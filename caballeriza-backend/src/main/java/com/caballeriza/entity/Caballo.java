package com.caballeriza.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "caballos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Caballo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, unique = true)
    private String identificador;

    private Integer edad;
    private String raza;
    private String sexo;
    private Double peso;
    @Column(columnDefinition = "LONGTEXT")
    private String fotoUrl;

    @OneToMany(mappedBy = "caballo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RegistroMedico> registrosMedicos;

    @OneToMany(mappedBy = "caballo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PlanAlimentacion> planesAlimentacion;

    @OneToMany(mappedBy = "caballo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Reserva> reservas;
}
