import React, { useState } from 'react';
import { SubCrew, Employee } from '@/lib/data';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, UserPlus, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { supabase } from '@/integrations/supabase/client';
import { adaptSubCrewFromDB, adaptSubCrewToDB, adaptCrewToDB, adaptSubCrewForInsert } from '@/lib/supabase-adapters';

interface SubCrewManagementProps {
  subCrews: SubCrew[];
  onAddSubCrew: (subCrew: Omit<SubCrew, 'id'>) => void;
  onDeleteSubCrew: (id: string) => void;
  onUpdateSubCrew: (id: string, subCrew: Partial<SubCrew>) => void;
  crewId: string;
  availableEmployees: Employee[];
  getEmployeeById: (id: string) => Employee | undefined;
}

const SubCrewManagement: React.FC<SubCrewManagementProps> = ({
  subCrews,
  onAddSubCrew,
  onDeleteSubCrew,
  onUpdateSubCrew,
  crewId,
  availableEmployees,
  getEmployeeById,
}) => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSubCrew, setSelectedSubCrew] = useState<SubCrew | null>(null);
  const [showManageMembers, setShowManageMembers] = useState(false);
  const [newSubCrewName, setNewSubCrewName] = useState('');
  const [newSubCrewForeman, setNewSubCrewForeman] = useState('');
  const [newSubCrewSpecialization, setNewSubCrewSpecialization] = useState('');

  const openAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
    setNewSubCrewName('');
    setNewSubCrewForeman('');
    setNewSubCrewSpecialization('');
  };

  const handleAddSubCrew = async () => {
    if (!newSubCrewName || !newSubCrewForeman || !newSubCrewSpecialization) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    try {
      const newSubCrewData = {
        name: newSubCrewName,
        foreman: newSubCrewForeman,
        members: [newSubCrewForeman],
        specialization: newSubCrewSpecialization,
      };

      const { data: newSubCrew, error } = await supabase
        .from('subcrews')
        .insert(adaptSubCrewForInsert(newSubCrewData))
        .select();
        
      if (error) throw error;
      
      if (newSubCrew && newSubCrew[0]) {
        onAddSubCrew(newSubCrewData);
        
        const { error: updateError } = await supabase
          .from('crews')
          .update(adaptCrewToDB({
            subCrews: [...(subCrews.map(sc => sc.id)), newSubCrew[0].id]
          }))
          .eq('id', crewId);
          
        if (updateError) throw updateError;
        
        closeAddDialog();
      
        toast({
          title: "Подбригада создана",
          description: `Подбригада "${newSubCrewName}" успешно создана`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Ошибка создания подбригады",
        description: error.message,
        variant: "destructive",
      });
      console.error("Error creating subcrew:", error);
    }
  };

  const openManageMembers = (subCrew: SubCrew) => {
    setSelectedSubCrew(subCrew);
    setShowManageMembers(true);
  };

  const closeManageMembers = () => {
    setShowManageMembers(false);
    setSelectedSubCrew(null);
  };

  const getAvailableMembersForSubCrew = () => {
    if (!selectedSubCrew) return [];
    
    return availableEmployees.filter(employee => !selectedSubCrew.members.includes(employee.id));
  };

  const addEmployeeToSubCrew = async (employeeId: string) => {
    if (!selectedSubCrew) return;

    try {
      const updatedMembers = [...selectedSubCrew.members, employeeId];
      
      const { error } = await supabase
        .from('subcrews')
        .update(adaptSubCrewToDB({ members: updatedMembers }))
        .eq('id', selectedSubCrew.id);
        
      if (error) throw error;
      
      onUpdateSubCrew(selectedSubCrew.id, { members: updatedMembers });
      
      setSelectedSubCrew(prev => 
        prev ? { ...prev, members: updatedMembers } : null
      );
      
      const employee = getEmployeeById(employeeId);
      
      toast({
        title: "Сотрудник добавлен",
        description: `${employee?.name} добавлен в подбригаду "${selectedSubCrew.name}"`,
      });
    } catch (error: any) {
      toast({
        title: "Ошибка добавления сотрудника",
        description: error.message,
        variant: "destructive",
      });
      console.error("Error adding employee to subcrew:", error);
    }
  };

  const handleUpdateSubCrew = async (id: string, updatedSubCrew: Partial<SubCrew>) => {
    try {
      const updateData = adaptSubCrewToDB(updatedSubCrew);
      
      const { error } = await supabase
        .from('subcrews')
        .update(updateData)
        .eq('id', id);
        
      if (error) throw error;
      
      onUpdateSubCrew(id, updatedSubCrew);
      
      toast({
        title: "Подбригада обновлена",
        description: "Данные подбригады успешно обновлены",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка обновления подбригады",
        description: error.message,
        variant: "destructive",
      });
      console.error("Error updating subcrew:", error);
    }
  };

  const removeEmployeeFromSubCrew = async (employeeId: string) => {
    if (!selectedSubCrew) return;

    if (selectedSubCrew.foreman === employeeId) {
      toast({
        title: "Ошибка удаления",
        description: "Нельзя удалить бригадира из подбригады. Сначала назначьте другого бригадира.",
        variant: "destructive",
      });
      return;
    }

    try {
      const updatedMembers = selectedSubCrew.members.filter(id => id !== employeeId);
      
      const { error } = await supabase
        .from('subcrews')
        .update(adaptSubCrewToDB({ members: updatedMembers }))
        .eq('id', selectedSubCrew.id);
        
      if (error) throw error;
      
      onUpdateSubCrew(selectedSubCrew.id, { members: updatedMembers });
      
      setSelectedSubCrew(prev => 
        prev ? { ...prev, members: updatedMembers } : null
      );
      
      const employee = getEmployeeById(employeeId);
      
      toast({
        title: "Сотрудник удален",
        description: `${employee?.name} удален из подбригады "${selectedSubCrew.name}"`,
      });
    } catch (error: any) {
      toast({
        title: "Ошибка удаления сотрудника",
        description: error.message,
        variant: "destructive",
      });
      console.error("Error removing employee from subcrew:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Подбригады</h3>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
          onClick={openAddDialog}
        >
          <Plus className="h-3.5 w-3.5" />
          Добавить подбригаду
        </Button>
      </div>

      {subCrews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subCrews.map(subCrew => (
            <Card key={subCrew.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50 pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{subCrew.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-full"
                    onClick={() => onDeleteSubCrew(subCrew.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  Специализация: {subCrew.specialization}
                </div>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium">
                    Бригадир: {getEmployeeById(subCrew.foreman)?.name || 'Не назначен'}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {subCrew.members.length} чел.
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 text-xs flex items-center justify-center gap-1"
                  onClick={() => openManageMembers(subCrew)}
                >
                  <UserPlus className="h-3 w-3" />
                  Управление составом
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-6 bg-muted/50 rounded-lg">
          <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">У этой бригады нет подбригад</p>
        </div>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Добавить новую подбригаду</DialogTitle>
            <DialogDescription>
              Создайте специализированную подбригаду и назначьте бригадира
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subcrew-name">Название подбригады</Label>
              <Input
                id="subcrew-name"
                value={newSubCrewName}
                onChange={(e) => setNewSubCrewName(e.target.value)}
                placeholder="Введите название подбригады"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subcrew-specialization">Специализация</Label>
              <Input
                id="subcrew-specialization"
                value={newSubCrewSpecialization}
                onChange={(e) => setNewSubCrewSpecialization(e.target.value)}
                placeholder="Наприм��р: Электромонтаж, Сантехника, и т.д."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subcrew-foreman">Бригадир</Label>
              <select
                id="subcrew-foreman"
                value={newSubCrewForeman}
                onChange={(e) => setNewSubCrewForeman(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Выберите бригадира</option>
                {availableEmployees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} - {employee.position}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={closeAddDialog}>Отмена</Button>
            <Button onClick={handleAddSubCrew}>Создать подбригаду</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showManageMembers} onOpenChange={setShowManageMembers}>
        {selectedSubCrew && (
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Управление составом подбригады</DialogTitle>
              <DialogDescription>
                Добавляйте и удаляйте сотрудников из подбригады "{selectedSubCrew.name}"
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Текущий состав подбригады</h3>
                {selectedSubCrew.members.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Сотрудник</TableHead>
                        <TableHead>Должность</TableHead>
                        <TableHead>Роль</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedSubCrew.members.map(memberId => {
                        const employee = getEmployeeById(memberId);
                        if (!employee) return null;
                        
                        return (
                          <TableRow key={employee.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                                  <img 
                                    src={employee.avatar} 
                                    alt={employee.name} 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                {employee.name}
                              </div>
                            </TableCell>
                            <TableCell>{employee.position}</TableCell>
                            <TableCell>
                              {selectedSubCrew.foreman === employee.id && (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                                  Бригадир
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                onClick={() => removeEmployeeFromSubCrew(employee.id)}
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                disabled={selectedSubCrew.foreman === employee.id}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center p-6 bg-muted/50 rounded-lg">
                    <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">В подбригаде нет сотрудников</p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Доступные сотрудники</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Сотрудник</TableHead>
                      <TableHead>Должность</TableHead>
                      <TableHead>Отдел</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getAvailableMembersForSubCrew().map(employee => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                              <img 
                                src={employee.avatar} 
                                alt={employee.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            {employee.name}
                          </div>
                        </TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            onClick={() => addEmployeeToSubCrew(employee.id)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4 text-primary" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {getAvailableMembersForSubCrew().length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                          Все доступные сотрудники уже добавлены в подбригаду
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <DialogFooter className="mt-4">
              <Button onClick={closeManageMembers}>
                Готово
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default SubCrewManagement;
