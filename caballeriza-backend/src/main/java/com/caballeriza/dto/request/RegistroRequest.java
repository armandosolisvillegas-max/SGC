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
