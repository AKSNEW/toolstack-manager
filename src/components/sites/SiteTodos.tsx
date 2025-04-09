
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { List, Plus, Loader2 } from 'lucide-react';
import TodoList from '@/components/todos/TodoList';
import AddTodoForm from '@/components/todos/AddTodoForm';
import { useToast } from '@/hooks/use-toast';
import { fetchSiteTodos, updateTodo, deleteTodo } from '@/lib/data/todos';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SiteTodosProps {
  siteId: string;
  siteName: string;
}

const SiteTodos: React.FC<SiteTodosProps> = ({ siteId, siteName }) => {
  const [todos, setTodos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const loadTodos = async () => {
    setIsLoading(true);
    try {
      const siteTodos = await fetchSiteTodos(siteId);
      setTodos(siteTodos);
    } catch (error) {
      console.error('Error loading todos:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить список задач',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [siteId]);

  const handleEdit = (todo: any) => {
    // Implement edit functionality if needed
    console.log('Edit todo:', todo);
  };

  const handleDelete = (id: string) => {
    setTodoToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!todoToDelete) return;
    
    try {
      const success = await deleteTodo(todoToDelete);
      if (success) {
        setTodos(prev => prev.filter(todo => todo.id !== todoToDelete));
        toast({
          title: 'Задача удалена',
          description: 'Задача успешно удалена',
        });
      } else {
        toast({
          title: 'Ошибка',
          description: 'Не удалось удалить задачу',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить задачу',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setTodoToDelete(null);
    }
  };

  const handleStatusChange = async (id: string, status: 'pending' | 'in-progress' | 'completed') => {
    try {
      const updatedTodo = await updateTodo(id, { status });
      if (updatedTodo) {
        // Update local state
        setTodos(prev => prev.map(todo => todo.id === id ? { ...todo, status } : todo));
        toast({
          title: 'Статус обновлен',
          description: `Задача переведена в статус "${status === 'completed' ? 'Завершена' : status === 'in-progress' ? 'В работе' : 'Ожидает'}"`,
        });
      } else {
        toast({
          title: 'Ошибка',
          description: 'Не удалось обновить статус задачи',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating todo status:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус задачи',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <List className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Задачи на объекте</h2>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить задачу
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <TodoList 
          todos={todos} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          onStatusChange={handleStatusChange} 
        />
      )}
      
      <AddTodoForm 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={loadTodos}
        siteId={siteId}
        siteName={siteName}
      />
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить задачу?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Задача будет удалена навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SiteTodos;
