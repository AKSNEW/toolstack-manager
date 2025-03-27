
import React from 'react';
import { useForm } from 'react-hook-form';
import { sites, crews } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Create a schema for form validation
const formSchema = z.object({
  name: z.string().min(3, { message: 'Название должно содержать минимум 3 символа' }),
  address: z.string().min(5, { message: 'Адрес должен содержать минимум 5 символов' }),
  status: z.enum(['planning', 'active', 'completed']),
  crewId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().min(10, { message: 'Описание должно содержать минимум 10 символов' }),
});

type FormData = z.infer<typeof formSchema>;

interface AddSiteFormProps {
  onSuccess: () => void;
}

const AddSiteForm = ({ onSuccess }: AddSiteFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      address: '',
      status: 'planning',
      crewId: '',
      startDate: '',
      endDate: '',
      description: '',
    },
  });

  const { control, handleSubmit, formState: { isSubmitting }, watch } = form;
  
  const selectedStatus = watch('status');

  const onSubmit = async (data: FormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new site
      const newSite = {
        id: `s${sites.length + 1}`,
        name: data.name,
        address: data.address,
        status: data.status,
        crewId: data.crewId || undefined,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
        description: data.description,
      };
      
      // Add to the sites array (in a real app, this would be an API call)
      sites.push(newSite);
      
      toast.success('Объект успешно создан');
      onSuccess();
    } catch (error) {
      toast.error('Ошибка при создании объекта');
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
              <FormLabel>Название объекта</FormLabel>
              <FormControl>
                <Input placeholder="Название объекта" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Адрес</FormLabel>
              <FormControl>
                <Input placeholder="Адрес объекта" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Статус объекта</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус объекта" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="planning">Планирование</SelectItem>
                  <SelectItem value="active">Активный</SelectItem>
                  <SelectItem value="completed">Завершен</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="crewId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Назначенная бригада</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите бригаду (необязательно)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {crews.map(crew => (
                    <SelectItem key={crew.id} value={crew.id}>
                      {crew.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Дата начала</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Предполагаемая дата завершения</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание объекта</FormLabel>
              <FormControl>
                <Textarea placeholder="Введите описание объекта" className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Отмена
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Создание...' : 'Создать объект'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddSiteForm;
