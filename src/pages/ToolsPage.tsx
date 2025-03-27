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
  Check
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const ToolsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  // Get unique categories
  const categories = [...new Set(tools.map(tool => tool.category))];
  
  // Filter tools based on search and filters
  const filteredTools = tools.filter(tool => {
    // Search term filter
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter ? tool.category === categoryFilter : true;
    
    // Status filter
    const matchesStatus = statusFilter ? tool.status === statusFilter : true;
    
    return matchesSearch && matchesCategory && matchesStatus;
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

  // Status buttons data
  const statusButtons = [
    { value: 'available', label: 'Доступно', icon: Check, color: 'bg-green-100 text-green-700 border-green-200' },
    { value: 'in-use', label: 'Используется', icon: Clock, color: 'bg-amber-100 text-amber-700 border-amber-200' },
    { value: 'maintenance', label: 'В ремонте', icon: AlertTriangle, color: 'bg-red-100 text-red-700 border-red-200' },
  ];

  return (
    <TransitionWrapper className="pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Инструменты и оборудование</h1>
          <p className="text-muted-foreground mt-2">
            Управление инструментами и оборудованием компании
          </p>
        </div>
        
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
      </div>
    </TransitionWrapper>
  );
};

export default ToolsPage;
