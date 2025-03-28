
import React, { useState } from 'react';
import { crews, Crew, employees, Employee, sites, Site, subCrews, SubCrew } from '@/lib/data';
import CrewCard from '@/components/CrewCard';
import TransitionWrapper from '@/components/TransitionWrapper';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Users, X, Plus, UserPlus, Building, Edit, Trash2, HardHat } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import AddCrewForm from '@/components/AddCrewForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import SubCrewManagement from '@/components/SubCrewManagement';

const CrewsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [crewsList, setCrewsList] = useState<Crew[]>(crews);
  const [subCrewsList, setSubCrewsList] = useState<SubCrew[]>(subCrews);
  const [selectedCrew, setSelectedCrew] = useState<Crew | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showManageMembers, setShowManageMembers] = useState(false);
  const [showSubCrews, setShowSubCrews] = useState(false);
  const { toast } = useToast();

  const handleCrewClick = (crew: Crew) => {
    setSelectedCrew(crew);
  };

  const closeDialog = () => {
    setSelectedCrew(null);
  };

  const openAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  const handleAddCrew = (newCrew: Omit<Crew, 'id'>) => {
    const crew: Crew = {
      ...newCrew,
      id: `c${crewsList.length + 1}`,
      subCrews: [],
    };
    
    setCrewsList(prev => [...prev, crew]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Бригада создана",
      description: `Бригада "${newCrew.name}" успешно создана`
    });
  };

  const openEditDialog = (crew: Crew) => {
    setSelectedCrew(crew);
    setIsEditDialogOpen(true);
  };

  const handleEditCrew = (id: string, updatedCrew: Omit<Crew, 'id'>) => {
    setCrewsList(prevList => 
      prevList.map(crew => 
        crew.id === id 
          ? { 
              ...crew, 
              ...updatedCrew 
            } 
          : crew
      )
    );

    setIsEditDialogOpen(false);
    setSelectedCrew(null);
    
    toast({
      title: "Бригада обновлена",
      description: `Информация о бригаде "${updatedCrew.name}" успешно обновлена`
    });
  };

  const openDeleteDialog = (crew: Crew) => {
    setSelectedCrew(crew);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCrew = () => {
    if (!selectedCrew) return;

    // Check if crew is assigned to any site
    const assignedToSite = sites.some(site => site.crewId === selectedCrew.id);

    if (assignedToSite) {
      toast({
        title: "Ошибка удаления",
        description: "Эта бригада назначена на объект. Сначала отвяжите бригаду от объекта.",
        variant: "destructive"
      });
      setIsDeleteDialogOpen(false);
      return;
    }

    // Remove any sub-crews associated with this crew
    setSubCrewsList(prevSubCrews => 
      prevSubCrews.filter(subCrew => !selectedCrew.subCrews.includes(subCrew.id))
    );

    setCrewsList(prevList => 
      prevList.filter(crew => crew.id !== selectedCrew.id)
    );
    
    setIsDeleteDialogOpen(false);
    setSelectedCrew(null);
    
    toast({
      title: "Бригада удалена",
      description: `Бригада "${selectedCrew.name}" успешно удалена`
    });
  };

  const openManageMembers = (crew: Crew) => {
    setSelectedCrew(crew);
    setShowManageMembers(true);
  };

  const closeManageMembers = () => {
    setShowManageMembers(false);
  };

  const openManageSubCrews = (crew: Crew) => {
    setSelectedCrew(crew);
    setShowSubCrews(true);
  };

  const closeManageSubCrews = () => {
    setShowSubCrews(false);
  };

  const getEmployeeById = (id: string): Employee | undefined => {
    return employees.find(employee => employee.id === id);
  };

  const getAvailableEmployees = (): Employee[] => {
    if (!selectedCrew) return [];
    
    // Get all employees that are not in the current crew
    return employees.filter(employee => !selectedCrew.members.includes(employee.id));
  };

  const addEmployeeToCrew = (employeeId: string) => {
    if (!selectedCrew) return;

    setCrewsList(prevList => 
      prevList.map(crew => 
        crew.id === selectedCrew.id 
          ? { 
              ...crew, 
              members: [...crew.members, employeeId]
            } 
          : crew
      )
    );

    setSelectedCrew(prev => 
      prev ? { ...prev, members: [...prev.members, employeeId] } : null
    );
    
    const employee = getEmployeeById(employeeId);
    
    toast({
      title: "Сотрудник добавлен",
      description: `${employee?.name} добавлен в бригаду "${selectedCrew.name}"`
    });
  };

  const removeEmployeeFromCrew = (employeeId: string) => {
    if (!selectedCrew) return;

    // Check if employee is foreman or supervisor
    if (selectedCrew.foreman === employeeId) {
      toast({
        title: "Ошибка удаления",
        description: "Нельзя удалить бригадира из бригады. Сначала назначьте другого бригадира.",
        variant: "destructive"
      });
      return;
    }

    if (selectedCrew.supervisor === employeeId) {
      toast({
        title: "Ошибка удаления",
        description: "Нельзя удалить ГИПа из бригады. Сначала назначьте другого ГИПа.",
        variant: "destructive"
      });
      return;
    }

    setCrewsList(prevList => 
      prevList.map(crew => 
        crew.id === selectedCrew.id 
          ? { 
              ...crew, 
              members: crew.members.filter(id => id !== employeeId)
            } 
          : crew
      )
    );

    setSelectedCrew(prev => 
      prev ? { 
        ...prev, 
        members: prev.members.filter(id => id !== employeeId)
      } : null
    );
    
    const employee = getEmployeeById(employeeId);
    
    toast({
      title: "Сотрудник удален",
      description: `${employee?.name} удален из бригады "${selectedCrew.name}"`
    });
  };

  const getSubCrewsForCrew = (crewId: string): SubCrew[] => {
    if (!selectedCrew) return [];
    return subCrewsList.filter(subCrew => selectedCrew.subCrews.includes(subCrew.id));
  };

  const handleAddSubCrew = (newSubCrew: Omit<SubCrew, 'id'>) => {
    if (!selectedCrew) return;

    const subCrew: SubCrew = {
      ...newSubCrew,
      id: `sc${subCrewsList.length + 1}`,
    };
    
    setSubCrewsList(prev => [...prev, subCrew]);
    
    setCrewsList(prevList => 
      prevList.map(crew => 
        crew.id === selectedCrew.id 
          ? { 
              ...crew, 
              subCrews: [...crew.subCrews, subCrew.id]
            } 
          : crew
      )
    );

    setSelectedCrew(prev => 
      prev ? { ...prev, subCrews: [...prev.subCrews, subCrew.id] } : null
    );
  };

  const handleDeleteSubCrew = (subCrewId: string) => {
    if (!selectedCrew) return;

    setSubCrewsList(prev => prev.filter(sc => sc.id !== subCrewId));
    
    setCrewsList(prevList => 
      prevList.map(crew => 
        crew.id === selectedCrew.id 
          ? { 
              ...crew, 
              subCrews: crew.subCrews.filter(id => id !== subCrewId)
            } 
          : crew
      )
    );

    setSelectedCrew(prev => 
      prev ? { 
        ...prev, 
        subCrews: prev.subCrews.filter(id => id !== subCrewId)
      } : null
    );
    
    toast({
      title: "Подбригада удалена",
      description: "Подбригада успешно удалена из состава бригады"
    });
  };

  const handleUpdateSubCrew = (id: string, updatedSubCrew: Partial<SubCrew>) => {
    setSubCrewsList(prev => 
      prev.map(sc => 
        sc.id === id 
          ? { ...sc, ...updatedSubCrew } 
          : sc
      )
    );
  };

  // Get associated site for a crew
  const getCrewSite = (crewId: string): Site | undefined => {
    return sites.find(site => site.crewId === crewId);
  };

  const filteredCrews = crewsList.filter(crew => 
    crew.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <TransitionWrapper className="pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Бригады</h1>
            <p className="text-muted-foreground mt-2">
              Управление строительными бригадами
            </p>
          </div>
          <Button 
            onClick={openAddDialog} 
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Создать бригаду</span>
          </Button>
        </div>
        
        {/* Search */}
        <div className="glass rounded-xl mb-8 p-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input 
              type="text" 
              placeholder="Поиск бригады..." 
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
        </div>
        
        {/* Crews grid */}
        {filteredCrews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrews.map(crew => (
              <CrewCard 
                key={crew.id} 
                crew={crew} 
                onClick={handleCrewClick}
              />
            ))}
          </div>
        ) : (
          <div className="glass rounded-xl p-12 text-center">
            <HardHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-1">Бригады не найдены</h3>
            <p className="text-muted-foreground">
              Создайте свою первую бригаду, нажав на кнопку "Создать бригаду"
            </p>
            <Button
              onClick={openAddDialog}
              className="mt-4"
            >
              Создать бригаду
            </Button>
          </div>
        )}
        
        {/* Crew details dialog */}
        <Dialog open={!!selectedCrew && !isEditDialogOpen && !showManageMembers && !showSubCrews} onOpenChange={() => closeDialog()}>
          {selectedCrew && (
            <DialogContent className="sm:max-w-[650px]">
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedCrew.name}</DialogTitle>
                <DialogDescription>
                  Информация о бригаде и её участниках
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4 space-y-6">
                {/* Key positions */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Бригадир</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {getEmployeeById(selectedCrew.foreman) ? (
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                            <img 
                              src={getEmployeeById(selectedCrew.foreman)?.avatar} 
                              alt={getEmployeeById(selectedCrew.foreman)?.name}
                              className="h-full w-full object-cover" 
                            />
                          </div>
                          <div>
                            <p className="font-medium">{getEmployeeById(selectedCrew.foreman)?.name}</p>
                            <p className="text-xs text-muted-foreground">{getEmployeeById(selectedCrew.foreman)?.position}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Не назначен</p>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">ГИП</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {getEmployeeById(selectedCrew.supervisor) ? (
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                            <img 
                              src={getEmployeeById(selectedCrew.supervisor)?.avatar} 
                              alt={getEmployeeById(selectedCrew.supervisor)?.name}
                              className="h-full w-full object-cover" 
                            />
                          </div>
                          <div>
                            <p className="font-medium">{getEmployeeById(selectedCrew.supervisor)?.name}</p>
                            <p className="text-xs text-muted-foreground">{getEmployeeById(selectedCrew.supervisor)?.position}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Не назначен</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                {/* Assigned site */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Назначенный объект</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {getCrewSite(selectedCrew.id) ? (
                      <div className="flex items-center">
                        <Building className="h-10 w-10 p-2 rounded-md bg-primary/10 text-primary mr-3" />
                        <div>
                          <p className="font-medium">{getCrewSite(selectedCrew.id)?.name}</p>
                          <p className="text-xs text-muted-foreground">{getCrewSite(selectedCrew.id)?.address}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Не назначен</p>
                    )}
                  </CardContent>
                </Card>
                
                {/* Sub-crews */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium">
                      Подбригады ({selectedCrew.subCrews.length})
                    </h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1 text-xs"
                      onClick={() => openManageSubCrews(selectedCrew)}
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Управление
                    </Button>
                  </div>
                  
                  {selectedCrew.subCrews.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedCrew.subCrews.map(subCrewId => {
                        const subCrew = subCrewsList.find(sc => sc.id === subCrewId);
                        if (!subCrew) return null;
                        
                        return (
                          <Card key={subCrew.id} className="overflow-hidden">
                            <CardHeader className="bg-muted/50 pb-2">
                              <CardTitle className="text-sm">{subCrew.name}</CardTitle>
                              <CardDescription className="text-xs">
                                Специализация: {subCrew.specialization}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-2">
                              <div className="flex justify-between items-center">
                                <div className="text-sm">
                                  Бригадир: {getEmployeeById(subCrew.foreman)?.name}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {subCrew.members.length} чел.
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-muted/50 rounded-lg">
                      <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">У этой бригады нет подбригад</p>
                    </div>
                  )}
                </div>
                
                {/* Crew members */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium">
                      Состав бригады ({selectedCrew.members.length} чел.)
                    </h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1 text-xs"
                      onClick={() => openManageMembers(selectedCrew)}
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Управление
                    </Button>
                  </div>
                  
                  {selectedCrew.members.length > 0 ? (
                    <div className="space-y-3">
                      {selectedCrew.members.map(memberId => {
                        const employee = getEmployeeById(memberId);
                        if (!employee) return null;
                        
                        return (
                          <div key={employee.id} className="glass rounded-lg p-3 flex items-center">
                            <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                              <img 
                                src={employee.avatar} 
                                alt={employee.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-grow">
                              <h4 className="font-medium">{employee.name}</h4>
                              <p className="text-xs text-muted-foreground">{employee.position}</p>
                            </div>
                            {selectedCrew.foreman === employee.id && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                                Бригадир
                              </span>
                            )}
                            {selectedCrew.supervisor === employee.id && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                ГИП
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-muted/50 rounded-lg">
                      <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">В бригаде нет сотрудников</p>
                    </div>
                  )}
                </div>
                
                <DialogFooter className="flex justify-between gap-2 pt-4">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => openEditDialog(selectedCrew)}
                      className="flex items-center gap-2" 
                      variant="outline"
                    >
                      <Edit className="h-4 w-4" />
                      Редактировать
                    </Button>
                    <Button
                      onClick={() => openDeleteDialog(selectedCrew)}
                      className="flex items-center gap-2" 
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Удалить
                    </Button>
                  </div>
                  <Button onClick={closeDialog}>
                    Закрыть
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          )}
        </Dialog>

        {/* Sub-Crews Management Dialog */}
        <Dialog open={showSubCrews} onOpenChange={setShowSubCrews}>
          {selectedCrew && (
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Управление подбригадами</DialogTitle>
                <DialogDescription>
                  Создание и управление специализированными подбригадами
                </DialogDescription>
              </DialogHeader>
              
              <SubCrewManagement
                subCrews={getSubCrewsForCrew(selectedCrew.id)}
                onAddSubCrew={handleAddSubCrew}
                onDeleteSubCrew={handleDeleteSubCrew}
                onUpdateSubCrew={handleUpdateSubCrew}
                crewId={selectedCrew.id}
                availableEmployees={employees}
                getEmployeeById={getEmployeeById}
              />
              
              <DialogFooter className="mt-4">
                <Button onClick={closeManageSubCrews}>
                  Готово
                </Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>

        {/* Manage Crew Members Dialog */}
        <Dialog open={showManageMembers} onOpenChange={setShowManageMembers}>
          {selectedCrew && (
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Управление составом бригады</DialogTitle>
                <DialogDescription>
                  Добавляйте и удаляйте сотрудников из бригады "{selectedCrew.name}"
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Текущий состав бригады</h3>
                  {selectedCrew.members.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Сотрудник</TableHead>
                          <TableHead>Должность</TableHead>
                          <TableHead>Роль в бригаде</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedCrew.members.map(memberId => {
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
                                {selectedCrew.foreman === employee.id && (
                                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                                    Бригадир
                                  </span>
                                )}
                                {selectedCrew.supervisor === employee.id && (
                                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                    ГИП
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  onClick={() => removeEmployeeFromCrew(employee.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
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
                      <p className="text-muted-foreground">В бригаде нет сотрудников</p>
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
                      {getAvailableEmployees().map(employee => (
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
                              onClick={() => addEmployeeToCrew(employee.id)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-4 w-4 text-primary" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {getAvailableEmployees().length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                            Все сотрудники уже добавлены в бригаду
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

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
              <AlertDialogDescription>
                Вы собираетесь удалить бригаду "{selectedCrew?.name}". Это действие нельзя отменить.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDeleteCrew}
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

export default CrewsPage;
