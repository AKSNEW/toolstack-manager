
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

  const onSubmitProfile = async (values: ProfileFormValues) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: values.username,
          avatar_url: values.avatar_url,
          whatsapp: values.whatsapp,
          telegram: values.telegram,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Профиль обновлен",
        description: "Ваш профиль был успешно обновлен",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка обновления профиля",
        description: error.message || "Не удалось обновить профиль",
        variant: "destructive",
      });
    }
  };

  const onSubmitEmployee = async (values: EmployeeFormValues) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('employees')
        .update({
          name: values.name,
          position: values.position,
          department: values.department,
          phone: values.phone,
          avatar: values.avatar || profile?.avatar_url || "",
        })
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Данные сотрудника обновлены",
        description: "Ваши данные сотрудника были успешно обновлены",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка обновления данных",
        description: error.message || "Не удалось обновить данные сотрудника",
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
                      <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-4">
                        <FormField
                          control={profileForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Имя пользователя</FormLabel>
                              <FormControl>
                                <Input placeholder="Введите имя пользователя" {...field} />
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
                                <Input placeholder="https://example.com/avatar.jpg" {...field} />
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
                                  <Input className="pl-10" placeholder="+7 (123) 456-7890" {...field} />
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
                                  <Input className="pl-10" placeholder="@username" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                          {profileForm.formState.isSubmitting ? "Сохранение..." : "Сохранить изменения"}
                        </Button>
                      </form>
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
                    <form onSubmit={employeeForm.handleSubmit(onSubmitEmployee)} className="space-y-4">
                      <FormField
                        control={employeeForm.control}
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
                        control={employeeForm.control}
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
                        control={employeeForm.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Отдел</FormLabel>
                            <FormControl>
                              <Input placeholder="Электрический" {...field} />
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
                              <Input placeholder="+7 (123) 456-7890" {...field} />
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
                              <Input placeholder="https://example.com/avatar.jpg" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={employeeForm.formState.isSubmitting}>
                        {employeeForm.formState.isSubmitting ? "Сохранение..." : "Сохранить данные сотрудника"}
                      </Button>
                    </form>
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
