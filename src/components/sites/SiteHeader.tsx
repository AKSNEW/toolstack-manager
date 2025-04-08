
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface SiteHeaderProps {
  onAddSite: () => void;
}

const SiteHeader: React.FC<SiteHeaderProps> = ({ onAddSite }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">Объекты строительства</h1>
        <p className="text-muted-foreground mt-2">
          Управление объектами и назначение рабочих бригад
        </p>
      </div>
      <Button 
        onClick={onAddSite}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Добавить объект
      </Button>
    </div>
  );
};

export default SiteHeader;
