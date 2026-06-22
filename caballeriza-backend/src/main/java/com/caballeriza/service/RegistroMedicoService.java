package com.caballeriza.service;
import com.caballeriza.dto.RegistroMedicoDTO;
import com.caballeriza.dto.request.RegistroMedicoRequest;
import java.util.List;
public interface RegistroMedicoService {
    List<RegistroMedicoDTO> getRegistrosByCaballo(Long caballoId);
    RegistroMedicoDTO save(Long caballoId, RegistroMedicoRequest request);
}
