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

    @GetMapping("/api/planes/suministros")
    public List<RegistroSuministroDTO> getSuministros() {
        return service.getAllSuministros();
    }
}
