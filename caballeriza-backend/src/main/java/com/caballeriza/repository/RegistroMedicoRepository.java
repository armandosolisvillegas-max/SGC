package com.caballeriza.repository;
import com.caballeriza.entity.RegistroMedico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistroMedicoRepository extends JpaRepository<RegistroMedico, Long> {
}
