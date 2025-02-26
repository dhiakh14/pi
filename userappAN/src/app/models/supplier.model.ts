export interface Supplier {
  id: number;
  name: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  status: 'ACTIVE' | 'INACTIVE';  // ✅ Add status field
  notes: string;  // ✅ Add notes field
  materialResource?: MaterialResource;
}

export interface MaterialResource {
  idMR: number;
  firstName: string;
}
