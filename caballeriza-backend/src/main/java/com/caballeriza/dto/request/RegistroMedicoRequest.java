package com.caballeriza.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class RegistroMedicoRequest {
    private String tipo;
    private LocalDate fecha;
    private String descripcion;
    private Long responsableId;
    private String responsableNombre;
}
