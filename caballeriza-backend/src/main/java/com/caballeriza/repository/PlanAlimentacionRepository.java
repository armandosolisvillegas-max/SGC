package com.caballeriza.repository;
import com.caballeriza.entity.PlanAlimentacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanAlimentacionRepository extends JpaRepository<PlanAlimentacion, Long> {
}
