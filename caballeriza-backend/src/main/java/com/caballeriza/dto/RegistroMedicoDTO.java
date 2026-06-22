package com.caballeriza.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroMedicoDTO {
    private Long id;
    private String tipo;
    private LocalDate fecha;
    private String descripcion;
    private Long responsableId;
    private String responsableNombre;
    private Long caballoId;
}
