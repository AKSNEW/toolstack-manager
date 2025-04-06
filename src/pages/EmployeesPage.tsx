import React, { useState, useEffect } from 'react';
import { Employee, Tool } from '@/lib/types';
import { tools } from '@/lib/data';
import EmployeeCard from '@/components/EmployeeCard';
import TransitionWrapper from '@/components/TransitionWrapper';
import { Search, Users, X, Package, Calendar, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import EditEmployeeForm from '@/components/EditEmployeeForm';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';

const EmployeesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditEmployeeDialogOpen, setIsEditEmployeeDialogOpen] = useState(false);
  const [isDeleteEmployeeDialogOpen, setIsDeleteEmployeeDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [employeesList, setEmployeesList] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('employees')
          .select('*');
        
        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const mappedEmployees: Employee[] = data.map(emp => ({
            id: emp.id,
            name: emp.name || 'Новый сотрудник',
            position: emp.position || '',
            department: emp.department || '',
            email: emp.email,
            phone: emp.phone || '',
            avatar: emp.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
            activeRentals: [],
            rentalHistory: [],
            whatsapp: emp.whatsapp,
            telegram: emp.telegram,
            user_id: emp.user_id
          }));
          setEmployeesList(mappedEmployees);
        } else {
          import('@/lib/data/employees').then(module => {
            setEmployeesList(module.employees);
          });
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        import('@/lib/data/employees').then(module => {
          setEmployeesList(module.employees);
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const departments = [...new Set(employeesList.map(emp => emp.department).filter(Boolean))];
  
  const filteredEmployees = employeesList.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter ? employee.department === departmentFilter : true;
    
    return matchesSearch && matchesDepartment;
  });

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const closeDialog = () => {
    setSelectedEmployee(null);
  };

  const clearFilters = () => {
    setDepartmentFilter(null);
    setSearchTerm('');
  };

  const openEditEmployeeDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditEmployeeDialogOpen(true);
  };

  const closeEditEmployeeDialog = () => {
    setIsEditEmployeeDialogOpen(false);
  };

  const handleEditEmployee = async (id: string, updatedEmployee: Omit<Employee, 'id' | 'activeRentals' | 'rentalHistory'>) => {
    try {
      const { error } = await supabase
        .from('employees')
        .update({
          name: updatedEmployee.name,
          position: updatedEmployee.position,
          department: updatedEmployee.department,
          phone: updatedEmployee.phone,
          avatar: updatedEmployee.avatar,
          whatsapp: updatedEmployee.whatsapp,
          telegram: updatedEmployee.telegram
        })
        .eq('id', id);

      if (error) throw error;

      setEmployeesList(prevList => 
        prevList.map(employee => 
          employee.id === id 
            ? { 
                ...employee, 
                ...updatedEmployee 
              } 
            : employee
        )
      );

      toast({
        title: "Сотрудник обновлен",
        description: `Данные сотрудника "${updatedEmployee.name}" успешно обновлены`
      });

      closeEditEmployeeDialog();
      closeDialog();
    } catch (error: any) {
      toast({
        title: "Ошибка обновления",
        description: error.message || "Не удалось обновить данные сотрудника",
        variant: "destructive"
      });
    }
  };

  const openDeleteEmployeeDialog = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteEmployeeDialogOpen(true);
  };

  const handleUpdateEmployee = async (updatedEmployee: Employee) => {
    try {
      const { error } = await supabase
        .from('employees')
        .update({
          name: updatedEmployee.name,
          position: updatedEmployee.position,
          department: updatedEmployee.department,
          phone: updatedEmployee.phone,
          avatar: updatedEmployee.avatar,
          whatsapp: updatedEmployee.whatsapp,
          telegram: updatedEmployee.telegram
        })
        .eq('id', updatedEmployee.id);

      if (error) throw error;

      setEmployeesList(prevList => 
        prevList.map(employee => 
          employee.id === updatedEmployee.id 
            ? updatedEmployee
            : employee
        )
      );

      toast({
        title: "Данные обновлены",
        description: "Информация о сотруднике успешно обновлена"
      });
    } catch (error: any) {
      toast({
        title: "Ошибка обновления",
        description: error.message || "Не удалось обновить данные сотрудника",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    const employeeToDelete = employeesList.find(e => e.id === id);
    if (!employeeToDelete) return;

    if (employeeToDelete.user_id) {
      toast({
        title: "Невозможно удалить",
        description: "Этот сотрудник связан с учетной записью пользователя и не может быть удален.",
        variant: "destructive"
      });
      setIsDeleteEmployeeDialogOpen(false);
      setEmployeeToDelete(null);
      return;
    }

    const isInCrew = false;
    
    if (isInCrew) {
      toast({
        title: "Ошибка удаления",
        description: "Этот сотрудник входит в состав бригады. Сначала удалите его из всех бригад.",
        variant: "destructive"
      });
    } else if (employeeToDelete.activeRentals.length > 0) {
      toast({
        title: "Ошибка удаления",
        description: "У этого сотрудника есть активные заказы инструментов. Сначала верните все инструменты.",
        variant: "destructive"
      });
    } else {
      try {
        const { error } = await supabase
          .from('employees')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setEmployeesList(prevList => 
          prevList.filter(employee => employee.id !== id)
        );
        
        toast({
          title: "Сотрудник удален",
          description: `${employeeToDelete.name} был успешно удален из системы`
        });
        
        if (selectedEmployee && selectedEmployee.id === id) {
          setSelectedEmployee(null);
        }
      } catch (error: any) {
        toast({
          title: "Ошибка удаления",
          description: error.message || "Не удалось удалить сотрудника",
          variant: "destructive"
        });
      }
      
      setIsDeleteEmployeeDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const getToolById = (id: string): Tool | undefined => {
    return tools.find(tool => tool.id === id);
  };

  return (
    <TransitionWrapper className="pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Сотрудники</h1>
            <p className="text-muted-foreground mt-2">
              Список сотрудников компании
            </p>
          </div>
        </div>
        
        <div className="glass rounded-xl mb-8 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input 
                type="text" 
                placeholder="Поиск сотрудника..." 
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select
                value={departmentFilter || ''}
                onChange={(e) => setDepartmentFilter(e.target.value || null)}
                className="h-10 rounded-lg bg-background border border-input px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              >
                <option value="">Все отделы</option>
                {departments.map(department => (
                  <option key={department} value={department}>{department}</option>
                ))}
              </select>
              
              {(searchTerm || departmentFilter) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 h-10 px-3 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground text-sm transition-all"
                >
                  <X className="h-3.5 w-3.5" />
                  Очистить
                </button>
              )}
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <span className="ml-2">Загрузка сотрудников...</span>
          </div>
        ) : filteredEmployees.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map(employee => (
              <EmployeeCard 
                key={employee.id} 
                employee={employee} 
                onClick={handleEmployeeClick}
                onUpdate={handleUpdateEmployee}
                onDelete={handleDeleteEmployee}
              />
            ))}
          </div>
        ) : (
          <div className="glass rounded-xl p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-1">Ничего не найдено</h3>
            <p className="text-muted-foreground">
              Не найдено сотрудников соответствующих заданным критериям
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
        
        <Dialog open={!!selectedEmployee && !isEditEmployeeDialogOpen} onOpenChange={() => closeDialog()}>
          {selectedEmployee && (
            <DialogContent className="sm:max-w-[650px]">
              <DialogHeader className="text-center">
                <div className="mx-auto w-24 h-24 rounded-full mb-4 overflow-hidden border-4 border-white/50 shadow-lg">
                  <img
                    src={selectedEmployee.avatar}
                    alt={selectedEmployee.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <DialogTitle className="text-xl">{selectedEmployee.name}</DialogTitle>
                <DialogDescription className="flex justify-center items-center gap-2">
                  <span>{selectedEmployee.position}</span>
                  <span className="text-xs">•</span>
                  <span>{selectedEmployee.department}</span>
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Email</p>
                    <p>{selectedEmployee.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Телефон</p>
                    <p>{selectedEmployee.phone}</p>
                  </div>
                  {selectedEmployee.whatsapp && (
                    <div className="space-y-1">
                      <p className="text-muted-foreground">WhatsApp</p>
                      <p>{selectedEmployee.whatsapp}</p>
                    </div>
                  )}
                  {selectedEmployee.telegram && (
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Telegram</p>
                      <p>{selectedEmployee.telegram}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">
                    Активные заказы
                  </h3>
                  {selectedEmployee.activeRentals.length > 0 ? (
                    <div className="space-y-3">
                      {selectedEmployee.activeRentals.map(toolId => {
                        const tool = getToolById(toolId);
                        if (!tool) return null;
                        
                        return (
                          <div key={tool.id} className="glass rounded-lg p-3 flex items-center">
                            <div className="h-12 w-12 rounded-md overflow-hidden mr-3">
                              <img 
                                src={tool.image} 
                                alt={tool.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{tool.name}</h4>
                              <p className="text-xs text-muted-foreground">{tool.category}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-muted/50 rounded-lg">
                      <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Нет активных заказов</p>
                    </div>
                  )}
                </div>
                
                {selectedEmployee.rentalHistory.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-3">
                      История заказов
                    </h3>
                    <div className="space-y-3">
                      {selectedEmployee.rentalHistory.map((rental, index) => {
                        const tool = getToolById(rental.toolId);
                        if (!tool) return null;
                        
                        return (
                          <div 
                            key={index} 
                            className={cn(
                              "rounded-lg p-3 flex items-center",
                              rental.returnDate ? "bg-muted/50" : "glass"
                            )}
                          >
                            <div className="h-12 w-12 rounded-md overflow-hidden mr-3">
                              <img 
                                src={tool.image} 
                                alt={tool.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-grow">
                              <h4 className="font-medium">{tool.name}</h4>
                              <p className="text-xs text-muted-foreground">{tool.category}</p>
                            </div>
                            <div className="text-right text-sm">
                              <div className="flex items-center text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                <span>
                                  {new Date(rental.checkoutDate).toLocaleDateString('ru-RU')}
                                </span>
                              </div>
                              {rental.returnDate && (
                                <div className="text-green-600 text-xs mt-1">
                                  Возвращено: {new Date(rental.returnDate).toLocaleDateString('ru-RU')}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <DialogFooter className="flex justify-between pt-4">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => openEditEmployeeDialog(selectedEmployee)}
                      className="flex items-center gap-2" 
                      variant="outline"
                    >
                      <Edit className="h-4 w-4" />
                      Редактировать
                    </Button>
                    <Button
                      onClick={() => openDeleteEmployeeDialog(selectedEmployee)}
                      className="flex items-center gap-2" 
                      variant="destructive"
                      disabled={!!selectedEmployee.user_id}
                    >
                      <Trash2 className="h-4 w-4" />
                      Удалить
                    </Button>
                  </div>
                  <Button
                    onClick={closeDialog}
                  >
                    Закрыть
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          )}
        </Dialog>

        <Dialog open={isEditEmployeeDialogOpen} onOpenChange={setIsEditEmployeeDialogOpen}>
          {selectedEmployee && (
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Редактировать профиль сотрудника</DialogTitle>
                <DialogDescription>Измените информацию о сотруднике</DialogDescription>
              </DialogHeader>
              
              <EditEmployeeForm 
                employee={selectedEmployee}
                onEditEmployee={handleEditEmployee}
                onCancel={closeEditEmployeeDialog}
                departments={departments}
              />
            </DialogContent>
          )}
        </Dialog>

        <AlertDialog open={isDeleteEmployeeDialogOpen} onOpenChange={setIsDeleteEmployeeDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
              <AlertDialogDescription>
                Вы собираетесь удалить сотрудника "{employeeToDelete?.name}". Это действие нельзя отменить.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={(e) => {
                  e.preventDefault();
                  if (employeeToDelete) {
                    handleDeleteEmployee(employeeToDelete.id);
                  }
                }}
              >
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TransitionWrapper>
  );
};

export default EmployeesPage;
