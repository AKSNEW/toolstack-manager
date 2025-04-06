
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
  username: z.string().min(3, { message: "Имя пользователя должно содержать минимум 3 символа" }).optional(),
  avatar_url: z.string().optional(),
  whatsapp: z.string().optional(),
  telegram: z.string().optional(),
  name: z.string().min(2, { message: "Имя должно содержать минимум 2 символа" }),
  position: z.string().min(2, { message: "Должность обязательна" }),
  department: z.string().min(2, { message: "Отдел обязателен" }),
  phone: z.string().min(5, { message: "Телефон обязателен" }),
  avatar: z.string().url({ message: "Введите корректный URL изображения" }).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [employee, setEmployee] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      avatar_url: "",
      whatsapp: "",
      telegram: "",
      name: "",
      position: "",
      department: "",
      phone: "",
      avatar: "",
    },
  });

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        setProfile(profileData);

        // Load or create employee data
        const { data: employeeData, error: employeeError } = await supabase
          .from('employees')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (employeeError && employeeError.code !== 'PGRST116') { // PGRST116: No rows found error
          throw employeeError;
        }

        if (!employeeData) {
          // Create new employee record linked to this user
          const { data: newEmployee, error: createError } = await supabase
            .from('employees')
            .insert({
              name: profileData.username || '',
              position: '',
              department: '',
              email: user.email || '',
              phone: '',
              avatar: profileData.avatar_url || '',
              user_id: user.id,
              whatsapp: profileData.whatsapp || '',
              telegram: profileData.telegram || '',
            })
            .select()
            .single();

          if (createError) throw createError;
          setEmployee(newEmployee);
        } else {
          setEmployee(employeeData);
        }

        // Reset form with combined data
        profileForm.reset({
          username: profileData.username || "",
          avatar_url: profileData.avatar_url || "",
          whatsapp: profileData.whatsapp || "",
          telegram: profileData.telegram || "",
          name: employeeData?.name || "",
          position: employeeData?.position || "",
          department: employeeData?.department || "",
          phone: employeeData?.phone || "",
          avatar: employeeData?.avatar || "",
        });
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
    
    try {
      if (['username', 'avatar_url', 'whatsapp', 'telegram'].includes(field)) {
        // Save to profiles table
        const { error } = await supabase
          .from('profiles')
          .update({
            [field]: value,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (error) throw error;
      }

      if (['name', 'position', 'department', 'phone', 'avatar', 'whatsapp', 'telegram'].includes(field)) {
        // Also save to employees table
        const { error } = await supabase
          .from('employees')
          .update({
            [field === 'avatar_url' ? 'avatar' : field]: value,
          })
          .eq('user_id', user.id);

        if (error) throw error;
      }

      toast({
        title: "Поле обновлено",
        description: "Ваши данные успешно сохранены",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка сохранения",
        description: error.message || "Не удалось сохранить данные",
        variant: "destructive",
      });
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

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
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
                  {profile?.avatar_url ? (
                    <AvatarImage src={profile.avatar_url} alt={profile.username || user.email} />
                  ) : null}
                  <AvatarFallback className="text-2xl">{getInitials(user.email || '')}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="font-medium text-lg">{profile?.username || 'Пользователь'}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="flex-1">
                <Form {...profileForm}>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Личные данные</h3>
                    <FormField
                      control={profileForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Имя пользователя</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Введите имя пользователя" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                saveField('username', e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="avatar_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL аватара (профиль)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://example.com/avatar.jpg" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                saveField('avatar_url', e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <h3 className="text-lg font-medium pt-4">Данные сотрудника</h3>
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
                          <FormLabel>URL аватара (сотрудник)</FormLabel>
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
