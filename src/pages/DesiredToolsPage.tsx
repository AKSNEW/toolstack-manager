
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import TransitionWrapper from '@/components/TransitionWrapper';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Plus, 
  ExternalLink, 
  Search,
  AlertCircle,
  User 
} from 'lucide-react';
import { toolboxCategories } from '@/lib/data/toolbox';
import { employees } from '@/lib/data';
import { ToolboxItem } from '@/lib/types';

// Mock data for desired tools (reuse toolbox structure)
const initialTools: ToolboxItem[] = [
  {
    id: 'dt-001',
    name: 'Лазерный уровень Hilti PM 2-LG',
    category: 'Измерительный инструмент',
    price: 42500,
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407',
    description: 'Профессиональный лазерный уровень с зелеными лучами для улучшенной видимости. Самовыравнивание, точность ±2 мм на 10 м, защита IP54.',
    link: 'https://example.com/product/hilti-pm-2-lg',
    authorId: 'e1',
    createdAt: '2023-09-10T15:30:00Z',
    likes: 8,
    dislikes: 1,
    comments: [
      {
        id: 'c-001',
        authorId: 'e2',
        content: 'У нас на объекте такой есть, отличная вещь. Зеленый луч видно даже при ярком солнце.',
        createdAt: '2023-09-11T09:15:00Z'
      },
      {
        id: 'c-002',
        authorId: 'e3',
        content: 'Дорогой, но стоит своих денег. Батарейки держат долго.',
        createdAt: '2023-09-12T14:40:00Z'
      }
    ]
  },
  {
    id: 'dt-002',
    name: 'Аккумуляторная дрель-шуруповерт DeWalt DCD791D2',
    category: 'Аккумуляторный инструмент',
    price: 18900,
    image: 'https://images.unsplash.com/photo-1623712174886-231891610f6d',
    description: 'Мощная и компактная дрель-шуруповерт с бесщеточным двигателем. В комплекте 2 аккумулятора 2.0 Ач, зарядное устройство и кейс.',
    link: 'https://example.com/product/dewalt-dcd791d2',
    authorId: 'e4',
    createdAt: '2023-09-15T11:20:00Z',
    likes: 5,
    dislikes: 0,
    comments: []
  },
  {
    id: 'dt-003',
    name: 'Набор инструментов Wera Kraftform Kompakt 100',
    category: 'Ручной инструмент',
    price: 12700,
    image: 'https://images.unsplash.com/photo-1629958126149-d09629eb7f8d',
    description: 'Высококачественный набор бит и отверток в компактном чехле. Включает 52 предмета: биты, отвертки и держатели. Идеально для электромонтажных работ.',
    link: 'https://example.com/product/wera-kraftform-kompakt-100',
    authorId: 'e2',
    createdAt: '2023-09-20T16:45:00Z',
    likes: 3,
    dislikes: 2,
    comments: [
      {
        id: 'c-003',
        authorId: 'e1',
        content: 'Используем такой на работе, очень удобно что все в одном месте.',
        createdAt: '2023-09-21T08:30:00Z'
      }
    ]
  }
];

interface ToolFormValues {
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
  link: string;
}

const initialFormState: ToolFormValues = {
  name: '',
  category: '',
  price: '',
  image: '',
  description: '',
  link: ''
};

interface CommentFormValues {
  content: string;
}

