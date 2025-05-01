package tn.esprit.exam.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.exam.entity.HumanResources;
import tn.esprit.exam.repository.IhumanRepo;

import java.util.List;

@Service
@AllArgsConstructor
public class HumanResourcesServicesImpl {

    public IhumanRepo humanRepo;


    public List<HumanResources> findAll() {
        return humanRepo.findAll();
    }

    public HumanResources findById(long id) {
        return humanRepo.findById(id).orElse(null);
    }

    public HumanResources addHR(HumanResources human) {
        return humanRepo.save(human);
    }

    public void delete(long id) {
        humanRepo.deleteById(id);
    }

    public HumanResources update(long idHR, HumanResources human) {
        HumanResources existingHuman = humanRepo.findById(idHR)
                .orElseThrow(() -> new RuntimeException("HumanResources not found with id: " + idHR));

        if (human.getName() != null) {
            existingHuman.setName(human.getName());
        }
        if (human.getLastName() != null) {
            existingHuman.setLastName(human.getLastName());
        }
        if (human.getEmail() != null) {
            existingHuman.setEmail(human.getEmail());
        }
        if (human.getPhoneNumber() != null) {
            existingHuman.setPhoneNumber(human.getPhoneNumber());
        }
        existingHuman.setAvailability(human.isAvailability());
        if (human.getJob_Role() != null) {
            existingHuman.setJob_Role(human.getJob_Role());
        }


        return humanRepo.save(existingHuman);
    }


}