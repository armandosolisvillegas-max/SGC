$basePath = "c:\Users\Armando Solis\OneDrive\Documents\UNA\2026\Progra IV\Examen final\SGC\caballeriza-backend\src\main\java\com\caballeriza"
$dtoDir = Join-Path $basePath "dto"
$serviceDir = Join-Path $basePath "service"
$serviceImplDir = Join-Path $basePath "service\impl"
$controllerDir = Join-Path $basePath "controller"

# --- DTOs ---
$planDto = "package com.caballeriza.dto;`nimport lombok.Data;`n@Data`npublic class PlanAlimentacionDTO { private Long id; private String descripcion; private String frecuencia; private Long caballoId; }"
$suministroDto = "package com.caballeriza.dto;`nimport lombok.Data;`nimport java.time.LocalDateTime;`n@Data`npublic class RegistroSuministroDTO { private Long id; private LocalDateTime fecha; private String tipo; private Double cantidad; private Long planId; }"
$insumoDto = "package com.caballeriza.dto;`nimport lombok.Data;`n@Data`npublic class InsumoDTO { private Long id; private String nombre; private String tipo; private Double stockActual; private Double stockMinimo; }"
$alertaDto = "package com.caballeriza.dto;`nimport lombok.Data;`nimport java.time.LocalDateTime;`n@Data`npublic class AlertaDTO { private Long id; private String tipo; private String mensaje; private Long referenciaId; private Boolean leida; private LocalDateTime fecha; private Long destinatarioId; }"

Set-Content -Path "$dtoDir\PlanAlimentacionDTO.java" -Value $planDto -Encoding UTF8
Set-Content -Path "$dtoDir\RegistroSuministroDTO.java" -Value $suministroDto -Encoding UTF8
Set-Content -Path "$dtoDir\InsumoDTO.java" -Value $insumoDto -Encoding UTF8
Set-Content -Path "$dtoDir\AlertaDTO.java" -Value $alertaDto -Encoding UTF8

# --- ALIMENTACION SERVICE & CONTROLLER ---
$alimentacionService = @"
package com.caballeriza.service;
import com.caballeriza.dto.PlanAlimentacionDTO;
import com.caballeriza.dto.RegistroSuministroDTO;
import java.util.List;
public interface AlimentacionService {
    List<PlanAlimentacionDTO> getPlanesByCaballo(Long caballoId);
    PlanAlimentacionDTO createPlan(Long caballoId, PlanAlimentacionDTO dto);
    RegistroSuministroDTO createSuministro(Long planId, RegistroSuministroDTO dto);
}
"@
Set-Content -Path "$serviceDir\AlimentacionService.java" -Value $alimentacionService -Encoding UTF8

$alimentacionServiceImpl = @"
package com.caballeriza.service.impl;
import com.caballeriza.dto.PlanAlimentacionDTO;
import com.caballeriza.dto.RegistroSuministroDTO;
import com.caballeriza.entity.Caballo;
import com.caballeriza.entity.PlanAlimentacion;
import com.caballeriza.entity.RegistroSuministro;
import com.caballeriza.exception.ResourceNotFoundException;
import com.caballeriza.repository.CaballoRepository;
import com.caballeriza.repository.PlanAlimentacionRepository;
import com.caballeriza.repository.RegistroSuministroRepository;
import com.caballeriza.service.AlimentacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlimentacionServiceImpl implements AlimentacionService {
    private final PlanAlimentacionRepository planRepository;
    private final RegistroSuministroRepository suministroRepository;
    private final CaballoRepository caballoRepository;

    @Override public List<PlanAlimentacionDTO> getPlanesByCaballo(Long caballoId) {
        return planRepository.findAll().stream()
                .filter(p -> p.getCaballo().getId().equals(caballoId))
                .map(p -> {
                    PlanAlimentacionDTO dto = new PlanAlimentacionDTO();
                    dto.setId(p.getId()); dto.setDescripcion(p.getDescripcion());
                    dto.setFrecuencia(p.getFrecuencia()); dto.setCaballoId(p.getCaballo().getId());
                    return dto;
                }).collect(Collectors.toList());
    }

    @Override public PlanAlimentacionDTO createPlan(Long caballoId, PlanAlimentacionDTO dto) {
        Caballo c = caballoRepository.findById(caballoId).orElseThrow(() -> new ResourceNotFoundException("Caballo no encontrado"));
        PlanAlimentacion p = new PlanAlimentacion();
        p.setDescripcion(dto.getDescripcion()); p.setFrecuencia(dto.getFrecuencia()); p.setCaballo(c);
        p = planRepository.save(p);
        dto.setId(p.getId()); dto.setCaballoId(c.getId());
        return dto;
    }

    @Override public RegistroSuministroDTO createSuministro(Long planId, RegistroSuministroDTO dto) {
        PlanAlimentacion p = planRepository.findById(planId).orElseThrow(() -> new ResourceNotFoundException("Plan no encontrado"));
        RegistroSuministro s = new RegistroSuministro();
        s.setFecha(dto.getFecha() != null ? dto.getFecha() : LocalDateTime.now());
        s.setTipo(dto.getTipo()); s.setCantidad(dto.getCantidad()); s.setPlanAlimentacion(p);
        s = suministroRepository.save(s);
        dto.setId(s.getId()); dto.setPlanId(p.getId()); dto.setFecha(s.getFecha());
        return dto;
    }
}
"@
Set-Content -Path "$serviceImplDir\AlimentacionServiceImpl.java" -Value $alimentacionServiceImpl -Encoding UTF8

