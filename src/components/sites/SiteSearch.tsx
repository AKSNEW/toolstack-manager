
import React from 'react';
import { Search, X, FileEdit, Clock, CheckCircle } from 'lucide-react';

interface SiteSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
  clearFilters: () => void;
}

const SiteSearch: React.FC<SiteSearchProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter,
  clearFilters
}) => {
  // Status buttons data
  const statusButtons = [
    { value: 'planning', label: 'Планирование', icon: FileEdit, color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { value: 'active', label: 'Активный', icon: Clock, color: 'bg-amber-100 text-amber-700 border-amber-200' },
    { value: 'completed', label: 'Завершен', icon: CheckCircle, color: 'bg-green-100 text-green-700 border-green-200' },
  ];

  return (
    <div className="glass rounded-xl mb-8 p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input 
            type="text" 
            placeholder="Поиск по объектам..." 
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-2">
            {statusButtons.map(button => (
              <button
                key={button.value}
                onClick={() => setStatusFilter(statusFilter === button.value ? null : button.value)}
                className={`flex items-center gap-1 px-3 h-10 rounded-lg border text-sm transition-all ${
                  statusFilter === button.value 
                    ? button.color 
                    : 'bg-background border-input text-muted-foreground hover:text-foreground'
                }`}
              >
                <button.icon className="h-3.5 w-3.5" />
                {button.label}
              </button>
            ))}
          </div>
          
          {(searchTerm || statusFilter) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 h-10 px-3 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground text-sm transition-all"
            >
              <X className="h-3.5 w-3.5" />
              Очистить
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteSearch;
