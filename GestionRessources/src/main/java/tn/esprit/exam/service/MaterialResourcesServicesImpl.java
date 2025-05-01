package tn.esprit.exam.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.exam.entity.MaterialResources;
import tn.esprit.exam.repository.ImaterialRepo;

import java.util.List;

@Service
@AllArgsConstructor

public class MaterialResourcesServicesImpl {


    private ImaterialRepo matREPO;

    public List<MaterialResources> findAll() {
        return matREPO.findAll();
    }

    public MaterialResources findById(long id) {
        return matREPO.findById(id).orElse(null);
    }

    public MaterialResources addmat(MaterialResources mat) {
        return matREPO.save(mat);
    }

    public void delete(long id) {
        matREPO.deleteById(id);
    }

    public MaterialResources update(long idMR, MaterialResources mat) {

        MaterialResources existingMat = matREPO.findById(idMR)
                .orElseThrow(() -> new RuntimeException("MaterialResources not found with id: " + idMR));


        if (mat.getFirstName() != null) {
            existingMat.setFirstName(mat.getFirstName());
        }
        if (mat.getQuantity() != 0) {
            existingMat.setQuantity(mat.getQuantity());
        }
        if (mat.getPrice() != 0) {
            existingMat.setPrice(mat.getPrice());
        }
        if (mat.getCategory() != null) {
            existingMat.setCategory(mat.getCategory());
        }

        return matREPO.save(existingMat);
    }

}
