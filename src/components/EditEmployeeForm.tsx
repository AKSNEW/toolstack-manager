
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Employee } from '@/lib/data';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Имя должно содержать не менее 2 символов',
  }),
  position: z.string().min(2, {
    message: 'Укажите должность',
  }),
  department: z.string().min(1, {
    message: 'Выберите отдел',
  }),
  email: z.string().email({
    message: 'Введите корректный email',
  }),
  phone: z.string().min(5, {
    message: 'Введите корректный номер телефона',
  }),
  avatar: z.string().url({
    message: 'Введите корректный URL изображения',
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface EditEmployeeFormProps {
  employee: Employee;
  onEditEmployee: (id: string, updatedEmployee: Omit<Employee, 'id' | 'activeRentals' | 'rentalHistory'>) => void;
  onCancel: () => void;
  departments: string[];
}

const EditEmployeeForm = ({ employee, onEditEmployee, onCancel, departments }: EditEmployeeFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: employee.name,
      position: employee.position,
      department: employee.department,
      email: employee.email,
      phone: employee.phone,
      avatar: employee.avatar,
    },
  });

  const onSubmit = (values: FormValues) => {
    try {
      onEditEmployee(employee.id, {
        name: values.name,
        position: values.position,
        department: values.department,
        email: values.email,
        phone: values.phone,
        avatar: values.avatar,
      });
      
      toast({
        title: 'Профиль обновлен',
        description: `Данные сотрудника "${values.name}" успешно обновлены`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить данные сотрудника',
        variant: 'destructive',
      });
    }
  };

  return (
    <ScrollArea className="max-h-[80vh]">
      <div className="p-1 sm:p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ФИО</FormLabel>
                  <FormControl>
                    <Input placeholder="Иванов Иван Иванович" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Должность</FormLabel>
                  <FormControl>
                    <Input placeholder="Старший инженер" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Отдел</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      {...field}
                    >
                      <option value="" disabled>Выберите отдел</option>
                      {departments.map(department => (
                        <option key={department} value={department}>{department}</option>
                      ))}
                      <option value="New Department">Другой отдел</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="ivan@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <Input placeholder="+7 (123) 456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL фотографии</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex flex-wrap justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">Отменить</Button>
              <Button type="submit" className="w-full sm:w-auto">Сохранить изменения</Button>
            </div>
          </form>
        </Form>
      </div>
    </ScrollArea>
  );
};

export default EditEmployeeForm;
