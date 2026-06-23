package com.caballeriza.controller;

import com.caballeriza.dto.PlanAlimentacionDTO;
import com.caballeriza.dto.RegistroSuministroDTO;
import com.caballeriza.service.AlimentacionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Tag(name = "Alimentación", description = "Planes nutricionales por caballo y registro de suministros con deducción automática de inventario")
@RestController
@RequiredArgsConstructor
public class AlimentacionController {
    private final AlimentacionService service;

    @Operation(summary = "Listar todos los planes", description = "Retorna todos los planes de alimentación de todos los caballos con nombre del insumo vinculado.")
    @GetMapping("/api/planes")
    public List<PlanAlimentacionDTO> getAllPlanes() {
        return service.getAllPlanes();
    }

    @Operation(summary = "Planes por caballo", description = "Retorna los planes de alimentación asignados a un caballo específico.")
    @GetMapping("/api/caballos/{id}/plan-alimentacion")
    public List<PlanAlimentacionDTO> getPlanes(@PathVariable Long id) {
        return service.getPlanesByCaballo(id);
    }

    @Operation(summary = "Crear plan de alimentación", description = "Asigna un nuevo plan nutricional a un caballo, vinculándolo opcionalmente a un insumo del inventario.")
    @PostMapping("/api/caballos/{id}/plan-alimentacion")
    @ResponseStatus(HttpStatus.CREATED)
    public PlanAlimentacionDTO createPlan(@PathVariable Long id, @RequestBody PlanAlimentacionDTO dto) {
        return service.createPlan(id, dto);
    }

    @Operation(summary = "Actualizar plan", description = "Modifica la descripción, frecuencia o insumo vinculado de un plan existente.")
    @PutMapping("/api/planes/{id}")
    public PlanAlimentacionDTO updatePlan(@PathVariable Long id, @RequestBody PlanAlimentacionDTO dto) {
        return service.updatePlan(id, dto);
    }

    @Operation(summary = "Eliminar plan", description = "Elimina permanentemente un plan de alimentación.")
    @DeleteMapping("/api/planes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePlan(@PathVariable Long id) {
        service.deletePlan(id);
    }

    @Operation(summary = "Registrar suministro", description = "Registra una ración de alimento o medicina y descuenta automáticamente la cantidad del stock del insumo vinculado.")
    @PostMapping("/api/planes/{id}/suministros")
    @ResponseStatus(HttpStatus.CREATED)
    public RegistroSuministroDTO createSuministro(@PathVariable Long id, @RequestBody RegistroSuministroDTO dto) {
        return service.createSuministro(id, dto);
    }

    @Operation(summary = "Historial de suministros", description = "Retorna todos los registros de raciones suministradas con nombre del caballo y tipo.")
    @GetMapping("/api/planes/suministros")
    public List<RegistroSuministroDTO> getSuministros() {
        return service.getAllSuministros();
    }
}

// Ale Document
