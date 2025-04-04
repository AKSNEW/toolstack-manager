
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Defect } from '@/lib/types';
import { employees } from '@/lib/data/employees';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Search, 
  X,
  ChevronDown 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SiteDefectsJournalProps {
  siteId: string;
  siteName: string;
}

// Mock data for defects
const mockDefects: Defect[] = [
  {
    id: 'def-001',
    siteId: 's1',
    title: 'Протечка в крыше корпуса А',
    description: 'При сильном дожде обнаружена протечка на 5 этаже в районе лифтовой шахты.',
    reportedBy: 'emp-001',
    reportedDate: '2023-04-15T10:30:00Z',
    status: 'open',
  },
  {
    id: 'def-002',
    siteId: 's1',
    title: 'Трещина в фундаменте',
    description: 'Во время осмотра обнаружена трещина в фундаменте длиной около 1 метра в юго-восточной части здания.',
    reportedBy: 'emp-002',
    reportedDate: '2023-04-10T08:45:00Z',
    status: 'in-progress',
  },
  {
    id: 'def-003',
    siteId: 's1',
    title: 'Неисправность электропроводки',
    description: 'В корпусе Б на 3-м этаже обнаружены проблемы с электропроводкой, розетки не работают.',
    reportedBy: 'emp-003',
    reportedDate: '2023-04-05T14:20:00Z',
    status: 'resolved',
    resolvedBy: 'emp-004',
    resolvedDate: '2023-04-08T16:30:00Z',
    resolution: 'Заменена электропроводка и установлены новые розетки.',
  },
  {
    id: 'def-004',
    siteId: 's2',
    title: 'Проблема с вентиляцией',
    description: 'Система вентиляции работает с перебоями на 2-м этаже.',
    reportedBy: 'emp-001',
    reportedDate: '2023-04-12T11:15:00Z',
    status: 'open',
  },
];

