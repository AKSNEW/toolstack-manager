
import React from 'react';
import { Site } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Home, Clock, Users, Info } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { crews } from '@/lib/data/crews';
import SiteTodos from './SiteTodos';

interface SiteDetailsProps {
  site: Site;
}

const SiteDetails: React.FC<SiteDetailsProps> = ({ site }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'active':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'completed':
        return 'bg-purple-100 text-purple-600 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planning':
        return 'Планирование';
      case 'active':
        return 'Активный';
      case 'completed':
        return 'Завершен';
      default:
        return status;
    }
  };

  const crewName = site.crewId 
    ? crews.find(crew => crew.id === site.crewId)?.name || 'Бригада не найдена'
    : 'Не назначена';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{site.name}</h1>
          <div className="flex items-center mt-2 space-x-2">
            <Badge variant="outline" className={getStatusColor(site.status)}>
              {getStatusLabel(site.status)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Home className="h-4 w-4 mr-2 text-muted-foreground" />
              Адрес
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{site.address}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              Даты
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {site.startDate && (
                <p className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Начало:</span>
                  <span>{formatDate(site.startDate)}</span>
                </p>
              )}
              {site.endDate && (
                <p className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Завершение:</span>
                  <span>{formatDate(site.endDate)}</span>
                </p>
              )}
              {!site.startDate && !site.endDate && (
                <p className="text-muted-foreground">Даты не указаны</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              Бригада
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{crewName}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <Info className="h-4 w-4 mr-2 text-muted-foreground" />
            Описание
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{site.description}</p>
        </CardContent>
      </Card>

      <div className="pt-4">
        <SiteTodos siteId={site.id} siteName={site.name} />
      </div>
    </div>
  );
};

export default SiteDetails;
