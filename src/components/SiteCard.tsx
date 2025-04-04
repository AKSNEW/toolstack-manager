
import React from 'react';
import { Site } from '@/lib/types';
import { Building, Users, Calendar, CheckCircle2, Clock, FileEdit, ClipboardList } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { crews } from '@/lib/data';

interface SiteCardProps {
  site: Site;
  onClick: (site: Site) => void;
  onOpenDefectsJournal?: (site: Site) => void;
}

const SiteCard: React.FC<SiteCardProps> = ({ site, onClick, onOpenDefectsJournal }) => {
  const handleClick = () => {
    onClick(site);
  };

  const handleOpenDefectsJournal = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenDefectsJournal) {
      onOpenDefectsJournal(site);
    }
  };

  const getStatusIcon = () => {
    switch (site.status) {
      case 'planning':
        return <FileEdit className="h-4 w-4" />;
      case 'active':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (site.status) {
      case 'planning':
        return 'Планирование';
      case 'active':
        return 'Активный';
      case 'completed':
        return 'Завершен';
      default:
        return 'Неизвестно';
    }
  };

  const getStatusColor = () => {
    switch (site.status) {
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-amber-100 text-amber-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssignedCrew = () => {
    if (!site.crewId) return null;
    return crews.find(crew => crew.id === site.crewId);
  };

  const assignedCrew = getAssignedCrew();

  return (
    <div 
      className="card-hover glass rounded-xl overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold">{site.name}</h3>
          <Badge className={cn(getStatusColor())}>
            {getStatusIcon()}
            <span className="ml-1">{getStatusText()}</span>
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{site.description}</p>
        
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Building className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{site.address}</span>
          </div>
          
          {assignedCrew && (
            <div className="flex items-center text-sm">
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Бригада: {assignedCrew.name}</span>
            </div>
          )}
          
          {site.startDate && (
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>
                Начало: {new Date(site.startDate).toLocaleDateString('ru-RU')}
                {site.endDate && ` - ${new Date(site.endDate).toLocaleDateString('ru-RU')}`}
              </span>
            </div>
          )}
        </div>
        
        {onOpenDefectsJournal && (
          <div className="mt-5 pt-5 border-t border-border flex justify-end">
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs flex items-center gap-1.5"
              onClick={handleOpenDefectsJournal}
            >
              <ClipboardList className="h-3.5 w-3.5" />
              Журнал неисправностей
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteCard;
