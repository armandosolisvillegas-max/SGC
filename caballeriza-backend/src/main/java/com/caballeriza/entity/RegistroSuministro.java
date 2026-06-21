package com.caballeriza.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "registros_suministros")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RegistroSuministro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(nullable = false)
    private String tipo;

    @Column(nullable = false)
    private Double cantidad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private PlanAlimentacion planAlimentacion;
}
