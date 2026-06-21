package com.caballeriza.service;
import com.caballeriza.entity.RegistroMedico;
import java.util.List;
public interface RegistroMedicoService {
    List<RegistroMedico> getRegistrosByCaballo(Long caballoId);
    RegistroMedico save(RegistroMedico registroMedico);
}
