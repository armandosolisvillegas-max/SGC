package com.caballeriza.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "insumos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Insumo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String tipo;

    @Column(nullable = false)
    private Double stockActual;

    @Column(nullable = false)
    private Double stockMinimo;
}
