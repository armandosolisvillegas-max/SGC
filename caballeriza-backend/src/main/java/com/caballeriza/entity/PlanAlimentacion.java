package com.caballeriza.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "planes_alimentacion")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PlanAlimentacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false)
    private String frecuencia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "caballo_id", nullable = false)
    private Caballo caballo;

    @OneToMany(mappedBy = "planAlimentacion", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RegistroSuministro> registrosSuministros;
}
