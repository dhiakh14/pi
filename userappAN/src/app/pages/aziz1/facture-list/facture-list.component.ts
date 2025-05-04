import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/servicesAziz/services';  // Import du service
import { Facture } from 'src/app/servicesAziz/models'; // Import du modèle Facture
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-facture-list',
  templateUrl: './facture-list.component.html',
  styleUrls: ['./facture-list.component.css']
})
export class FactureListComponent implements OnInit {
  factures: Facture[] = [];  
  filteredFactures: Facture[] = [];  
  loading: boolean = false; 
  error: string | null = null; 
  selectedEtat: string = 'ALL';
  searchNumber: string = '';
  currentPage: number = 1;
itemsPerPage: number = 4; // Nombre d'éléments par page
totalItems: number = 0;
  


  constructor(private restService: RestService, private router: Router) {}

  ngOnInit(): void {
    this.loadFactures(); // Charger les factures à l'initialisation
  }

  loadFactures(): void {
    this.loading = true;
    this.restService.retrieveAllFacture().subscribe(
      (data: Facture[]) => {
        this.factures = data;
        this.filteredFactures = data;
        this.totalItems = data.length; // Cette ligne est cruciale
        this.loading = false;
      },
      (error) => {
        this.error = 'Erreur lors du chargement des factures';
        this.loading = false;
      }
    );
  }
  searchFactures(): void {
    if (this.searchNumber.trim() !== '') {
      this.filteredFactures = this.factures.filter(
        facture => facture.number?.toString().includes(this.searchNumber)
      );
    } else {
      this.filteredFactures = this.factures;  // Reset to all factures if no search term
    }
  }

  deleteFacture(idF: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      this.restService.deleteFactureById({ idF }).subscribe(
        () => {
          // Mise à jour de la liste après suppression
          this.factures = this.factures.filter(facture => facture.idF !== idF);
          this.filteredFactures = this.filteredFactures.filter(facture => facture.idF !== idF);
          alert('Facture supprimée avec succès.');
        },
        (error) => {
          this.error = `Erreur lors de la suppression de la facture: ${error.message || error}`;
          alert(this.error);
        }
      );
    }
  }

  filterFactures(): void {
    if (this.selectedEtat === 'ALL') {
      this.filteredFactures = this.factures;
    } else {
      this.filteredFactures = this.factures.filter(
        facture => facture.etatFacture === this.selectedEtat
      );
    }
    this.totalItems = this.filteredFactures.length;
    this.currentPage = 1; // Reset à la première page après filtrage
  }

  addFacture(): void {
    this.router.navigate(['/addfacture']); 
  }

  showDetails(idF: number): void {
    this.router.navigate(['/facture-details', idF]); // Navigate to details page
  }

exportFacturesToExcel(): void {
  if (!this.filteredFactures || this.filteredFactures.length === 0) {
    alert("Aucune facture à exporter !");
    return;
  }

  // Convertir les données en un format compatible avec Excel
  const factureData = this.filteredFactures.map(facture => ({
    Numéro: facture.number || 'N/A',
    Montant: facture.montant !== undefined ? facture.montant : 0,
    État: facture.etatFacture || 'N/A',
    "Date d'Émission": facture.dateemission ? new Date(facture.dateemission).toLocaleDateString() : 'N/A',
    "Date d'Échéance": facture.dateecheance ? new Date(facture.dateecheance).toLocaleDateString() : 'N/A'
  }));

  // Création d'un fichier Excel
  const worksheet = XLSX.utils.json_to_sheet(factureData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Factures");

  // Génération du fichier Excel et téléchargement
  XLSX.writeFile(workbook, 'Liste_Factures.xlsx');
  
  alert('Fichier Excel exporté avec succès ! 🎉');
}
goToStats() {
  this.router.navigate(['/stataziz']);
}

goToExchange() {
  this.router.navigate(['/rate']);
}

// Ajoutez ces méthodes pour la pagination
get paginatedFactures(): Facture[] {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  return this.filteredFactures.slice(startIndex, startIndex + this.itemsPerPage);
}

totalPages(): number {
  return Math.ceil(this.totalItems / this.itemsPerPage);
}

getPages(): number[] {
  const total = this.totalPages();
  const current = this.currentPage;
  const pages = [];
  
  // Afficher jusqu'à 5 pages autour de la page courante
  const start = Math.max(1, current - 2);
  const end = Math.min(total, current + 2);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
}
goToPage(page: number): void {
  if (page >= 1 && page <= this.totalPages()) {
    this.currentPage = page;
  }
}


}
