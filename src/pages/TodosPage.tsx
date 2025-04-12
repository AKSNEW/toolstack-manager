
import React, { useState, useEffect } from 'react';
import { fetchTodos } from '@/lib/data/todos';
import TodoList from '@/components/todos/TodoList';
import AddTodoForm from '@/components/todos/AddTodoForm';
import TransitionWrapper from '@/components/TransitionWrapper';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { createTodo } from '@/lib/data/todos';

const TodosPage = () => {
  const [todos, setTodos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [isAddingQuickTask, setIsAddingQuickTask] = useState(false);
  const { user } = useAuth();

  const loadTodos = async () => {
    setIsLoading(true);
    try {
      const allTodos = await fetchTodos();
      setTodos(allTodos);
    } catch (error) {
      console.error('Error loading todos:', error);
      toast.error('Не удалось загрузить список задач');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleQuickAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quickTaskTitle.trim()) return;
    
    setIsAddingQuickTask(true);
    
    try {
      const newTodo = await createTodo({
        title: quickTaskTitle,
        description: '',
        status: 'pending',
        createdBy: user?.id || ''
      });
      
      if (newTodo) {
        toast.success('Задача создана');
        setQuickTaskTitle('');
        await loadTodos();
      } else {
        toast.error('Не удалось создать задачу');
      }
    } catch (error) {
      console.error('Error creating quick task:', error);
      toast.error('Не удалось создать задачу');
    } finally {
      setIsAddingQuickTask(false);
    }
  };

  const handleEdit = (todo: any) => {
    // Implement edit functionality if needed
    console.log('Edit todo:', todo);
  };

  const handleDelete = async (id: string) => {
    try {
      const { deleteTodo } = await import('@/lib/data/todos');
      const success = await deleteTodo(id);
      
      if (success) {
        setTodos(prev => prev.filter(todo => todo.id !== id));
        toast.success('Задача удалена');
      } else {
        toast.error('Не удалось удалить задачу');
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error('Не удалось удалить задачу');
    }
  };

  const handleStatusChange = async (id: string, status: 'pending' | 'in-progress' | 'completed') => {
    try {
      const { updateTodo } = await import('@/lib/data/todos');
      const updatedTodo = await updateTodo(id, { status });
      
      if (updatedTodo) {
        setTodos(prev => prev.map(todo => todo.id === id ? { ...todo, status } : todo));
        toast.success(`Статус задачи обновлен на "${status === 'completed' ? 'Завершена' : status === 'in-progress' ? 'В работе' : 'Ожидает'}"`);
      } else {
        toast.error('Не удалось обновить статус задачи');
      }
    } catch (error) {
      console.error('Error updating todo status:', error);
      toast.error('Не удалось обновить статус задачи');
    }
  };

  return (
    <TransitionWrapper className="pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Задачи</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Детальное создание
          </Button>
        </div>
        
        <form onSubmit={handleQuickAddTask} className="flex gap-2 mb-6">
          <Input
            placeholder="Введите название задачи и нажмите Enter для быстрого создания"
            value={quickTaskTitle}
            onChange={(e) => setQuickTaskTitle(e.target.value)}
            className="flex-1"
            disabled={isAddingQuickTask}
          />
          <Button type="submit" disabled={isAddingQuickTask || !quickTaskTitle.trim()}>
            {isAddingQuickTask ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            <span className="sr-only">Добавить задачу</span>
          </Button>
        </form>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {todos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Нет задач</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  Создать первую задачу
                </Button>
              </div>
            ) : (
              <TodoList 
                todos={todos} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
                onStatusChange={handleStatusChange} 
              />
            )}
          </>
        )}
        
        <AddTodoForm 
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSuccess={loadTodos}
        />
      </div>
    </TransitionWrapper>
  );
};

export default TodosPage;
