package com.caballeriza.service;

import com.caballeriza.dto.ReservaDTO;
import java.util.List;

public interface ReservaService {
    List<ReservaDTO> getAll(String tipo, String fecha, int page);

    ReservaDTO create(ReservaDTO dto);

    ReservaDTO update(Long id, ReservaDTO dto);

    void delete(Long id);

    void cancelar(Long id);
}

// Ale
