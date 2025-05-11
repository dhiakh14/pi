import { Component, OnInit } from '@angular/core';
import { SupplierService } from 'src/app/service-arij/supplier.service';
import { Router } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-supplier-map',
  templateUrl: './supplier-map.component.html',
  styleUrls: ['./supplier-map.component.css']
})
export class SupplierMapComponent implements OnInit {
  suppliers: any[] = [];
  center = { lat: 36.8065, lng: 10.1815 };
  zoom = 13;
  markers: any[] = [];
  selectedSupplier: any = null;
  map: any;
  infoWindow: any;

  constructor(private supplierService: SupplierService, private router: Router) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (data) => {
        this.suppliers = data;
        this.initMap();
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
      }
    });
  }

  initMap(): void {
    this.map = new google.maps.Map(document.getElementById("map"), {
      center: this.center,
      zoom: this.zoom,
    });

    this.infoWindow = new google.maps.InfoWindow();

    this.suppliers.forEach(supplier => {
      this.geocodeAddress(supplier.address, this.map, supplier);
    });
  }

  geocodeAddress(address: string, map: any, supplier: any): void {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results: any[], status: string) => {
      if (status === "OK" && results[0]) {
        const position = results[0].geometry.location;
        this.createMarker(position, map, supplier);
      }
    });
  }

  createMarker(position: any, map: any, supplier: any): void {
    const marker = new google.maps.Marker({
      map: map,
      position: position,
      title: supplier.name
    });

    const contentString = `
      <div class="map-info-window">
        <h3>${supplier.name}</h3>
        <p>${supplier.address}</p>
      </div>
    `;

    marker.addListener('click', () => {
      this.openSupplierDetails(supplier);
      this.infoWindow.setContent(contentString);
      this.infoWindow.open(map, marker);
    });

    this.markers.push(marker);
  }

  openSupplierDetails(supplier: any): void {
    this.selectedSupplier = supplier;
    // You can replace the alert with a more complex UI interaction.
    // For example, display supplier details in a modal or panel
    // Example:
    // this.router.navigate(['/supplier-details', supplier.idSupplier]);
}


  clearMarkers(): void {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
    this.selectedSupplier = null;
    this.infoWindow.close();
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}