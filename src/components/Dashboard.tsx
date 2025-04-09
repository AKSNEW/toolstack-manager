import React, { useState, useEffect } from 'react';
import { dashboardStats, tools } from '@/lib/data';
import { fetchBirthdays } from '@/lib/data/birthdays';
import { fetchTodos } from '@/lib/data/todos';
import { fetchSites } from '@/lib/data/sites';
import { Package, Users, Clock, AlertTriangle, Check, Gift, ChevronDown, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import BirthdayCard from './BirthdayCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Employee, Site, Todo } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Dashboard: React.FC = () => {
  const [isBirthdayOpen, setIsBirthdayOpen] = useState(false);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<Array<Employee & { upcomingBirthday: Date; daysUntil: number }>>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [recentTodos, setRecentTodos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Load birthdays from database
        const birthdays = await fetchBirthdays();
        setUpcomingBirthdays(birthdays);

        // Load recent site activity
        const sites = await fetchSites();
        
        // Load recent todos
        const todos = await fetchTodos();
        
        // Combine recent activities
        const combinedActivity = [
          ...sites.map(site => ({
            type: 'site',
            id: site.id,
            name: site.name,
            status: site.status,
            date: site.startDate || new Date().toISOString(),
            address: site.address,
          })),
          ...todos.map(todo => ({
            type: 'todo',
            id: todo.id,
            title: todo.title,
            status: todo.status,
            date: todo.createdAt,
            siteId: todo.siteId,
            siteName: (todo as any).siteName,
            assigneeName: (todo as any).assigneeName,
            assigneeAvatar: (todo as any).assigneeAvatar,
          }))
        ]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);
        
        setRecentActivity(combinedActivity);
        
        // Filter todo activities
        setRecentTodos(combinedActivity.filter(item => item.type === 'todo').slice(0, 5));

        // Load tool activities
        const toolActivities = [...tools]
          .filter(tool => tool.lastCheckedOut)
          .sort((a, b) => {
            if (!a.lastCheckedOut || !b.lastCheckedOut) return 0;
            return new Date(b.lastCheckedOut.date).getTime() - new Date(a.lastCheckedOut.date).getTime();
          })
          .slice(0, 5);

        // Update recent activity with tool activities
        setRecentActivity(prevActivity => {
          const combined = [
            ...prevActivity,
            ...toolActivities.map(tool => ({
              type: 'tool',
              id: tool.id,
              name: tool.name,
              date: tool?.lastCheckedOut?.date,
              employeeId: tool?.lastCheckedOut?.employeeId
            }))
          ];
          
          return combined
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10);
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Всего инструментов',
      value: dashboardStats.totalTools,
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Доступно',
      value: dashboardStats.availableTools,
      icon: Check,
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Используется',
      value: dashboardStats.inUseTools,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'В ремонте',
      value: dashboardStats.maintenanceTools,
      icon: AlertTriangle,
      color: 'bg-red-50 text-red-600',
    },
    {
      title: 'Всего сотрудников',
      value: dashboardStats.totalEmployees,
      icon: Users,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Активные заказы',
      value: dashboardStats.activeRentals,
      icon: Clock,
      color: 'bg-indigo-50 text-indigo-600',
    },
  ];

  const getEmployeeName = (id: string) => {
    try {
      const employee = require('./data/employees').employees.find((emp: any) => emp.id === id);
      return employee ? employee.name : 'Unknown';
    } catch {
      return 'Unknown';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  const getActivityLabel = (activity: any) => {
    if (activity.type === 'site') {
      if (activity.status === 'planning') return 'Новый объект в планировании';
      if (activity.status === 'active') return 'Объект активирован';
      if (activity.status === 'completed') return 'Объект завершен';
      return 'Обновление объекта';
    }
    
    if (activity.type === 'todo') {
      if (activity.status === 'pending') return 'Новая задача создана';
      if (activity.status === 'in-progress') return 'Задача в работе';
      if (activity.status === 'completed') return 'Задача завершена';
      return 'Обновление задачи';
    }
    
    if (activity.type === 'tool') {
      return 'Выдача инструмента';
    }
    
    return 'Активность';
  };

  const getActivityIcon = (activity: any) => {
    if (activity.type === 'todo') return List;
    if (activity.type === 'site') return Package;
    return Package;
  };

  const getActivityColor = (activity: any) => {
    if (activity.type === 'site') return 'bg-blue-50 text-blue-600';
    if (activity.type === 'todo') {
      if (activity.status === 'pending') return 'bg-amber-50 text-amber-600';
      if (activity.status === 'in-progress') return 'bg-purple-50 text-purple-600';
      if (activity.status === 'completed') return 'bg-green-50 text-green-600';
      return 'bg-gray-50 text-gray-600';
    }
    return 'bg-primary/10 text-primary';
  };

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-8">
      {/* Дни рождения как выпадающий список */}
      <div className="glass rounded-xl overflow-hidden">
        <DropdownMenu open={isBirthdayOpen} onOpenChange={setIsBirthdayOpen}>
          <DropdownMenuTrigger asChild>
            <div className="px-6 py-5 border-b border-border flex items-center justify-between cursor-pointer hover:bg-accent/10 transition-colors">
              <div>
                <h2 className="text-lg font-semibold">Дни рождения</h2>
                <p className="text-sm text-muted-foreground">Ближайшие праздники</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                  <Gift className="h-5 w-5" />
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${isBirthdayOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[500px] p-0 bg-popover">
            <BirthdayCard employees={upcomingBirthdays} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div 
            key={index}
            className="glass rounded-xl p-6 transition-all card-hover"
          >
            <div className="flex items-center">
              <div className={cn("p-3 rounded-lg mr-4", stat.color)}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-lg font-semibold">Недавняя активность</h2>
          <p className="text-sm text-muted-foreground">Последние события в системе</p>
        </div>
        <div className="divide-y divide-border">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={`${activity.type}-${activity.id}`} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`mr-4 p-2 rounded-lg ${getActivityColor(activity)}`}>
                    {React.createElement(getActivityIcon(activity), { className: "h-5 w-5" })}
                  </div>
                  <div>
                    <h3 className="font-medium">{getActivityLabel(activity)}</h3>
                    <p className="text-sm text-muted-foreground">
                      {activity.type === 'site' && (
                        <>Объект: {activity.name}</>
                      )}
                      {activity.type === 'todo' && (
                        <>
                          {activity.title}
                          {activity.siteName && <> | Объект: {activity.siteName}</>}
                        </>
                      )}
                      {activity.type === 'tool' && (
                        <>Выдано: {getEmployeeName(activity.employeeId)}</>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {activity.type === 'todo' && activity.assigneeName && (
                    <Avatar className="h-8 w-8">
                      {activity.assigneeAvatar && <AvatarImage src={activity.assigneeAvatar} alt={activity.assigneeName} />}
                      <AvatarFallback>{getInitials(activity.assigneeName)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="text-sm text-muted-foreground">
                    {activity.date && formatDate(activity.date)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-muted-foreground">Нет недавней активности</p>
            </div>
          )}
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Задачи</h2>
            <p className="text-sm text-muted-foreground">Последние обновления по задачам</p>
          </div>
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <List className="h-5 w-5" />
          </div>
        </div>
        <div className="divide-y divide-border">
          {recentTodos.length > 0 ? (
            recentTodos.map((todo) => (
              <div key={todo.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    todo.status === 'completed' ? 'bg-green-500' : 
                    todo.status === 'in-progress' ? 'bg-amber-500' : 
                    'bg-red-500'
                  }`}></div>
                  <div>
                    <h3 className="font-medium">{todo.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {todo.siteName && <>Объект: {todo.siteName}</>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {todo.assigneeName && (
                    <Avatar className="h-7 w-7">
                      {todo.assigneeAvatar && <AvatarImage src={todo.assigneeAvatar} alt={todo.assigneeName} />}
                      <AvatarFallback>{getInitials(todo.assigneeName)}</AvatarFallback>
                    </Avatar>
                  )}
                  <span className="text-xs px-2 py-1 rounded-full font-medium bg-opacity-10 
                    ${todo.status === 'completed' ? 'bg-green-100 text-green-600' : 
                    todo.status === 'in-progress' ? 'bg-amber-100 text-amber-600' : 
                    'bg-blue-100 text-blue-600'}">
                    {todo.status === 'completed' ? 'Завершена' : 
                     todo.status === 'in-progress' ? 'В работе' : 
                     'Ожидает'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-muted-foreground">Нет задач</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
