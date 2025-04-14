import { Component, OnInit } from '@angular/core';
import { ProjectControllerService } from 'src/app/servicesAbir/services';

@Component({
  selector: 'app-project-duration',
  templateUrl: './project-duration.component.html',
  styleUrls: ['./project-duration.component.css']
})
export class ProjectDurationComponent implements OnInit {
  averageDuration: number = 0; ;

  constructor(private projectService: ProjectControllerService) {}

  ngOnInit(): void {
    this.projectService.getAverageDuration().subscribe(duration => {
      this.averageDuration = duration;
    });
  }
}
