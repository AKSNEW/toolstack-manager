
import React from 'react';
import { useForm } from 'react-hook-form';
import { employees, crews } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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

  const onSubmit = async (data: FormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new crew
      const newCrew = {
        id: `c${crews.length + 1}`,
        name: data.name,
        foreman: data.foreman,
        supervisor: data.supervisor,
        members: [...data.members, data.foreman], // Include foreman in members
        subCrews: [], // Add the missing subCrews property as an empty array
      };
      
      // Add to the crews array (in a real app, this would be an API call)
      crews.push(newCrew);
      
      toast.success('Бригада успешно создана');
      onSuccess();
    } catch (error) {
      toast.error('Ошибка при создании бригады');
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
                  {employees
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
                  {employees
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
                {employees
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

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Отмена
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Создание...' : 'Создать бригаду'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddCrewForm;
