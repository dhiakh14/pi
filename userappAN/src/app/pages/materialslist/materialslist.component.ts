import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { MaterialResourcesRestControllerService as MaterialResourcesService } from 'src/app/ServiceMaram/services';
import { GeminiControllerService } from 'src/app/ServiceMaram/services';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-material-resource-list',
  templateUrl: './materialslist.component.html',
  styleUrls: ['./materialslist.component.css']
})
export class MaterialResourceListComponent implements OnInit {
  Math = Math;
  showPredictionForm: boolean = false;
  predictionForm: FormGroup;
  predictedPrice: number | null = null;

  
  materialResources: any[] = [];
  filteredResources: any[] = [];
  paginatedResources: any[] = [];
  
  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  
  searchTerm: string = '';
  selectedCategory: string = '';
  currentSortColumn: string = '';
  ascending: boolean = true;
  categories = ['CONSTRUCTION_MATERIAL', 'EQUIPMENT_AND_MACHINES', 'TOOLS', 'VEHICLES', 'SECURITY'];
  
  // Gemini related properties
  showGeminiForm = false;
  geminiResponse = '';
  isLoading = false;
  questionForm: FormGroup;

  

  constructor(
    private materialResourcesService: MaterialResourcesService,
    private geminiService: GeminiControllerService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.questionForm = this.fb.group({
      question: ['', Validators.required]
    });

   
      // Initialize the prediction form
      this.predictionForm = this.fb.group({
        name: ['', Validators.required],
        category: ['', Validators.required],
        quantity: [null, [Validators.required, Validators.min(1)]]
      });
    }

  ngOnInit(): void {
    this.loadMaterialResources();
  }

  // Navigate to add material page
  navigateToAddMaterial(): void {
    this.router.navigate(['/add-mat']);
  }

  loadMaterialResources(): void {
    this.materialResourcesService.findAll().subscribe({
      next: (data: any[]) => {
        this.materialResources = data;
        this.filterResources();
      },
      error: (error) => {
        console.error('Error loading materials:', error);
      }
    });
  }

  filterResources(): void {
    let filtered = [...this.materialResources];

    // Apply search filter
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(material =>
        material.firstName?.toString().toLowerCase().includes(searchLower) ||
        material.category?.toString().toLowerCase().includes(searchLower) ||
        material.price?.toString().includes(searchLower) ||
        material.quantity?.toString().includes(searchLower)
      );
    }

    // Apply category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(material => 
        material.category === this.selectedCategory
      );
    }

    this.filteredResources = filtered;

    // Maintain current sort if any
    if (this.currentSortColumn) {
      this.sortBy(this.currentSortColumn);
    }
    
    // Reset to first page and update pagination
    this.currentPage = 1;
    this.updatePagination();
  }
  
  // Update pagination based on filtered results
  updatePagination(): void {
    this.totalItems = this.filteredResources.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    
    // Ensure current page is valid
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
    
    // Calculate start and end indices for the current page
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalItems);
    
    // Update paginated results
    this.paginatedResources = this.filteredResources.slice(startIndex, endIndex);
  }
  
  // Change page
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  sortBy(column: string): void {
    if (this.currentSortColumn === column) {
      this.ascending = !this.ascending;
    } else {
      this.currentSortColumn = column;
      this.ascending = true;
    }

    this.filteredResources.sort((a, b) => {
      const valA = a[column]?.toString().toLowerCase() || '';
      const valB = b[column]?.toString().toLowerCase() || '';
      return this.ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
    
    // Update pagination after sorting
    this.updatePagination();
  }

  updateResource(id: number): void {
    this.router.navigate(['/material-resources/edit', id]);
  }

  deleteResource(id: number): void {
    if (confirm('Are you sure you want to delete this material?')) {
      this.materialResourcesService.deletemat({ id }).subscribe({
        next: () => {
          this.loadMaterialResources();
        },
        error: (error) => {
          console.error('Error deleting material:', error);
        }
      });
    }
  }

  exportToExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredResources);
    const workbook: XLSX.WorkBook = { Sheets: { 'Materials': worksheet }, SheetNames: ['Materials'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, 'material_resources.xlsx');
  }

  // Gemini related methods
  toggleGeminiForm(): void {
    this.showGeminiForm = !this.showGeminiForm;
    if (!this.showGeminiForm) {
      this.geminiResponse = '';
      this.questionForm.reset();
    }
  }

  submitQuestion(): void {
    if (this.questionForm.valid) {
      this.isLoading = true;
      this.geminiResponse = '';
      
      this.geminiService.chatAboutMaterials({ 
        body: this.questionForm.value.question 
      }).subscribe({
        next: (response: string) => {
          this.geminiResponse = response;
          this.isLoading = false;
        },
        error: (err) => {
          this.geminiResponse = 'Error getting response from Gemini';
          this.isLoading = false;
          console.error('Error:', err);
        }
      });
    }
  }
  togglePredictionForm(): void {
    this.showPredictionForm = !this.showPredictionForm;
    if (!this.showPredictionForm) {
      this.predictionForm.reset();
      this.predictedPrice = null;
    }
  }
  
  submitPrediction(): void {
    if (this.predictionForm.valid) {
      const formValues = this.predictionForm.value;
      const body = {
        first_name: formValues.name,
        quantity: formValues.quantity,
        category: formValues.category
      };
  
      // Appel à l’API Flask
      this.http.post<any>('http://localhost:5000/predict-price', body).subscribe({
        next: (response) => {
          this.predictedPrice = response.predicted_price;
        },
        error: (err) => {
          console.error('Prediction error:', err);
          this.predictedPrice = null;
        }
      });
    }
  }
  
}
  


