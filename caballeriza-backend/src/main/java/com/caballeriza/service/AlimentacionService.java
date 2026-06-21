package com.caballeriza.service;
import com.caballeriza.dto.PlanAlimentacionDTO;
import com.caballeriza.dto.RegistroSuministroDTO;
import java.util.List;
public interface AlimentacionService {
    List<PlanAlimentacionDTO> getPlanesByCaballo(Long caballoId);
    PlanAlimentacionDTO createPlan(Long caballoId, PlanAlimentacionDTO dto);
    RegistroSuministroDTO createSuministro(Long planId, RegistroSuministroDTO dto);
}
