package com.caballeriza.controller;
import com.caballeriza.dto.AlertaDTO;
import com.caballeriza.service.AlertaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/alertas")
@RequiredArgsConstructor
public class AlertaController {
    private final AlertaService service;

    @GetMapping
    public List<AlertaDTO> getAlertas(@RequestParam(defaultValue = "false") boolean leida) {
        if (!leida) {
            return service.getAlertasNoLeidas();
        }
        return List.of(); // Si envÃ­an leida=true no devuelve nada segÃºn requerimiento
    }

    @PatchMapping("/{id}/marcar-leida")
    public void marcarLeida(@PathVariable Long id) {
        service.marcarLeida(id);
    }
}
