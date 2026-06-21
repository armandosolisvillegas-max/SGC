package com.caballeriza.repository;
import com.caballeriza.entity.Caballo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CaballoRepository extends JpaRepository<Caballo, Long> {
}
