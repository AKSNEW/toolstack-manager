
import { SubCrew, Crew } from '../types';

// Initial sub-crews data
export const subCrews: SubCrew[] = [
  {
    id: 'sc1',
    name: 'Электрики',
    foreman: 'e1', // Alexei Petrov
    members: ['e1'],
    specialization: 'Electrical',
  },
];

// Initial crews data
export const crews: Crew[] = [
  {
    id: 'c1',
    name: 'Основная бригада А',
    foreman: 'e3', // Mikhail Sokolov
    supervisor: 'e2', // Natalia Volkova
    members: ['e1', 'e3', 'e4'],
    subCrews: ['sc1'],
  },
];
