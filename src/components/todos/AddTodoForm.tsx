
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { employees } from '@/lib/data/employees';
import { useAuth } from '@/context/AuthContext';
import { createTodo } from '@/lib/data/todos';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const todoSchema = z.object({
  title: z.string().min(3, 'Введите название задачи (минимум 3 символа)'),
  description: z.string().optional(),
  status: z.enum(['pending', 'in-progress', 'completed']).default('pending'),
  dueDate: z.date().optional(),
  assignedTo: z.string().optional(),
});

type TodoFormValues = z.infer<typeof todoSchema>;

interface AddTodoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  siteId?: string;
  siteName?: string;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  siteId,
  siteName
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const form = useForm<TodoFormValues>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'pending',
      dueDate: undefined,
      assignedTo: undefined,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        title: '',
        description: '',
        status: 'pending',
        dueDate: undefined,
        assignedTo: undefined,
      });
    }
  }, [isOpen, form]);

  const onSubmit = async (data: TodoFormValues) => {
    if (!user) {
      toast.error('Необходимо авторизоваться');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create todo in the database
      const result = await createTodo({
        title: data.title,
        description: data.description || '',
        status: data.status,
        dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
        assignedTo: data.assignedTo,
        siteId: siteId,
        createdBy: user.id,
      });

      if (result) {
        toast.success('Задача успешно создана');
        form.reset();
        onSuccess();
        onClose();
      } else {
        toast.error('Ошибка при создании задачи');
      }
    } catch (error) {
      console.error('Error creating todo:', error);
      toast.error('Ошибка при создании задачи');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Создать задачу</DialogTitle>
          <DialogDescription>
            Заполните форму для создания новой задачи
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {siteName && (
              <div className="bg-muted p-3 rounded-md text-sm">
                Объект: <span className="font-medium">{siteName}</span>
              </div>
            )}
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название задачи</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите название задачи" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Введите описание задачи" 
                      {...field} 
                      value={field.value || ''} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Статус</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите статус" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Ожидает</SelectItem>
                        <SelectItem value="in-progress">В работе</SelectItem>
                        <SelectItem value="completed">Завершена</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ответственный</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите ответственного" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees.map(employee => (
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
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Срок выполнения</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Выберите дату</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={onClose}>
                Отмена
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Создание...
                  </>
                ) : (
                  'Создать задачу'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTodoForm;
