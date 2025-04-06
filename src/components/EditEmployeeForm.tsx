import React, { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Employee } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { IdCard, MessageCircle, Phone } from 'lucide-react';

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
  whatsapp: z.string().optional(),
  telegram: z.string().optional(),
  // Optional driver license fields
  hasDriverLicense: z.boolean().optional(),
  driverLicenseNumber: z.string().optional(),
  driverLicenseCategory: z.string().optional(),
  driverLicenseIssueDate: z.string().optional(),
  driverLicenseExpiryDate: z.string().optional(),
  driverLicenseIssuedBy: z.string().optional(),
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
      whatsapp: employee.whatsapp || '',
      telegram: employee.telegram || '',
      hasDriverLicense: !!employee.driverLicense,
      driverLicenseNumber: employee.driverLicense?.number || '',
      driverLicenseCategory: employee.driverLicense?.category || '',
      driverLicenseIssueDate: employee.driverLicense?.issueDate || '',
      driverLicenseExpiryDate: employee.driverLicense?.expiryDate || '',
      driverLicenseIssuedBy: employee.driverLicense?.issuedBy || '',
    },
  });

  const hasDriverLicense = form.watch('hasDriverLicense');

  const onSubmit = (values: FormValues) => {
    try {
      const updatedEmployee: Omit<Employee, 'id' | 'activeRentals' | 'rentalHistory'> = {
        name: values.name,
        position: values.position,
        department: values.department,
        email: values.email,
        phone: values.phone,
        avatar: values.avatar,
        birthDate: employee.birthDate,
        whatsapp: values.whatsapp,
        telegram: values.telegram,
        user_id: employee.user_id,
      };

      // Add driver license if provided
      if (values.hasDriverLicense && values.driverLicenseNumber && values.driverLicenseCategory &&
          values.driverLicenseIssueDate && values.driverLicenseExpiryDate) {
        updatedEmployee.driverLicense = {
          number: values.driverLicenseNumber,
          category: values.driverLicenseCategory,
          issueDate: values.driverLicenseIssueDate,
          expiryDate: values.driverLicenseExpiryDate,
          issuedBy: values.driverLicenseIssuedBy,
        };
      }

      onEditEmployee(employee.id, updatedEmployee);
      
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
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="+7 (123) 456-7890" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="+7 (123) 456-7890" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="telegram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telegram</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="@username" className="pl-10" {...field} />
                    </div>
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
            
            {/* Driver License Section */}
            <Accordion type="single" collapsible className="border rounded-md">
              <AccordionItem value="driver-license">
                <AccordionTrigger className="px-4">
                  <div className="flex items-center gap-2">
                    <IdCard className="h-4 w-4" />
                    <span>Водительское удостоверение</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="hasDriverLicense"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-2 space-y-0">
                          <FormControl>
                            <input
                              type="checkbox"
                              className="h-4 w-4"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          </FormControl>
                          <FormLabel>Есть водительское удостоверение</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    {hasDriverLicense && (
                      <div className="space-y-4 mt-4">
                        <FormField
                          control={form.control}
                          name="driverLicenseNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Номер ВУ</FormLabel>
                              <FormControl>
                                <Input placeholder="0000 000000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="driverLicenseCategory"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Категории</FormLabel>
                              <FormControl>
                                <Input placeholder="A, B, C" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="driverLicenseIssueDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Дата выдачи</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="driverLicenseExpiryDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Дата окончания</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="driverLicenseIssuedBy"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Кем выдано</FormLabel>
                              <FormControl>
                                <Input placeholder="ГИБДД ..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
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
