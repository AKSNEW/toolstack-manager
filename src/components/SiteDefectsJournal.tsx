
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Defect, SiteMedia } from '@/lib/types';
import { mockDefects } from '@/lib/data/defects'; // We'll need to move the mock data to a separate file
import SiteMediaForm from './SiteMediaForm';
import DefectsList from './defects/DefectsList';
import DefectsSearch from './defects/DefectsSearch';
import AddDefectForm from './defects/AddDefectForm';
import ResolveDefectForm from './defects/ResolveDefectForm';

interface SiteDefectsJournalProps {
  siteId: string;
  siteName: string;
}

const SiteDefectsJournal: React.FC<SiteDefectsJournalProps> = ({ siteId, siteName }) => {
  const { toast } = useToast();
  const [defects, setDefects] = useState<Defect[]>(mockDefects);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isAddDefectOpen, setIsAddDefectOpen] = useState(false);
  const [isResolveDefectOpen, setIsResolveDefectOpen] = useState(false);
  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [isAddMediaOpen, setIsAddMediaOpen] = useState(false);
  
  // Filter defects by site, search term, status, and active tab
  const filteredDefects = defects.filter(defect => {
    if (defect.siteId !== siteId) return false;
    
    const matchesSearch = defect.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        defect.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? defect.status === statusFilter : true;
    
    const matchesTab = activeTab === 'all' ? true : 
                      (activeTab === 'open' ? defect.status === 'open' : 
                      (activeTab === 'in-progress' ? defect.status === 'in-progress' : 
                      defect.status === 'resolved'));
    
    return matchesSearch && matchesStatus && matchesTab;
  });
  
  const handleAddDefect = (data: { title: string; description: string }) => {
    if (!data.title.trim() || !data.description.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive',
      });
      return;
    }
    
    const newDefectObj: Defect = {
      id: `def-${defects.length + 1}`,
      siteId,
      title: data.title,
      description: data.description,
      reportedBy: 'e1', // Current user ID
      reportedDate: new Date().toISOString(),
      status: 'open',
      media: [],
    };
    
    setDefects([...defects, newDefectObj]);
    setIsAddDefectOpen(false);
    
    toast({
      title: 'Неисправность добавлена',
      description: 'Новая запись успешно добавлена в журнал',
    });
  };
  
  const handleResolveDefect = (data: { resolution: string; resolvedBy: string }) => {
    if (!selectedDefect || !data.resolution.trim() || !data.resolvedBy) {
      toast({
        title: 'Ошибка',
        description: 'Необходимо указать решение проблемы и исполнителя',
        variant: 'destructive',
      });
      return;
    }
    
    setDefects(defects.map(defect => 
      defect.id === selectedDefect.id ? {
        ...defect,
        status: 'resolved',
        resolvedBy: data.resolvedBy,
        resolvedDate: new Date().toISOString(),
        resolution: data.resolution,
      } : defect
    ));
    
    setSelectedDefect(null);
    setIsResolveDefectOpen(false);
    
    toast({
      title: 'Неисправность устранена',
      description: 'Запись обновлена в журнале',
    });
  };
  
  const handleStatusChange = (defectId: string, newStatus: 'open' | 'in-progress' | 'resolved') => {
    if (newStatus === 'resolved') {
      const defect = defects.find(d => d.id === defectId);
      if (defect) {
        setSelectedDefect(defect);
        setIsResolveDefectOpen(true);
      }
      return;
    }
    
    setDefects(defects.map(d => 
      d.id === defectId ? { ...d, status: newStatus } : d
    ));
    
    toast({
      title: 'Статус обновлен',
      description: `Статус неисправности изменен на "${
        newStatus === 'open' ? 'Открыта' : 
        newStatus === 'in-progress' ? 'В работе' : 'Устранена'
      }"`,
    });
  };
  
  const handleAddMedia = (media: SiteMedia) => {
    if (!selectedDefect) return;
    
    const updatedDefect = {
      ...selectedDefect,
      media: [...(selectedDefect.media || []), media]
    };
    
    setDefects(defects.map(defect => 
      defect.id === selectedDefect.id ? updatedDefect : defect
    ));
    
    setSelectedDefect(updatedDefect);
    setIsAddMediaOpen(false);
  };
  
  const handleDeleteMedia = (mediaId: string) => {
    if (!selectedDefect || !selectedDefect.media) return;
    
    const updatedMedia = selectedDefect.media.filter(media => media.id !== mediaId);
    const updatedDefect = { ...selectedDefect, media: updatedMedia };
    
    setDefects(defects.map(defect => 
      defect.id === selectedDefect.id ? updatedDefect : defect
    ));
    
    setSelectedDefect(updatedDefect);
    
    toast({
      title: 'Медиафайл удален',
      description: 'Медиафайл успешно удален из записи',
    });
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Открыта';
      case 'in-progress':
        return 'В работе';
      case 'resolved':
        return 'Устранена';
      default:
        return 'Неизвестно';
    }
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter(null);
  };

  const handleClearFilter = (filterType: 'search' | 'status') => {
    if (filterType === 'search') {
      setSearchTerm('');
    } else if (filterType === 'status') {
      setStatusFilter(null);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="open">Открытые</TabsTrigger>
          <TabsTrigger value="in-progress">В работе</TabsTrigger>
          <TabsTrigger value="resolved">Устраненные</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <DefectsSearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddDefect={() => setIsAddDefectOpen(true)}
        activeFilters={{ searchTerm, status: statusFilter }}
        onClearFilter={handleClearFilter}
        onClearAllFilters={clearFilters}
        getStatusText={getStatusText}
      />
      
      <DefectsList 
        defects={filteredDefects}
        onStatusChange={handleStatusChange}
        onAddMedia={(defect) => {
          setSelectedDefect(defect);
          setIsAddMediaOpen(true);
        }}
        onDeleteMedia={handleDeleteMedia}
        onClearFilters={clearFilters}
        hasFilters={!!searchTerm || !!statusFilter}
      />
      
      {/* Add Defect Dialog */}
      <Dialog open={isAddDefectOpen} onOpenChange={setIsAddDefectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить новую запись</DialogTitle>
            <DialogDescription>
              Заполните форму для добавления новой неисправности в журнал
            </DialogDescription>
          </DialogHeader>
          
          <AddDefectForm 
            onSubmit={handleAddDefect}
            onCancel={() => setIsAddDefectOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Resolve Defect Dialog */}
      <Dialog open={isResolveDefectOpen} onOpenChange={setIsResolveDefectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отметить как устраненную</DialogTitle>
            <DialogDescription>
              Укажите, как была устранена неисправность и кто выполнил работу
            </DialogDescription>
          </DialogHeader>
          
          <ResolveDefectForm 
            onSubmit={handleResolveDefect}
            onCancel={() => setIsResolveDefectOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Add Media Dialog */}
      <Dialog open={isAddMediaOpen && !!selectedDefect} onOpenChange={(open) => setIsAddMediaOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Добавить медиафайл</span>
            </DialogTitle>
            <DialogDescription>
              {selectedDefect && `Добавление медиафайла к неисправности: ${selectedDefect.title}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedDefect && (
            <SiteMediaForm 
              defectId={selectedDefect.id}
              onSuccess={handleAddMedia}
              onCancel={() => setIsAddMediaOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SiteDefectsJournal;
