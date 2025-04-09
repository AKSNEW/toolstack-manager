
import { supabase } from '@/integrations/supabase/client';
import { Employee } from '@/lib/types';

// Get upcoming birthdays from database
export async function fetchBirthdays(): Promise<Array<Employee & { upcomingBirthday: Date; daysUntil: number }>> {
  try {
    // Get current date components
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed
    const currentDay = today.getDate();
    
    // Query employees with birthdays in the next 30 days
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .not('birth_date', 'is', null) as any;
    
    if (error) {
      console.error('Error fetching birthdays:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Filter and sort employees by upcoming birthdays
    const employeesWithBirthdays = data
      .filter((emp: any) => emp.birth_date)
      .map((emp: any) => {
        const birthDate = new Date(emp.birth_date);
        const birthMonth = birthDate.getMonth() + 1;
        const birthDay = birthDate.getDate();
        
        // Calculate days until next birthday
        let daysUntilBirthday;
        if (birthMonth > currentMonth || (birthMonth === currentMonth && birthDay >= currentDay)) {
          // Birthday is later this year
          const nextBirthday = new Date(today.getFullYear(), birthMonth - 1, birthDay);
          daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        } else {
          // Birthday is next year
          const nextBirthday = new Date(today.getFullYear() + 1, birthMonth - 1, birthDay);
          daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        }

        // Create the upcoming birthday date object
        const upcomingBirthday = new Date(
          birthMonth > currentMonth || (birthMonth === currentMonth && birthDay >= currentDay)
            ? today.getFullYear()
            : today.getFullYear() + 1,
          birthMonth - 1,
          birthDay
        );
        
        return {
          ...emp,
          id: emp.id,
          name: emp.name,
          position: emp.position,
          department: emp.department,
          email: emp.email,
          phone: emp.phone,
          avatar: emp.avatar,
          birthDate: emp.birth_date,
          upcomingBirthday,
          daysUntilBirthday
        };
      })
      .filter((emp: any) => emp.daysUntilBirthday <= 30) // Only show birthdays in the next 30 days
      .sort((a: any, b: any) => a.daysUntilBirthday - b.daysUntilBirthday);
    
    return employeesWithBirthdays;
  } catch (error) {
    console.error('Error in fetchBirthdays:', error);
    return [];
  }
}

// Get upcoming birthdays (fallback for mock data)
export function getUpcomingBirthdays(): Array<Employee & { upcomingBirthday: Date; daysUntil: number }> {
  const employees = require('./employees').employees;
  
  // Get today's date
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();
  
  // Filter employees who have birthdays in the next 30 days
  return employees
    .filter(emp => emp.birthDate)
    .map(emp => {
      const birthDate = new Date(emp.birthDate as string);
      const birthMonth = birthDate.getMonth();
      const birthDay = birthDate.getDate();
      
      // Calculate days until next birthday
      let daysUntilBirthday;
      if (birthMonth > currentMonth || (birthMonth === currentMonth && birthDay >= currentDay)) {
        // Birthday is later this year
        const nextBirthday = new Date(today.getFullYear(), birthMonth, birthDay);
        daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      } else {
        // Birthday is next year
        const nextBirthday = new Date(today.getFullYear() + 1, birthMonth, birthDay);
        daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      }

      // Create the upcoming birthday date object
      const upcomingBirthday = new Date(
        birthMonth > currentMonth || (birthMonth === currentMonth && birthDay >= currentDay)
          ? today.getFullYear()
          : today.getFullYear() + 1,
        birthMonth,
        birthDay
      );
      
      return {
        ...emp,
        upcomingBirthday,
        daysUntil: daysUntilBirthday
      };
    })
    .filter(emp => emp.daysUntil <= 30)
    .sort((a, b) => a.daysUntil - b.daysUntil);
}
