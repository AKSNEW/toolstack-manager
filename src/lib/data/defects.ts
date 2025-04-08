
import { Defect } from '@/lib/types';

// Mock data for defects
export const mockDefects: Defect[] = [
  {
    id: 'def-001',
    siteId: 's1',
    title: 'Протечка в крыше корпуса А',
    description: 'При сильном дожде обнаружена протечка на 5 этаже в районе лифтовой шахты.',
    reportedBy: 'e1',
    reportedDate: '2023-04-15T10:30:00Z',
    status: 'open',
    media: [
      {
        id: 'media-001',
        defectId: 'def-001',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1580901368919-7738efb0f87e',
        description: 'Следы воды на потолке возле лифта',
        uploadedBy: 'e1',
        uploadedDate: '2023-04-15T10:45:00Z',
      }
    ]
  },
  {
    id: 'def-002',
    siteId: 's1',
    title: 'Трещина в фундаменте',
    description: 'Во время осмотра обнаружена трещина в фундаменте длиной около 1 метра в юго-восточной части здания.',
    reportedBy: 'e2',
    reportedDate: '2023-04-10T08:45:00Z',
    status: 'in-progress',
    media: [
      {
        id: 'media-002',
        defectId: 'def-002',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1603994189975-502a1aefdbb5',
        description: 'Трещина в фундаменте - общий вид',
        uploadedBy: 'e2',
        uploadedDate: '2023-04-10T09:00:00Z',
      },
      {
        id: 'media-003',
        defectId: 'def-002',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1621503828642-a756be7255c8',
        description: 'Трещина в фундаменте - крупный план',
        uploadedBy: 'e2',
        uploadedDate: '2023-04-10T09:05:00Z',
      },
      {
        id: 'media-004',
        defectId: 'def-002',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        description: 'Видео осмотра трещины',
        uploadedBy: 'e2',
        uploadedDate: '2023-04-10T09:10:00Z',
        thumbnailUrl: 'https://images.unsplash.com/photo-1603994189975-502a1aefdbb5'
      }
    ]
  },
  {
    id: 'def-003',
    siteId: 's1',
    title: 'Неисправность электропроводки',
    description: 'В корпусе Б на 3-м этаже обнаружены проблемы с электропроводкой, розетки не работают.',
    reportedBy: 'e3',
    reportedDate: '2023-04-05T14:20:00Z',
    status: 'resolved',
    resolvedBy: 'e4',
    resolvedDate: '2023-04-08T16:30:00Z',
    resolution: 'Заменена электропроводка и установлены новые розетки.',
  },
  {
    id: 'def-004',
    siteId: 's2',
    title: 'Проблема с вентиляцией',
    description: 'Система вентиляции работает с перебоями на 2-м этаже.',
    reportedBy: 'e1',
    reportedDate: '2023-04-12T11:15:00Z',
    status: 'open',
  },
];