const SiteDefectsJournal: React.FC<SiteDefectsJournalProps> = ({ siteId, siteName }) => {
  const { toast } = useToast();
  const [defects, setDefects] = useState<Defect[]>(mockDefects);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isAddDefectOpen, setIsAddDefectOpen] = useState(false);
  const [isResolveDefectOpen, setIsResolveDefectOpen] = useState(false);
  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  const [newDefect, setNewDefect] = useState({
    title: '',
    description: '',
  });
  
  const [resolution, setResolution] = useState('');
  
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
  
  const handleAddDefect = () => {
    if (!newDefect.title.trim() || !newDefect.description.trim()) {
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
      title: newDefect.title,
      description: newDefect.description,
      reportedBy: 'emp-001', // Current user ID
      reportedDate: new Date().toISOString(),
      status: 'open',
    };
    
    setDefects([...defects, newDefectObj]);
    setNewDefect({ title: '', description: '' });
    setIsAddDefectOpen(false);
    
    toast({
      title: 'Неисправность добавлена',
      description: 'Новая запись успешно добавлена в журнал',
    });
  };
  
  const handleResolveDefect = () => {
    if (!selectedDefect || !resolution.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Необходимо указать решение проблемы',
        variant: 'destructive',
      });
      return;
    }
    
    setDefects(defects.map(defect => 
      defect.id === selectedDefect.id ? {
        ...defect,
        status: 'resolved',
        resolvedBy: 'emp-001', // Current user ID
        resolvedDate: new Date().toISOString(),
        resolution,
      } : defect
    ));
    
    setResolution('');
    setSelectedDefect(null);
    setIsResolveDefectOpen(false);
    
    toast({
      title: 'Неисправность устранена',
      description: 'Запись обновлена в журнале',
    });
  };
  
  const handleStatusChange = (defect: Defect, newStatus: 'open' | 'in-progress' | 'resolved') => {
    if (newStatus === 'resolved') {
      setSelectedDefect(defect);
      setIsResolveDefectOpen(true);
      return;
    }
    
    setDefects(defects.map(d => 
      d.id === defect.id ? { ...d, status: newStatus } : d
    ));
    
    toast({
      title: 'Статус обновлен',
      description: `Статус неисправности изменен на "${
        newStatus === 'open' ? 'Открыта' : 
        newStatus === 'in-progress' ? 'В работе' : 'Устранена'
      }"`,
    });
  };
  
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
  
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter(null);
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
      
      <div className="flex items-center justify-between">
        <div className="relative flex-grow max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input 
            type="text" 
            placeholder="Поиск неисправностей..." 
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
        
        <Button 
          onClick={() => setIsAddDefectOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Добавить запись
        </Button>
      </div>
      
      {(searchTerm || statusFilter) && (
        <div className="flex items-center">
          <p className="text-sm text-muted-foreground">Активные фильтры:</p>
          {searchTerm && (
            <Badge variant="outline" className="ml-2">
              Поиск: {searchTerm}
              <button onClick={() => setSearchTerm('')} className="ml-1 focus:outline-none">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {statusFilter && (
            <Badge variant="outline" className="ml-2">
              Статус: {getStatusText(statusFilter)}
              <button onClick={() => setStatusFilter(null)} className="ml-1 focus:outline-none">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="ml-2 h-8 text-xs"
          >
            Сбросить все
          </Button>
        </div>
      )}
      
      {filteredDefects.length > 0 ? (
        <div className="space-y-4">
          {filteredDefects.map((defect) => (
            <div key={defect.id} className="glass p-4 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium">{defect.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(defect.status)}>
                    {getStatusIcon(defect.status)}
                    <span className="ml-1">{getStatusText(defect.status)}</span>
                  </Badge>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {defect.status !== 'open' && (
                        <DropdownMenuItem onClick={() => handleStatusChange(defect, 'open')}>
                          <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                          <span>Отметить как открытую</span>
                        </DropdownMenuItem>
                      )}
                      {defect.status !== 'in-progress' && (
                        <DropdownMenuItem onClick={() => handleStatusChange(defect, 'in-progress')}>
                          <Clock className="h-4 w-4 mr-2 text-amber-500" />
                          <span>Взять в работу</span>
                        </DropdownMenuItem>
                      )}
                      {defect.status !== 'resolved' && (
                        <DropdownMenuItem onClick={() => handleStatusChange(defect, 'resolved')}>
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
              
              {defect.status === 'resolved' && defect.resolution && (
                <div className="mt-3 pt-3 border-t border-border">
                  <h4 className="text-sm font-medium mb-1">Решение:</h4>
                  <p className="text-sm">{defect.resolution}</p>
                  
                  <div className="text-xs text-muted-foreground grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <span className="block">Кем устранено:</span>
                      <span>{getEmployeeName(defect.resolvedBy || '')}</span>
                    </div>
                    <div>
                      <span className="block">Дата устранения:</span>
                      <span>{formatDate(defect.resolvedDate || '')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-xl p-8 text-center">
          <AlertTriangle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-1">Записи не найдены</h3>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter ? 
              'Не найдено записей соответствующих заданным критериям' : 
              'В журнале неисправностей пока нет записей для этого объекта'}
          </p>
          {(searchTerm || statusFilter) && (
            <Button
              onClick={clearFilters}
              variant="outline"
              className="mt-4"
            >
              Сбросить фильтры
            </Button>
          )}
        </div>
      )}
      
      {/* Add Defect Dialog */}
      <Dialog open={isAddDefectOpen} onOpenChange={setIsAddDefectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить новую запись</DialogTitle>
            <DialogDescription>
              Заполните форму для добавления новой неисправности в журнал
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Наименование неисправности</Label>
              <Input
                id="title"
                placeholder="Введите короткое название неисправности"
                value={newDefect.title}
                onChange={(e) => setNewDefect({ ...newDefect, title: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Описание неисправности</Label>
              <Textarea
                id="description"
                placeholder="Подробно опишите обнаруженную неисправность"
                rows={4}
                value={newDefect.description}
                onChange={(e) => setNewDefect({ ...newDefect, description: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDefectOpen(false)}>Отмена</Button>
            <Button onClick={handleAddDefect}>Добавить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Resolve Defect Dialog */}
      <Dialog open={isResolveDefectOpen} onOpenChange={setIsResolveDefectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отметить как устраненную</DialogTitle>
            <DialogDescription>
              Укажите, как была устранена неисправность
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="resolution">Описание решения</Label>
              <Textarea
                id="resolution"
                placeholder="Опишите, как была устранена неисправность"
                rows={4}
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResolveDefectOpen(false)}>Отмена</Button>
            <Button onClick={handleResolveDefect}>Подтвердить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SiteDefectsJournal;
