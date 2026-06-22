package com.caballeriza.service;
import com.caballeriza.dto.EmpleadoDTO;
import com.caballeriza.dto.TurnoDTO;
import java.util.List;
public interface EmpleadoService {
    List<EmpleadoDTO> getAll();
    EmpleadoDTO create(EmpleadoDTO dto);
    EmpleadoDTO update(Long id, EmpleadoDTO dto);
    void delete(Long id);
    List<TurnoDTO> getTurnosByEmpleado(Long empleadoId);
    TurnoDTO addTurno(Long empleadoId, TurnoDTO dto);
}
