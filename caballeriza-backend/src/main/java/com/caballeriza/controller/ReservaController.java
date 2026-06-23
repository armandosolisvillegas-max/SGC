package com.caballeriza.controller;

import com.caballeriza.dto.ReservaDTO;
import com.caballeriza.service.ReservaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Tag(name = "Reservas", description = "Agenda de paseos, entrenamientos, citas veterinarias y monta con control de cupo")
@RestController
@RequestMapping("/api/reservas")
@RequiredArgsConstructor
public class ReservaController {
    private final ReservaService service;

    @Operation(summary = "Listar reservas", description = "Retorna las reservas activas con filtros opcionales por tipo de evento y fecha.")
    @GetMapping
    public List<ReservaDTO> getReservas(
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String fecha,
            @RequestParam(defaultValue = "0") int page) {
        return service.getAll(tipo, fecha, page);
    }

    @Operation(summary = "Crear reserva", description = "Registra una nueva reserva validando el cupo máximo del caballo para la fecha y hora seleccionadas.")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReservaDTO createReserva(@RequestBody ReservaDTO dto) {
        return service.create(dto);
    }

    @Operation(summary = "Actualizar reserva", description = "Modifica los datos de una reserva existente.")
    @PutMapping("/{id}")
    public ReservaDTO updateReserva(@PathVariable Long id, @RequestBody ReservaDTO dto) {
        return service.update(id, dto);
    }

    @Operation(summary = "Eliminar reserva", description = "Elimina permanentemente una reserva del sistema.")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReserva(@PathVariable Long id) {
        service.delete(id);
    }

    @Operation(summary = "Cancelar reserva", description = "Cambia el estado de una reserva a CANCELADA sin eliminarla del registro.")
    @PatchMapping("/{id}/cancelar")
    public void cancelarReserva(@PathVariable Long id) {
        service.cancelar(id);
    }
}

// Ale Document
