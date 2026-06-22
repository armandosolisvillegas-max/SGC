package com.caballeriza.service.impl;
import com.caballeriza.dto.InsumoDTO;
import com.caballeriza.entity.Insumo;
import com.caballeriza.exception.ResourceNotFoundException;
import com.caballeriza.repository.InsumoRepository;
import com.caballeriza.service.InventarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventarioServiceImpl implements InventarioService {
    private final InsumoRepository repository;

    private InsumoDTO mapToDTO(Insumo i) {
        InsumoDTO dto = new InsumoDTO();
        dto.setId(i.getId()); dto.setNombre(i.getNombre()); dto.setTipo(i.getTipo());
        dto.setStockActual(i.getStockActual()); dto.setStockMinimo(i.getStockMinimo());
        return dto;
    }

    @Override public List<InsumoDTO> getAll() {
        return repository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override public List<InsumoDTO> getStockBajo() {
        return repository.findAll().stream()
                .filter(i -> i.getStockActual() <= i.getStockMinimo())
                .map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override public InsumoDTO create(InsumoDTO dto) {
        Insumo i = new Insumo();
        i.setNombre(dto.getNombre()); i.setTipo(dto.getTipo());
        i.setStockActual(dto.getStockActual()); i.setStockMinimo(dto.getStockMinimo());
        return mapToDTO(repository.save(i));
    }

    @Override public InsumoDTO update(Long id, InsumoDTO dto) {
        Insumo i = repository.findById(java.util.Objects.requireNonNull(id)).orElseThrow(() -> new ResourceNotFoundException("Insumo no encontrado"));
        i.setNombre(dto.getNombre()); i.setTipo(dto.getTipo());
        i.setStockActual(dto.getStockActual()); i.setStockMinimo(dto.getStockMinimo());
        return mapToDTO(repository.save(i));
    }

    @Override public void delete(Long id) {
        if (!repository.existsById(java.util.Objects.requireNonNull(id))) {
            throw new ResourceNotFoundException("Insumo no encontrado");
        }
        repository.deleteById(id);
    }
}
