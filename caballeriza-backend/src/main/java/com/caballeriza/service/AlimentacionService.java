package com.caballeriza.service;
import com.caballeriza.dto.PlanAlimentacionDTO;
import com.caballeriza.dto.RegistroSuministroDTO;
import java.util.List;
public interface AlimentacionService {
    List<PlanAlimentacionDTO> getAllPlanes();
    List<PlanAlimentacionDTO> getPlanesByCaballo(Long caballoId);
    PlanAlimentacionDTO createPlan(Long caballoId, PlanAlimentacionDTO dto);
    PlanAlimentacionDTO updatePlan(Long planId, PlanAlimentacionDTO dto);
    void deletePlan(Long planId);
    RegistroSuministroDTO createSuministro(Long planId, RegistroSuministroDTO dto);
    List<RegistroSuministroDTO> getAllSuministros();
}
