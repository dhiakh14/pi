import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Supplier, MaterialResource } from '../models/supplier.model';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private apiUrl = 'http://localhost:8095/api/suppliers';
  private materialResourceUrl = 'http://localhost:8095/api/suppliers/material-resources';

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

  createSupplier(supplierData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, supplierData);
  }
  

  getAllMaterialResources(): Observable<MaterialResource[]> {
    return this.http.get<MaterialResource[]>(this.materialResourceUrl);
  }
  
}
