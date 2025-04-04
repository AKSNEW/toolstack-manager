
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import TransitionWrapper from '@/components/TransitionWrapper';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WiringDiagram, DiagramComment, Employee } from '@/lib/types';
import { employees } from '@/lib/data';
import { 
  FileCode, 
  FilePlus, 
  Search, 
  X, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Plus,
  Send
} from 'lucide-react';

// Mock wiring diagrams data
const mockDiagrams: WiringDiagram[] = [
  {
    id: 'wiring-001',
    title: 'Схема электропроводки первого этажа',
    description: 'Полная схема электропроводки первого этажа с разводкой для освещения и розеток.',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e',
    category: 'Электрика',
    createdBy: 'e1',
    createdAt: '2023-03-15T10:00:00Z',
    comments: [
      {
        id: 'comment-001',
        diagramId: 'wiring-001',
        authorId: 'e2',
        content: 'Предлагаю добавить автомат для кондиционера в комнате 103.',
        createdAt: '2023-03-16T14:30:00Z'
      },
      {
        id: 'comment-002',
        diagramId: 'wiring-001',
        authorId: 'e3',
        content: 'Хорошая схема, но нужно отметить фазу и ноль разными цветами.',
        createdAt: '2023-03-17T09:15:00Z'
      }
    ],
    votes: [
      { userId: 'e2', value: 1 },
      { userId: 'e3', value: 1 },
      { userId: 'e4', value: -1 }
    ]
  },
  {
    id: 'wiring-002',
    title: 'Схема вентиляции технического помещения',
    description: 'Схема разводки вентиляционных каналов в техническом помещении с указанием диаметров труб.',
    imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12',
    category: 'Вентиляция',
    createdBy: 'e4',
    createdAt: '2023-04-05T11:30:00Z',
    comments: [],
    votes: [
      { userId: 'e1', value: 1 },
      { userId: 'e2', value: 1 }
    ]
  },
  {
    id: 'wiring-003',
    title: 'Схема водоснабжения душевых',
    description: 'Схема разводки холодного и горячего водоснабжения для душевых в бытовом корпусе.',
    imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1',
    category: 'Водоснабжение',
    createdBy: 'e2',
    createdAt: '2023-04-20T14:45:00Z',
    comments: [
      {
        id: 'comment-003',
        diagramId: 'wiring-003',
        authorId: 'e1',
        content: 'Нужно добавить отдельный стояк для технической воды.',
        createdAt: '2023-04-21T10:20:00Z'
      }
    ],
    votes: [
      { userId: 'e3', value: 1 },
      { userId: 'e4', value: 1 }
    ]
  }
];

