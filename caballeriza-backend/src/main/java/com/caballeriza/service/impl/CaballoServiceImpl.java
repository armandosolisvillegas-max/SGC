package com.caballeriza.service.impl;
import com.caballeriza.dto.CaballoDTO;
import com.caballeriza.entity.Caballo;
import com.caballeriza.exception.ResourceNotFoundException;
import com.caballeriza.repository.CaballoRepository;
import com.caballeriza.service.CaballoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CaballoServiceImpl implements CaballoService {
    private final CaballoRepository repository;

    private CaballoDTO mapToDTO(Caballo e) {
        CaballoDTO dto = new CaballoDTO();
        dto.setId(e.getId()); dto.setNombre(e.getNombre()); dto.setIdentificador(e.getIdentificador());
        dto.setEdad(e.getEdad()); dto.setRaza(e.getRaza()); dto.setSexo(e.getSexo());
        dto.setPeso(e.getPeso()); dto.setFotoUrl(e.getFotoUrl());
        return dto;
    }
    
    private Caballo mapToEntity(CaballoDTO dto) {
        Caballo e = new Caballo();
        e.setNombre(dto.getNombre()); e.setIdentificador(dto.getIdentificador());
        e.setEdad(dto.getEdad()); e.setRaza(dto.getRaza()); e.setSexo(dto.getSexo());
        e.setPeso(dto.getPeso()); e.setFotoUrl(dto.getFotoUrl());
        return e;
    }

    @Override public List<CaballoDTO> getAll() {
        return repository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }
    @Override public CaballoDTO getById(Long id) {
        return mapToDTO(repository.findById(java.util.Objects.requireNonNull(id)).orElseThrow(() -> new ResourceNotFoundException("Caballo no encontrado")));
    }
    @Override public CaballoDTO create(CaballoDTO dto) {
        return mapToDTO(repository.save(java.util.Objects.requireNonNull(mapToEntity(dto))));
    }
    @Override public CaballoDTO update(Long id, CaballoDTO dto) {
        Caballo e = repository.findById(java.util.Objects.requireNonNull(id)).orElseThrow(() -> new ResourceNotFoundException("Caballo no encontrado"));
        e.setNombre(dto.getNombre()); e.setIdentificador(dto.getIdentificador());
        e.setEdad(dto.getEdad()); e.setRaza(dto.getRaza()); e.setSexo(dto.getSexo());
        e.setPeso(dto.getPeso()); e.setFotoUrl(dto.getFotoUrl());
        return mapToDTO(repository.save(e));
    }
    @Override public void delete(Long id) {
        repository.deleteById(java.util.Objects.requireNonNull(id));
    }
}
