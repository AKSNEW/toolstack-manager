
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, X } from 'lucide-react';

interface DefectsSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddDefect: () => void;
  activeFilters: {
    searchTerm?: string;
    status?: string | null;
  };
  onClearFilter: (filterType: 'search' | 'status') => void;
  onClearAllFilters: () => void;
  getStatusText: (status: string) => string;
}

const DefectsSearch: React.FC<DefectsSearchProps> = ({
  searchTerm,
  onSearchChange,
  onAddDefect,
  activeFilters,
  onClearFilter,
  onClearAllFilters,
  getStatusText
}) => {
  const hasFilters = !!activeFilters.searchTerm || !!activeFilters.status;

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="relative flex-grow max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input 
            type="text" 
            placeholder="Поиск неисправностей..." 
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => onClearFilter('search')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <Button 
          onClick={onAddDefect}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Добавить запись
        </Button>
      </div>
      
      {hasFilters && (
        <div className="flex items-center">
          <p className="text-sm text-muted-foreground">Активные фильтры:</p>
          {activeFilters.searchTerm && (
            <Badge variant="outline" className="ml-2">
              Поиск: {activeFilters.searchTerm}
              <button onClick={() => onClearFilter('search')} className="ml-1 focus:outline-none">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {activeFilters.status && (
            <Badge variant="outline" className="ml-2">
              Статус: {getStatusText(activeFilters.status)}
              <button onClick={() => onClearFilter('status')} className="ml-1 focus:outline-none">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearAllFilters}
            className="ml-2 h-8 text-xs"
          >
            Сбросить все
          </Button>
        </div>
      )}
    </>
  );
};

export default DefectsSearch;
