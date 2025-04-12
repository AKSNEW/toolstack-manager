
import { Employee } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { employees as localEmployees } from './employees';

const getNextBirthday = (birthDate: string | null): { upcomingBirthday: Date, daysUntil: number } | null => {
  if (!birthDate) return null;
  
  const today = new Date();
  const currentYear = today.getFullYear();
  
  // Parse the birth date
  const [year, month, day] = birthDate.split('-').map(Number);
  
  // Create date for this year's birthday
  const thisYearBirthday = new Date(currentYear, month - 1, day);
  
  // Create date for next year's birthday
  const nextYearBirthday = new Date(currentYear + 1, month - 1, day);
  
  // Determine which birthday to use (this year if not passed, next year if passed)
  const upcomingBirthday = thisYearBirthday < today ? nextYearBirthday : thisYearBirthday;
  
  // Calculate days until next birthday
  const timeDiff = upcomingBirthday.getTime() - today.getTime();
  const daysUntil = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  return { upcomingBirthday, daysUntil };
};

// Get employee's zodiac sign
export const getZodiacSign = (date: Date | null): string => {
  if (!date) return '';
  
  const day = date.getDate();
  const month = date.getMonth() + 1;
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Овен';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Телец';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Близнецы';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Рак';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Лев';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Дева';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Весы';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Скорпион';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Стрелец';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Козерог';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Водолей';
  return 'Рыбы';
};

export async function fetchBirthdays(limit: number = 5): Promise<Array<Employee & { upcomingBirthday: Date; daysUntil: number }>> {
  try {
    // Attempt to fetch from the database
    const { data, error } = await supabase
      .from('employees' as any)
      .select('*')
      .not('birth_date', 'is', null) as any;
    
    if (error) {
      console.error('Error fetching birthdays from database:', error);
      // Fall back to local data
      return getUpcomingBirthdaysFromLocal(limit);
    }
    
    if (!data || data.length === 0) {
      // No data in database or no employees with birthdays
      return getUpcomingBirthdaysFromLocal(limit);
    }
    
    const employeesWithBirthdays = data
      .map((emp: any) => {
        const birthDate = emp.birth_date;
        const nextBirthday = getNextBirthday(birthDate);
        
        if (!nextBirthday) return null;
        
        return {
          id: emp.id,
          name: emp.name,
          position: emp.position,
          department: emp.department,
          email: emp.email,
          phone: emp.phone,
          avatar: emp.avatar,
          birthDate: emp.birth_date,
          ...nextBirthday
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => a.daysUntil - b.daysUntil);
    
    return employeesWithBirthdays.slice(0, limit);
  } catch (error) {
    console.error('Error in fetchBirthdays:', error);
    return getUpcomingBirthdaysFromLocal(limit);
  }
}

function getUpcomingBirthdaysFromLocal(limit: number = 5): Array<Employee & { upcomingBirthday: Date; daysUntil: number }> {
  // Use the local employees data as fallback
  return localEmployees
    .map(emp => {
      const nextBirthday = getNextBirthday(emp.birthDate || null);
      
      if (!nextBirthday) return null;
      
      return {
        ...emp,
        ...nextBirthday
      };
    })
    .filter(Boolean)
    .sort((a, b) => a!.daysUntil - b!.daysUntil)
    .slice(0, limit);
}

// For demonstration, we'll also export a config for the birthdays visibility setting
export const birthdayConfig = {
  notificationDaysInAdvance: 7,
  showCount: 5
};
