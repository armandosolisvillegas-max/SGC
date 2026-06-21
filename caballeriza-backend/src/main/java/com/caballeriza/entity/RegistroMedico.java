package com.caballeriza.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "registros_medicos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RegistroMedico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String tipo;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responsable_id", nullable = false)
    private Empleado responsable;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "caballo_id", nullable = false)
    private Caballo caballo;
}
