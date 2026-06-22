package com.caballeriza.service.impl;
import com.caballeriza.dto.ReservaDTO;
import com.caballeriza.entity.Caballo;
import com.caballeriza.entity.Reserva;
import com.caballeriza.entity.Usuario;
import com.caballeriza.exception.ResourceNotFoundException;
import com.caballeriza.repository.CaballoRepository;
import com.caballeriza.repository.ReservaRepository;
import com.caballeriza.repository.UsuarioRepository;
import com.caballeriza.service.ReservaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservaServiceImpl implements ReservaService {
    private final ReservaRepository reservaRepository;
    private final CaballoRepository caballoRepository;
    private final UsuarioRepository usuarioRepository;

    private ReservaDTO mapToDTO(Reserva e) {
        ReservaDTO dto = new ReservaDTO();
        dto.setId(e.getId()); dto.setTipo(e.getTipo()); dto.setFecha(e.getFecha());
        dto.setHoraInicio(e.getHoraInicio()); dto.setHoraFin(e.getHoraFin());
        dto.setEstado(e.getEstado()); dto.setCupoMaximo(e.getCupoMaximo()); dto.setCupoActual(e.getCupoActual());
        dto.setCaballoId(e.getCaballo().getId()); dto.setClienteId(e.getCliente().getId());
        return dto;
    }

    @Override public List<ReservaDTO> getAll(String tipo, String fecha, int page) {
        return reservaRepository.findAll().stream()
            .filter(r -> {
                if (tipo != null && !tipo.trim().isEmpty()) {
                    return r.getTipo().equalsIgnoreCase(tipo.trim());
                }
                return true;
            })
            .filter(r -> {
                if (fecha != null && !fecha.trim().isEmpty()) {
                    try {
                        java.time.LocalDate parsedDate = java.time.LocalDate.parse(fecha.trim());
                        return r.getFecha().equals(parsedDate);
                    } catch (Exception e) {
                        return false;
                    }
                }
                return true;
            })
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    @Override public ReservaDTO create(ReservaDTO dto) {
        if ("paseo".equalsIgnoreCase(dto.getTipo())) {
            if (dto.getCupoActual() != null && dto.getCupoMaximo() != null && dto.getCupoActual() >= dto.getCupoMaximo()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "El cupo para este paseo está lleno");
            }
            if (dto.getCaballoId() != null && dto.getFecha() != null && dto.getHoraInicio() != null) {
                List<Reserva> activeBookings = reservaRepository.findByCaballoIdAndFechaAndHoraInicioAndEstadoNot(
                    dto.getCaballoId(), dto.getFecha(), dto.getHoraInicio(), "CANCELADA"
                );
                int totalBooked = activeBookings.stream().mapToInt(r -> r.getCupoActual() != null ? r.getCupoActual() : 1).sum();
                int maxSlots = dto.getCupoMaximo() != null ? dto.getCupoMaximo() : 5;
                if (totalBooked >= maxSlots) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "El cupo para este paseo está lleno");
                }
            }
        }

        Caballo caballo = caballoRepository.findById(dto.getCaballoId()).orElseThrow(() -> new ResourceNotFoundException("Caballo no encontrado"));
        Usuario cliente = usuarioRepository.findById(dto.getClienteId()).orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado"));

        Reserva e = new Reserva();
        e.setTipo(dto.getTipo()); e.setFecha(dto.getFecha()); e.setHoraInicio(dto.getHoraInicio());
        e.setHoraFin(dto.getHoraFin()); e.setEstado("ACTIVA"); e.setCupoMaximo(dto.getCupoMaximo());
        e.setCupoActual(dto.getCupoActual() == null ? 1 : dto.getCupoActual() + 1);
        e.setCaballo(caballo); e.setCliente(cliente);

        return mapToDTO(reservaRepository.save(e));
    }

    @Override public ReservaDTO update(Long id, ReservaDTO dto) {
        Reserva e = reservaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada"));

        if ("paseo".equalsIgnoreCase(dto.getTipo())) {
            if (dto.getCupoActual() != null && dto.getCupoMaximo() != null && dto.getCupoActual() >= dto.getCupoMaximo()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "El cupo para este paseo está lleno");
            }
            Long caballoId = dto.getCaballoId() != null ? dto.getCaballoId() : e.getCaballo().getId();
            java.time.LocalDate fecha = dto.getFecha() != null ? dto.getFecha() : e.getFecha();
            java.time.LocalTime horaInicio = dto.getHoraInicio() != null ? dto.getHoraInicio() : e.getHoraInicio();
            int maxSlots = dto.getCupoMaximo() != null ? dto.getCupoMaximo() : (e.getCupoMaximo() != null ? e.getCupoMaximo() : 5);

            List<Reserva> activeBookings = reservaRepository.findByCaballoIdAndFechaAndHoraInicioAndEstadoNot(
                caballoId, fecha, horaInicio, "CANCELADA"
            );
            int totalBooked = activeBookings.stream()
                .filter(r -> !r.getId().equals(id))
                .mapToInt(r -> r.getCupoActual() != null ? r.getCupoActual() : 1)
                .sum();
            if (totalBooked >= maxSlots) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "El cupo para este paseo está lleno");
            }
        }

        e.setTipo(dto.getTipo());
        e.setFecha(dto.getFecha());
        e.setHoraInicio(dto.getHoraInicio());
        e.setHoraFin(dto.getHoraFin());
        e.setCupoMaximo(dto.getCupoMaximo());
        
        if (dto.getCaballoId() != null) {
            Caballo caballo = caballoRepository.findById(dto.getCaballoId())
                .orElseThrow(() -> new ResourceNotFoundException("Caballo no encontrado"));
            e.setCaballo(caballo);
        }
        if (dto.getClienteId() != null) {
            Usuario cliente = usuarioRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado"));
            e.setCliente(cliente);
        }

        return mapToDTO(reservaRepository.save(e));
    }

    @Override public void delete(Long id) { reservaRepository.deleteById(id); }

    @Override public void cancelar(Long id) {
        Reserva e = reservaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada"));
        e.setEstado("CANCELADA");
        reservaRepository.save(e);
    }
}
