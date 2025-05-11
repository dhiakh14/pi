import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { Supplier, MaterialResource } from '../models/supplier.model';

////
export interface SupplierSummary {
  totalSuppliers: number;
  activeSuppliers: number;
  inactiveSuppliers: number;
  newSuppliersThisMonth: number;
}/////

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private apiUrl = 'http://localhost:8095/api/suppliers';
  private materialResourceUrl = 'http://localhost:8095/api/suppliers/material-resources';
  private predictionUrl = 'http://localhost:8095/prediction/supplier_prediction';

  constructor(private http: HttpClient) {}

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl);
  }

  getSupplierById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`);
  }

  deleteSupplier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateSupplier(id: number, supplier: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.apiUrl}/${id}`, supplier);
  }

  createSupplier(supplierData: any): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, supplierData);
  }
  
  

  getAllMaterialResources(): Observable<MaterialResource[]> {
    return this.http.get<MaterialResource[]>(this.materialResourceUrl);
  }

  incrementClickCount(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/increment-click`, {});
  }
  

  getTopSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.apiUrl}/top-suppliers`);
  }
  

  ////
  getSummary(): Observable<SupplierSummary> {
    return this.http.get<SupplierSummary>('http://localhost:8095/api/suppliers/summary').pipe(
      tap(() => console.log('Fetching supplier summary')),
      catchError(error => {
        console.error('API Error:', error);
        throw error; // Re-throw to handle in component
      })
    );

  
  }
  analyzeSentiment(text: string): Observable<{ sentiment: string }> {
    return this.http.post<{ sentiment: string }>(
      `${this.apiUrl}/analyze-sentiment`,
      { text }
    );
  }


  getSupplierStatusBreakdown(): Observable<any> {
    return this.http.get<any>('http://localhost:8095/api/suppliers/status-breakdown');  // Corrected URL
  }
  
  
   // New method to fetch category breakdown
   getSupplierCategoryBreakdown(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/category-breakdown`);
  }


  // Update the method to accept a plain object instead of Supplier
  /*getPredictionForSupplier(supplierData: any): Observable<any> {
    console.log('Sending request with data:', supplierData);  // Debug log

    return this.http.post<any>(this.predictionUrl, supplierData);
  }*/

  // Fetch suppliers with prediction status from the backend
  getSuppliersPrediction(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>('http://localhost:8095/api/suppliers/prediction-dashboard');
  }

  getPredictionDetails(id: string): Observable<Supplier> {
    return this.http.get<Supplier>(`http://localhost:8095/prediction/supplier-prediction-details/${id}`);
  }
  

  sendWarningEmail(id: number): Observable<any> {
    return this.http.post<any>(`http://localhost:8095/email/send-warning-email/${id}`, {});
  }
  
  
  
  
}
