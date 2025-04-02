
import { ToolboxItem } from '../types';

// Categories for toolbox items
export const toolboxCategories = [
  'Электроинструмент',
  'Аккумуляторный инструмент',
  'Ручной инструмент',
  'Измерительный инструмент',
  'Сварочное оборудование',
  'Строительное оборудование',
  'Спецодежда и СИЗ',
  'Другое'
];

// Mock data for toolbox items
export const toolboxItems: ToolboxItem[] = [
  {
    id: 'tb-001',
    name: 'Дрель аккумуляторная Makita DHP481Z',
    category: 'Аккумуляторный инструмент',
    price: 14900,
    image: 'https://images.unsplash.com/photo-1586864387789-628af9feed72',
    description: 'Профессиональная аккумуляторная дрель-шуруповерт с функцией удара. Легкая и мощная, с двумя скоростями, LED-подсветкой и индикатором заряда батареи.',
    link: 'https://example.com/product/makita-dhp481z',
    authorId: 'emp-001',
    createdAt: '2023-06-15T10:30:00Z',
    likes: 12,
    dislikes: 2,
    comments: [
      {
        id: 'tc-001',
        authorId: 'emp-002',
        content: 'Очень надежная дрель, использую уже 2 года без проблем.',
        createdAt: '2023-06-16T14:25:00Z'
      },
      {
        id: 'tc-002',
        authorId: 'emp-003',
        content: 'Аккумулятор держит заряд весь день. Рекомендую брать версию с двумя батареями.',
        createdAt: '2023-06-18T09:10:00Z'
      }
    ]
  },
  {
    id: 'tb-002',
    name: 'Лазерный нивелир Bosch GLL 3-80 CG',
    category: 'Измерительный инструмент',
    price: 35700,
    image: 'https://images.unsplash.com/photo-1501286353178-1ec871214838',
    description: 'Профессиональный лазерный нивелир с зелеными лучами высокой видимости. Имеет 3 вертикальных и 1 горизонтальную линию, дальность работы до 30 м.',
    link: 'https://example.com/product/bosch-gll-3-80',
    authorId: 'emp-004',
    createdAt: '2023-07-20T15:45:00Z',
    likes: 8,
    dislikes: 0,
    comments: [
      {
        id: 'tc-003',
        authorId: 'emp-005',
        content: 'Зеленый луч гораздо лучше видно даже при ярком освещении.',
        createdAt: '2023-07-21T10:15:00Z'
      }
    ]
  },
  {
    id: 'tb-003',
    name: 'Защитная каска 3M G3000',
    category: 'Спецодежда и СИЗ',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
    description: 'Легкая и удобная защитная каска с вентиляцией. Регулируемое оголовье, сменная потовпитывающая лента.',
    link: 'https://example.com/product/3m-g3000',
    authorId: 'emp-002',
    createdAt: '2023-08-05T12:20:00Z',
    likes: 15,
    dislikes: 1,
    comments: []
  }
];
