package com.caballeriza.service;
import com.caballeriza.dto.InsumoDTO;
import java.util.List;
public interface InventarioService {
    List<InsumoDTO> getAll();
    List<InsumoDTO> getStockBajo();
    InsumoDTO create(InsumoDTO dto);
    InsumoDTO update(Long id, InsumoDTO dto);
    void delete(Long id);
}
