
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
    status: 'approved',
    totalAmount: 50000,
  },
];
