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
