package com.caballeriza.service;
import com.caballeriza.dto.AlertaDTO;
import java.util.List;
public interface AlertaService {
    List<AlertaDTO> getAlertasNoLeidas();
    void marcarLeida(Long id);
}
