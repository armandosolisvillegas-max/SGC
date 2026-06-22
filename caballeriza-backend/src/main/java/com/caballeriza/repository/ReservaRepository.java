package com.caballeriza.repository;
import com.caballeriza.entity.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByCaballoIdAndFechaAndHoraInicioAndEstadoNot(Long caballoId, LocalDate fecha, LocalTime horaInicio, String estado);
}
