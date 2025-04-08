
import React from 'react';
import { Building, Loader2 } from 'lucide-react';
import { Site } from '@/lib/types';
import SiteCard from '@/components/SiteCard';

interface SitesGridProps {
  isLoading: boolean;
  sites: Site[];
  onSiteClick: (site: Site) => void;
  onOpenDefectsJournal: (site: Site) => void;
  clearFilters: () => void;
}

const SitesGrid: React.FC<SitesGridProps> = ({ 
  isLoading, 
  sites, 
  onSiteClick, 
  onOpenDefectsJournal,
  clearFilters
}) => {
  if (isLoading) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
        <h3 className="text-lg font-medium mb-1">Загрузка объектов...</h3>
        <p className="text-muted-foreground">
          Пожалуйста, подождите
        </p>
      </div>
    );
  }

  if (sites.length === 0) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-1">Объекты не найдены</h3>
        <p className="text-muted-foreground">
          Не найдено объектов соответствующих заданным критериям
        </p>
        <button
          onClick={clearFilters}
          className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Сбросить фильтры
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {sites.map(site => (
        <SiteCard 
          key={site.id} 
          site={site} 
          onClick={onSiteClick}
          onOpenDefectsJournal={() => onOpenDefectsJournal(site)}
        />
      ))}
    </div>
  );
};

export default SitesGrid;
