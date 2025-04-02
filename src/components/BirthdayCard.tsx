
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
  
  const getZodiacSign = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1; // JavaScript months are 0-based
    
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "♒︎"; // Aquarius
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "♓︎"; // Pisces
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "♈︎"; // Aries
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "♉︎"; // Taurus
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "♊︎"; // Gemini
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "♋︎"; // Cancer
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "♌︎"; // Leo
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "♍︎"; // Virgo
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "♎︎"; // Libra
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "♏︎"; // Scorpio
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "♐︎"; // Sagittarius
    return "♑︎"; // Capricorn
  };
  
  const getZodiacName = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1; // JavaScript months are 0-based
    
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Водолей"; // Aquarius
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Рыбы"; // Pisces
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Овен"; // Aries
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Телец"; // Taurus
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Близнецы"; // Gemini
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Рак"; // Cancer
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Лев"; // Leo
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Дева"; // Virgo
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Весы"; // Libra
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Скорпион"; // Scorpio
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Стрелец"; // Sagittarius
    return "Козерог"; // Capricorn
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
                    <span className="mx-1.5 text-lg" title={getZodiacName(employee.upcomingBirthday)}>
                      {getZodiacSign(employee.upcomingBirthday)}
                    </span>
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
