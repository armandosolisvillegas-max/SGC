package com.caballeriza.dto;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
@Data
public class ReservaDTO {
    private Long id;
    private String tipo;
    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private String estado;
    private Integer cupoMaximo;
    private Integer cupoActual;
    private Long caballoId;
    private Long clienteId;
    private String caballoNombre;
    private String clienteNombre;
}
