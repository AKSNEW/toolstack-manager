
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import TransitionWrapper from '@/components/TransitionWrapper';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, Calendar, User, FileImage, FileVideo, Pencil, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import SiteMediaForm from '@/components/SiteMediaForm';
import SiteMediaGallery from '@/components/SiteMediaGallery';
import { sites, employees } from '@/lib/data';
import { SiteMedia } from '@/lib/types';

interface SiteIncident {
  id: string;
  title: string;
  description: string;
  siteId: string;
  createdAt: string;
  createdBy: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  resolution?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  media: SiteMedia[];
}

// Mock data for site incidents
const mockIncidents: SiteIncident[] = [
  {
    id: 'inc-001',
    title: 'Протечка кровли на 3-м этаже',
    description: 'После сильного дождя обнаружена протечка на 3-м этаже в коридоре рядом с лифтом.',
    siteId: 's1',
    createdAt: '2023-07-15T09:30:00Z',
    createdBy: 'e2',
    status: 'in-progress',
    priority: 'high',
    media: [
      {
        id: 'media-1',
        defectId: 'inc-001',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1583243552802-94ccb4200150',
        description: 'Протечка кровли в коридоре',
        uploadedBy: 'e2',
        uploadedDate: '2023-07-15T09:35:00Z'
      }
    ]
  },
  {
    id: 'inc-002',
    title: 'Неисправность электропроводки в подвале',
    description: 'В подвальном помещении обнаружено короткое замыкание в распределительном щите.',
    siteId: 's2',
    createdAt: '2023-07-20T14:15:00Z',
    createdBy: 'e3',
    status: 'open',
    priority: 'medium',
    media: []
  },
  {
    id: 'inc-003',
    title: 'Трещина в фундаменте здания',
    description: 'При осмотре обнаружена трещина в фундаменте на северо-восточной стороне здания.',
    siteId: 's1',
    createdAt: '2023-07-10T11:45:00Z',
    createdBy: 'e1',
    status: 'resolved',
    priority: 'high',
    resolution: 'Произведена заделка трещины специальным составом и укрепление конструкции.',
    resolvedBy: 'e4',
    resolvedAt: '2023-07-25T16:30:00Z',
    media: [
      {
        id: 'media-2',
        defectId: 'inc-003',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1590856545517-8f95b97c9b6d',
        description: 'Трещина в фундаменте',
        uploadedBy: 'e1',
        uploadedDate: '2023-07-10T11:50:00Z'
      },
      {
        id: 'media-3',
        defectId: 'inc-003',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1591711696076-b6fe55f6684a',
        description: 'После ремонта',
        uploadedBy: 'e4',
        uploadedDate: '2023-07-25T16:35:00Z'
      }
    ]
  }
];

