package com.caballeriza.dto;
import lombok.Data;
import java.time.LocalDateTime;
@Data
public class AlertaDTO { private Long id; private String tipo; private String mensaje; private Long referenciaId; private Boolean leida; private LocalDateTime fecha; private Long destinatarioId; }