$alimentacionController = @"
package com.caballeriza.controller;
import com.caballeriza.dto.PlanAlimentacionDTO;
import com.caballeriza.dto.RegistroSuministroDTO;
import com.caballeriza.service.AlimentacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class AlimentacionController {
    private final AlimentacionService service;

    @GetMapping("/api/caballos/{id}/plan-alimentacion")
    public List<PlanAlimentacionDTO> getPlanes(@PathVariable Long id) {
        return service.getPlanesByCaballo(id);
    }

    @PostMapping("/api/caballos/{id}/plan-alimentacion")
    @ResponseStatus(HttpStatus.CREATED)
    public PlanAlimentacionDTO createPlan(@PathVariable Long id, @RequestBody PlanAlimentacionDTO dto) {
        return service.createPlan(id, dto);
    }

    @PostMapping("/api/planes/{id}/suministros")
    @ResponseStatus(HttpStatus.CREATED)
    public RegistroSuministroDTO createSuministro(@PathVariable Long id, @RequestBody RegistroSuministroDTO dto) {
        return service.createSuministro(id, dto);
    }
}
"@
Set-Content -Path "$controllerDir\AlimentacionController.java" -Value $alimentacionController -Encoding UTF8


# --- INVENTARIO SERVICE & CONTROLLER ---
$inventarioService = @"
package com.caballeriza.service;
import com.caballeriza.dto.InsumoDTO;
import java.util.List;
public interface InventarioService {
    List<InsumoDTO> getAll();
    List<InsumoDTO> getStockBajo();
    InsumoDTO create(InsumoDTO dto);
    InsumoDTO update(Long id, InsumoDTO dto);
}
"@
Set-Content -Path "$serviceDir\InventarioService.java" -Value $inventarioService -Encoding UTF8

