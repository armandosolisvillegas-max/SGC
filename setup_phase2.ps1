$basePath = "c:\Users\Armando Solis\OneDrive\Documents\UNA\2026\Progra IV\Examen final\SGC\caballeriza-backend\src\main\java\com\caballeriza"

$dtoDir = Join-Path $basePath "dto"
$serviceDir = Join-Path $basePath "service"
$serviceImplDir = Join-Path $basePath "service\impl"
$controllerDir = Join-Path $basePath "controller"
$configDir = Join-Path $basePath "config"

# --- OPENAPI CONFIG ---
$openApiConfig = @"
package com.caballeriza.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(title = "API Caballeriza", version = "1.0", description = "Documentación de endpoints del SGC"),
        security = @SecurityRequirement(name = "bearerAuth")
)
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT"
)
public class OpenApiConfig {
}
"@
Set-Content -Path "$configDir\OpenApiConfig.java" -Value $openApiConfig -Encoding UTF8

# --- DTOs ---
$caballoDto = @"
package com.caballeriza.dto;
import lombok.Data;
@Data
public class CaballoDTO {
    private Long id;
    private String nombre;
    private String identificador;
    private Integer edad;
    private String raza;
    private String sexo;
    private Double peso;
    private String fotoUrl;
}
"@

$empleadoDto = @"
package com.caballeriza.dto;
import com.caballeriza.entity.Rol;
import lombok.Data;
@Data
public class EmpleadoDTO {
    private Long id;
    private String nombre;
    private Rol rol;
    private String contacto;
}
"@

$reservaDto = @"
package com.caballeriza.dto;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
@Data
public class ReservaDTO {
    private Long id;
    private String tipo;
    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private String estado;
    private Integer cupoMaximo;
    private Integer cupoActual;
    private Long caballoId;
    private Long clienteId;
}
"@
Set-Content -Path "$dtoDir\CaballoDTO.java" -Value $caballoDto -Encoding UTF8
Set-Content -Path "$dtoDir\EmpleadoDTO.java" -Value $empleadoDto -Encoding UTF8
Set-Content -Path "$dtoDir\ReservaDTO.java" -Value $reservaDto -Encoding UTF8

# --- CABALLO SERVICE & CONTROLLER ---
$caballoService = @"
package com.caballeriza.service;
import com.caballeriza.dto.CaballoDTO;
import java.util.List;
public interface CaballoService {
    List<CaballoDTO> getAll();
    CaballoDTO getById(Long id);
    CaballoDTO create(CaballoDTO dto);
    CaballoDTO update(Long id, CaballoDTO dto);
    void delete(Long id);
}
"@

