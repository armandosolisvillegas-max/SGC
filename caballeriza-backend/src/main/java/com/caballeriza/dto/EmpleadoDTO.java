package com.caballeriza.dto;
import com.caballeriza.entity.Rol;
import lombok.Data;
@Data
public class EmpleadoDTO {
    private Long id;
    private String nombre;
    private Rol rol;
    private String contacto;
}
