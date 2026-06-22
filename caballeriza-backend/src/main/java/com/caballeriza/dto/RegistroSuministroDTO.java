package com.caballeriza.dto;
import lombok.Data;
import java.time.LocalDateTime;
@Data
public class RegistroSuministroDTO { 
    private Long id; 
    private LocalDateTime fecha; 
    private String tipo; 
    private Double cantidad; 
    private Long planId; 
    private String caballoNombre; 
}
