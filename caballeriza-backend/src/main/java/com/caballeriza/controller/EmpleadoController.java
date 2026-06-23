package com.caballeriza.controller;
import com.caballeriza.dto.EmpleadoDTO;
import com.caballeriza.service.EmpleadoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Tag(name = "Empleados", description = "Gestión de personal y asignación de turnos de trabajo")
@RestController
@RequestMapping("/api/empleados")
@RequiredArgsConstructor
public class EmpleadoController {
    private final EmpleadoService service;

    @Operation(summary = "Listar empleados", description = "Retorna todo el personal registrado: cuidadores, veterinarios, potradores y administradores.")
    @GetMapping
    public List<EmpleadoDTO> getAll() { return service.getAll(); }

    @Operation(summary = "Registrar empleado", description = "Crea un nuevo empleado con nombre, cargo, contacto y especialidad.")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EmpleadoDTO create(@RequestBody EmpleadoDTO dto) { return service.create(dto); }

    @Operation(summary = "Actualizar empleado", description = "Modifica los datos de un empleado existente.")
    @PutMapping("/{id}")
    public EmpleadoDTO update(@PathVariable Long id, @RequestBody EmpleadoDTO dto) { return service.update(id, dto); }

    @Operation(summary = "Eliminar empleado", description = "Da de baja a un empleado del sistema.")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }

    @Operation(summary = "Listar turnos de un empleado", description = "Retorna los turnos de trabajo asignados al empleado indicado.")
    @GetMapping("/{id}/turnos")
    public List<com.caballeriza.dto.TurnoDTO> getTurnos(@PathVariable Long id) {
        return service.getTurnosByEmpleado(id);
    }

    @Operation(summary = "Asignar turno de trabajo", description = "Programa un nuevo turno con fecha, hora de inicio, hora de fin y descripción de la tarea.")
    @PostMapping("/{id}/turnos")
    @ResponseStatus(HttpStatus.CREATED)
    public com.caballeriza.dto.TurnoDTO addTurno(@PathVariable Long id, @RequestBody com.caballeriza.dto.TurnoDTO dto) {
        return service.addTurno(id, dto);
    }
}
