import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-project-location',
  templateUrl: './project-location.component.html',
  styleUrls: ['./project-location.component.css']
})

export class ProjectLocationComponent {
  @Input() adresse: string = '';

  get googleMapsUrl(): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.adresse)}`;
  }
}
