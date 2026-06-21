package com.caballeriza.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "reservas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Reserva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String tipo;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private LocalTime horaInicio;

    @Column(nullable = false)
    private LocalTime horaFin;

    @Column(nullable = false)
    private String estado;

    private Integer cupoMaximo;
    private Integer cupoActual;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "caballo_id", nullable = false)
    private Caballo caballo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Usuario cliente;
}
