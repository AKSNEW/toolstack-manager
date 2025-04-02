
import { LibraryItem } from '../types';

// Mock data for library items
export const libraryItems: LibraryItem[] = [
  {
    id: 'lib-001',
    name: 'Технология строительного производства',
    type: 'book',
    author: 'Теличенко В.И., Терентьев О.М., Лапидус А.А.',
    year: '2008',
    description: 'Учебник охватывает основные вопросы технологии строительных процессов и производства работ. Рассмотрены основные понятия и положения строительного производства.',
    externalLink: 'https://example.com/books/construction-technology',
    fileUrl: 'https://example.com/files/construction-technology.pdf',
    authorId: 'emp-001',
    createdAt: '2023-05-10T09:15:00Z'
  },
  {
    id: 'lib-002',
    name: 'СП 70.13330.2012 Несущие и ограждающие конструкции',
    type: 'standard',
    year: '2012',
    description: 'Свод правил по строительству несущих и ограждающих конструкций. Настоящий свод правил распространяется на производство и приемку работ, выполняемых при строительстве.',
    externalLink: 'https://example.com/standards/sp-70-13330-2012',
    fileUrl: 'https://example.com/files/sp-70-13330-2012.pdf',
    authorId: 'emp-004',
    createdAt: '2023-06-22T14:30:00Z'
  },
  {
    id: 'lib-003',
    name: 'Инструкция по эксплуатации башенного крана Liebherr 132 EC-H',
    type: 'instruction',
    author: 'Liebherr Group',
    year: '2019',
    description: 'Полное руководство по эксплуатации, техническому обслуживанию и безопасному использованию башенного крана Liebherr 132 EC-H.',
    fileUrl: 'https://example.com/files/liebherr-132-ec-h-manual.pdf',
    authorId: 'emp-003',
    createdAt: '2023-07-15T11:45:00Z'
  },
  {
    id: 'lib-004',
    name: 'ГОСТ 5802-86 Растворы строительные. Методы испытаний',
    type: 'standard',
    year: '1986',
    description: 'Стандарт устанавливает методы испытаний строительных растворов: отбор проб, определение подвижности, плотности, расслаиваемости, водоудерживающей способности и др.',
    externalLink: 'https://example.com/standards/gost-5802-86',
    fileUrl: 'https://example.com/files/gost-5802-86.pdf',
    authorId: 'emp-005',
    createdAt: '2023-08-03T10:10:00Z'
  },
  {
    id: 'lib-005',
    name: 'Справочник строителя. Современные строительные материалы',
    type: 'book',
    author: 'Кислый В.А.',
    year: '2020',
    description: 'Справочное пособие по современным строительным материалам, их свойствам, характеристикам и области применения.',
    externalLink: 'https://example.com/books/modern-construction-materials',
    authorId: 'emp-002',
    createdAt: '2023-09-08T15:20:00Z'
  }
];
