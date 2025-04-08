
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Defect } from '@/lib/types';
import DefectItem from './DefectItem';

interface DefectsListProps {
  defects: Defect[];
  onStatusChange: (defectId: string, status: 'open' | 'in-progress' | 'resolved') => void;
  onAddMedia: (defect: Defect) => void;
  onDeleteMedia: (mediaId: string) => void;
  onClearFilters: () => void;
  hasFilters: boolean;
}

const DefectsList: React.FC<DefectsListProps> = ({ 
  defects, 
  onStatusChange, 
  onAddMedia, 
  onDeleteMedia,
  onClearFilters,
  hasFilters
}) => {
  if (defects.length === 0) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <AlertTriangle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-lg font-medium mb-1">Записи не найдены</h3>
        <p className="text-muted-foreground">
          {hasFilters ? 
            'Не найдено записей соответствующих заданным критериям' : 
            'В журнале неисправностей пока нет записей для этого объекта'}
        </p>
        {hasFilters && (
          <Button
            onClick={onClearFilters}
            variant="outline"
            className="mt-4"
          >
            Сбросить фильтры
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {defects.map((defect) => (
        <DefectItem 
          key={defect.id}
          defect={defect}
          onStatusChange={onStatusChange}
          onAddMedia={onAddMedia}
          onDeleteMedia={onDeleteMedia}
        />
      ))}
    </div>
  );
};

export default DefectsList;
