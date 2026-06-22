package com.caballeriza.repository;
import com.caballeriza.entity.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {
    java.util.Optional<Empleado> findByNombre(String nombre);
}
