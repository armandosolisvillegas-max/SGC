package com.caballeriza.service.impl;
import com.caballeriza.entity.RegistroMedico;
import com.caballeriza.repository.RegistroMedicoRepository;
import com.caballeriza.service.RegistroMedicoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RegistroMedicoServiceImpl implements RegistroMedicoService {
    private final RegistroMedicoRepository repository;

    @Override
    public List<RegistroMedico> getRegistrosByCaballo(Long caballoId) {
        return repository.findAll().stream()
                .filter(r -> r.getCaballo().getId().equals(caballoId))
                .collect(Collectors.toList());
    }

    @Override
    public RegistroMedico save(RegistroMedico registroMedico) {
        return repository.save(registroMedico);
    }
}
