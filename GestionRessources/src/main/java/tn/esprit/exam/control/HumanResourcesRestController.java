package tn.esprit.exam.control;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.exam.entity.HumanResources;
import tn.esprit.exam.service.HumanResourcesServicesImpl;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/HumanResources")
@CrossOrigin(origins = "http://localhost:4200")
public class HumanResourcesRestController {

    private HumanResourcesServicesImpl humanResourcesService;

    @PostMapping("/addHR")
    public HumanResources addHR(@RequestBody HumanResources human) {
        
        return humanResourcesService.addHR(human);
    }



    @GetMapping(value = "/findAll", produces = "application/json")
    public List<HumanResources> findAll() {
        return humanResourcesService.findAll();
    }

    @GetMapping("/findId/{id}")
    public HumanResources findById(@PathVariable long id) {
        return humanResourcesService.findById(id);
    }

    @DeleteMapping("/deleteHR/{id}")
    public void deleteHR(@PathVariable long id) {
        humanResourcesService.delete(id);
    }

    @PutMapping("/updateHR/{idHR}")
    public HumanResources updateHR(@PathVariable long idHR, @RequestBody HumanResources human) {
        return humanResourcesService.update(idHR, human);
    }
}