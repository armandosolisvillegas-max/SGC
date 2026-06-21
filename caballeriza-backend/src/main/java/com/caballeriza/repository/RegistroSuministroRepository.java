package com.caballeriza.repository;
import com.caballeriza.entity.RegistroSuministro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistroSuministroRepository extends JpaRepository<RegistroSuministro, Long> {
}
