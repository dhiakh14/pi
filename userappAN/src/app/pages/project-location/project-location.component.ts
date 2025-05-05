import { Component, OnInit } from '@angular/core';
import { ProjectControllerService } from 'src/app/servicesAbir/services';

@Component({
  selector: 'app-project-location',
  templateUrl: './project-location.component.html',
  styleUrls: ['./project-location.component.css']
})
export class ProjectLocationComponent implements OnInit {

  center: google.maps.LatLngLiteral = { lat: 36.8065, lng: 10.1815 };
  zoom = 7;

  projects: any[] = [];

  google = google;

  constructor(private projectService: ProjectControllerService) {}

  ngOnInit(): void {
    this.projectService.getAllProjects().subscribe((data) => {
      this.projects = data;
      console.log(this.projects);
    });
  }
  
}