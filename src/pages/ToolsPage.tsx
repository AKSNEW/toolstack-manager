
import React, { useState } from 'react';
import { tools, Tool } from '@/lib/data';
import ToolCard from '@/components/ToolCard';
import TransitionWrapper from '@/components/TransitionWrapper';
import { 
  Search, 
  Filter, 
  Package,
  X, 
  AlertTriangle, 
  Clock, 
  Check,
  Plus,
  Wrench
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddToolForm from '@/components/AddToolForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EdcToolForm from '@/components/EdcToolForm';

const ToolsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isAddToolDialogOpen, setIsAddToolDialogOpen] = useState(false);
  const [isAddEdcDialogOpen, setIsAddEdcDialogOpen] = useState(false);
  const [toolsList, setToolsList] = useState<Tool[]>(tools);
  const [activeTab, setActiveTab] = useState<string>("all");

  // Get unique categories
  const categories = [...new Set(toolsList.map(tool => tool.category))];
  
  // Filter tools based on search, filters and tabs
  const filteredTools = toolsList.filter(tool => {
    // Search term filter
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter ? tool.category === categoryFilter : true;
    
    // Status filter
    const matchesStatus = statusFilter ? tool.status === statusFilter : true;
    
    // Tab filter
    const matchesTab = activeTab === "all" ? true : 
                      (activeTab === "edc" ? !!tool.isEdc : !tool.isEdc);
    
    return matchesSearch && matchesCategory && matchesStatus && matchesTab;
  });

  const handleToolClick = (tool: Tool) => {
    setSelectedTool(tool);
  };

  const closeDialog = () => {
    setSelectedTool(null);
  };

  const clearFilters = () => {
    setCategoryFilter(null);
    setStatusFilter(null);
    setSearchTerm('');
  };

  const openAddToolDialog = () => {
    setIsAddToolDialogOpen(true);
  };

  const closeAddToolDialog = () => {
    setIsAddToolDialogOpen(false);
  };

  const openAddEdcDialog = () => {
    setIsAddEdcDialogOpen(true);
  };

  const closeAddEdcDialog = () => {
    setIsAddEdcDialogOpen(false);
  };

  const handleAddTool = (newTool: Omit<Tool, 'id' | 'status' | 'lastCheckedOut'>) => {
    const tool: Tool = {
      ...newTool,
      id: `t${toolsList.length + 1}`,
      status: 'available',
    };
    
    setToolsList(prev => [...prev, tool]);
    closeAddToolDialog();
  };

  const handleAddEdcTool = (newTool: Omit<Tool, 'id' | 'status' | 'lastCheckedOut'> & {isEdc: true, links: string[]}) => {
    const tool: Tool = {
      ...newTool,
      id: `edc${toolsList.length + 1}`,
      status: 'available',
    };
    
    setToolsList(prev => [...prev, tool]);
    closeAddEdcDialog();
  };

  const handleVoteTool = (toolId: string, value: 1 | -1) => {
    setToolsList(prev => prev.map(tool => {
      if (tool.id === toolId) {
        // For simplicity, we use a fixed user ID here
        const userId = "current-user";
        const votes = tool.votes || [];
        
        // Check if the user already voted
        const existingVoteIndex = votes.findIndex(v => v.userId === userId);
        
        if (existingVoteIndex >= 0) {
          // User already voted, update their vote
          const updatedVotes = [...votes];
          updatedVotes[existingVoteIndex] = { userId, value };
          return { ...tool, votes: updatedVotes };
        } else {
          // New vote
          return { ...tool, votes: [...votes, { userId, value }] };
        }
      }
      return tool;
    }));
  };

  // Status buttons data
  const statusButtons = [
    { value: 'available', label: 'Доступно', icon: Check, color: 'bg-green-100 text-green-700 border-green-200' },
    { value: 'in-use', label: 'Используется', icon: Clock, color: 'bg-amber-100 text-amber-700 border-amber-200' },
    { value: 'maintenance', label: 'В ремонте', icon: AlertTriangle, color: 'bg-red-100 text-red-700 border-red-200' },
  ];

  return (
    <TransitionWrapper className="pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Инструменты и оборудование</h1>
            <p className="text-muted-foreground mt-2">
              Управление инструментами и оборудованием компании
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={openAddToolDialog} 
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Добавить инструмент</span>
            </Button>
            <Button 
              onClick={openAddEdcDialog} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Wrench className="h-4 w-4" />
              <span>Добавить EDC набор</span>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="mb-8" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Все инструменты</TabsTrigger>
            <TabsTrigger value="regular">Обычные инструменты</TabsTrigger>
            <TabsTrigger value="edc">EDC наборы</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Search and filters */}
        <div className="glass rounded-xl mb-8 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input 
                type="text" 
                placeholder="Поиск инструмента..." 
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
              <select
                value={categoryFilter || ''}
                onChange={(e) => setCategoryFilter(e.target.value || null)}
                className="h-10 rounded-lg bg-background border border-input px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              >
                <option value="">Все категории</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
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
              
              {(searchTerm || categoryFilter || statusFilter) && (
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
        
        {/* Tools grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map(tool => (
              <ToolCard 
                key={tool.id} 
                tool={tool} 
                onClick={handleToolClick}
                onVote={tool.isEdc ? handleVoteTool : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="glass rounded-xl p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-1">Ничего не найдено</h3>
            <p className="text-muted-foreground">
              Не найдено инструментов соответствующих заданным критериям
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
        
        {/* Tool details dialog */}
        <Dialog open={!!selectedTool} onOpenChange={() => closeDialog()}>
          {selectedTool && (
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{selectedTool.name}</DialogTitle>
                <DialogDescription>{selectedTool.category}</DialogDescription>
              </DialogHeader>
              
              <div className="mt-4 space-y-6">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img 
                    src={selectedTool.image} 
                    alt={selectedTool.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Статус</p>
                    <div className="flex items-center gap-1.5">
                      {selectedTool.status === 'available' ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : selectedTool.status === 'in-use' ? (
                        <Clock className="h-4 w-4 text-amber-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                      <span>
                        {statusButtons.find(b => b.value === selectedTool.status)?.label}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Расположение</p>
                    <p>{selectedTool.location}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-muted-foreground">Описание</p>
                  <p>{selectedTool.description}</p>
                </div>
                
                {selectedTool.isEdc && selectedTool.links && selectedTool.links.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-muted-foreground">Ссылки на товар</p>
                    <ul className="space-y-1">
                      {selectedTool.links.map((link, index) => (
                        <li key={index}>
                          <a 
                            href={link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Ссылка {index + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedTool.lastCheckedOut && (
                  <div className="space-y-2">
                    <p className="text-muted-foreground">Последняя выдача</p>
                    <p>{new Date(selectedTool.lastCheckedOut.date).toLocaleDateString('ru-RU')}</p>
                  </div>
                )}
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={closeDialog}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>

        {/* Add Tool Dialog */}
        <Dialog open={isAddToolDialogOpen} onOpenChange={setIsAddToolDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Добавить новый инструмент</DialogTitle>
              <DialogDescription>Заполните форму для добавления нового инструмента</DialogDescription>
            </DialogHeader>
            
            <AddToolForm 
              onAddTool={handleAddTool}
              onCancel={closeAddToolDialog}
              categories={categories}
            />
          </DialogContent>
        </Dialog>

        {/* Add EDC Tool Dialog */}
        <Dialog open={isAddEdcDialogOpen} onOpenChange={setIsAddEdcDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Добавить EDC набор</DialogTitle>
              <DialogDescription>Заполните форму для добавления нового EDC набора</DialogDescription>
            </DialogHeader>
            
            <EdcToolForm 
              onAddTool={handleAddEdcTool}
              onCancel={closeAddEdcDialog}
              categories={categories}
            />
          </DialogContent>
        </Dialog>
      </div>
    </TransitionWrapper>
  );
};

export default ToolsPage;
