
// Sample data for the application

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
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  avatar: string;
  activeRentals: string[];
  rentalHistory: {
    toolId: string;
    checkoutDate: string;
    returnDate?: string;
  }[];
}

export const tools: Tool[] = [
  {
    id: 't1',
    name: 'Cordless Drill',
    category: 'Power Tools',
    status: 'available',
    location: 'Main Warehouse',
    image: 'https://images.unsplash.com/photo-1586864387789-628af9feed72',
    description: 'Professional 18V cordless drill with two batteries and charger.'
  },
  {
    id: 't2',
    name: 'Circular Saw',
    category: 'Power Tools',
    status: 'in-use',
    location: 'Site B',
    lastCheckedOut: {
      date: '2023-10-05',
      employeeId: 'e3'
    },
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c',
    description: 'Heavy-duty circular saw with laser guide and dust collection.'
  },
  {
    id: 't3',
    name: 'Laser Level',
    category: 'Measurement',
    status: 'available',
    location: 'Main Warehouse',
    image: 'https://images.unsplash.com/photo-1572981279625-40b22fcae78a',
    description: 'Self-leveling cross-line laser level with tripod mount.'
  },
  {
    id: 't4',
    name: 'Hammer Drill',
    category: 'Power Tools',
    status: 'maintenance',
    location: 'Repair Shop',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c',
    description: 'SDS-Plus rotary hammer drill for concrete and masonry work.'
  },
  {
    id: 't5',
    name: 'Pipe Wrench',
    category: 'Hand Tools',
    status: 'available',
    location: 'Main Warehouse',
    image: 'https://images.unsplash.com/photo-1580402427914-a6cc60dba8f2',
    description: '14-inch heavy-duty pipe wrench for plumbing and gas fitting.'
  },
  {
    id: 't6',
    name: 'Extension Ladder',
    category: 'Ladders & Scaffolding',
    status: 'in-use',
    lastCheckedOut: {
      date: '2023-10-10',
      employeeId: 'e1'
    },
    location: 'Site A',
    image: 'https://images.unsplash.com/photo-1535927669717-68e121c37776',
    description: '28-foot fiberglass extension ladder with 300 lb capacity.'
  }
];

export const employees: Employee[] = [
  {
    id: 'e1',
    name: 'Alexei Petrov',
    position: 'Senior Technician',
    department: 'Electrical',
    email: 'alexei.p@example.com',
    phone: '+7 (123) 456-7890',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    activeRentals: ['t6'],
    rentalHistory: [
      {
        toolId: 't1',
        checkoutDate: '2023-09-15',
        returnDate: '2023-09-20'
      },
      {
        toolId: 't6',
        checkoutDate: '2023-10-10'
      }
    ]
  },
  {
    id: 'e2',
    name: 'Natalia Volkova',
    position: 'Project Manager',
    department: 'Construction',
    email: 'natalia.v@example.com',
    phone: '+7 (234) 567-8901',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    activeRentals: [],
    rentalHistory: [
      {
        toolId: 't3',
        checkoutDate: '2023-09-05',
        returnDate: '2023-09-12'
      }
    ]
  },
  {
    id: 'e3',
    name: 'Mikhail Sokolov',
    position: 'Carpenter',
    department: 'Finishing',
    email: 'mikhail.s@example.com',
    phone: '+7 (345) 678-9012',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    activeRentals: ['t2'],
    rentalHistory: [
      {
        toolId: 't2',
        checkoutDate: '2023-10-05'
      },
      {
        toolId: 't4',
        checkoutDate: '2023-08-20',
        returnDate: '2023-08-25'
      }
    ]
  },
  {
    id: 'e4',
    name: 'Elena Ivanova',
    position: 'Safety Inspector',
    department: 'Health & Safety',
    email: 'elena.i@example.com',
    phone: '+7 (456) 789-0123',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    activeRentals: [],
    rentalHistory: [
      {
        toolId: 't5',
        checkoutDate: '2023-09-25',
        returnDate: '2023-09-30'
      }
    ]
  }
];

// Dashboard statistics
export const dashboardStats = {
  totalTools: tools.length,
  availableTools: tools.filter(tool => tool.status === 'available').length,
  inUseTools: tools.filter(tool => tool.status === 'in-use').length,
  maintenanceTools: tools.filter(tool => tool.status === 'maintenance').length,
  totalEmployees: employees.length,
  activeRentals: employees.reduce((acc, emp) => acc + emp.activeRentals.length, 0),
};
