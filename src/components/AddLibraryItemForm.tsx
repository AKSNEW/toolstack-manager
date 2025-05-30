
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { createLibraryItem } from '@/services/libraryService';
import { LibraryItem } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Название должно содержать не менее 2 символов',
  }),
  type: z.enum(['book', 'instruction', 'standard'], {
    required_error: 'Выберите тип материала',
  }),
  author: z.string().optional(),
  year: z.string().optional(),
  description: z.string().min(5, {
    message: 'Описание должно содержать не менее 5 символов',
  }),
  externalLink: z.string().url({
    message: 'Введите корректный URL ссылки',
  }).optional().or(z.literal('')),
  fileUrl: z.string().url({
    message: 'Введите корректный URL файла',
  }).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

interface AddLibraryItemFormProps {
  onSuccess: (item: LibraryItem) => void;
}

const AddLibraryItemForm = ({ onSuccess }: AddLibraryItemFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: 'book',
      author: '',
      year: '',
      description: '',
      externalLink: '',
      fileUrl: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: 'Ошибка',
        description: 'Необходимо авторизоваться для добавления материалов',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const newLibraryItem: Omit<LibraryItem, 'id'> = {
        name: values.name,
        type: values.type,
        author: values.author || undefined,
        year: values.year || undefined,
        description: values.description,
        externalLink: values.externalLink || undefined,
        fileUrl: values.fileUrl || undefined,
        authorId: user.id,
        createdAt: new Date().toISOString(),
      };
      
      const createdItem = await createLibraryItem(newLibraryItem);
      
      toast({
        title: 'Материал добавлен',
        description: `Материал "${values.name}" успешно добавлен`,
      });
      
      onSuccess(createdItem);
    } catch (error) {
      console.error('Error submitting library item:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить материал',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Тип материала</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-wrap gap-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="book" />
                    </FormControl>
                    <FormLabel className="font-normal">Книга</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="instruction" />
                    </FormControl>
                    <FormLabel className="font-normal">Инструкция</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="standard" />
                    </FormControl>
                    <FormLabel className="font-normal">СП/ГОСТ</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input placeholder="Название материала" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Автор</FormLabel>
                <FormControl>
                  <Input placeholder="Автор материала" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Год издания</FormLabel>
                <FormControl>
                  <Input placeholder="2023" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea placeholder="Описание материала..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="externalLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Внешняя ссылка (необязательно)</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="fileUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ссылка на файл (необязательно)</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Добавление...
              </>
            ) : (
              'Добавить'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddLibraryItemForm;