const DesiredToolsPage: React.FC = () => {
  const { toast } = useToast();
  const [tools, setTools] = useState<ToolboxItem[]>(initialTools);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formValues, setFormValues] = useState<ToolFormValues>(initialFormState);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState<ToolboxItem | null>(null);
  const [newComment, setNewComment] = useState('');
  
  const handleAddTool = () => {
    // Validate form
    if (!formValues.name.trim()) {
      toast({
        title: "Ошибка",
        description: "Необходимо указать название инструмента",
        variant: "destructive",
      });
      return;
    }
    
    if (!formValues.category) {
      toast({
        title: "Ошибка",
        description: "Выберите категорию инструмента",
        variant: "destructive",
      });
      return;
    }
    
    const price = parseFloat(formValues.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Ошибка",
        description: "Введите корректную цену",
        variant: "destructive",
      });
      return;
    }
    
    // Create new tool
    const newTool: ToolboxItem = {
      id: `dt-${Date.now()}`,
      name: formValues.name.trim(),
      category: formValues.category,
      price,
      image: formValues.image || 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122',
      description: formValues.description.trim(),
      link: formValues.link.trim(),
      authorId: 'e1', // Current user ID
      createdAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      comments: []
    };
    
    setTools([newTool, ...tools]);
    setFormValues(initialFormState);
    setShowAddForm(false);
    
    toast({
      title: "Инструмент добавлен",
      description: "Ваш запрос на инструмент успешно добавлен",
    });
  };
  
  const handleVote = (toolId: string, voteType: 'like' | 'dislike') => {
    setTools(tools.map(tool => {
      if (tool.id !== toolId) return tool;
      
      if (voteType === 'like') {
        return { ...tool, likes: tool.likes + 1 };
      } else {
        return { ...tool, dislikes: tool.dislikes + 1 };
      }
    }));
    
    toast({
      title: voteType === 'like' ? "Голос отдан" : "Голос против принят",
      description: "Ваш голос учтен",
    });
  };
  
  const handleAddComment = (toolId: string) => {
    if (!newComment.trim()) {
      toast({
        title: "Ошибка",
        description: "Комментарий не может быть пустым",
        variant: "destructive",
      });
      return;
    }
    
    const comment = {
      id: `c-${Date.now()}`,
      authorId: 'e1', // Current user ID
      content: newComment.trim(),
      createdAt: new Date().toISOString()
    };
    
    setTools(tools.map(tool => {
      if (tool.id !== toolId) return tool;
      
      return {
        ...tool,
        comments: [...(tool.comments || []), comment]
      };
    }));
    
    setNewComment('');
    
    toast({
      title: "Комментарий добавлен",
      description: "Ваш комментарий успешно добавлен",
    });
  };
  
  const filteredTools = tools.filter(tool => {
    const matchesSearch = !searchQuery || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeTab === 'all' || tool.category === activeTab;
    
    return matchesSearch && matchesCategory;
  });
  
  const getEmployeeName = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? employee.name : 'Неизвестный сотрудник';
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  
  return (
    <TransitionWrapper className="pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Желаемый инструмент</h1>
            <p className="text-muted-foreground mt-2">
              Запросы на приобретение нового инструмента и оборудования
            </p>
          </div>
          
          <Sheet open={showAddForm} onOpenChange={setShowAddForm}>
            <SheetTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Предложить инструмент
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Добавить инструмент</SheetTitle>
                <SheetDescription>
                  Предложите инструмент для приобретения компанией
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="toolName">Название инструмента</Label>
                  <Input
                    id="toolName"
                    placeholder="Например: Перфоратор Bosch GBH 2-26"
                    value={formValues.name}
                    onChange={(e) => setFormValues({...formValues, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Категория</Label>
                  <Select 
                    value={formValues.category} 
                    onValueChange={(value) => setFormValues({...formValues, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {toolboxCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Примерная цена (₽)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="10000"
                    value={formValues.price}
                    onChange={(e) => setFormValues({...formValues, price: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL изображения (необязательно)</Label>
                  <Input
                    id="imageUrl"
                    placeholder="https://example.com/image.jpg"
                    value={formValues.image}
                    onChange={(e) => setFormValues({...formValues, image: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="toolDescription">Описание</Label>
                  <Textarea
                    id="toolDescription"
                    placeholder="Опишите инструмент и зачем он нужен..."
                    rows={4}
                    value={formValues.description}
                    onChange={(e) => setFormValues({...formValues, description: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="toolLink">Ссылка на товар (необязательно)</Label>
                  <Input
                    id="toolLink"
                    placeholder="https://example.com/product"
                    value={formValues.link}
                    onChange={(e) => setFormValues({...formValues, link: e.target.value})}
                  />
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button onClick={handleAddTool}>Добавить инструмент</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Поиск инструмента..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-2">
              <TabsTrigger value="all">Все категории</TabsTrigger>
              {toolboxCategories.map(category => (
                <TabsTrigger key={category} value={category} className="hidden md:inline-flex">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <div className="md:hidden">
              <Select 
                value={activeTab} 
                onValueChange={setActiveTab}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  {toolboxCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Tabs>
        </div>
        
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map(tool => (
              <Card key={tool.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={tool.image} 
                    alt={tool.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                    <Badge variant="outline">{tool.category}</Badge>
                  </div>
                  <CardDescription>
                    {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(tool.price)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-3">{tool.description}</p>
                  
                  <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                    <div>Предложил: {getEmployeeName(tool.authorId)}</div>
                    <div>{formatDate(tool.createdAt)}</div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleVote(tool.id, 'like')}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-green-600"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{tool.likes}</span>
                    </button>
                    <button 
                      onClick={() => handleVote(tool.id, 'dislike')}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-600"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      <span>{tool.dislikes}</span>
                    </button>
                    <Sheet>
                      <SheetTrigger asChild>
                        <button 
                          onClick={() => setSelectedTool(tool)}
                          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>{tool.comments?.length || 0}</span>
                        </button>
                      </SheetTrigger>
                      <SheetContent className="sm:max-w-md">
                        <SheetHeader>
                          <SheetTitle>Комментарии</SheetTitle>
                        </SheetHeader>
                        <div className="py-4">
                          <h3 className="font-medium mb-1">{tool.name}</h3>
                          <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                          
                          <div className="space-y-4 mb-6">
                            {tool.comments && tool.comments.length > 0 ? (
                              tool.comments.map(comment => (
                                <div key={comment.id} className="p-3 bg-muted rounded-lg">
                                  <div className="flex justify-between items-center mb-2">
                                    <div className="text-sm font-medium">
                                      {getEmployeeName(comment.authorId)}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {formatDate(comment.createdAt)}
                                    </div>
                                  </div>
                                  <p className="text-sm">{comment.content}</p>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-4 text-muted-foreground">
                                <AlertCircle className="h-10 w-10 mx-auto mb-2" />
                                <p>Комментариев пока нет</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="comment">Добавить комментарий</Label>
                            <Textarea
                              id="comment"
                              placeholder="Напишите ваш комментарий..."
                              rows={3}
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                            />
                            <div className="flex justify-end">
                              <Button 
                                onClick={() => handleAddComment(tool.id)}
                                disabled={!newComment.trim()}
                              >
                                Отправить
                              </Button>
                            </div>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                  
                  {tool.link && (
                    <a 
                      href={tool.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Подробнее</span>
                    </a>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="glass rounded-xl p-8 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-1">Инструменты не найдены</h3>
            <p className="text-muted-foreground">
              По вашему запросу не найдено инструментов. Попробуйте изменить параметры поиска или добавьте новый инструмент.
            </p>
          </div>
        )}
      </div>
    </TransitionWrapper>
  );
};

export default DesiredToolsPage;
