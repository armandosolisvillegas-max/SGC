package com.caballeriza.service.impl;
import com.caballeriza.dto.EmpleadoDTO;
import com.caballeriza.dto.TurnoDTO;
import com.caballeriza.entity.Empleado;
import com.caballeriza.entity.Turno;
import com.caballeriza.exception.ResourceNotFoundException;
import com.caballeriza.repository.EmpleadoRepository;
import com.caballeriza.repository.TurnoRepository;
import com.caballeriza.service.EmpleadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmpleadoServiceImpl implements EmpleadoService {
    private final EmpleadoRepository repository;
    private final TurnoRepository turnoRepository;

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
        Empleado e = repository.findById(java.util.Objects.requireNonNull(id)).orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado"));
        e.setNombre(dto.getNombre()); e.setRol(dto.getRol()); e.setContacto(dto.getContacto());
        return mapToDTO(repository.save(e));
    }
    @Override public void delete(Long id) { repository.deleteById(java.util.Objects.requireNonNull(id)); }

    @Override
    public List<TurnoDTO> getTurnosByEmpleado(Long empleadoId) {
        return turnoRepository.findAll().stream()
                .filter(t -> t.getEmpleado().getId().equals(empleadoId))
                .map(t -> new TurnoDTO(t.getId(), t.getFecha(), t.getHoraInicio(), t.getHoraFin(), t.getTareaAsignada(), empleadoId))
                .collect(Collectors.toList());
    }

    @Override
    public TurnoDTO addTurno(Long empleadoId, TurnoDTO dto) {
        Empleado e = repository.findById(java.util.Objects.requireNonNull(empleadoId)).orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado"));
        Turno turno = Turno.builder()
                .fecha(dto.getFecha())
                .horaInicio(dto.getHoraInicio())
                .horaFin(dto.getHoraFin())
                .tareaAsignada(dto.getTareaAsignada())
                .empleado(e)
                .build();
        Turno saved = turnoRepository.save(java.util.Objects.requireNonNull(turno));
        return new TurnoDTO(saved.getId(), saved.getFecha(), saved.getHoraInicio(), saved.getHoraFin(), saved.getTareaAsignada(), empleadoId);
    }
}
