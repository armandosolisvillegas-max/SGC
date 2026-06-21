package com.caballeriza.controller;
import com.caballeriza.dto.ReservaDTO;
import com.caballeriza.service.ReservaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@RequiredArgsConstructor
public class ReservaController {
    private final ReservaService service;

    @GetMapping
    public List<ReservaDTO> getReservas(
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String fecha,
            @RequestParam(defaultValue = "0") int page) {
        return service.getAll(tipo, fecha, page);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReservaDTO createReserva(@RequestBody ReservaDTO dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public ReservaDTO updateReserva(@PathVariable Long id, @RequestBody ReservaDTO dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReserva(@PathVariable Long id) { service.delete(id); }

    @PatchMapping("/{id}/cancelar")
    public void cancelarReserva(@PathVariable Long id) { service.cancelar(id); }
}
