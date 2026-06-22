package com.caballeriza.controller;

import com.caballeriza.dto.request.LoginRequest;
import com.caballeriza.dto.request.RegistroRequest;
import com.caballeriza.dto.response.AuthResponse;
import com.caballeriza.entity.Usuario;
import com.caballeriza.repository.UsuarioRepository;
import com.caballeriza.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@Valid @RequestBody RegistroRequest request) {
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("El email ya está registrado.");
        }

        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .rol(request.getRol())
                .build();
        
        usuarioRepository.save(usuario);
        
        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);
        
        AuthResponse.UserDto userDto = new AuthResponse.UserDto(
            usuario.getId(), usuario.getNombre(), usuario.getEmail(), usuario.getRol().name()
        );
        
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(jwt, userDto));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail()).orElseThrow();
        AuthResponse.UserDto userDto = new AuthResponse.UserDto(
            usuario.getId(), usuario.getNombre(), usuario.getEmail(), usuario.getRol().name()
        );
        
        return ResponseEntity.ok(new AuthResponse(jwt, userDto));
    }
}
