package com.caballeriza.service.impl;
import com.caballeriza.dto.AlertaDTO;
import com.caballeriza.entity.Alerta;
import com.caballeriza.exception.ResourceNotFoundException;
import com.caballeriza.repository.AlertaRepository;
import com.caballeriza.service.AlertaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlertaServiceImpl implements AlertaService {
    private final AlertaRepository repository;

    @Override public List<AlertaDTO> getAlertasNoLeidas() {
        return repository.findAll().stream()
                .filter(a -> !a.getLeida())
                .map(a -> {
                    AlertaDTO dto = new AlertaDTO();
                    dto.setId(a.getId()); dto.setTipo(a.getTipo()); dto.setMensaje(a.getMensaje());
                    dto.setReferenciaId(a.getReferenciaId()); dto.setLeida(a.getLeida());
                    dto.setFecha(a.getFecha()); dto.setDestinatarioId(a.getDestinatario().getId());
                    return dto;
                }).collect(Collectors.toList());
    }

    @Override public void marcarLeida(Long id) {
        Alerta a = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Alerta no encontrada"));
        a.setLeida(true);
        repository.save(a);
    }
}
