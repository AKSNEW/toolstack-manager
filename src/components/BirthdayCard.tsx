
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Gift, ArrowUp, ArrowDown, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Employee } from '@/lib/types';
import { birthdayConfig } from '@/lib/data/birthdays';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { getZodiacSign } from '@/lib/data/birthdays';

interface BirthdayCardProps {
  employees: Array<Employee & { upcomingBirthday: Date; daysUntil: number }>;
}

const BirthdayCard: React.FC<BirthdayCardProps> = ({ employees }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationDays, setNotificationDays] = useState(birthdayConfig.notificationDaysInAdvance);
  const [showCount, setShowCount] = useState(birthdayConfig.showCount);

  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const formatBirthday = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  };

  const formatAge = (birthDate: string | null, incomingBirthday: Date) => {
    if (!birthDate) return '';
    
    const birthYear = new Date(birthDate).getFullYear();
    const currentYear = incomingBirthday.getFullYear();
    
    // Age at the next birthday
    const age = currentYear - birthYear;
    
    return `${age} ${getYearWord(age)}`;
  };

  const getYearWord = (age: number) => {
    const lastDigit = age % 10;
    const lastTwoDigits = age % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return 'лет';
    }
    
    if (lastDigit === 1) {
      return 'год';
    }
    
    if (lastDigit >= 2 && lastDigit <= 4) {
      return 'года';
    }
    
    return 'лет';
  };

  // Function to get zodiac sign's emoji
  const getZodiacEmoji = (sign: string) => {
    const zodiacEmojis: Record<string, string> = {
      'Овен': '♈',
      'Телец': '♉',
      'Близнецы': '♊',
      'Рак': '♋',
      'Лев': '♌',
      'Дева': '♍',
      'Весы': '♎',
      'Скорпион': '♏',
      'Стрелец': '♐',
      'Козерог': '♑',
      'Водолей': '♒',
      'Рыбы': '♓'
    };
    
    return zodiacEmojis[sign] || '';
  };

  if (!employees || employees.length === 0) {
    return (
      <div className="p-8 text-center">
        <Gift className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
        <h3 className="mt-4 text-lg font-medium">Нет данных о днях рождения</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Добавьте даты рождения сотрудникам, чтобы видеть уведомления о предстоящих праздниках.
        </p>
      </div>
    );
  }

  const currentEmployee = employees[currentIndex];
  const birthDate = currentEmployee?.birthDate ? new Date(currentEmployee.birthDate) : null;
  const zodiacSign = birthDate ? getZodiacSign(birthDate) : '';

  return (
    <div className="px-1 py-3">
      <div className="flex justify-between items-center px-4 mb-3">
        <CardTitle className="text-base flex items-center space-x-2">
          <span>Ближайшие дни рождения</span>
          <span className="text-sm text-muted-foreground font-normal">
            ({employees.length} сотрудников)
          </span>
        </CardTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      
      {showSettings && (
        <div className="px-4 py-3 mb-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-3">Настройки уведомлений</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="notificationDays">Показывать за (дней)</Label>
              <Input 
                id="notificationDays" 
                type="number"
                min="1" 
                max="30"
                value={notificationDays}
                onChange={(e) => setNotificationDays(parseInt(e.target.value) || 7)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="showCount">Количество именинников</Label>
              <Input 
                id="showCount" 
                type="number" 
                min="1"
                max="20"
                value={showCount}
                onChange={(e) => setShowCount(parseInt(e.target.value) || 5)}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Оповещения будут появляться за {notificationDays} дней до дня рождения.
          </p>
        </div>
      )}
      
      <Card className="border-0 shadow-none">
        <CardContent className="pt-4">
          {currentEmployee && (
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                {currentEmployee.avatar && <AvatarImage src={currentEmployee.avatar} alt={currentEmployee.name} />}
                <AvatarFallback className="text-xl">{getInitials(currentEmployee.name)}</AvatarFallback>
              </Avatar>
              
              <h3 className="text-xl font-semibold">{currentEmployee.name}</h3>
              
              <p className="text-sm text-muted-foreground mt-1">
                {currentEmployee.position && (
                  <span className="block">{currentEmployee.position}</span>
                )}
                {currentEmployee.department && (
                  <span className="block">{currentEmployee.department}</span>
                )}
              </p>
              
              <div className="mt-5 space-y-3">
                <div className="flex flex-col items-center">
                  <span className="text-sm text-muted-foreground">День рождения</span>
                  <span className="text-lg font-medium">{formatBirthday(currentEmployee.upcomingBirthday)}</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <span className="text-sm text-muted-foreground">Исполнится</span>
                  <span className="text-lg font-medium">
                    {formatAge(currentEmployee.birthDate, currentEmployee.upcomingBirthday)}
                  </span>
                </div>
                
                {zodiacSign && (
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-muted-foreground">Знак зодиака</span>
                    <span className="text-lg font-medium">
                      {getZodiacEmoji(zodiacSign)} {zodiacSign}
                    </span>
                  </div>
                )}
                
                <div className="flex flex-col items-center">
                  <span className="text-sm text-muted-foreground">Осталось дней</span>
                  <span className={cn(
                    "text-lg font-medium", 
                    currentEmployee.daysUntil <= 3 ? "text-red-500" : 
                    currentEmployee.daysUntil <= 7 ? "text-amber-500" : ""
                  )}>
                    {currentEmployee.daysUntil}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between pt-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentIndex(prev => (prev > 0 ? prev - 1 : employees.length - 1))}
            disabled={employees.length <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="text-xs text-muted-foreground">
            {currentIndex + 1} из {employees.length}
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentIndex(prev => (prev < employees.length - 1 ? prev + 1 : 0))}
            disabled={employees.length <= 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      
      {employees.length > 1 && (
        <div className="px-4 mt-4">
          <h4 className="text-sm font-medium mb-2">Все ближайшие дни рождения</h4>
          <div className="space-y-2">
            {employees.map((emp, index) => (
              <div 
                key={emp.id} 
                className={cn(
                  "flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent",
                  index === currentIndex && "bg-accent"
                )}
                onClick={() => setCurrentIndex(index)}
              >
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    {emp.avatar && <AvatarImage src={emp.avatar} alt={emp.name} />}
                    <AvatarFallback className="text-xs">{getInitials(emp.name)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{emp.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    {formatBirthday(emp.upcomingBirthday)}
                  </span>
                  <span className={cn(
                    "text-xs font-medium", 
                    emp.daysUntil <= 3 ? "text-red-500" : 
                    emp.daysUntil <= 7 ? "text-amber-500" : "text-muted-foreground"
                  )}>
                    {emp.daysUntil} д.
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BirthdayCard;
