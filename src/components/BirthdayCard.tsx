
import React from 'react';
import { Employee } from '@/lib/types';
import { Calendar, Gift, CalendarDays } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  
  const getZodiacSign = (date: Date | undefined) => {
    if (!date) return "?"; // Safe check for undefined date
    
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
  
  const getZodiacName = (date: Date | undefined) => {
    if (!date) return "Неизвестно"; // Safe check for undefined date
    
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

  // Расчет возраста сотрудника
  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;
    
    const today = new Date();
    const dob = new Date(birthDate);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
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
                  <span>{employee.upcomingBirthday ? formatDate(employee.upcomingBirthday) : 'Дата не указана'}</span>
                  {employee.upcomingBirthday && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="mx-1.5 text-lg cursor-help">
                            {getZodiacSign(employee.upcomingBirthday)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{getZodiacName(employee.upcomingBirthday)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {employee.birthDate && (
                    <span className="ml-2 text-xs bg-gray-100 rounded-full px-2 py-0.5">
                      {calculateAge(employee.birthDate)} лет
                    </span>
                  )}
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
  );
};

export default BirthdayCard;
