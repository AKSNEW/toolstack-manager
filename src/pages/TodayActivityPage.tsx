
import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import TransitionWrapper from '@/components/TransitionWrapper';
import { Button } from '@/components/ui/button';
import { 
  FireExtinguisher, 
  BellRing, 
  CircleDot, 
  Save, 
  ArrowDown, 
  ArrowUp, 
  ArrowLeft, 
  ArrowRight, 
  Undo, 
  Trash2 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Dummy data for saved plans (this would come from the database in a real implementation)
const dummySavedPlans = [
  { id: '1', name: 'Офис 1-й этаж', createdAt: '2025-04-10' },
  { id: '2', name: 'Склад', createdAt: '2025-04-11' },
];

type SensorType = 'fire' | 'security' | 'motion';

interface Sensor {
  id: string;
  type: SensorType;
  x: number;
  y: number;
}

interface FloorPlanElement {
  id: string;
  type: 'wall' | 'door' | 'window';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const TodayActivityPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('draw');
  const [activeElement, setActiveElement] = useState<'wall' | 'door' | 'window' | SensorType | null>(null);
  const [elements, setElements] = useState<FloorPlanElement[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  // Initialize canvas context
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (context) {
      setCtx(context);
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = '#000000';
      context.lineWidth = 2;
    }
  }, []);

  // Redraw everything when elements or sensors change
  useEffect(() => {
    if (!ctx || !canvasRef.current) return;
    
    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Draw walls, doors, windows
    elements.forEach(element => {
      ctx.beginPath();
      ctx.moveTo(element.startX, element.startY);
      ctx.lineTo(element.endX, element.endY);
      
      if (element.type === 'wall') {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 5;
      } else if (element.type === 'door') {
        ctx.strokeStyle = '#964B00';
        ctx.lineWidth = 4;
      } else if (element.type === 'window') {
        ctx.strokeStyle = '#87CEEB';
        ctx.lineWidth = 3;
      }
      
      ctx.stroke();
    });
    
    // Draw sensors
    sensors.forEach(sensor => {
      ctx.beginPath();
      if (sensor.type === 'fire') {
        // Fire sensor (red)
        ctx.fillStyle = '#FF4500';
      } else if (sensor.type === 'security') {
        // Security sensor (blue)
        ctx.fillStyle = '#1E90FF';
      } else {
        // Motion sensor (green)
        ctx.fillStyle = '#32CD32';
      }
      
      ctx.arc(sensor.x, sensor.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  }, [elements, sensors, ctx]);

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!activeElement || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (['wall', 'door', 'window'].includes(activeElement as string)) {
      setIsDrawing(true);
      setStartPoint({ x, y });
    } else if (['fire', 'security', 'motion'].includes(activeElement as string)) {
      // Add sensor immediately
      const newSensor: Sensor = {
        id: Date.now().toString(),
        type: activeElement as SensorType,
        x,
        y
      };
      
      setSensors(prev => [...prev, newSensor]);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint || !canvasRef.current || !ctx) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    // Redraw everything to show the current line being drawn
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Redraw all existing elements
    elements.forEach(element => {
      ctx.beginPath();
      ctx.moveTo(element.startX, element.startY);
      ctx.lineTo(element.endX, element.endY);
      
      if (element.type === 'wall') {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 5;
      } else if (element.type === 'door') {
        ctx.strokeStyle = '#964B00';
        ctx.lineWidth = 4;
      } else if (element.type === 'window') {
        ctx.strokeStyle = '#87CEEB';
        ctx.lineWidth = 3;
      }
      
      ctx.stroke();
    });
    
    // Draw the line currently being drawn
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currentX, currentY);
    
    if (activeElement === 'wall') {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 5;
    } else if (activeElement === 'door') {
      ctx.strokeStyle = '#964B00';
      ctx.lineWidth = 4;
    } else if (activeElement === 'window') {
      ctx.strokeStyle = '#87CEEB';
      ctx.lineWidth = 3;
    }
    
    ctx.stroke();
    
    // Redraw all sensors
    sensors.forEach(sensor => {
      ctx.beginPath();
      if (sensor.type === 'fire') {
        ctx.fillStyle = '#FF4500';
      } else if (sensor.type === 'security') {
        ctx.fillStyle = '#1E90FF';
      } else {
        ctx.fillStyle = '#32CD32';
      }
      
      ctx.arc(sensor.x, sensor.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  };

  const handleCanvasMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint || !activeElement || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    
    // Add the new element
    const newElement: FloorPlanElement = {
      id: Date.now().toString(),
      type: activeElement as 'wall' | 'door' | 'window',
      startX: startPoint.x,
      startY: startPoint.y,
      endX,
      endY
    };
    
    setElements(prev => [...prev, newElement]);
    setIsDrawing(false);
    setStartPoint(null);
  };

  const handleUndo = () => {
    if (elements.length > 0) {
      setElements(prev => prev.slice(0, -1));
    } else if (sensors.length > 0) {
      setSensors(prev => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (window.confirm('Вы уверены, что хотите очистить план?')) {
      setElements([]);
      setSensors([]);
    }
  };

  const handleSave = () => {
    toast.success('План сохранен');
    // In a real app, you would save the canvas data to the backend here
  };

  return (
    <TransitionWrapper className="pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Что я делал сегодня</h1>
        </div>
        
        <Tabs defaultValue="draw" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="draw">Рисование схемы</TabsTrigger>
            <TabsTrigger value="saved">Сохраненные схемы</TabsTrigger>
          </TabsList>
          
          <TabsContent value="draw" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Инструменты</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant={activeElement === 'wall' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setActiveElement('wall')}
                      >
                        <span className="w-4 h-4 bg-black rounded-full mr-2"></span>
                        Стена
                      </Button>
                      <Button 
                        variant={activeElement === 'door' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setActiveElement('door')}
                      >
                        <span className="w-4 h-4 bg-amber-700 rounded-full mr-2"></span>
                        Дверь
                      </Button>
                      <Button 
                        variant={activeElement === 'window' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setActiveElement('window')}
                      >
                        <span className="w-4 h-4 bg-blue-300 rounded-full mr-2"></span>
                        Окно
                      </Button>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-2">Датчики</h3>
                      <div className="grid grid-cols-1 gap-2">
                        <Button 
                          variant={activeElement === 'fire' ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => setActiveElement('fire')}
                        >
                          <FireExtinguisher className="h-4 w-4 mr-2 text-red-500" />
                          Пожарный
                        </Button>
                        <Button 
                          variant={activeElement === 'security' ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => setActiveElement('security')}
                        >
                          <BellRing className="h-4 w-4 mr-2 text-blue-500" />
                          Охранный
                        </Button>
                        <Button 
                          variant={activeElement === 'motion' ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => setActiveElement('motion')}
                        >
                          <CircleDot className="h-4 w-4 mr-2 text-green-500" />
                          Движения
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-2">Действия</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleUndo}
                        >
                          <Undo className="h-4 w-4 mr-1" />
                          Отменить
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleClear}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Очистить
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          className="col-span-2"
                          onClick={handleSave}
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Сохранить
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-3">
                <ContextMenu>
                  <ContextMenuTrigger>
                    <div className="border rounded-lg overflow-hidden bg-white">
                      <canvas 
                        ref={canvasRef}
                        width={800}
                        height={600}
                        className="w-full h-[600px] object-contain cursor-crosshair"
                        onMouseDown={handleCanvasMouseDown}
                        onMouseMove={handleCanvasMouseMove}
                        onMouseUp={handleCanvasMouseUp}
                        onMouseLeave={() => {
                          if (isDrawing) {
                            setIsDrawing(false);
                            setStartPoint(null);
                          }
                        }}
                      />
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem 
                      onClick={() => setActiveElement('wall')}
                    >
                      <span className="w-4 h-4 bg-black rounded-full mr-2"></span>
                      Стена
                    </ContextMenuItem>
                    <ContextMenuItem 
                      onClick={() => setActiveElement('door')}
                    >
                      <span className="w-4 h-4 bg-amber-700 rounded-full mr-2"></span>
                      Дверь
                    </ContextMenuItem>
                    <ContextMenuItem 
                      onClick={() => setActiveElement('window')}
                    >
                      <span className="w-4 h-4 bg-blue-300 rounded-full mr-2"></span>
                      Окно
                    </ContextMenuItem>
                    <ContextMenuItem 
                      onClick={() => setActiveElement('fire')}
                    >
                      <FireExtinguisher className="h-4 w-4 mr-2 text-red-500" />
                      Пожарный датчик
                    </ContextMenuItem>
                    <ContextMenuItem 
                      onClick={() => setActiveElement('security')}
                    >
                      <BellRing className="h-4 w-4 mr-2 text-blue-500" />
                      Охранный датчик
                    </ContextMenuItem>
                    <ContextMenuItem 
                      onClick={() => setActiveElement('motion')}
                    >
                      <CircleDot className="h-4 w-4 mr-2 text-green-500" />
                      Датчик движения
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="saved" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dummySavedPlans.map((plan) => (
                <Card key={plan.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Создан: {new Date(plan.createdAt).toLocaleDateString('ru-RU')}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                      <p className="text-muted-foreground">Предпросмотр схемы</p>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-40">
                          <div className="flex flex-col space-y-1">
                            <Button variant="ghost" size="sm" className="justify-start">
                              <Edit className="h-4 w-4 mr-2" />
                              Изменить
                            </Button>
                            <Button variant="ghost" size="sm" className="justify-start">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Удалить
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TransitionWrapper>
  );
};

export default TodayActivityPage;
