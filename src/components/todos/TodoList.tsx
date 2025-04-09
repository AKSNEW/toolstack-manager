
import React from 'react';
import TodoItem from './TodoItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TodoListProps {
  todos: any[];
  onEdit: (todo: any) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: 'pending' | 'in-progress' | 'completed') => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onEdit, onDelete, onStatusChange }) => {
  const pendingTodos = todos.filter(todo => todo.status === 'pending');
  const inProgressTodos = todos.filter(todo => todo.status === 'in-progress');
  const completedTodos = todos.filter(todo => todo.status === 'completed');

  return (
    <Tabs defaultValue="pending" className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="pending" className="relative">
          Ожидающие
          {pendingTodos.length > 0 && (
            <span className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center text-xs bg-red-100 text-red-600 rounded-full">
              {pendingTodos.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="in-progress" className="relative">
          В работе
          {inProgressTodos.length > 0 && (
            <span className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center text-xs bg-amber-100 text-amber-600 rounded-full">
              {inProgressTodos.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="completed" className="relative">
          Завершенные
          {completedTodos.length > 0 && (
            <span className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center text-xs bg-green-100 text-green-600 rounded-full">
              {completedTodos.length}
            </span>
          )}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="pending" className="space-y-4">
        {pendingTodos.length > 0 ? (
          pendingTodos.map(todo => (
            <TodoItem 
              key={todo.id} 
              todo={todo} 
              onEdit={onEdit} 
              onDelete={onDelete} 
              onStatusChange={onStatusChange} 
            />
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Нет ожидающих задач
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="in-progress" className="space-y-4">
        {inProgressTodos.length > 0 ? (
          inProgressTodos.map(todo => (
            <TodoItem 
              key={todo.id} 
              todo={todo} 
              onEdit={onEdit} 
              onDelete={onDelete} 
              onStatusChange={onStatusChange} 
            />
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Нет задач в работе
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="completed" className="space-y-4">
        {completedTodos.length > 0 ? (
          completedTodos.map(todo => (
            <TodoItem 
              key={todo.id} 
              todo={todo} 
              onEdit={onEdit} 
              onDelete={onDelete} 
              onStatusChange={onStatusChange} 
            />
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Нет завершенных задач
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default TodoList;
