package tn.esprit.exam.control;

import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import tn.esprit.exam.entity.MaterialResources;
import tn.esprit.exam.service.MaterialResourcesServicesImpl;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/MaterialResources")
@CrossOrigin(origins = "http://localhost:4200")
public class MaterialResourcesRestController {
    private MaterialResourcesServicesImpl materialResourcesService;


    @PostMapping("/addmat")
    public MaterialResources addmat(@RequestBody MaterialResources mat) {
        return materialResourcesService.addmat(mat);
    }
    @GetMapping(value = "/findAll", produces = "application/json")
public List<MaterialResources> findAll() {
        return materialResourcesService.findAll();
}

    @GetMapping("/findId/{id}")
    public MaterialResources findById(@PathVariable long id) {
        return materialResourcesService.findById(id);
        
    }
@DeleteMapping("/deletemat/{id}")
    public void deletemat(@PathVariable long id) {
        materialResourcesService.delete(id);
}

    @PutMapping("/updateMaterial/{idMR}")
    public MaterialResources updateMaterial(@PathVariable long idMR, @RequestBody MaterialResources mat) {
        return materialResourcesService.update(idMR, mat);
    }


    }
