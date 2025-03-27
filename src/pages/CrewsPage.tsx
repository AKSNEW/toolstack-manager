
import React, { useState } from 'react';
import { crews, employees, Crew } from '@/lib/data';
import TransitionWrapper from '@/components/TransitionWrapper';
import { 
  Users, 
  Plus,
  Search,
  X
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddCrewForm from '@/components/AddCrewForm';
import CrewCard from '@/components/CrewCard';

const CrewsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState<Crew | null>(null);

  // Filter crews based on search
  const filteredCrews = crews.filter(crew => {
    const matchesSearch = crew.name.toLowerCase().includes(searchTerm.toLowerCase());
    const foreman = employees.find(e => e.id === crew.foreman);
    const supervisor = employees.find(e => e.id === crew.supervisor);
    
    const matchesForeman = foreman && foreman.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSupervisor = supervisor && supervisor.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch || matchesForeman || matchesSupervisor;
  });

  const handleCrewClick = (crew: Crew) => {
    setSelectedCrew(crew);
  };

  return (
    <TransitionWrapper className="pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Бригады</h1>
            <p className="text-muted-foreground mt-2">
              Управление рабочими бригадами и назначение ответственных
            </p>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Добавить бригаду
          </Button>
        </div>
        
        {/* Search */}
        <div className="glass rounded-xl mb-8 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input 
              type="text" 
              placeholder="Поиск по бригадам, бригадирам, ГИПам..." 
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
        </div>
        
        {/* Crews grid */}
        {filteredCrews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrews.map(crew => (
              <CrewCard 
                key={crew.id} 
                crew={crew} 
                onClick={handleCrewClick}
              />
            ))}
          </div>
        ) : (
          <div className="glass rounded-xl p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-1">Бригады не найдены</h3>
            <p className="text-muted-foreground">
              Не найдено бригад соответствующих заданным критериям
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Сбросить поиск
              </button>
            )}
          </div>
        )}
        
        {/* Add Crew Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Добавить новую бригаду</DialogTitle>
            </DialogHeader>
            <AddCrewForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </TransitionWrapper>
  );
};

export default CrewsPage;