$caballoServiceImpl = @"
package com.caballeriza.service.impl;
import com.caballeriza.dto.CaballoDTO;
import com.caballeriza.entity.Caballo;
import com.caballeriza.exception.ResourceNotFoundException;
import com.caballeriza.repository.CaballoRepository;
import com.caballeriza.service.CaballoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CaballoServiceImpl implements CaballoService {
    private final CaballoRepository repository;

    private CaballoDTO mapToDTO(Caballo e) {
        CaballoDTO dto = new CaballoDTO();
        dto.setId(e.getId()); dto.setNombre(e.getNombre()); dto.setIdentificador(e.getIdentificador());
        dto.setEdad(e.getEdad()); dto.setRaza(e.getRaza()); dto.setSexo(e.getSexo());
        dto.setPeso(e.getPeso()); dto.setFotoUrl(e.getFotoUrl());
        return dto;
    }
    
    private Caballo mapToEntity(CaballoDTO dto) {
        Caballo e = new Caballo();
        e.setNombre(dto.getNombre()); e.setIdentificador(dto.getIdentificador());
        e.setEdad(dto.getEdad()); e.setRaza(dto.getRaza()); e.setSexo(dto.getSexo());
        e.setPeso(dto.getPeso()); e.setFotoUrl(dto.getFotoUrl());
        return e;
    }

    @Override public List<CaballoDTO> getAll() {
        return repository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }
    @Override public CaballoDTO getById(Long id) {
        return mapToDTO(repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Caballo no encontrado")));
    }
    @Override public CaballoDTO create(CaballoDTO dto) {
        return mapToDTO(repository.save(mapToEntity(dto)));
    }
    @Override public CaballoDTO update(Long id, CaballoDTO dto) {
        Caballo e = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Caballo no encontrado"));
        e.setNombre(dto.getNombre()); e.setIdentificador(dto.getIdentificador());
        e.setEdad(dto.getEdad()); e.setRaza(dto.getRaza()); e.setSexo(dto.getSexo());
        e.setPeso(dto.getPeso()); e.setFotoUrl(dto.getFotoUrl());
        return mapToDTO(repository.save(e));
    }
    @Override public void delete(Long id) {
        repository.deleteById(id);
    }
}
"@

$caballoController = @"
package com.caballeriza.controller;
import com.caballeriza.dto.CaballoDTO;
import com.caballeriza.service.CaballoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/caballos")
@RequiredArgsConstructor
public class CaballoController {
    private final CaballoService service;

    @GetMapping
    public List<CaballoDTO> getAll() { return service.getAll(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CaballoDTO create(@RequestBody CaballoDTO dto) { return service.create(dto); }

    @GetMapping("/{id}")
    public CaballoDTO getById(@PathVariable Long id) { return service.getById(id); }

    @PutMapping("/{id}")
    public CaballoDTO update(@PathVariable Long id, @RequestBody CaballoDTO dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }
}
"@
Set-Content -Path "$serviceDir\CaballoService.java" -Value $caballoService -Encoding UTF8
Set-Content -Path "$serviceImplDir\CaballoServiceImpl.java" -Value $caballoServiceImpl -Encoding UTF8
Set-Content -Path "$controllerDir\CaballoController.java" -Value $caballoController -Encoding UTF8

# --- EMPLEADO SERVICE & CONTROLLER ---
$empleadoService = @"
package com.caballeriza.service;
import com.caballeriza.dto.EmpleadoDTO;
import java.util.List;
public interface EmpleadoService {
    List<EmpleadoDTO> getAll();
    EmpleadoDTO create(EmpleadoDTO dto);
    EmpleadoDTO update(Long id, EmpleadoDTO dto);
    void delete(Long id);
}
"@

$empleadoServiceImpl = @"
package com.caballeriza.service.impl;
import com.caballeriza.dto.EmpleadoDTO;
import com.caballeriza.entity.Empleado;
import com.caballeriza.exception.ResourceNotFoundException;
import com.caballeriza.repository.EmpleadoRepository;
import com.caballeriza.service.EmpleadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmpleadoServiceImpl implements EmpleadoService {
    private final EmpleadoRepository repository;

    private EmpleadoDTO mapToDTO(Empleado e) {
        EmpleadoDTO dto = new EmpleadoDTO();
        dto.setId(e.getId()); dto.setNombre(e.getNombre()); dto.setRol(e.getRol()); dto.setContacto(e.getContacto());
        return dto;
    }

    @Override public List<EmpleadoDTO> getAll() {
        return repository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }
    @Override public EmpleadoDTO create(EmpleadoDTO dto) {
        Empleado e = new Empleado(); e.setNombre(dto.getNombre()); e.setRol(dto.getRol()); e.setContacto(dto.getContacto());
        return mapToDTO(repository.save(e));
    }
    @Override public EmpleadoDTO update(Long id, EmpleadoDTO dto) {
        Empleado e = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado"));
        e.setNombre(dto.getNombre()); e.setRol(dto.getRol()); e.setContacto(dto.getContacto());
        return mapToDTO(repository.save(e));
    }
    @Override public void delete(Long id) { repository.deleteById(id); }
}
"@

$empleadoController = @"
package com.caballeriza.controller;
import com.caballeriza.dto.EmpleadoDTO;
import com.caballeriza.service.EmpleadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/empleados")
@RequiredArgsConstructor
public class EmpleadoController {
    private final EmpleadoService service;

    @GetMapping
    public List<EmpleadoDTO> getAll() { return service.getAll(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EmpleadoDTO create(@RequestBody EmpleadoDTO dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public EmpleadoDTO update(@PathVariable Long id, @RequestBody EmpleadoDTO dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }
}
"@
Set-Content -Path "$serviceDir\EmpleadoService.java" -Value $empleadoService -Encoding UTF8
Set-Content -Path "$serviceImplDir\EmpleadoServiceImpl.java" -Value $empleadoServiceImpl -Encoding UTF8
Set-Content -Path "$controllerDir\EmpleadoController.java" -Value $empleadoController -Encoding UTF8

Write-Host "Fase 2: Servicios y Controladores generados."
