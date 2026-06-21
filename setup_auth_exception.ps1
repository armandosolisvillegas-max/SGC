$basePath = "c:\Users\Armando Solis\OneDrive\Documents\UNA\2026\Progra IV\Examen final\SGC\caballeriza-backend\src\main\java\com\caballeriza"
$dtoReqDir = Join-Path $basePath "dto\request"
$dtoResDir = Join-Path $basePath "dto\response"
$controllerDir = Join-Path $basePath "controller"
$exceptionDir = Join-Path $basePath "exception"

New-Item -ItemType Directory -Force -Path $dtoReqDir | Out-Null
New-Item -ItemType Directory -Force -Path $dtoResDir | Out-Null

# --- DTOs ---
$loginReq = @"
package com.caballeriza.dto.request;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class LoginRequest {
    @NotBlank @Email private String email;
    @NotBlank private String password;
}
"@

$registroReq = @"
package com.caballeriza.dto.request;
import com.caballeriza.entity.Rol;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data
public class RegistroRequest {
    @NotBlank private String nombre;
    @NotBlank @Email private String email;
    @NotBlank private String password;
    @NotNull private Rol rol;
}
"@

$authRes = @"
package com.caballeriza.dto.response;
import lombok.AllArgsConstructor;
import lombok.Data;
@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
}
"@

$errorRes = @"
package com.caballeriza.dto.response;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;
@Data
@AllArgsConstructor
public class ErrorResponse {
    private int status;
    private String error;
    private String message;
    private LocalDateTime timestamp;
}
"@

Set-Content -Path "$dtoReqDir\LoginRequest.java" -Value $loginReq -Encoding UTF8
Set-Content -Path "$dtoReqDir\RegistroRequest.java" -Value $registroReq -Encoding UTF8
Set-Content -Path "$dtoResDir\AuthResponse.java" -Value $authRes -Encoding UTF8
Set-Content -Path "$dtoResDir\ErrorResponse.java" -Value $errorRes -Encoding UTF8

# --- EXCEPTIONS ---
$globalExceptionHandler = @"
package com.caballeriza.exception;

import com.caballeriza.dto.response.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(HttpStatus.NOT_FOUND.value(), "Not Found", ex.getMessage(), LocalDateTime.now());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .reduce("", (a, b) -> a + " | " + b);
        ErrorResponse error = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), "Validation Error", msg, LocalDateTime.now());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex) {
        ErrorResponse error = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", ex.getMessage(), LocalDateTime.now());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
"@

$resourceNotFoundException = @"
package com.caballeriza.exception;
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
"@

Set-Content -Path "$exceptionDir\GlobalExceptionHandler.java" -Value $globalExceptionHandler -Encoding UTF8
Set-Content -Path "$exceptionDir\ResourceNotFoundException.java" -Value $resourceNotFoundException -Encoding UTF8

# --- AUTH CONTROLLER ---
$authController = @"
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
        return ResponseEntity.status(HttpStatus.CREATED).body("Usuario registrado exitosamente.");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);
        
        return ResponseEntity.ok(new AuthResponse(jwt));
    }
}
"@

Set-Content -Path "$controllerDir\AuthController.java" -Value $authController -Encoding UTF8

Write-Host "Auth, DTOs y Exceptions configurados."
