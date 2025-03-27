
import React, { useState } from 'react';
import { employees, Employee, tools, Tool } from '@/lib/data';
import EmployeeCard from '@/components/EmployeeCard';
import TransitionWrapper from '@/components/TransitionWrapper';
import { Search, Users, X, Package, Calendar, Plus, UserPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import AddEmployeeForm from '@/components/AddEmployeeForm';

const EmployeesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState(false);
  const [employeesList, setEmployeesList] = useState<Employee[]>(employees);

  // Get unique departments
  const departments = [...new Set(employeesList.map(emp => emp.department))];
  
  // Filter employees based on search and filters
  const filteredEmployees = employeesList.filter(employee => {
    // Search term filter
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Department filter
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

  const openAddEmployeeDialog = () => {
    setIsAddEmployeeDialogOpen(true);
  };

  const closeAddEmployeeDialog = () => {
    setIsAddEmployeeDialogOpen(false);
  };

  const handleAddEmployee = (newEmployee: Omit<Employee, 'id' | 'activeRentals' | 'rentalHistory'>) => {
    const employee: Employee = {
      ...newEmployee,
      id: `e${employeesList.length + 1}`,
      activeRentals: [],
      rentalHistory: [],
    };
    
    setEmployeesList(prev => [...prev, employee]);
    closeAddEmployeeDialog();
  };

  // Get tool details by ID
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
              Управление профилями сотрудников компании
            </p>
          </div>
          <Button 
            onClick={openAddEmployeeDialog} 
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Добавить сотрудника</span>
          </Button>
        </div>
        
        {/* Search and filters */}
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
        
        {/* Employees grid */}
        {filteredEmployees.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map(employee => (
              <EmployeeCard 
                key={employee.id} 
                employee={employee} 
                onClick={handleEmployeeClick}
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
        
        {/* Employee details dialog */}
        <Dialog open={!!selectedEmployee} onOpenChange={() => closeDialog()}>
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
                </div>
                
                {/* Active rentals */}
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
                
                {/* Rental history */}
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
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={closeDialog}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>

        {/* Add Employee Dialog */}
        <Dialog open={isAddEmployeeDialogOpen} onOpenChange={setIsAddEmployeeDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Добавить нового сотрудника</DialogTitle>
              <DialogDescription>Заполните форму для добавления нового сотрудника</DialogDescription>
            </DialogHeader>
            
            <AddEmployeeForm 
              onAddEmployee={handleAddEmployee}
              onCancel={closeAddEmployeeDialog}
              departments={departments}
            />
          </DialogContent>
        </Dialog>
      </div>
    </TransitionWrapper>
  );
};

export default EmployeesPage;
