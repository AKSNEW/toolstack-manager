
import { Tool } from '../types';

// Tools data
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
