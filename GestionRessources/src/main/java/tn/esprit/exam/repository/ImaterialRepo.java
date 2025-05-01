package tn.esprit.exam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.exam.entity.MaterialResources;

@Repository
public interface ImaterialRepo extends JpaRepository<MaterialResources, Long> {
}
