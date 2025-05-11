export interface Supplier {
  idSupplier: number;
  name: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  status: 'ACTIVE' | 'INACTIVE';  // ✅ Add status field
  notes: string;  // ✅ Add notes field
  materialResource?: MaterialResource;
  clickCount: number;
  createdAt:Date;
  aiRating?: number;
  sentiment?: string;
  predictionStatus: string;  // Prediction status ("active" or "inactive")
  featureImportance?: { [key: string]: number }; // This is the structure for feature importance



}

export interface MaterialResource {
  idMR: number;
  firstName: string;
}