const WiringDiagramsPage: React.FC = () => {
  const { toast } = useToast();
  const [diagrams, setDiagrams] = useState<WiringDiagram[]>(mockDiagrams);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDiagram, setSelectedDiagram] = useState<WiringDiagram | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  
  const [newDiagram, setNewDiagram] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: ''
  });
  
  // Get unique categories for filtering
  const categories = Array.from(new Set(diagrams.map(d => d.category)));
  
  // Current user for demo purposes
  const currentUserId = 'e1';
  
  // Filter diagrams based on search and category
  const filteredDiagrams = diagrams.filter(diagram => {
    const matchesSearch = 
      diagram.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagram.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagram.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter ? diagram.category === categoryFilter : true;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleAddDiagram = () => {
    if (!newDiagram.title.trim() || !newDiagram.imageUrl.trim() || !newDiagram.category.trim()) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }
    
    const diagram: WiringDiagram = {
      id: `wiring-${Date.now()}`,
      title: newDiagram.title,
      description: newDiagram.description,
      imageUrl: newDiagram.imageUrl,
      category: newDiagram.category,
      createdBy: currentUserId,
      createdAt: new Date().toISOString(),
      comments: [],
      votes: []
    };
    
    setDiagrams([...diagrams, diagram]);
    setNewDiagram({
      title: '',
      description: '',
      imageUrl: '',
      category: ''
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Схема добавлена",
      description: "Новая схема успешно добавлена",
    });
  };
  
  const handleAddComment = () => {
    if (!selectedDiagram || !newComment.trim()) {
      toast({
        title: "Ошибка",
        description: "Комментарий не может быть пустым",
        variant: "destructive",
      });
      return;
    }
    
    const comment: DiagramComment = {
      id: `comment-${Date.now()}`,
      diagramId: selectedDiagram.id,
      authorId: currentUserId,
      content: newComment,
      createdAt: new Date().toISOString()
    };
    
    // Update the selected diagram with the new comment
    const updatedDiagram = {
      ...selectedDiagram,
      comments: [...selectedDiagram.comments, comment]
    };
    
    // Update the diagrams array
    setDiagrams(diagrams.map(d => 
      d.id === selectedDiagram.id ? updatedDiagram : d
    ));
    
    // Update the selected diagram
    setSelectedDiagram(updatedDiagram);
    setNewComment('');
    
    toast({
      title: "Комментарий добавлен",
      description: "Ваш комментарий успешно добавлен",
    });
  };
  
  const handleVote = (diagramId: string, value: 1 | -1) => {
    // Check if user already voted
    const diagram = diagrams.find(d => d.id === diagramId);
    if (!diagram) return;
    
    const existingVote = diagram.votes.find(v => v.userId === currentUserId);
    
    let updatedVotes;
    
    if (existingVote) {
      // If the same vote value, remove the vote (toggle off)
      if (existingVote.value === value) {
        updatedVotes = diagram.votes.filter(v => v.userId !== currentUserId);
      } else {
        // Change vote value
        updatedVotes = diagram.votes.map(v => 
          v.userId === currentUserId ? { ...v, value } : v
        );
      }
    } else {
      // Add new vote
      updatedVotes = [...diagram.votes, { userId: currentUserId, value }];
    }
    
    // Update diagrams
    setDiagrams(diagrams.map(d => 
      d.id === diagramId ? { ...d, votes: updatedVotes } : d
    ));
    
    // Update selected diagram if open
    if (selectedDiagram && selectedDiagram.id === diagramId) {
      setSelectedDiagram({ ...selectedDiagram, votes: updatedVotes });
    }
    
    toast({
      title: value === 1 ? "Вы оценили схему положительно" : "Вы оценили схему отрицательно",
      description: "Ваш голос учтен",
    });
  };
  
  const getUserVote = (votes: { userId: string; value: 1 | -1 }[]) => {
    const vote = votes.find(v => v.userId === currentUserId);
    return vote ? vote.value : 0;
  };
  
  const getTotalVotes = (votes: { userId: string; value: 1 | -1 }[]) => {
    return votes.reduce((sum, vote) => sum + vote.value, 0);
  };
  
  const getEmployeeName = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
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
    setCategoryFilter(null);
  };
  
  return (
    <TransitionWrapper className="pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Схемы подключения</h1>
            <p className="text-muted-foreground mt-2">
              Схемы электропроводки, вентиляции, водоснабжения и других инженерных систем
            </p>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <FilePlus className="h-4 w-4" />
            Добавить схему
          </Button>
        </div>
        
        {/* Search and filters */}
        <div className="glass rounded-xl mb-8 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input 
                type="text" 
                placeholder="Поиск схем..." 
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
              <div className="flex gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setCategoryFilter(categoryFilter === category ? null : category)}
                    className={`flex items-center gap-1 px-3 h-10 rounded-lg border text-sm transition-all ${
                      categoryFilter === category 
                        ? 'bg-blue-100 text-blue-700 border-blue-200' 
                        : 'bg-background border-input text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              
              {(searchTerm || categoryFilter) && (
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
        
        {/* Diagrams grid */}
        {filteredDiagrams.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDiagrams.map((diagram) => (
              <Card key={diagram.id} className="overflow-hidden hover:shadow-md transition-all">
                <div 
                  className="h-48 bg-cover bg-center cursor-pointer" 
                  style={{ backgroundImage: `url(${diagram.imageUrl})` }}
                  onClick={() => {
                    setSelectedDiagram(diagram);
                    setIsViewDialogOpen(true);
                  }}
                ></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle 
                        className="cursor-pointer hover:text-primary"
                        onClick={() => {
                          setSelectedDiagram(diagram);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        {diagram.title}
                      </CardTitle>
                      <CardDescription>{formatDate(diagram.createdAt)}</CardDescription>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      {diagram.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm line-clamp-2">{diagram.description}</p>
                </CardContent>
                <CardFooter className="pt-2 flex justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => handleVote(diagram.id, 1)}
                        className={`p-1 rounded ${getUserVote(diagram.votes) === 1 ? 'bg-green-100 text-green-700' : 'text-muted-foreground hover:text-green-600'}`}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </button>
                      <span>{diagram.votes.filter(v => v.value === 1).length}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => handleVote(diagram.id, -1)}
                        className={`p-1 rounded ${getUserVote(diagram.votes) === -1 ? 'bg-red-100 text-red-700' : 'text-muted-foreground hover:text-red-600'}`}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </button>
                      <span>{diagram.votes.filter(v => v.value === -1).length}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span>{diagram.comments.length}</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="glass rounded-xl p-8 text-center">
            <FileCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-1">Схемы не найдены</h3>
            <p className="text-muted-foreground">
              Не найдено схем, соответствующих заданным критериям
            </p>
            {(searchTerm || categoryFilter) && (
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
        
        {/* Add Diagram Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Добавить новую схему</DialogTitle>
              <DialogDescription>
                Заполните форму для добавления новой схемы в базу данных
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Название схемы</Label>
                <Input
                  id="title"
                  placeholder="Введите название схемы"
                  value={newDiagram.title}
                  onChange={(e) => setNewDiagram({ ...newDiagram, title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Категория</Label>
                <Input
                  id="category"
                  placeholder="Введите категорию (Электрика, Вентиляция и т.д.)"
                  value={newDiagram.category}
                  onChange={(e) => setNewDiagram({ ...newDiagram, category: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL изображения</Label>
                <Input
                  id="imageUrl"
                  placeholder="Вставьте URL изображения схемы"
                  value={newDiagram.imageUrl}
                  onChange={(e) => setNewDiagram({ ...newDiagram, imageUrl: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  placeholder="Добавьте описание схемы"
                  rows={4}
                  value={newDiagram.description}
                  onChange={(e) => setNewDiagram({ ...newDiagram, description: e.target.value })}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Отмена</Button>
              <Button onClick={handleAddDiagram}>Добавить схему</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* View Diagram Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            {selectedDiagram && (
              <>
                <DialogHeader>
                  <div className="flex justify-between items-start">
                    <DialogTitle>{selectedDiagram.title}</DialogTitle>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      {selectedDiagram.category}
                    </Badge>
                  </div>
                  <DialogDescription>
                    Добавлено: {formatDate(selectedDiagram.createdAt)} • 
                    Автор: {getEmployeeName(selectedDiagram.createdBy)}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="rounded-lg overflow-hidden border border-border">
                    <img 
                      src={selectedDiagram.imageUrl} 
                      alt={selectedDiagram.title} 
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Описание</h3>
                    <p className="text-sm">{selectedDiagram.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleVote(selectedDiagram.id, 1)}
                          className={`p-1.5 rounded ${getUserVote(selectedDiagram.votes) === 1 ? 'bg-green-100 text-green-700' : 'text-muted-foreground hover:text-green-600'}`}
                        >
                          <ThumbsUp className="h-5 w-5" />
                        </button>
                        <span>{selectedDiagram.votes.filter(v => v.value === 1).length}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleVote(selectedDiagram.id, -1)}
                          className={`p-1.5 rounded ${getUserVote(selectedDiagram.votes) === -1 ? 'bg-red-100 text-red-700' : 'text-muted-foreground hover:text-red-600'}`}
                        >
                          <ThumbsDown className="h-5 w-5" />
                        </button>
                        <span>{selectedDiagram.votes.filter(v => v.value === -1).length}</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Рейтинг: {getTotalVotes(selectedDiagram.votes)}
                    </div>
                  </div>
                  
                  {/* Comments section */}
                  <div className="pt-4 border-t border-border">
                    <h3 className="text-lg font-medium mb-4">Комментарии ({selectedDiagram.comments.length})</h3>
                    
                    <div className="space-y-4 mb-4">
                      {selectedDiagram.comments.length > 0 ? (
                        selectedDiagram.comments.map((comment) => (
                          <div key={comment.id} className="p-3 bg-muted rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">{getEmployeeName(comment.authorId)}</span>
                              <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">Пока нет комментариев</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Добавьте комментарий..."
                        rows={2}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-grow"
                      />
                      <Button 
                        onClick={handleAddComment}
                        className="self-end"
                        disabled={!newComment.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TransitionWrapper>
  );
};

export default WiringDiagramsPage;
