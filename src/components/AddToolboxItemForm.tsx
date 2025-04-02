
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { toolboxCategories } from '@/lib/data/toolbox';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Название должно содержать не менее 2 символов',
  }),
  category: z.string().min(1, {
    message: 'Выберите категорию',
  }),
  price: z.number().positive({
    message: 'Цена должна быть положительным числом',
  }),
  image: z.string().url({
    message: 'Введите корректный URL изображения',
  }),
  description: z.string().min(5, {
    message: 'Описание должно содержать не менее 5 символов',
  }),
  link: z.string().url({
    message: 'Введите корректный URL ссылки',
  }).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

interface AddToolboxItemFormProps {
  onSuccess: () => void;
}

const AddToolboxItemForm = ({ onSuccess }: AddToolboxItemFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category: '',
      price: 0,
      image: 'https://images.unsplash.com/photo-1586864387789-628af9feed72',
      description: '',
      link: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    try {
      // В реальном приложении здесь был бы API-запрос
      console.log('Submitted toolbox item:', values);
      
      toast({
        title: 'Инструмент добавлен',
        description: `Инструмент "${values.name}" успешно добавлен`,
      });
      
      onSuccess();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить инструмент',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input placeholder="Дрель аккумуляторная Makita" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Категория</FormLabel>
              <FormControl>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...field}
                >
                  <option value="" disabled>Выберите категорию</option>
                  {toolboxCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Стоимость (₽)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="12000" 
                  {...field} 
                  onChange={e => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL изображения</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
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
                <Textarea placeholder="Описание инструмента..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ссылка на товар (необязательно)</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit">Добавить</Button>
        </div>
      </form>
    </Form>
  );
};

export default AddToolboxItemForm;
