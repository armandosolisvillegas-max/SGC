package com.caballeriza.service;

import com.caballeriza.dto.ReservaDTO;
import com.caballeriza.entity.Reserva;
import com.caballeriza.repository.ReservaRepository;
import com.caballeriza.service.impl.ReservaServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ReservaServiceImplTest {

    @Mock
    private ReservaRepository reservaRepository;

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
        assertTrue(exception.getReason().contains("El cupo para este paseo está lleno"));
        verify(reservaRepository, never()).save(any());
    }

    @Test
    public void testCreateReserva_PaseoDisponible_Success() {
        // Arrange
        ReservaDTO dto = new ReservaDTO();
        dto.setTipo("paseo");
        dto.setCupoActual(5);
        dto.setCupoMaximo(10);

        Reserva savedReserva = new Reserva();
        savedReserva.setId(1L);
        savedReserva.setTipo("paseo");
        savedReserva.setCupoActual(5);
        savedReserva.setCupoMaximo(10);

        when(reservaRepository.save(any(Reserva.class))).thenReturn(savedReserva);

        // Act
        ReservaDTO result = reservaService.create(dto);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(reservaRepository, times(1)).save(any(Reserva.class));
    }
}
