
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tool } from '@/lib/data';
import { X, Plus, Link } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Название должно содержать не менее 2 символов',
  }),
  category: z.string().min(1, {
    message: 'Выберите категорию',
  }),
  location: z.string().min(2, {
    message: 'Укажите местоположение',
  }),
  image: z.string().url({
    message: 'Введите корректный URL изображения',
  }),
  description: z.string().min(5, {
    message: 'Описание должно содержать не менее 5 символов',
  }),
  price: z.string().min(1, {
    message: 'Укажите стоимость',
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface EdcToolFormProps {
  onAddTool: (tool: Omit<Tool, 'id' | 'status' | 'lastCheckedOut'> & {isEdc: true, links: string[]}) => void;
  onCancel: () => void;
  categories: string[];
}

const EdcToolForm = ({ onAddTool, onCancel, categories }: EdcToolFormProps) => {
  const { toast } = useToast();
  const [links, setLinks] = useState<string[]>(['']);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category: '',
      location: 'EDC Коллекция',
      image: 'https://images.unsplash.com/photo-1586864387789-628af9feed72',
      description: '',
      price: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    try {
      // Filter out empty links
      const filteredLinks = links.filter(link => link.trim() !== '');
      
      onAddTool({
        name: values.name,
        category: values.category,
        location: values.location,
        image: values.image,
        description: values.description,
        isEdc: true,
        links: filteredLinks,
        price: parseFloat(values.price),
      });
      
      toast({
        title: 'EDC набор добавлен',
        description: `EDC набор "${values.name}" успешно добавлен`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить EDC набор',
        variant: 'destructive',
      });
    }
  };

  const addLinkField = () => {
    setLinks([...links, '']);
  };

  const updateLink = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const removeLink = (index: number) => {
    const newLinks = [...links];
    newLinks.splice(index, 1);
    setLinks(newLinks);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название набора</FormLabel>
              <FormControl>
                <Input placeholder="Многофункциональный набор инструментов" {...field} />
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
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                  <option value="EDC">EDC</option>
                  <option value="Многофункциональный инструмент">Многофункциональный инструмент</option>
                  <option value="Набор инструментов">Набор инструментов</option>
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
              <FormLabel>Стоимость (руб.)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="1500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Расположение</FormLabel>
              <FormControl>
                <Input placeholder="EDC Коллекция" {...field} />
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
        
        <div className="space-y-2">
          <FormLabel>Ссылки на товар</FormLabel>
          {links.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="relative flex-grow">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="https://..."
                  value={link}
                  onChange={(e) => updateLink(index, e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                onClick={() => removeLink(index)}
                disabled={links.length === 1 && index === 0}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addLinkField}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Добавить ссылку
          </Button>
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea placeholder="Описание набора..." className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Отменить</Button>
          <Button type="submit">Добавить EDC набор</Button>
        </div>
      </form>
    </Form>
  );
};

export default EdcToolForm;
