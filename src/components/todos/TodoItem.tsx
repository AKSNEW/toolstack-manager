
import React from 'react';
import { Check, Clock, CalendarIcon, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

interface TodoItemProps {
  todo: any;
  onEdit: (todo: any) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: 'pending' | 'in-progress' | 'completed') => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit, onDelete, onStatusChange }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-600 hover:bg-green-200';
      case 'in-progress':
        return 'bg-amber-100 text-amber-600 hover:bg-amber-200';
      default:
        return 'bg-blue-100 text-blue-600 hover:bg-blue-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'in-progress':
        return 'bg-amber-100 text-amber-600 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-600 border-blue-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Завершена';
      case 'in-progress':
        return 'В работе';
      default:
        return 'Ожидает';
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="shadow-sm hover:shadow transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-medium text-base">{todo.title}</h3>
            <Badge variant="outline" className={getStatusBadge(todo.status)}>
              {getStatusLabel(todo.status)}
            </Badge>
          </div>
          {todo.assigneeName && (
            <Avatar className="h-8 w-8">
              {todo.assigneeAvatar && <AvatarImage src={todo.assigneeAvatar} alt={todo.assigneeName} />}
              <AvatarFallback>{getInitials(todo.assigneeName)}</AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {todo.description && (
          <p className="text-sm text-muted-foreground mb-3">{todo.description}</p>
        )}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {todo.dueDate && (
            <div className="flex items-center">
              <CalendarIcon className="h-3.5 w-3.5 mr-1" />
              <span>{formatDate(todo.dueDate)}</span>
            </div>
          )}
          {todo.siteName && (
            <div className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>Объект: {todo.siteName}</span>
            </div>
          )}
          {todo.assigneeName && (
            <div className="flex items-center">
              <UserCircle className="h-3.5 w-3.5 mr-1" />
              <span>{todo.assigneeName}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-1 flex justify-between">
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit(todo)}
          >
            Изменить
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onDelete(todo.id)}
          >
            Удалить
          </Button>
        </div>
        {todo.status !== 'completed' && (
          <Button 
            variant="outline" 
            size="sm"
            className={getStatusColor(todo.status)}
            onClick={() => onStatusChange(todo.id, todo.status === 'pending' ? 'in-progress' : 'completed')}
          >
            {todo.status === 'pending' ? 'Начать' : 'Завершить'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TodoItem;