$inventarioServiceImpl = @"
package com.caballeriza.service.impl;
import com.caballeriza.dto.InsumoDTO;
import com.caballeriza.entity.Insumo;
import com.caballeriza.exception.ResourceNotFoundException;
import com.caballeriza.repository.InsumoRepository;
import com.caballeriza.service.InventarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventarioServiceImpl implements InventarioService {
    private final InsumoRepository repository;

    private InsumoDTO mapToDTO(Insumo i) {
        InsumoDTO dto = new InsumoDTO();
        dto.setId(i.getId()); dto.setNombre(i.getNombre()); dto.setTipo(i.getTipo());
        dto.setStockActual(i.getStockActual()); dto.setStockMinimo(i.getStockMinimo());
        return dto;
    }

    @Override public List<InsumoDTO> getAll() {
        return repository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override public List<InsumoDTO> getStockBajo() {
        return repository.findAll().stream()
                .filter(i -> i.getStockActual() <= i.getStockMinimo())
                .map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override public InsumoDTO create(InsumoDTO dto) {
        Insumo i = new Insumo();
        i.setNombre(dto.getNombre()); i.setTipo(dto.getTipo());
        i.setStockActual(dto.getStockActual()); i.setStockMinimo(dto.getStockMinimo());
        return mapToDTO(repository.save(i));
    }

    @Override public InsumoDTO update(Long id, InsumoDTO dto) {
        Insumo i = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Insumo no encontrado"));
        i.setNombre(dto.getNombre()); i.setTipo(dto.getTipo());
        i.setStockActual(dto.getStockActual()); i.setStockMinimo(dto.getStockMinimo());
        return mapToDTO(repository.save(i));
    }
}
"@
Set-Content -Path "$serviceImplDir\InventarioServiceImpl.java" -Value $inventarioServiceImpl -Encoding UTF8

$inventarioController = @"
package com.caballeriza.controller;
import com.caballeriza.dto.InsumoDTO;
import com.caballeriza.service.InventarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/insumos")
@RequiredArgsConstructor
public class InventarioController {
    private final InventarioService service;

    @GetMapping
    public List<InsumoDTO> getAll() { return service.getAll(); }

    @GetMapping("/stock-bajo")
    public List<InsumoDTO> getStockBajo() { return service.getStockBajo(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InsumoDTO create(@RequestBody InsumoDTO dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public InsumoDTO update(@PathVariable Long id, @RequestBody InsumoDTO dto) { return service.update(id, dto); }
}
"@
Set-Content -Path "$controllerDir\InventarioController.java" -Value $inventarioController -Encoding UTF8


# --- ALERTAS SERVICE & CONTROLLER ---
$alertaService = @"
package com.caballeriza.service;
import com.caballeriza.dto.AlertaDTO;
import java.util.List;
public interface AlertaService {
    List<AlertaDTO> getAlertasNoLeidas();
    void marcarLeida(Long id);
}
"@
Set-Content -Path "$serviceDir\AlertaService.java" -Value $alertaService -Encoding UTF8

$alertaServiceImpl = @"
package com.caballeriza.service.impl;
import com.caballeriza.dto.AlertaDTO;
import com.caballeriza.entity.Alerta;
import com.caballeriza.exception.ResourceNotFoundException;
import com.caballeriza.repository.AlertaRepository;
import com.caballeriza.service.AlertaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlertaServiceImpl implements AlertaService {
    private final AlertaRepository repository;

    @Override public List<AlertaDTO> getAlertasNoLeidas() {
        return repository.findAll().stream()
                .filter(a -> !a.getLeida())
                .map(a -> {
                    AlertaDTO dto = new AlertaDTO();
                    dto.setId(a.getId()); dto.setTipo(a.getTipo()); dto.setMensaje(a.getMensaje());
                    dto.setReferenciaId(a.getReferenciaId()); dto.setLeida(a.getLeida());
                    dto.setFecha(a.getFecha()); dto.setDestinatarioId(a.getDestinatario().getId());
                    return dto;
                }).collect(Collectors.toList());
    }

    @Override public void marcarLeida(Long id) {
        Alerta a = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Alerta no encontrada"));
        a.setLeida(true);
        repository.save(a);
    }
}
"@
Set-Content -Path "$serviceImplDir\AlertaServiceImpl.java" -Value $alertaServiceImpl -Encoding UTF8

$alertaController = @"
package com.caballeriza.controller;
import com.caballeriza.dto.AlertaDTO;
import com.caballeriza.service.AlertaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/alertas")
@RequiredArgsConstructor
public class AlertaController {
    private final AlertaService service;

    @GetMapping
    public List<AlertaDTO> getAlertas(@RequestParam(defaultValue = "false") boolean leida) {
        if (!leida) {
            return service.getAlertasNoLeidas();
        }
        return List.of(); // Si envían leida=true no devuelve nada según requerimiento
    }

    @PatchMapping("/{id}/marcar-leida")
    public void marcarLeida(@PathVariable Long id) {
        service.marcarLeida(id);
    }
}
"@
Set-Content -Path "$controllerDir\AlertaController.java" -Value $alertaController -Encoding UTF8

Write-Host "Fase 3: Módulos secundarios generados."
