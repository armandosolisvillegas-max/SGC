package com.caballeriza.controller;
import com.caballeriza.dto.EmpleadoDTO;
import com.caballeriza.service.EmpleadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/empleados")
@RequiredArgsConstructor
public class EmpleadoController {
    private final EmpleadoService service;

    @GetMapping
    public List<EmpleadoDTO> getAll() { return service.getAll(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EmpleadoDTO create(@RequestBody EmpleadoDTO dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public EmpleadoDTO update(@PathVariable Long id, @RequestBody EmpleadoDTO dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }

    @GetMapping("/{id}/turnos")
    public List<com.caballeriza.dto.TurnoDTO> getTurnos(@PathVariable Long id) {
        return service.getTurnosByEmpleado(id);
    }

    @PostMapping("/{id}/turnos")
    @ResponseStatus(HttpStatus.CREATED)
    public com.caballeriza.dto.TurnoDTO addTurno(@PathVariable Long id, @RequestBody com.caballeriza.dto.TurnoDTO dto) {
        return service.addTurno(id, dto);
    }
}
