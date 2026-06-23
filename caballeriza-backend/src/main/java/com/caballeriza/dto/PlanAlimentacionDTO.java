package com.caballeriza.dto;
import lombok.Data;
@Data
public class PlanAlimentacionDTO {
    private Long id;
    private String descripcion;
    private String frecuencia;
    private Long caballoId;
    private String caballoNombre;
    private Long insumoId;
    private String insumoNombre;
}
