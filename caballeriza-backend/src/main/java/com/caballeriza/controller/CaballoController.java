package com.caballeriza.controller;

import com.caballeriza.dto.CaballoDTO;
import com.caballeriza.service.CaballoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Tag(name = "Caballos", description = "CRUD de caballos e historial médico")
@RestController
@RequestMapping("/api/caballos")
@RequiredArgsConstructor
public class CaballoController {
    private final CaballoService service;
    private final com.caballeriza.service.RegistroMedicoService registroMedicoService;

    @Operation(summary = "Listar todos los caballos", description = "Retorna la lista completa de caballos registrados en el sistema.")
    @GetMapping
    public List<CaballoDTO> getAll() {
        return service.getAll();
    }

    @Operation(summary = "Registrar un caballo", description = "Crea un nuevo caballo con nombre, raza, identificador y foto en base64.")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CaballoDTO create(@RequestBody CaballoDTO dto) {
        return service.create(dto);
    }

    @Operation(summary = "Obtener caballo por ID", description = "Retorna la información detallada de un caballo específico.")
    @GetMapping("/{id}")
    public CaballoDTO getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @Operation(summary = "Actualizar caballo", description = "Modifica los datos de un caballo existente.")
    @PutMapping("/{id}")
    public CaballoDTO update(@PathVariable Long id, @RequestBody CaballoDTO dto) {
        return service.update(id, dto);
    }

    @Operation(summary = "Eliminar caballo", description = "Elimina permanentemente un caballo del sistema. Solo disponible para administradores.")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @Operation(summary = "Obtener historial médico", description = "Lista las vacunas, tratamientos y observaciones médicas registradas para el caballo.")
    @GetMapping("/{id}/historial-medico")
    public List<com.caballeriza.dto.RegistroMedicoDTO> getHistorial(@PathVariable Long id) {
        return registroMedicoService.getRegistrosByCaballo(id);
    }

    @Operation(summary = "Agregar registro médico", description = "Registra una vacuna, tratamiento u observación al historial clínico del caballo.")
    @PostMapping("/{id}/historial-medico")
    @ResponseStatus(HttpStatus.CREATED)
    public com.caballeriza.dto.RegistroMedicoDTO addRegistroMedico(@PathVariable Long id, @RequestBody com.caballeriza.dto.request.RegistroMedicoRequest request) {
        return registroMedicoService.save(id, request);
    }
}
