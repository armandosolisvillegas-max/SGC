$basePath = "c:\Users\Armando Solis\OneDrive\Documents\UNA\2026\Progra IV\Examen final\SGC\caballeriza-backend\src\main\java\com\caballeriza"
$repoDir = Join-Path $basePath "repository"
$secDir = Join-Path $basePath "security"
$configDir = Join-Path $basePath "config"

# --- REPOSITORIES ---
$repos = @{
    "UsuarioRepository.java" = @"
package com.caballeriza.repository;
import com.caballeriza.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
}
"@
    "TurnoRepository.java" = "package com.caballeriza.repository;`nimport com.caballeriza.entity.Turno;`nimport org.springframework.data.jpa.repository.JpaRepository;`npublic interface TurnoRepository extends JpaRepository<Turno, Long> {}"
    "PlanAlimentacionRepository.java" = "package com.caballeriza.repository;`nimport com.caballeriza.entity.PlanAlimentacion;`nimport org.springframework.data.jpa.repository.JpaRepository;`npublic interface PlanAlimentacionRepository extends JpaRepository<PlanAlimentacion, Long> {}"
    "RegistroSuministroRepository.java" = "package com.caballeriza.repository;`nimport com.caballeriza.entity.RegistroSuministro;`nimport org.springframework.data.jpa.repository.JpaRepository;`npublic interface RegistroSuministroRepository extends JpaRepository<RegistroSuministro, Long> {}"
    "InsumoRepository.java" = "package com.caballeriza.repository;`nimport com.caballeriza.entity.Insumo;`nimport org.springframework.data.jpa.repository.JpaRepository;`npublic interface InsumoRepository extends JpaRepository<Insumo, Long> {}"
    "AlertaRepository.java" = "package com.caballeriza.repository;`nimport com.caballeriza.entity.Alerta;`nimport org.springframework.data.jpa.repository.JpaRepository;`npublic interface AlertaRepository extends JpaRepository<Alerta, Long> {}"
}

foreach ($repo in $repos.GetEnumerator()) {
    Set-Content -Path (Join-Path $repoDir $repo.Name) -Value $repo.Value -Encoding UTF8
}

# --- SECURITY CLASSES ---
$jwtUtilContent = @"
package com.caballeriza.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    private final SecretKey key;
    private final long expirationTime;

    public JwtUtil() {
        // En un entorno real esto debe venir de application.yml
        String secretString = "EstaEsUnaClaveSecretaMuyLargaParaAsegurarElAlgoritmoHS256DeJWT!";
        this.key = Keys.hmacShaKeyFor(secretString.getBytes(StandardCharsets.UTF_8));
        this.expirationTime = 86400000; // 1 dia
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }

    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(key)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
"@

$jwtFilterContent = @"
package com.caballeriza.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        try {
            userEmail = jwtUtil.extractUsername(jwt);
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                if (jwtUtil.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Log error
        }

        filterChain.doFilter(request, response);
    }
}
"@

$userDetailsServiceImplContent = @"
package com.caballeriza.security;

import com.caballeriza.entity.Usuario;
import com.caballeriza.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));

        return new User(
                usuario.getEmail(),
                usuario.getPassword(),
                Collections.singleton(new SimpleGrantedAuthority(usuario.getRol().name()))
        );
    }
}
"@

$securityConfigContent = @"
package com.caballeriza.config;

import com.caballeriza.security.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
"@

Set-Content -Path "$secDir\JwtUtil.java" -Value $jwtUtilContent -Encoding UTF8
Set-Content -Path "$secDir\JwtFilter.java" -Value $jwtFilterContent -Encoding UTF8
Set-Content -Path "$secDir\UserDetailsServiceImpl.java" -Value $userDetailsServiceImplContent -Encoding UTF8
Set-Content -Path "$configDir\SecurityConfig.java" -Value $securityConfigContent -Encoding UTF8

Write-Host "Repositories and Security Classes generated successfully."
