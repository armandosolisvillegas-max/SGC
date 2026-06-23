package com.caballeriza.controller;
import com.caballeriza.dto.InsumoDTO;
import com.caballeriza.service.InventarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Tag(name = "Inventario", description = "Gestión de insumos alimentarios y médicos con control de stock")
@RestController
@RequestMapping("/api/insumos")
@RequiredArgsConstructor
public class InventarioController {
    private final InventarioService service;

    @Operation(summary = "Listar todos los insumos", description = "Retorna alimentos y medicamentos disponibles en el inventario con niveles de stock.")
    @GetMapping
    public List<InsumoDTO> getAll() { return service.getAll(); }

    @Operation(summary = "Insumos con stock bajo", description = "Retorna los insumos cuyo stock actual está por debajo del mínimo configurado.")
    @GetMapping("/stock-bajo")
    public List<InsumoDTO> getStockBajo() { return service.getStockBajo(); }

    @Operation(summary = "Registrar insumo", description = "Agrega un nuevo insumo al inventario con nombre, tipo, stock actual y stock mínimo.")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InsumoDTO create(@RequestBody InsumoDTO dto) { return service.create(dto); }

    @Operation(summary = "Actualizar insumo", description = "Modifica los datos o niveles de stock de un insumo existente.")
    @PutMapping("/{id}")
    public InsumoDTO update(@PathVariable Long id, @RequestBody InsumoDTO dto) { return service.update(id, dto); }

    @Operation(summary = "Eliminar insumo", description = "Elimina un insumo del inventario de forma permanente.")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }
}
