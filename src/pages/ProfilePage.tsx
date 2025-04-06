
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const profileSchema = z.object({
  username: z.string().min(3, { message: "Имя пользователя должно содержать минимум 3 символа" }).optional(),
  avatar_url: z.string().optional(),
  whatsapp: z.string().optional(),
  telegram: z.string().optional(),
});

const employeeSchema = z.object({
  name: z.string().min(2, { message: "Имя должно содержать минимум 2 символа" }),
  position: z.string().min(2, { message: "Должность обязательна" }),
  department: z.string().min(2, { message: "Отдел обязателен" }),
  phone: z.string().min(5, { message: "Телефон обязателен" }),
  avatar: z.string().url({ message: "Введите корректный URL изображения" }).optional(),
  whatsapp: z.string().optional(),
  telegram: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type EmployeeFormValues = z.infer<typeof employeeSchema>;

const ProfilePage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingEmployee, setIsLoadingEmployee] = useState(true);
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
    },
  });

  const employeeForm = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
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

    const getProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        setProfile(data);
        profileForm.reset({
          username: data.username || "",
          avatar_url: data.avatar_url || "",
          whatsapp: data.whatsapp || "",
          telegram: data.telegram || "",
        });
      } catch (error: any) {
        toast({
          title: "Ошибка загрузки профиля",
          description: error.message || "Не удалось загрузить профиль",
          variant: "destructive",
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    const getEmployee = async () => {
      setIsLoadingEmployee(true);
      try {
        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116: No rows found error
          throw error;
        }

        if (data) {
          setEmployee(data);
          employeeForm.reset({
            name: data.name || "",
            position: data.position || "",
            department: data.department || "",
            phone: data.phone || "",
            avatar: data.avatar || "",
            whatsapp: data.whatsapp || "",
            telegram: data.telegram || "",
          });
        }
      } catch (error: any) {
        toast({
          title: "Ошибка загрузки данных сотрудника",
          description: error.message || "Не удалось загрузить данные сотрудника",
          variant: "destructive",
        });
      } finally {
        setIsLoadingEmployee(false);
      }
    };

    getProfile();
    getEmployee();
  }, [user, profileForm, employeeForm, toast]);

  // Function to save profile field immediately after change
  const saveProfileField = async (field: keyof ProfileFormValues, value: any) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          [field]: value,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Update employee fields if they match (telegram, whatsapp)
      if ((field === 'telegram' || field === 'whatsapp') && employee) {
        await supabase
          .from('employees')
          .update({
            [field]: value,
          })
          .eq('user_id', user.id);
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

  // Function to save employee field immediately after change
  const saveEmployeeField = async (field: keyof EmployeeFormValues, value: any) => {
    if (!user || !employee) return;
    
    try {
      const { error } = await supabase
        .from('employees')
        .update({
          [field]: value,
        })
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Update profile fields if they match (telegram, whatsapp)
      if ((field === 'telegram' || field === 'whatsapp') && profile) {
        await supabase
          .from('profiles')
          .update({
            [field]: value,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
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

  if (authLoading || isLoadingProfile) {
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
        <Tabs defaultValue="profile">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Профиль пользователя</TabsTrigger>
            <TabsTrigger value="employee">Данные сотрудника</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Профиль пользователя</CardTitle>
                <CardDescription>Обновите ваш личный профиль и контактные данные</CardDescription>
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
                                    saveProfileField('username', e.target.value);
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
                              <FormLabel>URL аватара</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="https://example.com/avatar.jpg" 
                                  {...field} 
                                  onChange={(e) => {
                                    field.onChange(e);
                                    saveProfileField('avatar_url', e.target.value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
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
                                      saveProfileField('whatsapp', e.target.value);
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
                                      saveProfileField('telegram', e.target.value);
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
          </TabsContent>
          
          <TabsContent value="employee">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Данные сотрудника</CardTitle>
                <CardDescription>Обновите ваши данные как сотрудника компании</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingEmployee ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Загрузка данных сотрудника...</span>
                  </div>
                ) : (
                  <Form {...employeeForm}>
                    <div className="space-y-4">
                      <FormField
                        control={employeeForm.control}
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
                                  saveEmployeeField('name', e.target.value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={employeeForm.control}
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
                                  saveEmployeeField('position', e.target.value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={employeeForm.control}
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
                                  saveEmployeeField('department', e.target.value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={employeeForm.control}
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
                                  saveEmployeeField('phone', e.target.value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={employeeForm.control}
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
                                  saveEmployeeField('avatar', e.target.value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={employeeForm.control}
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
                                    saveEmployeeField('whatsapp', e.target.value);
                                  }}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={employeeForm.control}
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
                                    saveEmployeeField('telegram', e.target.value);
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
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TransitionWrapper>
  );
};

export default ProfilePage;
