package com.caballeriza.service;
import com.caballeriza.dto.CaballoDTO;
import java.util.List;
public interface CaballoService {
    List<CaballoDTO> getAll();
    CaballoDTO getById(Long id);
    CaballoDTO create(CaballoDTO dto);
    CaballoDTO update(Long id, CaballoDTO dto);
    void delete(Long id);
}