const SiteIncidentsPage: React.FC = () => {
  const { toast } = useToast();
  const [incidents, setIncidents] = useState<SiteIncident[]>(mockIncidents);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedIncident, setSelectedIncident] = useState<SiteIncident | null>(null);
  const [isResolutionDialogOpen, setIsResolutionDialogOpen] = useState(false);
  const [resolution, setResolution] = useState('');
  
  const addMediaToIncident = (incidentId: string, newMedia: SiteMedia) => {
    setIncidents(incidents.map(incident => 
      incident.id === incidentId 
        ? { ...incident, media: [...incident.media, newMedia] } 
        : incident
    ));
  };
  
  const resolveIncident = (incidentId: string) => {
    if (!resolution.trim()) {
      toast({
        title: "Ошибка",
        description: "Необходимо указать способ решения проблемы",
        variant: "destructive",
      });
      return;
    }
    
    setIncidents(incidents.map(incident => 
      incident.id === incidentId 
        ? { 
            ...incident, 
            status: 'resolved', 
            resolution: resolution.trim(),
            resolvedBy: 'e1', // Current user ID
            resolvedAt: new Date().toISOString()
          } 
        : incident
    ));
    
    setIsResolutionDialogOpen(false);
    setResolution('');
    
    toast({
      title: "Инцидент решен",
      description: "Информация о решении проблемы добавлена",
    });
  };
  
  const updateIncidentStatus = (incidentId: string, status: 'open' | 'in-progress' | 'resolved') => {
    if (status === 'resolved') {
      setSelectedIncident(incidents.find(inc => inc.id === incidentId) || null);
      setIsResolutionDialogOpen(true);
      return;
    }
    
    setIncidents(incidents.map(incident => 
      incident.id === incidentId ? { ...incident, status } : incident
    ));
    
    toast({
      title: "Статус обновлен",
      description: `Статус инцидента изменен на ${
        status === 'open' ? 'Открыт' : 
        status === 'in-progress' ? 'В работе' : 'Решен'
      }`,
    });
  };
  
  const filteredIncidents = incidents.filter(incident => {
    if (activeTab === 'all') return true;
    if (activeTab === 'open') return incident.status === 'open';
    if (activeTab === 'in-progress') return incident.status === 'in-progress';
    if (activeTab === 'resolved') return incident.status === 'resolved';
    return true;
  });
  
  const getSiteName = (siteId: string) => {
    const site = sites.find(site => site.id === siteId);
    return site ? site.name : 'Неизвестный объект';
  };
  
  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'Неизвестный сотрудник';
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Низкий</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Средний</Badge>;
      case 'high':
        return <Badge variant="destructive">Высокий</Badge>;
      default:
        return null;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Открыт</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">В работе</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Решен</Badge>;
      default:
        return null;
    }
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
    <TransitionWrapper className="pb-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Случаи на объектах</h1>
            <p className="text-muted-foreground mt-2">
              Учет и отслеживание инцидентов на строительных объектах
            </p>
          </div>
          
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Новый инцидент
          </Button>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="all">Все инциденты</TabsTrigger>
            <TabsTrigger value="open">Открытые</TabsTrigger>
            <TabsTrigger value="in-progress">В работе</TabsTrigger>
            <TabsTrigger value="resolved">Решенные</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="space-y-6">
          {filteredIncidents.length > 0 ? (
            filteredIncidents.map(incident => (
              <div key={incident.id} className="glass rounded-xl overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold">{incident.title}</h2>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(incident.priority)}
                      {getStatusBadge(incident.status)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4" />
                      <span>Объект: {getSiteName(incident.siteId)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>Создал: {getEmployeeName(incident.createdBy)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Дата создания: {formatDate(incident.createdAt)}</span>
                    </div>
                    {incident.resolvedAt && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Дата решения: {formatDate(incident.resolvedAt)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm">{incident.description}</p>
                  </div>
                  
                  {incident.resolution && (
                    <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <h3 className="text-sm font-medium text-green-800 mb-2">Способ решения:</h3>
                      <p className="text-sm text-green-700">{incident.resolution}</p>
                      {incident.resolvedBy && (
                        <p className="text-xs text-green-600 mt-2">
                          Устранил: {getEmployeeName(incident.resolvedBy)}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* Media gallery */}
                  {incident.media.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium mb-2">Медиафайлы ({incident.media.length}):</h3>
                      <SiteMediaGallery media={incident.media} />
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2 justify-end mt-6">
                    {incident.status !== 'resolved' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex items-center gap-2">
                            <FileImage className="h-4 w-4" />
                            <span>Добавить медиа</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Добавить медиафайл</DialogTitle>
                          </DialogHeader>
                          <SiteMediaForm 
                            defectId={incident.id} 
                            onSuccess={(newMedia) => addMediaToIncident(incident.id, newMedia)}
                            onCancel={() => {}}
                          />
                        </DialogContent>
                      </Dialog>
                    )}
                    
                    {incident.status === 'open' && (
                      <Button 
                        variant="outline" 
                        onClick={() => updateIncidentStatus(incident.id, 'in-progress')}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Взять в работу
                      </Button>
                    )}
                    
                    {incident.status === 'in-progress' && (
                      <Button 
                        variant="default" 
                        onClick={() => updateIncidentStatus(incident.id, 'resolved')}
                      >
                        Отметить как решенный
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="glass rounded-xl p-8 text-center">
              <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-1">Инциденты не найдены</h3>
              <p className="text-muted-foreground">
                В этой категории пока нет инцидентов
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Resolution Dialog */}
      <Dialog open={isResolutionDialogOpen} onOpenChange={setIsResolutionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить способ решения</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="resolution">Описание решения проблемы</Label>
              <Textarea
                id="resolution"
                placeholder="Опишите, как была устранена проблема..."
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={5}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsResolutionDialogOpen(false)}
              >
                Отмена
              </Button>
              <Button 
                type="button" 
                onClick={() => selectedIncident && resolveIncident(selectedIncident.id)}
              >
                Сохранить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TransitionWrapper>
  );
};

export default SiteIncidentsPage;
