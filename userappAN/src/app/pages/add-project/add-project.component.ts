import { Component, OnInit, NgZone } from '@angular/core';
import { Project } from 'src/app/servicesAbir/models';
import { ProjectControllerService } from 'src/app/servicesAbir/services';
import { Router } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {
  project: Partial<Project> = {
    status: 'ON_GOING'
  };
  formSubmitted: boolean = false;

  map: any;
  marker: any;

  constructor(private projectService: ProjectControllerService, private router: Router, private ngZone: NgZone) {}

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    const mapOptions = {
      center: new google.maps.LatLng(36.8065, 10.1815), // Par défaut Tunis
      zoom: 8,
    };
    this.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    this.map.addListener("click", (event: any) => {
      this.placeMarker(event.latLng);
    });
  }

  placeMarker(location: any) {
    if (this.marker) {
      this.marker.setPosition(location);
    } else {
      this.marker = new google.maps.Marker({
        position: location,
        map: this.map,
      });
    }
  
    const lat = location.lat();
    const lng = location.lng();
  
    this.ngZone.run(() => {
      this.project.latitude = lat;
      this.project.longitude = lng;
    });
  
    // Appel de reverse geocoding
    this.reverseGeocode(lat, lng);
  }
  
  reverseGeocode(lat: number, lng: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
  
    fetch(url)
      .then(res => res.json())
      .then(data => {
        this.ngZone.run(() => {
          this.project.city = data.address?.city || data.address?.town || data.address?.village || 'Unknown';
          this.project.location = data.display_name || 'Unknown location';
        });
      })
      .catch(error => {
        console.error('Erreur de géocodage inverse :', error);
      });
  }
  

  onSubmit() {
    this.formSubmitted = true;

    if (!this.project.name || !this.project.description || !this.project.startDate || !this.project.endDate) {
      alert('Please fill in all required fields.');
      return;
    }

    this.project.startDate = this.convertToISO(this.project.startDate);
    this.project.endDate = this.convertToISO(this.project.endDate);

    this.projectService.addProject({ body: this.project as Project }).subscribe({
      next: (response) => {
        console.log('Project added successfully:', response);
        alert('Project added successfully!');
        this.resetForm();
      },
      error: (error) => {
        console.error('Error adding project:', error);
        if (error.status === 0) {
          alert('Server connection error. Please make sure the backend is running and accessible.');
        } else {
          alert('Failed to add project. Details: ' + error.message);
        }
      }
    });
  }

  private convertToISO(date: any): string {
    if (date instanceof Date) {
      return date.toISOString();
    } else if (typeof date === 'string') {
      return new Date(date).toISOString();
    }
    return '';
  }

  resetForm() {
    this.project = { status: 'ON_GOING' };
    this.formSubmitted = false;
  }

  goBack() {
    this.router.navigate(['/project']);
  }
}
