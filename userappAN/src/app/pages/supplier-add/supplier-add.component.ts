import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupplierService } from 'src/app/service-arij/supplier.service';

declare var google: any;

@Component({
  selector: 'app-supplier-add',
  templateUrl: './supplier-add.component.html',
  styleUrls: ['./supplier-add.component.css']
})
export class SupplierAddComponent implements OnInit, AfterViewInit {
  supplierForm!: FormGroup;
  materialResources: any[] = [];
  submitted = false;
  loading = false;
  errorMessage = '';

  sentimentResult: string = '';
  sentimentError: string = '';
  isSummarizing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      status: ['ACTIVE', Validators.required],
      notes: [''],
      materialResourceId: [null, Validators.required],
      sentiment: [null],
      aiRating: [null]
    });

    this.supplierService.getAllMaterialResources().subscribe(data => {
      this.materialResources = data;
    });
  }

  ngAfterViewInit(): void {
    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 36.8065, lng: 10.1815 }, // Tunis
      zoom: 13,
    });

    const input = document.getElementById("address-input") as HTMLInputElement;
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo("bounds", map);

    const marker = new google.maps.Marker({
      map,
      draggable: true,
      anchorPoint: new google.maps.Point(0, -29),
    });

    autocomplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) return;

        map.setCenter(place.geometry.location);
        map.setZoom(15);
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        this.supplierForm.get('address')?.setValue(place.formatted_address);
      });
    });

    map.addListener("click", (e: any) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: e.latLng }, (results: any, status: any) => {
        if (status === "OK" && results[0]) {
          this.ngZone.run(() => {
            const formattedAddress = results[0].formatted_address;
            input.value = formattedAddress;
            this.supplierForm.get('address')?.setValue(formattedAddress);
            marker.setPosition(e.latLng);
            marker.setVisible(true);
          });
        }
      });
    });
  }

  analyzeSentiment(): void {
    const notes = this.supplierForm.get('notes')?.value;
    if (!notes) {
      this.sentimentError = "Please enter notes first.";
      return;
    }

    this.supplierService.analyzeSentiment(notes).subscribe({
      next: (response) => {
        const sentiment = response.sentiment;
        const aiRating = sentiment === 'POSITIVE' ? 5 : sentiment === 'NEUTRAL' ? 3 : 1;

        this.supplierForm.patchValue({
          sentiment: sentiment,
          aiRating: aiRating
        });

        this.sentimentResult = sentiment;
        this.sentimentError = '';
      },
      error: () => {
        this.sentimentError = "Analysis failed. Try again.";
        this.sentimentResult = '';
      }
    });
  }

  onSubmit(): void {
    console.log("Form Values:", this.supplierForm.value);

    const payload = {
      ...this.supplierForm.value,
      materialResource: { idMR: this.supplierForm.value.materialResourceId }
    };
    console.log("Final Payload:", payload);

    this.supplierService.createSupplier(payload).subscribe({
      next: (response) => {
        console.log("API Response:", response);
        alert('Success! Check console for details');
      },
      error: (err) => {
        console.error("API Error:", err);
        alert('Error! Check console');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/suppliers']);
  }

  get f() {
    return this.supplierForm.controls;
  }
}
