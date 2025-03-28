
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import TransitionWrapper from '@/components/TransitionWrapper';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { employees, expenseReceipts, travelExpenses, ExpenseReceipt, TravelExpense } from '@/lib/data';
import { Receipt, PlaneTakeoff, Search, Plus, X, FileText, Upload, DollarSign, Calendar } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const AccountingPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('receipts');
  const [receipts, setReceipts] = useState(expenseReceipts);
  const [travels, setTravels] = useState(travelExpenses);
  const [isAddReceiptOpen, setIsAddReceiptOpen] = useState(false);
  const [isAddTravelOpen, setIsAddTravelOpen] = useState(false);

  // Receipt form state
  const [newReceipt, setNewReceipt] = useState<Partial<ExpenseReceipt>>({
    employeeId: '',
    date: '',
    amount: 0,
    description: '',
    category: 'materials',
    status: 'pending',
  });

  // Travel expense form state
  const [newTravel, setNewTravel] = useState<Partial<TravelExpense>>({
    employeeId: '',
    startDate: '',
    endDate: '',
    destination: '',
    purpose: '',
    expenses: [],
    status: 'pending',
    totalAmount: 0,
  });
  
  const [newExpenseItem, setNewExpenseItem] = useState({
    type: 'transportation' as 'transportation' | 'accommodation' | 'food' | 'other',
    amount: 0,
    description: '',
  });

  const filteredReceipts = receipts.filter(receipt => {
    const employee = employees.find(e => e.id === receipt.employeeId);
    return (
      employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const filteredTravels = travels.filter(travel => {
    const employee = employees.find(e => e.id === travel.employeeId);
    return (
      employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      travel.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      travel.purpose.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getEmployeeName = (id: string): string => {
    const employee = employees.find(e => e.id === id);
    return employee?.name || 'Неизвестный сотрудник';
  };

  const handleAddReceipt = () => {
    if (!newReceipt.employeeId || !newReceipt.date || !newReceipt.amount || !newReceipt.description) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    const receipt: ExpenseReceipt = {
      id: `r${receipts.length + 1}`,
      employeeId: newReceipt.employeeId!,
      date: newReceipt.date!,
      amount: Number(newReceipt.amount),
      description: newReceipt.description!,
      category: newReceipt.category as 'materials' | 'tools' | 'travel' | 'food' | 'other',
      status: 'pending',
      imageUrl: newReceipt.imageUrl,
    };

    setReceipts([...receipts, receipt]);
    setIsAddReceiptOpen(false);
    setNewReceipt({
      employeeId: '',
      date: '',
      amount: 0,
      description: '',
      category: 'materials',
      status: 'pending',
    });

    toast({
      title: "Чек добавлен",
      description: "Чек успешно отправлен в бухгалтерию",
    });
  };

  const addExpenseItem = () => {
    if (!newExpenseItem.amount || !newExpenseItem.description) {
      toast({
        title: "Ошибка",
        description: "Укажите сумму и описание для добавления расхода",
        variant: "destructive",
      });
      return;
    }

    setNewTravel(prev => ({
      ...prev,
      expenses: [...(prev.expenses || []), { ...newExpenseItem }],
      totalAmount: (prev.totalAmount || 0) + newExpenseItem.amount,
    }));

    setNewExpenseItem({
      type: 'transportation',
      amount: 0,
      description: '',
    });
  };

  const removeExpenseItem = (index: number) => {
    const expenseAmount = newTravel.expenses?.[index].amount || 0;
    
    setNewTravel(prev => ({
      ...prev,
      expenses: prev.expenses?.filter((_, i) => i !== index) || [],
      totalAmount: (prev.totalAmount || 0) - expenseAmount,
    }));
  };

  const handleAddTravel = () => {
    if (
      !newTravel.employeeId || 
      !newTravel.startDate || 
      !newTravel.endDate || 
      !newTravel.destination || 
      !newTravel.purpose
    ) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    if (!newTravel.expenses?.length) {
      toast({
        title: "Ошибка",
        description: "Добавьте хотя бы один расход",
        variant: "destructive",
      });
      return;
    }

    const travel: TravelExpense = {
      id: `t${travels.length + 1}`,
      employeeId: newTravel.employeeId,
      startDate: newTravel.startDate,
      endDate: newTravel.endDate,
      destination: newTravel.destination,
      purpose: newTravel.purpose,
      expenses: newTravel.expenses || [],
      status: 'pending',
      totalAmount: newTravel.totalAmount || 0,
    };

    setTravels([...travels, travel]);
    setIsAddTravelOpen(false);
    setNewTravel({
      employeeId: '',
      startDate: '',
      endDate: '',
      destination: '',
      purpose: '',
      expenses: [],
      status: 'pending',
      totalAmount: 0,
    });

    toast({
      title: "Командировка добавлена",
      description: "Отчет о командировке успешно отправлен в бухгалтерию",
    });
  };

  return (
    <TransitionWrapper className="pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Бухгалтерия</h1>
            <p className="text-muted-foreground mt-2">
              Управление чеками и командировочными расходами
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="glass rounded-xl mb-8 p-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input 
              type="text" 
              placeholder="Поиск по сотрудникам, описанию или категории..." 
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

        <Tabs defaultValue="receipts" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="receipts" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              <span>Чеки и расходы</span>
            </TabsTrigger>
            <TabsTrigger value="travel" className="flex items-center gap-2">
              <PlaneTakeoff className="h-4 w-4" />
              <span>Командировки</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Receipts Tab */}
          <TabsContent value="receipts" className="mt-6">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setIsAddReceiptOpen(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Отправить чек</span>
              </Button>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Чеки и расходы</CardTitle>
                <CardDescription>
                  История чеков и расходов, отправленных в бухгалтерию
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Дата</TableHead>
                      <TableHead>Сотрудник</TableHead>
                      <TableHead>Описание</TableHead>
                      <TableHead>Категория</TableHead>
                      <TableHead>Сумма</TableHead>
                      <TableHead>Статус</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReceipts.length > 0 ? (
                      filteredReceipts.map(receipt => (
                        <TableRow key={receipt.id}>
                          <TableCell>{new Date(receipt.date).toLocaleDateString('ru-RU')}</TableCell>
                          <TableCell className="font-medium">{getEmployeeName(receipt.employeeId)}</TableCell>
                          <TableCell>{receipt.description}</TableCell>
                          <TableCell>
                            {receipt.category === 'materials' && 'Материалы'}
                            {receipt.category === 'tools' && 'Инструменты'}
                            {receipt.category === 'travel' && 'Проезд'}
                            {receipt.category === 'food' && 'Питание'}
                            {receipt.category === 'other' && 'Прочее'}
                          </TableCell>
                          <TableCell>{receipt.amount.toLocaleString('ru-RU')} ₽</TableCell>
                          <TableCell>
                            {receipt.status === 'pending' && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                На рассмотрении
                              </span>
                            )}
                            {receipt.status === 'approved' && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                Одобрено
                              </span>
                            )}
                            {receipt.status === 'rejected' && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                Отклонено
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          {searchTerm ? 'Ничего не найдено' : 'Нет чеков для отображения'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Travel Tab */}
          <TabsContent value="travel" className="mt-6">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setIsAddTravelOpen(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Добавить командировку</span>
              </Button>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Командировки</CardTitle>
                <CardDescription>
                  История командировок и связанных с ними расходов
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Период</TableHead>
                      <TableHead>Сотрудник</TableHead>
                      <TableHead>Назначение</TableHead>
                      <TableHead>Сумма</TableHead>
                      <TableHead>Статус</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTravels.length > 0 ? (
                      filteredTravels.map(travel => (
                        <TableRow key={travel.id}>
                          <TableCell>
                            {new Date(travel.startDate).toLocaleDateString('ru-RU')} - {new Date(travel.endDate).toLocaleDateString('ru-RU')}
                          </TableCell>
                          <TableCell className="font-medium">{getEmployeeName(travel.employeeId)}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{travel.destination}</div>
                              <div className="text-xs text-muted-foreground">{travel.purpose}</div>
                            </div>
                          </TableCell>
                          <TableCell>{travel.totalAmount.toLocaleString('ru-RU')} ₽</TableCell>
                          <TableCell>
                            {travel.status === 'pending' && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                На рассмотрении
                              </span>
                            )}
                            {travel.status === 'approved' && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                Одобрено
                              </span>
                            )}
                            {travel.status === 'rejected' && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                Отклонено
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          {searchTerm ? 'Ничего не найдено' : 'Нет командировок для отображения'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Receipt Dialog */}
        <Dialog open={isAddReceiptOpen} onOpenChange={setIsAddReceiptOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Отправить чек</DialogTitle>
              <DialogDescription>
                Заполните информацию о расходе для отправки в бухгалтерию
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="employee">Сотрудник</Label>
                <select
                  id="employee"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newReceipt.employeeId}
                  onChange={(e) => setNewReceipt({...newReceipt, employeeId: e.target.value})}
                >
                  <option value="">Выберите сотрудника</option>
                  {employees.map(employee => (
                    <option key={employee.id} value={employee.id}>{employee.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Дата</Label>
                <Input
                  id="date"
                  type="date"
                  value={newReceipt.date}
                  onChange={(e) => setNewReceipt({...newReceipt, date: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Категория</Label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newReceipt.category}
                  onChange={(e) => setNewReceipt({...newReceipt, category: e.target.value as any})}
                >
                  <option value="materials">Материалы</option>
                  <option value="tools">Инструменты</option>
                  <option value="travel">Проезд</option>
                  <option value="food">Питание</option>
                  <option value="other">Прочее</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Сумма (₽)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newReceipt.amount || ''}
                  onChange={(e) => setNewReceipt({...newReceipt, amount: Number(e.target.value)})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  placeholder="Опишите, за что был совершен расход"
                  value={newReceipt.description}
                  onChange={(e) => setNewReceipt({...newReceipt, description: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="receipt-image">URL изображения чека (опционально)</Label>
                <Input
                  id="receipt-image"
                  placeholder="https://..."
                  value={newReceipt.imageUrl || ''}
                  onChange={(e) => setNewReceipt({...newReceipt, imageUrl: e.target.value})}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddReceiptOpen(false)}>Отмена</Button>
              <Button onClick={handleAddReceipt} className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Отправить чек
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Travel Dialog */}
        <Dialog open={isAddTravelOpen} onOpenChange={setIsAddTravelOpen}>
          <DialogContent className="max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Добавить командировку</DialogTitle>
              <DialogDescription>
                Заполните информацию о командировке и связанных расходах
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="travel-employee">Сотрудник</Label>
                  <select
                    id="travel-employee"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newTravel.employeeId}
                    onChange={(e) => setNewTravel({...newTravel, employeeId: e.target.value})}
                  >
                    <option value="">Выберите сотрудника</option>
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.id}>{employee.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="destination">Место назначения</Label>
                  <Input
                    id="destination"
                    placeholder="Город или страна"
                    value={newTravel.destination}
                    onChange={(e) => setNewTravel({...newTravel, destination: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Дата начала</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={newTravel.startDate}
                    onChange={(e) => setNewTravel({...newTravel, startDate: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="end-date">Дата окончания</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={newTravel.endDate}
                    onChange={(e) => setNewTravel({...newTravel, endDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="purpose">Цель командировки</Label>
                <Textarea
                  id="purpose"
                  placeholder="Опишите цель командировки"
                  value={newTravel.purpose}
                  onChange={(e) => setNewTravel({...newTravel, purpose: e.target.value})}
                />
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Расходы</h3>
                  <span className="text-sm text-muted-foreground">
                    Итого: {newTravel.totalAmount?.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                
                {newTravel.expenses && newTravel.expenses.length > 0 ? (
                  <div className="space-y-2 mb-4">
                    {newTravel.expenses.map((expense, index) => (
                      <div key={index} className="flex items-center justify-between glass rounded-lg p-3">
                        <div>
                          <div className="font-medium text-sm">
                            {expense.type === 'transportation' && 'Транспорт'}
                            {expense.type === 'accommodation' && 'Проживание'}
                            {expense.type === 'food' && 'Питание'}
                            {expense.type === 'other' && 'Прочее'}
                          </div>
                          <div className="text-xs text-muted-foreground">{expense.description}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{expense.amount.toLocaleString('ru-RU')} ₽</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => removeExpenseItem(index)}
                          >
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4 mb-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Добавьте расходы для командировки</p>
                  </div>
                )}
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Добавить расход</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-3 gap-4 mb-2">
                      <div>
                        <Label htmlFor="expense-type" className="text-xs">Тип</Label>
                        <select
                          id="expense-type"
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          value={newExpenseItem.type}
                          onChange={(e) => setNewExpenseItem({...newExpenseItem, type: e.target.value as any})}
                        >
                          <option value="transportation">Транспорт</option>
                          <option value="accommodation">Проживание</option>
                          <option value="food">Питание</option>
                          <option value="other">Прочее</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="expense-amount" className="text-xs">Сумма (₽)</Label>
                        <Input
                          id="expense-amount"
                          type="number"
                          className="h-9"
                          value={newExpenseItem.amount || ''}
                          onChange={(e) => setNewExpenseItem({...newExpenseItem, amount: Number(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="expense-description" className="text-xs">Описание</Label>
                        <Input
                          id="expense-description"
                          className="h-9"
                          value={newExpenseItem.description}
                          onChange={(e) => setNewExpenseItem({...newExpenseItem, description: e.target.value})}
                        />
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={addExpenseItem}
                    >
                      Добавить расход
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddTravelOpen(false)}>Отмена</Button>
              <Button onClick={handleAddTravel} className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Отправить командировку
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TransitionWrapper>
  );
};

export default AccountingPage;
