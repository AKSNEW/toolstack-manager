
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { employees } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { Employee } from '@/lib/types';

// Create a schema for form validation
const formSchema = z.object({
  name: z.string().min(3, { message: 'Название должно содержать минимум 3 символа' }),
  foreman: z.string().min(1, { message: 'Необходимо выбрать бригадира' }),
  supervisor: z.string().min(1, { message: 'Необходимо выбрать ГИПа' }),
  members: z.array(z.string()).min(1, { message: 'Необходимо выбрать хотя бы одного члена бригады' }),
});

type FormData = z.infer<typeof formSchema>;

interface AddCrewFormProps {
  onSuccess: () => void;
}

const AddCrewForm = ({ onSuccess }: AddCrewFormProps) => {
  const [dbEmployees, setDbEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      foreman: '',
      supervisor: '',
      members: [],
    },
  });

  const { control, register, handleSubmit, formState: { errors, isSubmitting }, watch } = form;
  
  const selectedForeman = watch('foreman');
  const selectedSupervisor = watch('supervisor');

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('employees')
          .select('*');
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Преобразуем данные из БД в формат Employee
          const formattedEmployees = data.map((emp): Employee => ({
            id: emp.id,
            name: emp.name,
            position: emp.position,
            department: emp.department,
            email: emp.email,
            phone: emp.phone,
            avatar: emp.avatar
          }));
          setDbEmployees(formattedEmployees);
        } else {
          // Если в БД нет данных, используем моковые данные
          setDbEmployees(employees);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        setDbEmployees(employees);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployees();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      // Create a new crew in Supabase
      const { data: newCrew, error } = await supabase
        .from('crews')
        .insert({
          name: data.name,
          foreman: data.foreman,
          supervisor: data.supervisor,
          members: [...data.members, data.foreman], // Include foreman in members
          subcrews: [], // Add the subcrews property as an empty array
        })
        .select();
      
      if (error) throw error;
      
      toast.success('Бригада успешно создана');
      onSuccess();
    } catch (error: any) {
      toast.error('Ошибка при создании бригады: ' + error.message);
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название бригады</FormLabel>
              <FormControl>
                <Input placeholder="Название бригады" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <span className="ml-2 text-sm">Загрузка сотрудников...</span>
          </div>
        ) : (
          <>
            <FormField
              control={control}
              name="foreman"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Бригадир</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите бригадира" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dbEmployees
                        .filter(e => e.id !== selectedSupervisor)
                        .map(employee => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="supervisor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ГИП (Главный инженер проекта)</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите ГИПа" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dbEmployees
                        .filter(e => e.id !== selectedForeman)
                        .map(employee => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="members"
              render={() => (
                <FormItem>
                  <FormLabel>Члены бригады</FormLabel>
                  <div className="space-y-2">
                    {dbEmployees
                      .filter(e => e.id !== selectedForeman && e.id !== selectedSupervisor)
                      .map(employee => (
                        <div key={employee.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`member-${employee.id}`}
                            value={employee.id}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                            {...register('members')}
                          />
                          <label htmlFor={`member-${employee.id}`} className="text-sm">
                            {employee.name} - {employee.position}
                          </label>
                        </div>
                      ))}
                  </div>
                  {errors.members && (
                    <p className="text-sm font-medium text-destructive">{errors.members.message}</p>
                  )}
                </FormItem>
              )}
            />
          </>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Отмена
          </Button>
          <Button type="submit" disabled={isSubmitting || isLoading}>
            {isSubmitting ? 'Создание...' : 'Создать бригаду'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddCrewForm;
