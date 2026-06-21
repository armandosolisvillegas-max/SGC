package com.caballeriza.controller;
import com.caballeriza.dto.InsumoDTO;
import com.caballeriza.service.InventarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/insumos")
@RequiredArgsConstructor
public class InventarioController {
    private final InventarioService service;

    @GetMapping
    public List<InsumoDTO> getAll() { return service.getAll(); }

    @GetMapping("/stock-bajo")
    public List<InsumoDTO> getStockBajo() { return service.getStockBajo(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InsumoDTO create(@RequestBody InsumoDTO dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public InsumoDTO update(@PathVariable Long id, @RequestBody InsumoDTO dto) { return service.update(id, dto); }
}
