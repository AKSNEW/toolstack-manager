
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TransitionWrapper from '@/components/TransitionWrapper';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, MessageCircle, Phone } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, { message: "Имя должно содержать минимум 2 символа" }),
  position: z.string().min(2, { message: "Должность обязательна" }),
  department: z.string().min(2, { message: "Отдел обязателен" }),
  phone: z.string().min(5, { message: "Телефон обязателен" }),
  avatar: z.string().url({ message: "Введите корректный URL изображения" }).optional(),
  whatsapp: z.string().optional(),
  telegram: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [employee, setEmployee] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      position: "",
      department: "",
      phone: "",
      avatar: "",
      whatsapp: "",
      telegram: "",
    },
  });

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        console.log("Loading employee data for user ID:", user.id);
        // Load employee data
        const { data: employeeData, error: employeeError } = await supabase
          .from('employees')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (employeeError) {
          console.error("Error fetching employee data:", employeeError);
          if (employeeError.code !== 'PGRST116') { // PGRST116: No rows found error
            throw employeeError;
          }
        }

        console.log("Employee data loaded:", employeeData);
        setEmployee(employeeData || null);

        // Reset form with data
        if (employeeData) {
          profileForm.reset({
            name: employeeData.name || "",
            position: employeeData.position || "",
            department: employeeData.department || "",
            phone: employeeData.phone || "",
            avatar: employeeData.avatar || "",
            whatsapp: employeeData.whatsapp || "",
            telegram: employeeData.telegram || "",
          });
        }
      } catch (error: any) {
        console.error('Error loading profile data:', error);
        toast({
          title: "Ошибка загрузки данных",
          description: error.message || "Не удалось загрузить профиль",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, profileForm, toast]);

  // Function to save field immediately after change
  const saveField = async (field: keyof ProfileFormValues, value: any) => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      console.log(`Saving field "${field}" with value:`, value);
      
      // If we don't have an employee record yet, create one
      if (!employee) {
        console.log("No employee record found, creating one...");
        const { data: newEmployee, error: createError } = await supabase
          .from('employees')
          .insert([{
            user_id: user.id,
            name: field === 'name' ? value : '',
            position: field === 'position' ? value : '',
            department: field === 'department' ? value : '',
            phone: field === 'phone' ? value : '',
            avatar: field === 'avatar' ? value : '',
            whatsapp: field === 'whatsapp' ? value : '',
            telegram: field === 'telegram' ? value : '',
            email: user.email
          }])
          .select();
          
        if (createError) throw createError;
        
        setEmployee(newEmployee?.[0] || null);
        console.log("New employee record created:", newEmployee?.[0]);
      } else {
        // Update existing employee record
        const { error } = await supabase
          .from('employees')
          .update({
            [field]: value,
          })
          .eq('user_id', user.id);

        if (error) {
          console.error("Error updating employee record:", error);
          throw error;
        }
        
        // Update local state to reflect the change
        setEmployee(prev => prev ? { ...prev, [field]: value } : null);
      }

      toast({
        title: "Поле обновлено",
        description: "Ваши данные успешно сохранены",
      });
    } catch (error: any) {
      console.error('Error saving field:', error);
      toast({
        title: "Ошибка сохранения",
        description: error.message || "Не удалось сохранить данные",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Загрузка профиля...</span>
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  const getInitials = (name: string) => {
    if (!name) return user.email?.substring(0, 2).toUpperCase() || "??";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <TransitionWrapper>
      <div className="container max-w-4xl py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Профиль пользователя</CardTitle>
            <CardDescription>Обновите ваш профиль и данные сотрудника</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-32 w-32">
                  {employee?.avatar ? (
                    <AvatarImage src={employee.avatar} alt={employee.name || user.email} />
                  ) : null}
                  <AvatarFallback className="text-2xl">{getInitials(employee?.name || '')}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="font-medium text-lg">{employee?.name || 'Пользователь'}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="flex-1">
                <Form {...profileForm}>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Данные сотрудника</h3>
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ФИО</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Иванов Иван Иванович" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                saveField('name', e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Должность</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Старший инженер" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                saveField('position', e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Отдел</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Электрический" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                saveField('department', e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Телефон</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="+7 (123) 456-7890" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                saveField('phone', e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="avatar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL аватара</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://example.com/avatar.jpg" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                saveField('avatar', e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <h3 className="text-lg font-medium pt-4">Контактные данные</h3>
                    <FormField
                      control={profileForm.control}
                      name="whatsapp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WhatsApp</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input 
                                className="pl-10" 
                                placeholder="+7 (123) 456-7890" 
                                {...field} 
                                onChange={(e) => {
                                  field.onChange(e);
                                  saveField('whatsapp', e.target.value);
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="telegram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telegram</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input 
                                className="pl-10" 
                                placeholder="@username" 
                                {...field} 
                                onChange={(e) => {
                                  field.onChange(e);
                                  saveField('telegram', e.target.value);
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TransitionWrapper>
  );
};

export default ProfilePage;
