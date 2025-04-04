
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
    driverLicense: {
      number: '7743 265891',
      category: 'B, C',
      issueDate: '2012-03-20',
      expiryDate: '2032-03-20',
      issuedBy: 'ГИБДД 7701'
    },
    clothingSize: {
      shirt: 'L',
      pants: 34,
      shoes: 43,
      gloves: 'L',
      helmet: 'L'
    },
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
    driverLicense: {
      number: '9851 345762',
      category: 'B',
      issueDate: '2010-06-15',
      expiryDate: '2030-06-15',
      issuedBy: 'ГИБДД 7702'
    },
    clothingSize: {
      shirt: 'S',
      pants: 28,
      shoes: 38,
      gloves: 'S',
      helmet: 'S'
    },
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
    clothingSize: {
      shirt: 'M',
      pants: 32,
      shoes: 42,
      gloves: 'M',
      helmet: 'M'
    },
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
    driverLicense: {
      number: '5512 876543',
      category: 'B',
      issueDate: '2013-09-05',
      expiryDate: '2033-09-05',
      issuedBy: 'ГИБДД 7703'
    },
    clothingSize: {
      shirt: 'S',
      pants: 30,
      shoes: 39,
      gloves: 'S',
      helmet: 'M'
    },
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
