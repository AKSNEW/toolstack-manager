
import React from 'react';
import { Employee } from '@/lib/types';
import { Calendar, Gift, CalendarDays } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface BirthdayCardProps {
  employees: Array<Employee & { upcomingBirthday: Date; daysUntil: number }>;
}

const BirthdayCard: React.FC<BirthdayCardProps> = ({ employees }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', { 
      day: 'numeric', 
      month: 'long'
    }).format(date);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('');
  };

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="px-6 py-5 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Дни рождения</h2>
          <p className="text-sm text-muted-foreground">Ближайшие праздники</p>
        </div>
        <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
          <Gift className="h-5 w-5" />
        </div>
      </div>
      
      <div className="divide-y divide-border">
        {employees.length > 0 ? (
          employees.map((employee) => (
            <div key={employee.id} className="px-6 py-4 flex items-center justify-between hover:bg-accent/10 transition-colors">
              <div className="flex items-center">
                <Avatar className="mr-4 h-10 w-10 border-2 border-white shadow">
                  <AvatarImage src={employee.avatar} alt={employee.name} />
                  <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{employee.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    <span>{formatDate(employee.upcomingBirthday)}</span>
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center ${
                employee.daysUntil <= 7
                  ? 'bg-red-50 text-red-600'
                  : employee.daysUntil <= 30
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-green-50 text-green-600'
              }`}>
                <CalendarDays className="h-3 w-3 mr-1" />
                {employee.daysUntil === 0
                  ? 'Сегодня!'
                  : employee.daysUntil === 1
                  ? 'Завтра'
                  : `Через ${employee.daysUntil} ${
                      employee.daysUntil < 5 ? 'дня' : 'дней'
                    }`}
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-8 text-center">
            <p className="text-muted-foreground">Нет ближайших дней рождения</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthdayCard;
