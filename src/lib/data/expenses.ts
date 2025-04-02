
import { ExpenseReceipt, TravelExpense } from '../types';

// Initial expense receipts
export const expenseReceipts: ExpenseReceipt[] = [
  {
    id: 'r1',
    employeeId: 'e1',
    date: '2023-10-15',
    amount: 5000,
    description: 'Покупка материалов для электромонтажа',
    category: 'materials',
    status: 'approved',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
  },
  {
    id: 'r2',
    employeeId: 'e3',
    date: '2023-10-20',
    amount: 3500,
    description: 'Инструменты для столярных работ',
    category: 'tools',
    status: 'pending',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e',
  },
];

// Initial travel expenses
export const travelExpenses: TravelExpense[] = [
  {
    id: 't1',
    employeeId: 'e2',
    startDate: '2023-09-10',
    endDate: '2023-09-15',
    destination: 'Москва',
    purpose: 'Встреча с поставщиками материалов',
    expenses: [
      { type: 'transportation', amount: 15000, description: 'Авиабилеты' },
      { type: 'accommodation', amount: 25000, description: 'Гостиница (5 ночей)' },
      { type: 'food', amount: 10000, description: 'Питание' },
    ],
    perDiem: {
      dailyRate: 2000,
      days: 5,
      totalAmount: 10000,
      city: 'Москва',
      description: 'Стандартные суточные для командировки в Москву',
    },
    status: 'approved',
    totalAmount: 60000,  // Updated to include per-diem
  },
  {
    id: 't2',
    employeeId: 'e1',
    startDate: '2023-11-05',
    endDate: '2023-11-08',
    destination: 'Санкт-Петербург',
    purpose: 'Обучение по электромонтажным работам',
    expenses: [
      { type: 'transportation', amount: 8000, description: 'Билеты на поезд' },
      { type: 'accommodation', amount: 12000, description: 'Гостиница (3 ночи)' },
      { type: 'food', amount: 6000, description: 'Питание' },
    ],
    perDiem: {
      dailyRate: 1800,
      days: 3,
      totalAmount: 5400,
      city: 'Санкт-Петербург',
      description: 'Суточные для командировки в СПб',
    },
    status: 'pending',
    totalAmount: 31400, // Includes per-diem
  }
];
