package mx.edu.utez.saem.model.patient;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends JpaRepository<PatientBean, Long> {
}
