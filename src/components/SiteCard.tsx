
import React from 'react';
import { Site } from '@/lib/data';
import { crews } from '@/lib/data';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { 
  MapPin, 
  CalendarDays, 
  Users,
  CheckCircle,
  Clock,
  FileEdit
} from 'lucide-react';

interface SiteCardProps {
  site: Site;
  onClick: (site: Site) => void;
}

const SiteCard = ({ site, onClick }: SiteCardProps) => {
  const assignedCrew = site.crewId ? crews.find(c => c.id === site.crewId) : null;
  
  const getStatusInfo = () => {
    switch (site.status) {
      case 'planning':
        return { 
          icon: FileEdit, 
          text: 'Планирование', 
          color: 'bg-blue-100 text-blue-700' 
        };
      case 'active':
        return { 
          icon: Clock, 
          text: 'Активный', 
          color: 'bg-amber-100 text-amber-700' 
        };
      case 'completed':
        return { 
          icon: CheckCircle, 
          text: 'Завершен', 
          color: 'bg-green-100 text-green-700' 
        };
      default:
        return { 
          icon: Clock, 
          text: 'Неизвестно', 
          color: 'bg-gray-100 text-gray-700' 
        };
    }
  };
  
  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;
  
  return (
    <Card 
      className="h-full overflow-hidden hover:shadow-md transition-all cursor-pointer border border-border"
      onClick={() => onClick(site)}
    >
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold line-clamp-1">{site.name}</h3>
          <div className={`flex items-center px-2 py-1 rounded text-xs font-medium ${statusInfo.color}`}>
            <StatusIcon className="h-3.5 w-3.5 mr-1" />
            {statusInfo.text}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-muted-foreground line-clamp-2">{site.address}</p>
          </div>
          
          {site.startDate && (
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
              <p className="text-sm">
                {new Date(site.startDate).toLocaleDateString('ru-RU')}
                {site.endDate && ` - ${new Date(site.endDate).toLocaleDateString('ru-RU')}`}
              </p>
            </div>
          )}
          
          <p className="text-sm line-clamp-2">{site.description}</p>
        </div>
      </CardContent>
      
      <CardFooter className="px-6 py-4 bg-muted/50 border-t">
        {assignedCrew ? (
          <div className="flex items-center">
            <Users className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-sm font-medium">{assignedCrew.name}</span>
          </div>
        ) : (
          <div className="flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            <span className="text-sm">Бригада не назначена</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default SiteCard;
