
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Defect } from '@/lib/types';
import { employees } from '@/lib/data/employees';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle2,
  ChevronDown,
  Plus,
  Wrench,
  ImageIcon,
  Video
} from 'lucide-react';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SiteMediaGallery from '@/components/SiteMediaGallery';

interface DefectItemProps {
  defect: Defect;
  onStatusChange: (defectId: string, status: 'open' | 'in-progress' | 'resolved') => void;
  onAddMedia: (defect: Defect) => void;
  onDeleteMedia: (mediaId: string) => void;
}

const DefectItem: React.FC<DefectItemProps> = ({ 
  defect, 
  onStatusChange, 
  onAddMedia,
  onDeleteMedia
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'resolved':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
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
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-amber-100 text-amber-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getEmployeeName = (empId: string) => {
    const employee = employees.find(emp => emp.id === empId);
    return employee ? employee.name : 'Неизвестный сотрудник';
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Collapsible className="glass p-4 rounded-lg">
      <div className="flex justify-between items-start mb-3">
        <CollapsibleTrigger className="text-left">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{defect.title}</h3>
            {defect.status === 'resolved' && (
              <Badge className="bg-green-100 text-green-800">
                <Wrench className="h-3 w-3 mr-1" />
                <span>Исправлено: {getEmployeeName(defect.resolvedBy || '')}</span>
              </Badge>
            )}
          </div>
        </CollapsibleTrigger>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(defect.status)}>
            {getStatusIcon(defect.status)}
            <span className="ml-1">{getStatusText(defect.status)}</span>
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5"
            onClick={() => onAddMedia(defect)}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Медиа</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {defect.status !== 'open' && (
                <DropdownMenuItem onClick={() => onStatusChange(defect.id, 'open')}>
                  <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                  <span>Отметить как открытую</span>
                </DropdownMenuItem>
              )}
              {defect.status !== 'in-progress' && (
                <DropdownMenuItem onClick={() => onStatusChange(defect.id, 'in-progress')}>
                  <Clock className="h-4 w-4 mr-2 text-amber-500" />
                  <span>Взять в работу</span>
                </DropdownMenuItem>
              )}
              {defect.status !== 'resolved' && (
                <DropdownMenuItem onClick={() => onStatusChange(defect.id, 'resolved')}>
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  <span>Отметить как устраненную</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <p className="text-sm mb-3">{defect.description}</p>
      
      <div className="text-xs text-muted-foreground grid grid-cols-2 gap-4">
        <div>
          <span className="block">Кем добавлено:</span>
          <span>{getEmployeeName(defect.reportedBy)}</span>
        </div>
        <div>
          <span className="block">Дата добавления:</span>
          <span>{formatDate(defect.reportedDate)}</span>
        </div>
      </div>
      
      <CollapsibleContent className="mt-4 pt-4 border-t border-border">
        {/* Media gallery */}
        {defect.media && defect.media.length > 0 ? (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                <Video className="h-4 w-4" />
                <span>Медиафайлы ({defect.media.length})</span>
              </h4>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => onAddMedia(defect)}
              >
                <Plus className="h-3 w-3 mr-1" />
                Добавить
              </Button>
            </div>
            <SiteMediaGallery 
              media={defect.media}
              onDelete={onDeleteMedia}
            />
          </div>
        ) : (
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">Нет прикрепленных медиафайлов</p>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => onAddMedia(defect)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Добавить медиа
            </Button>
          </div>
        )}
        
        {defect.status === 'resolved' && defect.resolution && (
          <div className="mt-4 pt-4 border-t border-border">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Wrench className="h-4 w-4 text-green-600" />
              Информация об устранении:
            </h4>
            
            <div className="bg-green-50 p-3 rounded-md mb-3">
              <p className="text-sm">{defect.resolution}</p>
            </div>
            
            <div className="text-xs text-muted-foreground grid grid-cols-2 gap-4">
              <div>
                <span className="block font-medium">Кем устранено:</span>
                <span>{getEmployeeName(defect.resolvedBy || '')}</span>
              </div>
              <div>
                <span className="block font-medium">Дата устранения:</span>
                <span>{formatDate(defect.resolvedDate || '')}</span>
              </div>
            </div>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default DefectItem;
