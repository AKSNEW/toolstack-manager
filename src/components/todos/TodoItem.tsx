
import React from 'react';
import { Check, Clock, CalendarIcon, UserCircle, MoreHorizontal, Edit, Trash2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => onEdit(todo)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Изменить</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(todo.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Удалить</span>
            </DropdownMenuItem>
            {todo.status !== 'completed' && (
              <DropdownMenuItem 
                onClick={() => onStatusChange(todo.id, todo.status === 'pending' ? 'in-progress' : 'completed')}
              >
                {todo.status === 'pending' ? (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    <span>Начать</span>
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    <span>Завершить</span>
                  </>
                )}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {todo.status !== 'completed' && (
          <Button 
            variant="outline" 
            size="sm"
            className={getStatusColor(todo.status)}
            onClick={() => onStatusChange(todo.id, todo.status === 'pending' ? 'in-progress' : 'completed')}
          >
            {todo.status === 'pending' ? (
              <>
                <Play className="h-4 w-4 mr-1" />
                <span>Начать</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-1" />
                <span>Завершить</span>
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TodoItem;
