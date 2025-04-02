import React, { useState } from 'react';
import TransitionWrapper from '@/components/TransitionWrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { expenseReceipts, travelExpenses, employees, ExpenseReceipt, TravelExpense } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt, Bus, FileText, Filter, Plus, Search, Calendar, BadgeRussianRuble } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import ExpenseReceiptForm from '@/components/ExpenseReceiptForm';
import AccountantChat from '@/components/AccountantChat';

const getEmployeeById = (id: string) => {
  return employees.find(emp => emp.id === id);
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(amount);
};

const AccountingPage = () => {
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  const [isChatDialogOpen, setIsChatDialogOpen] = useState(false);

  const handleApproveReceipt = (id: string) => {
    const receiptIndex = expenseReceipts.findIndex(r => r.id === id);
    if (receiptIndex !== -1) {
      expenseReceipts[receiptIndex].status = 'approved';
      toast.success('Чек успешно одобрен');
    }
  };

  const handleRejectReceipt = (id: string) => {
    const receiptIndex = expenseReceipts.findIndex(r => r.id === id);
    if (receiptIndex !== -1) {
      expenseReceipts[receiptIndex].status = 'rejected';
      toast.success('Чек отклонен');
    }
  };

  const handleApproveExpense = (id: string) => {
    const expenseIndex = travelExpenses.findIndex(e => e.id === id);
    if (expenseIndex !== -1) {
      travelExpenses[expenseIndex].status = 'approved';
      toast.success('Командировочные расходы одобрены');
    }
  };

  const handleRejectExpense = (id: string) => {
    const expenseIndex = travelExpenses.findIndex(e => e.id === id);
    if (expenseIndex !== -1) {
      travelExpenses[expenseIndex].status = 'rejected';
      toast.success('Командировочные расходы отклонены');
    }
  };

  return (
    <TransitionWrapper className="pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Бухгалтерия</h1>
            <p className="text-muted-foreground mt-2">
              Управление расходами, чеками и финансовой отчетностью
            </p>
          </div>
          
          <div className="fixed bottom-6 right-6 z-10 sm:hidden">
            <Button 
              onClick={() => setIsReceiptDialogOpen(true)}
              size="lg"
              className="rounded-full shadow-lg h-14 w-14 p-0"
            >
              <Plus className="h-6 w-6" />
              <span className="sr-only">Добавить чек</span>
            </Button>
          </div>
          
          <div className="hidden sm:flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => setIsChatDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              <span>Чат с бухгалтером</span>
            </Button>
            <Button 
              onClick={() => setIsReceiptDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Добавить чек</span>
            </Button>
          </div>
          
          <div className="sm:hidden flex justify-center">
            <Button 
              variant="outline"
              onClick={() => setIsChatDialogOpen(true)}
              className="w-full flex items-center justify-center gap-2"
            >
              <FileText className="h-4 w-4" />
              <span>Чат с бухгалтером</span>
            </Button>
          </div>
        </div>

        <div className="mb-6 sm:hidden">
          <Button 
            onClick={() => setIsReceiptDialogOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-6 text-base"
            variant="default"
          >
            <Plus className="h-5 w-5" />
            <span>Добавить чек</span>
          </Button>
        </div>

        <Tabs defaultValue="receipts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="receipts" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              <span>Чеки на расходы</span>
            </TabsTrigger>
            <TabsTrigger value="travel" className="flex items-center gap-2">
              <Bus className="h-4 w-4" />
              <span>Командировочные</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="receipts" className="space-y-6">
            <div className="glass p-4 rounded-xl mb-6">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input 
                    type="text" 
                    placeholder="Поиск по чекам..." 
                    className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Фильтры</span>
                </Button>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Сотрудник</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Категория</TableHead>
                    <TableHead>Описание</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenseReceipts.map((receipt) => {
                    const employee = getEmployeeById(receipt.employeeId);
                    
                    return (
                      <TableRow key={receipt.id}>
                        <TableCell className="font-medium">
                          {employee?.name}
                        </TableCell>
                        <TableCell>
                          {new Date(receipt.date).toLocaleDateString('ru-RU')}
                        </TableCell>
                        <TableCell>
                          {receipt.category === 'materials' && 'Материалы'}
                          {receipt.category === 'tools' && 'Инструменты'}
                          {receipt.category === 'travel' && 'Проезд'}
                          {receipt.category === 'food' && 'Питание'}
                          {receipt.category === 'other' && 'Прочее'}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {receipt.description}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(receipt.amount)}
                        </TableCell>
                        <TableCell>
                          {receipt.status === 'pending' && (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">На рассмотрении</Badge>
                          )}
                          {receipt.status === 'approved' && (
                            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Одобрено</Badge>
                          )}
                          {receipt.status === 'rejected' && (
                            <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Отклонено</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {receipt.status === 'pending' && (
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 text-green-600"
                                onClick={() => handleApproveReceipt(receipt.id)}
                              >
                                Одобрить
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 text-red-600"
                                onClick={() => handleRejectReceipt(receipt.id)}
                              >
                                Отклонить
                              </Button>
                            </div>
                          )}
                          {receipt.status !== 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8"
                            >
                              Подробнее
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              {expenseReceipts.length === 0 && (
                <div className="py-12 text-center">
                  <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">Нет чеков</h3>
                  <p className="text-muted-foreground">
                    Добавьте свой первый чек для учета расходов
                  </p>
                  <Button
                    onClick={() => setIsReceiptDialogOpen(true)}
                    className="mt-4"
                  >
                    Добавить чек
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="travel" className="space-y-6">
            <div className="glass p-4 rounded-xl mb-6">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input 
                    type="text" 
                    placeholder="Поиск по командировкам..." 
                    className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Фильтры</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {travelExpenses.map((expense) => {
                const employee = getEmployeeById(expense.employeeId);
                
                return (
                  <Card key={expense.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{employee?.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <span>Командировка: {expense.destination}</span>
                            <span>•</span>
                            <span>
                              {new Date(expense.startDate).toLocaleDateString('ru-RU')} - {new Date(expense.endDate).toLocaleDateString('ru-RU')}
                            </span>
                          </CardDescription>
                        </div>
                        <div>
                          {expense.status === 'pending' && (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">На рассмотрении</Badge>
                          )}
                          {expense.status === 'approved' && (
                            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Одобрено</Badge>
                          )}
                          {expense.status === 'rejected' && (
                            <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Отклонено</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm mb-3">{expense.purpose}</div>
                      
                      <div className="space-y-4">
                        {expense.perDiem && (
                          <div className="bg-muted/30 p-4 rounded-lg mb-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2 font-medium">
                                <BadgeRussianRuble className="h-5 w-5 text-primary" />
                                <span>Суточные</span>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>{expense.perDiem.days} дн.</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                              <div>
                                <p className="text-xs text-muted-foreground">Город</p>
                                <p>{expense.perDiem.city}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">Ставка</p>
                                <p>{formatCurrency(expense.perDiem.dailyRate)} / день</p>
                              </div>
                            </div>
                            
                            {expense.perDiem.description && (
                              <p className="text-sm text-muted-foreground mt-2">{expense.perDiem.description}</p>
                            )}
                            
                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
                              <span className="font-medium">Всего суточных:</span>
                              <span className="font-bold">{formatCurrency(expense.perDiem.totalAmount)}</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="font-medium text-sm text-muted-foreground">Расходы:</div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Тип</TableHead>
                              <TableHead>Описание</TableHead>
                              <TableHead className="text-right">Сумма</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {expense.expenses.map((item, i) => (
                              <TableRow key={i}>
                                <TableCell>
                                  {item.type === 'transportation' && 'Транспорт'}
                                  {item.type === 'accommodation' && 'Проживание'}
                                  {item.type === 'food' && 'Питание'}
                                  {item.type === 'other' && 'Прочее'}
                                </TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(item.amount)}
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell colSpan={2} className="font-medium">
                                Итого:
                              </TableCell>
                              <TableCell className="text-right font-bold">
                                {formatCurrency(expense.totalAmount)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                      
                      {expense.status === 'pending' && (
                        <div className="flex justify-end gap-2 mt-4">
                          <Button 
                            variant="outline" 
                            className="text-green-600"
                            onClick={() => handleApproveExpense(expense.id)}
                          >
                            Одобрить
                          </Button>
                          <Button 
                            variant="outline" 
                            className="text-red-600"
                            onClick={() => handleRejectExpense(expense.id)}
                          >
                            Отклонить
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
              
              {travelExpenses.length === 0 && (
                <div className="py-12 text-center border rounded-xl">
                  <Bus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">Нет командировочных расходов</h3>
                  <p className="text-muted-foreground">
                    Здесь будут отображаться ваши командировочные расходы
                  </p>
                  <Button className="mt-4">
                    Добавить командировку
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Добавить чек</DialogTitle>
            <DialogDescription>
              Заполните информацию о расходах для отчетности
            </DialogDescription>
          </DialogHeader>
          
          <ExpenseReceiptForm onSuccess={() => setIsReceiptDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isChatDialogOpen} onOpenChange={setIsChatDialogOpen}>
        <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle>Чат с бухгалтером</DialogTitle>
            <DialogDescription>
              Задайте вопросы по расходам, чекам или другим финансовым вопросам
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden">
            <AccountantChat />
          </div>
        </DialogContent>
      </Dialog>
    </TransitionWrapper>
  );
};

export default AccountingPage;
