
import React from 'react';
import { dashboardStats, tools, employees } from '@/lib/data';
import { Package, Users, Clock, AlertTriangle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dashboard: React.FC = () => {
  // Get most recent tool activities
  const recentActivity = [...tools]
    .filter(tool => tool.lastCheckedOut)
    .sort((a, b) => {
      if (!a.lastCheckedOut || !b.lastCheckedOut) return 0;
      return new Date(b.lastCheckedOut.date).getTime() - new Date(a.lastCheckedOut.date).getTime();
    })
    .slice(0, 5);

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
    const employee = employees.find(emp => emp.id === id);
    return employee ? employee.name : 'Unknown';
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <div className="space-y-8">
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
          <p className="text-sm text-muted-foreground">Последние выдачи оборудования</p>
        </div>
        <div className="divide-y divide-border">
          {recentActivity.length > 0 ? (
            recentActivity.map((tool) => (
              <div key={tool.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-4 p-2 rounded-lg bg-primary/10">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Выдано: {tool.lastCheckedOut && getEmployeeName(tool.lastCheckedOut.employeeId)}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {tool.lastCheckedOut && formatDate(tool.lastCheckedOut.date)}
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
    </div>
  );
};

export default Dashboard;
