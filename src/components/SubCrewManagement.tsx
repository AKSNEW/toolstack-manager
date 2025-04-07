import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SubCrew, Employee } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Название должно содержать не менее 2 символов',
  }),
  foreman: z.string().min(1, {
    message: 'Необходимо выбрать бригадира',
  }),
  specialization: z.string().min(3, {
    message: 'Укажите специализацию',
  }),
  members: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SubCrewManagementProps {
  subCrews: SubCrew[];
  onAddSubCrew: (subCrew: Omit<SubCrew, 'id'>) => void;
  onDeleteSubCrew: (subCrewId: string) => void;
  onUpdateSubCrew: (subCrewId: string, subCrew: Partial<SubCrew>) => void;
  crewId: string;
  availableEmployees: Employee[];
  getEmployeeById: (id: string) => Employee | undefined;
}

const SubCrewManagement = ({
  subCrews,
  onAddSubCrew,
  onDeleteSubCrew,
  onUpdateSubCrew,
  crewId,
  availableEmployees,
  getEmployeeById
}: SubCrewManagementProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSubCrew, setEditingSubCrew] = useState<SubCrew | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      foreman: '',
      specialization: '',
      members: [],
    },
  });

  const { control, register, handleSubmit, watch, setValue } = form;

  const selectedForeman = watch('foreman');

  const openAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
    form.reset();
  };

  const openEditDialog = (subCrew: SubCrew) => {
    setEditingSubCrew(subCrew);
    setValue('name', subCrew.name);
    setValue('foreman', subCrew.foreman);
    setValue('specialization', subCrew.specialization);
    setValue('members', subCrew.members);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingSubCrew(null);
    form.reset();
  };

  const handleAddSubCrew = async (data: FormValues) => {
    try {
      const newSubCrew: Omit<SubCrew, 'id'> = {
        name: data.name,
        foreman: data.foreman,
        specialization: data.specialization,
        members: data.members || []
      };
      
      await onAddSubCrew(newSubCrew);
      form.reset();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding subcrew:", error);
    }
  };

  const handleEditSubCrew = async (data: FormValues) => {
    if (!editingSubCrew) return;
    
    try {
      const updatedSubCrew: Partial<SubCrew> = {
        name: data.name,
        foreman: data.foreman,
        specialization: data.specialization,
        members: data.members
      };
      
      await onUpdateSubCrew(editingSubCrew.id, updatedSubCrew);
      setEditingSubCrew(null);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating subcrew:", error);
    }
  };

  const removeEmployee = (employee: Employee) => {
    if (!editingSubCrew) return;
    
    const members = [...form.getValues('members')];
    const updatedMembers = members.filter(id => id !== employee.id);
    
    form.setValue('members', updatedMembers);
    
    toast({
      title: "Сотрудник удален",
      description: `${employee.name} удален из подбригады`,
    });
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить подбригаду
        </Button>
      </div>

      {subCrews.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Бригадир</TableHead>
              <TableHead>Специализация</TableHead>
              <TableHead>Кол-во сотрудников</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subCrews.map(subCrew => (
              <TableRow key={subCrew.id}>
                <TableCell className="font-medium">{subCrew.name}</TableCell>
                <TableCell>{getEmployeeById(subCrew.foreman)?.name}</TableCell>
                <TableCell>{subCrew.specialization}</TableCell>
                <TableCell>{subCrew.members.length}</TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => openEditDialog(subCrew)}
                    variant="ghost"
                    size="sm"
                    className="mr-2"
                  >
                    Редактировать
                  </Button>
                  <Button
                    onClick={() => onDeleteSubCrew(subCrew.id)}
                    variant="ghost"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center p-4">
          Нет подбригад в составе бригады
        </div>
      )}

      {/* Add SubCrew Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Добавить подбригаду</DialogTitle>
            <DialogDescription>
              Заполните информацию о новой подбригаде
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit(handleAddSubCrew)} className="space-y-4">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название подбригады</FormLabel>
                    <FormControl>
                      <Input placeholder="Название" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="foreman"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Бригадир</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите бригадира" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableEmployees.map(employee => (
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
                control={control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Специализация</FormLabel>
                    <FormControl>
                      <Input placeholder="Специализация" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="members"
                render={() => (
                  <FormItem>
                    <FormLabel>Члены подбригады</FormLabel>
                    <div className="space-y-2">
                      {availableEmployees
                        .filter(e => e.id !== selectedForeman)
                        .map(employee => (
                          <div key={employee.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`member-${employee.id}`}
                              value={employee.id}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                              {...register('members')}
                            />
                            <label htmlFor={`member-${employee.id}`} className="text-sm">
                              {employee.name}
                            </label>
                          </div>
                        ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="secondary" onClick={closeAddDialog}>
                  Отмена
                </Button>
                <Button type="submit">Добавить</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit SubCrew Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Редактировать подбригаду</DialogTitle>
            <DialogDescription>
              Измените информацию о подбригаде
            </DialogDescription>
          </DialogHeader>
          {editingSubCrew && (
            <Form {...form}>
              <form onSubmit={handleSubmit(handleEditSubCrew)} className="space-y-4">
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название подбригады</FormLabel>
                      <FormControl>
                        <Input placeholder="Название" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="foreman"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Бригадир</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите бригадира" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableEmployees.map(employee => (
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
                  control={control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Специализация</FormLabel>
                      <FormControl>
                        <Input placeholder="Специализация" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Члены подбригады</FormLabel>
                  <div className="space-y-2 mt-2">
                    {editingSubCrew.members.map(memberId => {
                      const employee = getEmployeeById(memberId);
                      if (!employee) return null;

                      return (
                        <div key={employee.id} className="flex items-center justify-between rounded-md border p-2">
                          <div className="flex items-center space-x-2">
                            <div className="h-6 w-6 rounded-full overflow-hidden">
                              <img
                                src={employee.avatar}
                                alt={employee.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <span>{employee.name}</span>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeEmployee(employee)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      );
                    })}
                    {availableEmployees
                      .filter(e => !editingSubCrew.members.includes(e.id))
                      .map(employee => (
                        <div key={employee.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`member-${employee.id}`}
                            value={employee.id}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                            {...register('members')}
                          />
                          <label htmlFor={`member-${employee.id}`} className="text-sm">
                            {employee.name}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="secondary" onClick={closeEditDialog}>
                    Отмена
                  </Button>
                  <Button type="submit">Сохранить</Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubCrewManagement;
