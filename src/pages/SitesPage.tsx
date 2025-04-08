
import React, { useState, useEffect } from 'react';
import { sites, fetchSites } from '@/lib/data/sites';
import { crews, Site } from '@/lib/data';
import TransitionWrapper from '@/components/TransitionWrapper';
import { 
  Building, 
  Plus,
  Search,
  X,
  CheckCircle,
  Clock,
  FileEdit,
  ClipboardList,
  Loader2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddSiteForm from '@/components/AddSiteForm';
import SiteCard from '@/components/SiteCard';
import SiteDefectsJournal from '@/components/SiteDefectsJournal';
import { toast } from 'sonner';

const SitesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [isDefectJournalOpen, setIsDefectJournalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [localSites, setLocalSites] = useState<Site[]>([]);

  useEffect(() => {
    const loadSites = async () => {
      setIsLoading(true);
      try {
        const data = await fetchSites();
        setLocalSites(data);
      } catch (error) {
        console.error("Error loading sites:", error);
        toast.error("Ошибка при загрузке объектов");
        setLocalSites(sites); // Fallback to in-memory data
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSites();
  }, []);

  // Refresh sites when a new one is added
  const handleAddSuccess = async () => {
    setIsAddDialogOpen(false);
    try {
      const data = await fetchSites();
      setLocalSites(data);
    } catch (error) {
      console.error("Error refreshing sites:", error);
    }
  };

  // Filter sites based on search and status
  const filteredSites = localSites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        site.address.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        site.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? site.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  const handleSiteClick = (site: Site) => {
    setSelectedSite(site);
  };

  const openDefectJournal = (site: Site) => {
    setSelectedSite(site);
    setIsDefectJournalOpen(true);
  };

  // Status buttons data
  const statusButtons = [
    { value: 'planning', label: 'Планирование', icon: FileEdit, color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { value: 'active', label: 'Активный', icon: Clock, color: 'bg-amber-100 text-amber-700 border-amber-200' },
    { value: 'completed', label: 'Завершен', icon: CheckCircle, color: 'bg-green-100 text-green-700 border-green-200' },
  ];

  const clearFilters = () => {
    setStatusFilter(null);
    setSearchTerm('');
  };

  return (
    <TransitionWrapper className="pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Объекты строительства</h1>
            <p className="text-muted-foreground mt-2">
              Управление объектами и назначение рабочих бригад
            </p>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Добавить объект
          </Button>
        </div>
        
        {/* Search and filters */}
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
        
        {/* Sites grid */}
        {isLoading ? (
          <div className="glass rounded-xl p-12 text-center">
            <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium mb-1">Загрузка объектов...</h3>
            <p className="text-muted-foreground">
              Пожалуйста, подождите
            </p>
          </div>
        ) : filteredSites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSites.map(site => (
              <SiteCard 
                key={site.id} 
                site={site} 
                onClick={handleSiteClick}
                onOpenDefectsJournal={() => openDefectJournal(site)}
              />
            ))}
          </div>
        ) : (
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
        )}
        
        {/* Add Site Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Добавить новый объект</DialogTitle>
            </DialogHeader>
            <AddSiteForm onSuccess={handleAddSuccess} />
          </DialogContent>
        </Dialog>
        
        {/* Defects Journal Dialog */}
        <Dialog 
          open={isDefectJournalOpen} 
          onOpenChange={(open) => {
            setIsDefectJournalOpen(open);
            if (!open) setSelectedSite(null);
          }}
        >
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Журнал неисправностей
                {selectedSite && <span className="text-muted-foreground ml-2">— {selectedSite.name}</span>}
              </DialogTitle>
            </DialogHeader>
            
            {selectedSite && (
              <SiteDefectsJournal siteId={selectedSite.id} siteName={selectedSite.name} />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TransitionWrapper>
  );
};

export default SitesPage;
