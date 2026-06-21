$entityDir = "c:\Users\Armando Solis\OneDrive\Documents\UNA\2026\Progra IV\Examen final\SGC\caballeriza-backend\src\main\java\com\caballeriza\entity"

# Rol.java
$rolContent = @"
package com.caballeriza.entity;
public enum Rol {
    ROLE_ADMIN,
    ROLE_VETERINARIO,
    ROLE_POTRADOR,
    ROLE_CUIDADOR,
    ROLE_CLIENTE
}
"@
Set-Content -Path "$entityDir\Rol.java" -Value $rolContent -Encoding UTF8

# Usuario.java
$usuarioContent = @"
package com.caballeriza.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "usuarios")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Reserva> reservas;
}
"@
Set-Content -Path "$entityDir\Usuario.java" -Value $usuarioContent -Encoding UTF8

# Caballo.java
$caballoContent = @"
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
    private String fotoUrl;

    @OneToMany(mappedBy = "caballo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RegistroMedico> registrosMedicos;

    @OneToMany(mappedBy = "caballo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PlanAlimentacion> planesAlimentacion;

    @OneToMany(mappedBy = "caballo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Reserva> reservas;
}
"@
Set-Content -Path "$entityDir\Caballo.java" -Value $caballoContent -Encoding UTF8

# RegistroMedico.java
$registroMedicoContent = @"
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
"@
Set-Content -Path "$entityDir\RegistroMedico.java" -Value $registroMedicoContent -Encoding UTF8

# Empleado.java
$empleadoContent = @"
package com.caballeriza.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "empleados")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Empleado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol;

    private String contacto;

    @OneToMany(mappedBy = "empleado", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Turno> turnos;

    @OneToMany(mappedBy = "responsable", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RegistroMedico> registrosMedicos;
}
"@
Set-Content -Path "$entityDir\Empleado.java" -Value $empleadoContent -Encoding UTF8

# Turno.java
$turnoContent = @"
package com.caballeriza.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "turnos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Turno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private LocalTime horaInicio;

    @Column(nullable = false)
    private LocalTime horaFin;

    @Column(nullable = false)
    private String tareaAsignada;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empleado_id", nullable = false)
    private Empleado empleado;
}
"@
Set-Content -Path "$entityDir\Turno.java" -Value $turnoContent -Encoding UTF8

# Reserva.java
$reservaContent = @"
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
"@
Set-Content -Path "$entityDir\Reserva.java" -Value $reservaContent -Encoding UTF8

# PlanAlimentacion.java
$planContent = @"
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
"@
Set-Content -Path "$entityDir\PlanAlimentacion.java" -Value $planContent -Encoding UTF8

# RegistroSuministro.java
$registroSumContent = @"
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
"@
Set-Content -Path "$entityDir\RegistroSuministro.java" -Value $registroSumContent -Encoding UTF8

# Insumo.java
$insumoContent = @"
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
"@
Set-Content -Path "$entityDir\Insumo.java" -Value $insumoContent -Encoding UTF8

# Alerta.java
$alertaContent = @"
package com.caballeriza.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alertas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Alerta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String tipo;

    @Column(nullable = false)
    private String mensaje;

    private Long referenciaId;

    @Column(nullable = false)
    private Boolean leida = false;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destinatario_id", nullable = false)
    private Usuario destinatario;
}
"@
Set-Content -Path "$entityDir\Alerta.java" -Value $alertaContent -Encoding UTF8

Write-Host "Todas las entidades generadas."
