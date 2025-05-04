export interface Supplier {
  id: number;
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

}

export interface MaterialResource {
  idMR: number;
  firstName: string;
}
