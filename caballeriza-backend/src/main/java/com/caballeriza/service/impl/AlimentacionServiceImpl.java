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
    private final com.caballeriza.repository.InsumoRepository insumoRepository;

    private PlanAlimentacionDTO mapPlan(PlanAlimentacion p) {
        PlanAlimentacionDTO dto = new PlanAlimentacionDTO();
        dto.setId(p.getId()); dto.setDescripcion(p.getDescripcion());
        dto.setFrecuencia(p.getFrecuencia()); dto.setCaballoId(p.getCaballo().getId());
        dto.setCaballoNombre(p.getCaballo().getNombre());
        dto.setInsumoId(p.getInsumo() != null ? p.getInsumo().getId() : null);
        dto.setInsumoNombre(p.getInsumo() != null ? p.getInsumo().getNombre() : null);
        return dto;
    }

    @Override public List<PlanAlimentacionDTO> getAllPlanes() {
        return planRepository.findAll().stream().map(this::mapPlan).collect(Collectors.toList());
    }

    @Override public List<PlanAlimentacionDTO> getPlanesByCaballo(Long caballoId) {
        return planRepository.findByCaballoId(caballoId).stream().map(this::mapPlan).collect(Collectors.toList());
    }

    @Override public PlanAlimentacionDTO createPlan(Long caballoId, PlanAlimentacionDTO dto) {
        Caballo c = caballoRepository.findById(java.util.Objects.requireNonNull(caballoId))
            .orElseThrow(() -> new ResourceNotFoundException("Caballo no encontrado"));
        PlanAlimentacion p = new PlanAlimentacion();
        p.setCaballo(c);
        p.setDescripcion(dto.getDescripcion());
        p.setFrecuencia(dto.getFrecuencia());
        com.caballeriza.entity.Insumo insumo = null;
        if (dto.getInsumoId() != null) {
            insumo = insumoRepository.findById(java.util.Objects.requireNonNull(dto.getInsumoId())).orElse(null);
        }
        p.setInsumo(insumo);
        return mapPlan(planRepository.save(p));
    }

    @Override public PlanAlimentacionDTO updatePlan(Long planId, PlanAlimentacionDTO dto) {
        PlanAlimentacion p = planRepository.findById(java.util.Objects.requireNonNull(planId))
            .orElseThrow(() -> new ResourceNotFoundException("Plan no encontrado"));
        p.setDescripcion(dto.getDescripcion());
        p.setFrecuencia(dto.getFrecuencia());
        com.caballeriza.entity.Insumo insumo = null;
        if (dto.getInsumoId() != null) {
            insumo = insumoRepository.findById(java.util.Objects.requireNonNull(dto.getInsumoId())).orElse(null);
        }
        p.setInsumo(insumo);
        return mapPlan(planRepository.save(p));
    }

    @Override public void deletePlan(Long planId) {
        planRepository.deleteById(java.util.Objects.requireNonNull(planId));
    }

    @Override public RegistroSuministroDTO createSuministro(Long planId, RegistroSuministroDTO dto) {
        PlanAlimentacion p = planRepository.findById(java.util.Objects.requireNonNull(planId)).orElseThrow(() -> new ResourceNotFoundException("Plan no encontrado"));
        RegistroSuministro s = new RegistroSuministro();
        s.setFecha(dto.getFecha() != null ? dto.getFecha() : LocalDateTime.now());
        s.setTipo(dto.getTipo()); s.setCantidad(dto.getCantidad()); s.setPlanAlimentacion(p);
        s = suministroRepository.save(s);
        dto.setId(s.getId()); dto.setPlanId(p.getId()); dto.setFecha(s.getFecha());
        if (p.getCaballo() != null) {
            dto.setCaballoNombre(p.getCaballo().getNombre());
        } else {
            dto.setCaballoNombre("Desconocido");
        }
        
        if (p.getInsumo() != null && dto.getCantidad() != null) {
            com.caballeriza.entity.Insumo i = p.getInsumo();
            i.setStockActual(Math.max(0.0, i.getStockActual() - dto.getCantidad()));
            insumoRepository.save(i);
        }

        return dto;
    }

    @Override public List<RegistroSuministroDTO> getAllSuministros() {
        return suministroRepository.findAll().stream()
                .map(s -> {
                    RegistroSuministroDTO dto = new RegistroSuministroDTO();
                    dto.setId(s.getId());
                    dto.setFecha(s.getFecha());
                    dto.setTipo(s.getTipo());
                    dto.setCantidad(s.getCantidad());
                    dto.setPlanId(s.getPlanAlimentacion().getId());
                    if (s.getPlanAlimentacion().getCaballo() != null) {
                        dto.setCaballoNombre(s.getPlanAlimentacion().getCaballo().getNombre());
                    } else {
                        dto.setCaballoNombre("Desconocido");
                    }
                    return dto;
                }).collect(Collectors.toList());
    }
}
