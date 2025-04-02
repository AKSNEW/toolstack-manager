
import { Employee } from '../types';

// Employees data
export const employees: Employee[] = [
  {
    id: 'e1',
    name: 'Alexei Petrov',
    position: 'Senior Technician',
    department: 'Electrical',
    email: 'alexei.p@example.com',
    phone: '+7 (123) 456-7890',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    birthDate: '1988-07-15',
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
    birthDate: '1985-11-23',
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
    birthDate: '1990-01-30',
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
    birthDate: '1992-05-10',
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
