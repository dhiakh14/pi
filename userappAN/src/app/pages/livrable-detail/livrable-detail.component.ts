import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Livrable, Status } from 'src/app/common/livrable';
import { LivrableService } from 'src/app/servicesEmira/livrable.service';

@Component({
  selector: 'app-livrable-detail',
  templateUrl: './livrable-detail.component.html',
  styleUrls: ['./livrable-detail.component.css']
})
export class LivrableDetailComponent implements OnInit {

  livrable!: Livrable;
  editMode: { [key: string]: boolean } = {}; // To track editable fields
  statuses = Object.values(Status); // Get status values




  constructor(private liv: LivrableService , private route : ActivatedRoute,
    private router: Router
) {



   }
  ngOnInit(): void {
    this.getLivrableDetails();
  }

   getLivrableDetails() {
    const id = Number(this.route.snapshot.paramMap.get('id')); 
    if (id) {
      this.liv.getLivrableById(id).subscribe((data) => {
        this.livrable = data;
      });
    }
  }

  editField(field: string) {
    this.editMode[field] = true;
  }

  saveUpdate(field: string) {
    this.editMode[field] = false;
  }

  saveChanges() {
    const id = this.livrable.idLivrable;  // Get the ID of the livrable
    this.liv.updateLivrable(id, this.livrable).subscribe(() => {
      this.router.navigate(['/livrables']).then(() => {
        this.liv.getLivrableList();
    
      });
  });}

  // Method to delete the livrable
  deleteLivrable() {
    const id = this.livrable.idLivrable; // Get the ID of the livrable
    this.liv.deleteLivrable(id).subscribe(() => {
      this.router.navigate(['/livrables']); // Navigate to the list of livrables after deletion
    });
  }

  get progressPercentage(): number {
    if (!this.livrable || this.livrable.total_count === 0) return 0;
    return Math.round((this.livrable.completed_count / this.livrable.total_count) * 100);
  }
  
  get isOverdue(): boolean {
    if (!this.livrable || !this.livrable.due_date) return false;
    const due = new Date(this.livrable.due_date);
    const today = new Date();
    return today > due && this.livrable.status !== 'Completed';
  }
  downloadPdf(id: number) {
    this.liv.downloadLivrablePdf(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `livrable_${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    });}

  }