package com.caballeriza.controller;
import com.caballeriza.dto.AlertaDTO;
import com.caballeriza.service.AlertaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Tag(name = "Alertas", description = "Sistema de notificaciones automáticas por stock bajo y eventos críticos")
@RestController
@RequestMapping("/api/alertas")
@RequiredArgsConstructor
public class AlertaController {
    private final AlertaService service;

    @Operation(summary = "Listar alertas no leídas", description = "Retorna las alertas pendientes generadas automáticamente por el sistema (ej. stock bajo).")
    @GetMapping
    public List<AlertaDTO> getAlertas(@RequestParam(defaultValue = "false") boolean leida) {
        if (!leida) {
            return service.getAlertasNoLeidas();
        }
        return List.of();
    }

    @Operation(summary = "Marcar alerta como leída", description = "Cambia el estado de una alerta a leída para que no aparezca en la bandeja de notificaciones.")
    @PatchMapping("/{id}/marcar-leida")
    public void marcarLeida(@PathVariable Long id) {
        service.marcarLeida(id);
    }
}
