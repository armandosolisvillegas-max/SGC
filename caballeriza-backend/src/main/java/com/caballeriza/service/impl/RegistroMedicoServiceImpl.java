package com.caballeriza.service.impl;
import com.caballeriza.dto.RegistroMedicoDTO;
import com.caballeriza.dto.request.RegistroMedicoRequest;
import com.caballeriza.entity.Caballo;
import com.caballeriza.entity.Empleado;
import com.caballeriza.entity.RegistroMedico;
import com.caballeriza.entity.Rol;
import com.caballeriza.repository.CaballoRepository;
import com.caballeriza.repository.EmpleadoRepository;
import com.caballeriza.repository.RegistroMedicoRepository;
import com.caballeriza.service.RegistroMedicoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RegistroMedicoServiceImpl implements RegistroMedicoService {
    private final RegistroMedicoRepository repository;
    private final CaballoRepository caballoRepository;
    private final EmpleadoRepository empleadoRepository;

    @Override
    public List<RegistroMedicoDTO> getRegistrosByCaballo(Long caballoId) {
        return repository.findAll().stream()
                .filter(r -> r.getCaballo().getId().equals(caballoId))
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RegistroMedicoDTO save(Long caballoId, RegistroMedicoRequest request) {
        Caballo caballo = caballoRepository.findById(java.util.Objects.requireNonNull(caballoId))
                .orElseThrow(() -> new RuntimeException("Caballo no encontrado con id: " + caballoId));

        Empleado responsable;
        if (request.getResponsableId() != null && request.getResponsableId() != 99L) {
            responsable = empleadoRepository.findById(java.util.Objects.requireNonNull(request.getResponsableId()))
                    .orElseThrow(() -> new RuntimeException("Empleado no encontrado con id: " + request.getResponsableId()));
        } else {
            // Find by name or create a new one
            responsable = empleadoRepository.findByNombre(request.getResponsableNombre())
                    .orElseGet(() -> {
                        Empleado newEmp = Empleado.builder()
                                .nombre(request.getResponsableNombre() != null ? request.getResponsableNombre() : "Desconocido")
                                .rol(Rol.ROLE_VETERINARIO)
                                .contacto("Sin contacto")
                                .build();
                        return empleadoRepository.save(java.util.Objects.requireNonNull(newEmp));
                    });
        }

        RegistroMedico registro = RegistroMedico.builder()
                .tipo(request.getTipo())
                .fecha(request.getFecha() != null ? request.getFecha() : LocalDate.now())
                .descripcion(request.getDescripcion())
                .responsable(responsable)
                .caballo(caballo)
                .build();

        return toDTO(repository.save(java.util.Objects.requireNonNull(registro)));
    }

    private RegistroMedicoDTO toDTO(RegistroMedico r) {
        return new RegistroMedicoDTO(
                r.getId(),
                r.getTipo(),
                r.getFecha(),
                r.getDescripcion(),
                r.getResponsable() != null ? r.getResponsable().getId() : null,
                r.getResponsable() != null ? r.getResponsable().getNombre() : null,
                r.getCaballo() != null ? r.getCaballo().getId() : null
        );
    }
}
