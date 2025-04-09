// Type definitions for the application

export interface Tool {
  id: string;
  name: string;
  category: string;
  status: 'available' | 'in-use' | 'maintenance';
  location: string;
  lastCheckedOut?: {
    date: string;
    employeeId: string;
  };
  image: string;
  description: string;
  isEdc?: boolean;
  links?: string[];
  votes?: {
    userId: string;
    value: 1 | -1;
  }[];
  price?: number;
}

export interface ClothingSize {
  shirt: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL';
  pants: number; // Waist size
  shoes: number; // EU size
  gloves: 'XS' | 'S' | 'M' | 'L' | 'XL';
  helmet?: 'S' | 'M' | 'L' | 'XL';
}

export interface DriverLicense {
  number: string;
  category: string;
  issueDate: string;
  expiryDate: string;
  issuedBy?: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  avatar: string;
  birthDate?: string;
  driverLicense?: DriverLicense;
  activeRentals: string[];
  rentalHistory: {
    toolId: string;
    checkoutDate: string;
    returnDate?: string;
  }[];
  clothingSize?: ClothingSize;
  whatsapp?: string;
  telegram?: string;
  user_id?: string;
}

export interface SubCrew {
  id: string;
  name: string;
  foreman: string; // employee id of the sub-crew foreman
  members: string[]; // array of employee ids
  specialization: string; // e.g., "Electrical", "Plumbing", etc.
}

export interface Crew {
  id: string;
  name: string;
  foreman: string; // employee id of the foreman
  supervisor: string; // employee id of the supervisor
  members: string[]; // array of employee ids
  site?: string; // optional construction site id
  subCrews: string[]; // array of sub-crew ids
}

export interface Site {
  id: string;
  name: string;
  address: string;
  status: 'planning' | 'active' | 'completed';
  crewId?: string; // optional crew id assigned to this site
  startDate?: string;
  endDate?: string;
  description: string;
}

export interface ExpenseReceipt {
  id: string;
  employeeId: string;
  date: string;
  amount: number;
  description: string;
  category: 'materials' | 'tools' | 'travel' | 'food' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  imageUrl?: string;
}

export interface PerDiem {
  dailyRate: number;
  days: number;
  totalAmount: number;
  city: string;
  description?: string;
}

export interface TravelExpense {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  destination: string;
  purpose: string;
  expenses: {
    type: 'transportation' | 'accommodation' | 'food' | 'other';
    amount: number;
    description: string;
  }[];
  perDiem?: PerDiem;
  status: 'pending' | 'approved' | 'rejected';
  totalAmount: number;
}

export interface DashboardStats {
  totalTools: number;
  availableTools: number;
  inUseTools: number;
  maintenanceTools: number;
  totalEmployees: number;
  activeRentals: number;
  totalCrews: number;
  totalSites: number;
  activeSites: number;
}

export interface ToolboxComment {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface ToolboxItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  link?: string;
  authorId: string;
  createdAt: string;
  likes: number;
  dislikes: number;
  comments?: ToolboxComment[];
}

export interface LibraryItem {
  id: string;
  name: string;
  type: 'book' | 'instruction' | 'standard';
  author?: string;
  year?: string;
  description: string;
  externalLink?: string;
  fileUrl?: string;
  authorId: string;
  createdAt: string;
}

export interface Defect {
  id: string;
  siteId: string;
  title: string;
  description: string;
  reportedBy: string;
  reportedDate: string;
  status: 'open' | 'in-progress' | 'resolved';
  resolvedBy?: string;
  resolvedDate?: string;
  resolution?: string;
  media?: SiteMedia[]; // Adding media attachments
}

export interface SiteMedia {
  id: string;
  defectId: string;
  type: 'image' | 'video';
  url: string;
  description?: string;
  uploadedBy: string;
  uploadedDate: string;
  thumbnailUrl?: string; // For videos
}

export interface WiringDiagram {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  createdBy: string;
  createdAt: string;
  comments: DiagramComment[];
  votes: {
    userId: string;
    value: 1 | -1;
  }[];
}

export interface DiagramComment {
  id: string;
  diagramId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface SiteIncident {
  id: string;
  title: string;
  description: string;
  siteId: string;
  createdAt: string;
  createdBy: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  resolution?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  media: SiteMedia[];
}

export interface UnionMessage {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  anonymous: boolean;
  category: 'complaint' | 'suggestion' | 'question';
  status: 'new' | 'in-review' | 'resolved';
  votes: {
    employeeId: string;
    type: 'up' | 'down';
  }[];
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: string;
  siteId?: string;
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}
