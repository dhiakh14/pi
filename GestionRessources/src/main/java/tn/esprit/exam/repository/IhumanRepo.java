package tn.esprit.exam.repository;

import jakarta.persistence.Id;
import jdk.jfr.Registered;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.exam.entity.HumanResources;

@Repository
public interface IhumanRepo extends JpaRepository<HumanResources, Long > {

}