$basePath = "c:\Users\Armando Solis\OneDrive\Documents\UNA\2026\Progra IV\Examen final\SGC\caballeriza-backend\src\main\java\com\caballeriza"

$repos = @(
    @{ Name="CaballoRepository"; Entity="Caballo" },
    @{ Name="EmpleadoRepository"; Entity="Empleado" },
    @{ Name="RegistroMedicoRepository"; Entity="RegistroMedico" },
    @{ Name="ReservaRepository"; Entity="Reserva" },
    @{ Name="UsuarioRepository"; Entity="Usuario" },
    @{ Name="PlanAlimentacionRepository"; Entity="PlanAlimentacion" },
    @{ Name="RegistroSuministroRepository"; Entity="RegistroSuministro" },
    @{ Name="InsumoRepository"; Entity="Insumo" },
    @{ Name="AlertaRepository"; Entity="Alerta" }
)

foreach ($repo in $repos) {
    $content = @"
package com.caballeriza.repository;
import com.caballeriza.entity.$($repo.Entity);
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface $($repo.Name) extends JpaRepository<$($repo.Entity), Long> {
}
"@
    Set-Content -Path "$basePath\repository\$($repo.Name).java" -Value $content -Encoding UTF8
}

$corsConfig = @"
package com.caballeriza.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
"@
Set-Content -Path "$basePath\config\CorsConfig.java" -Value $corsConfig -Encoding UTF8

$jwtConfig = @"
package com.caballeriza.config;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {
    // La configuración de JWT se manejaría a nivel de SecurityFilterChain o utilidades,
    // este es el punto de entrada para configuraciones globales.
}
"@
Set-Content -Path "$basePath\config\JwtConfig.java" -Value $jwtConfig -Encoding UTF8

$rmService = @"
package com.caballeriza.service;
import com.caballeriza.entity.RegistroMedico;
import java.util.List;
public interface RegistroMedicoService {
    List<RegistroMedico> getRegistrosByCaballo(Long caballoId);
    RegistroMedico save(RegistroMedico registroMedico);
}
"@
Set-Content -Path "$basePath\service\RegistroMedicoService.java" -Value $rmService -Encoding UTF8

$rmServiceImpl = @"
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
"@
Set-Content -Path "$basePath\service\impl\RegistroMedicoServiceImpl.java" -Value $rmServiceImpl -Encoding UTF8

Write-Host "Missing files populated successfully."
