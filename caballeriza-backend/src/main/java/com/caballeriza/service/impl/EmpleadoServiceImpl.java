package com.caballeriza.service.impl;
import com.caballeriza.dto.EmpleadoDTO;
import com.caballeriza.entity.Empleado;
import com.caballeriza.exception.ResourceNotFoundException;
import com.caballeriza.repository.EmpleadoRepository;
import com.caballeriza.service.EmpleadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmpleadoServiceImpl implements EmpleadoService {
    private final EmpleadoRepository repository;

    private EmpleadoDTO mapToDTO(Empleado e) {
        EmpleadoDTO dto = new EmpleadoDTO();
        dto.setId(e.getId()); dto.setNombre(e.getNombre()); dto.setRol(e.getRol()); dto.setContacto(e.getContacto());
        return dto;
    }

    @Override public List<EmpleadoDTO> getAll() {
        return repository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }
    @Override public EmpleadoDTO create(EmpleadoDTO dto) {
        Empleado e = new Empleado(); e.setNombre(dto.getNombre()); e.setRol(dto.getRol()); e.setContacto(dto.getContacto());
        return mapToDTO(repository.save(e));
    }
    @Override public EmpleadoDTO update(Long id, EmpleadoDTO dto) {
        Empleado e = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado"));
        e.setNombre(dto.getNombre()); e.setRol(dto.getRol()); e.setContacto(dto.getContacto());
        return mapToDTO(repository.save(e));
    }
    @Override public void delete(Long id) { repository.deleteById(id); }
}
