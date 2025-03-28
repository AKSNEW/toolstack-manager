
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { expenseReceipts, employees } from '@/lib/data';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';

const formSchema = z.object({
  employeeId: z.string({
    required_error: 'Выберите сотрудника',
  }),
  amount: z.coerce
    .number()
    .min(1, { message: 'Сумма должна быть больше 0' }),
  description: z.string().min(5, { message: 'Добавьте описание (минимум 5 символов)' }),
  category: z.enum(['materials', 'tools', 'travel', 'food', 'other'], {
    required_error: 'Выберите категорию',
  }),
});

interface ExpenseReceiptFormProps {
  onSuccess: () => void;
}

const ExpenseReceiptForm: React.FC<ExpenseReceiptFormProps> = ({ onSuccess }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [receiptImage, setReceiptImage] = useState<File | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeId: '',
      amount: undefined,
      description: '',
      category: undefined,
    },
  });
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceiptImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const clearImage = () => {
    setImagePreview(null);
    setReceiptImage(null);
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new receipt
      const newReceipt = {
        id: `r${expenseReceipts.length + 1}`,
        employeeId: values.employeeId,
        date: new Date().toISOString().split('T')[0],
        amount: values.amount,
        description: values.description,
        category: values.category,
        status: 'pending',
        imageUrl: imagePreview,
      };
      
      // Add to the expense receipts array (in a real app, this would be an API call)
      expenseReceipts.push(newReceipt as any);
      
      toast.success('Чек успешно отправлен на рассмотрение');
      onSuccess();
    } catch (error) {
      toast.error('Ошибка при отправке чека');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Добавить новый чек</CardTitle>
        <CardDescription>Заполните информацию о расходах и прикрепите скан чека</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Сотрудник</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите сотрудника" />
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
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Сумма</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormDescription>Укажите сумму в рублях</FormDescription>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="materials">Материалы</SelectItem>
                      <SelectItem value="tools">Инструменты</SelectItem>
                      <SelectItem value="travel">Проезд</SelectItem>
                      <SelectItem value="food">Питание</SelectItem>
                      <SelectItem value="other">Прочее</SelectItem>
                    </SelectContent>
                  </Select>
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
                      placeholder="Опишите, на что были потрачены средства..." 
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel>Скан чека</FormLabel>
              {imagePreview ? (
                <div className="relative rounded-md overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="Receipt Preview" 
                    className="w-full h-auto object-contain max-h-64"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={clearImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 rounded-md p-10 text-center">
                  <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Перетащите файл сюда или нажмите, чтобы загрузить
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Поддерживаются JPG, PNG, PDF до 5MB
                  </p>
                  <input
                    type="file"
                    accept="image/jpeg, image/png, application/pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleImageUpload}
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onSuccess}>
                Отмена
              </Button>
              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting || (!form.formState.isValid || !imagePreview)}
              >
                {form.formState.isSubmitting ? 'Отправка...' : 'Отправить чек'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ExpenseReceiptForm;
