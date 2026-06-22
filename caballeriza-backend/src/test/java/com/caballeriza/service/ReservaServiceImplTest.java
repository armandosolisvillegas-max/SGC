package com.caballeriza.service;

import com.caballeriza.dto.ReservaDTO;
import com.caballeriza.entity.Caballo;
import com.caballeriza.entity.Reserva;
import com.caballeriza.entity.Usuario;
import com.caballeriza.repository.CaballoRepository;
import com.caballeriza.repository.ReservaRepository;
import com.caballeriza.repository.UsuarioRepository;
import com.caballeriza.service.impl.ReservaServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
public class ReservaServiceImplTest {

    @Mock
    private ReservaRepository reservaRepository;

    @Mock
    private CaballoRepository caballoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private ReservaServiceImpl reservaService;

    @Test
    public void testCreateReserva_PaseoLleno_LanzaExcepcionConflicto() {
        // Arrange
        ReservaDTO dto = new ReservaDTO();
        dto.setTipo("paseo");
        dto.setCupoActual(10);
        dto.setCupoMaximo(10);
        
        // Act & Assert
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            reservaService.create(dto);
        });
        
        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
        assertTrue(java.util.Objects.requireNonNull(exception.getReason()).contains("El cupo para este paseo está lleno"));
        verify(reservaRepository, never()).save(any());
    }

    @Test
    public void testCreateReserva_PaseoDisponible_Success() {
        // Arrange
        ReservaDTO dto = new ReservaDTO();
        dto.setTipo("paseo");
        dto.setFecha(LocalDate.of(2026, 6, 22));
        dto.setHoraInicio(LocalTime.of(8, 0));
        dto.setHoraFin(LocalTime.of(9, 30));
        dto.setCupoActual(5);
        dto.setCupoMaximo(10);
        dto.setCaballoId(1L);
        dto.setClienteId(1L);

        Caballo caballo = new Caballo();
        caballo.setId(1L);
        Usuario cliente = new Usuario();
        cliente.setId(1L);

        Reserva savedReserva = new Reserva();
        savedReserva.setId(1L);
        savedReserva.setTipo("paseo");
        savedReserva.setFecha(LocalDate.of(2026, 6, 22));
        savedReserva.setHoraInicio(LocalTime.of(8, 0));
        savedReserva.setHoraFin(LocalTime.of(9, 30));
        savedReserva.setCupoActual(5);
        savedReserva.setCupoMaximo(10);
        savedReserva.setCaballo(caballo);
        savedReserva.setCliente(cliente);

        when(caballoRepository.findById(1L)).thenReturn(Optional.of(caballo));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(reservaRepository.findByCaballoIdAndFechaAndHoraInicioAndEstadoNot(1L, LocalDate.of(2026, 6, 22), LocalTime.of(8, 0), "CANCELADA"))
            .thenReturn(new ArrayList<>());
        when(reservaRepository.save(any(Reserva.class))).thenReturn(savedReserva);

        // Act
        ReservaDTO result = reservaService.create(dto);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(reservaRepository, times(1)).save(any(Reserva.class));
    }
}
