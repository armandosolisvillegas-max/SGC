package com.caballeriza.controller;
import com.caballeriza.dto.CaballoDTO;
import com.caballeriza.service.CaballoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/caballos")
@RequiredArgsConstructor
public class CaballoController {
    private final CaballoService service;

    @GetMapping
    public List<CaballoDTO> getAll() { return service.getAll(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CaballoDTO create(@RequestBody CaballoDTO dto) { return service.create(dto); }

    @GetMapping("/{id}")
    public CaballoDTO getById(@PathVariable Long id) { return service.getById(id); }

    @PutMapping("/{id}")
    public CaballoDTO update(@PathVariable Long id, @RequestBody CaballoDTO dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }
}
