
import { Employee } from '../types';
import { employees } from './employees';

// Функция для получения ближайших дней рождения сотрудников
export const getUpcomingBirthdays = () => {
  const today = new Date();
  
  // Создаем массив сотрудников с датами предстоящих дней рождения в этом году
  const employeesWithUpcomingBirthdays = employees
    .filter(employee => employee.birthDate)
    .map(employee => {
      const birthDate = new Date(employee.birthDate!);
      const thisYearBirthday = new Date(
        today.getFullYear(),
        birthDate.getMonth(),
        birthDate.getDate()
      );
      
      // Если день рождения уже прошел в этом году, рассчитываем дату на следующий год
      if (thisYearBirthday < today) {
        thisYearBirthday.setFullYear(today.getFullYear() + 1);
      }
      
      const daysUntil = Math.ceil(
        (thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      return {
        ...employee,
        upcomingBirthday: thisYearBirthday,
        daysUntil
      };
    })
    // Сортируем по близости даты дня рождения
    .sort((a, b) => a.daysUntil - b.daysUntil)
    // Берем только ближайшие 3 дня рождения
    .slice(0, 3);
    
  return employeesWithUpcomingBirthdays;
};
