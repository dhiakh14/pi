import { Component, OnInit } from '@angular/core';
import { SupplierService } from 'src/app/service-arij/supplier.service';

declare var google: any;

@Component({
  selector: 'app-supplier-map',
  templateUrl: './supplier-map.component.html',
  styleUrls: ['./supplier-map.component.css']
})
export class SupplierMapComponent implements OnInit {
  suppliers: any[] = [];
  center = { lat: 36.8065, lng: 10.1815 }; // Default center (e.g., Tunis)
  zoom = 13;
  markers: any[] = []; // Store markers here for future reference
  selectedSupplier: any = null;  // To store the currently selected supplier

  constructor(private supplierService: SupplierService) {}

  ngOnInit(): void {
    this.supplierService.getSuppliers().subscribe(data => {
      this.suppliers = data.map(supplier => ({
        name: supplier.name,
        address: supplier.address
      }));
      
      this.initMap();
    });
  }

  initMap(): void {
    const map = new google.maps.Map(document.getElementById("map"), {
      center: this.center,
      zoom: this.zoom,
    });

    // Loop through suppliers and convert their address to coordinates
    this.suppliers.forEach(supplier => {
      this.geocodeAddress(supplier.address, map, supplier);
    });
  }

  // Geocode address to get latitude and longitude
  geocodeAddress(address: string, map: any, supplier: any): void {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
      if (status === "OK" && results[0]) {
        const position = results[0].geometry.location;

        const marker = new google.maps.Marker({
          map: map,
          position: position,
          label: supplier.name
        });

        // Add click event to show supplier details on marker click
        marker.addListener('click', () => {
          this.openSupplierDetails(supplier);  // Open supplier details when marker is clicked
        });

        this.markers.push(marker); // Add marker to the array
      }
    });
  }

  // Open supplier details when clicking on a marker
  openSupplierDetails(supplier: any): void {
    this.selectedSupplier = supplier;
    // Optionally, you can show an info window on the map or navigate to a detail page
    alert(`Supplier: ${supplier.name}\nAddress: ${supplier.address}`);  // This is just an example; you can enhance it
  }

  // Method to clear the markers from the map
  clearMarkers(): void {
    this.markers.forEach(marker => marker.setMap(null)); // Remove markers from the map
    this.markers = []; // Clear the array
  }
}
