package com.caballeriza.dto;
import lombok.Data;
@Data
public class CaballoDTO {
    private Long id;
    private String nombre;
    private String identificador;
    private Integer edad;
    private String raza;
    private String sexo;
    private Double peso;
    private String fotoUrl;
}
