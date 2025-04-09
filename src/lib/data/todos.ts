
import { supabase } from '@/integrations/supabase/client';
import { Todo } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

// Adapter to convert from database format to app format
function adaptTodoFromDB(todo: any): Todo {
  return {
    id: todo.id,
    title: todo.title,
    description: todo.description,
    status: todo.status as 'pending' | 'in-progress' | 'completed',
    dueDate: todo.due_date,
    siteId: todo.site_id,
    assignedTo: todo.assigned_to,
    createdBy: todo.created_by,
    createdAt: todo.created_at,
    updatedAt: todo.updated_at
  };
}

// Adapter to convert from app format to database format for insert
function adaptTodoForInsert(todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): any {
  return {
    title: todo.title,
    description: todo.description,
    status: todo.status,
    due_date: todo.dueDate,
    site_id: todo.siteId,
    assigned_to: todo.assignedTo,
    created_by: todo.createdBy
  };
}

// Adapter to convert from app format to database format for update
function adaptTodoForUpdate(todo: Partial<Todo>): any {
  const result: any = {};
  
  if ('title' in todo) result.title = todo.title;
  if ('description' in todo) result.description = todo.description;
  if ('status' in todo) result.status = todo.status;
  if ('dueDate' in todo) result.due_date = todo.dueDate;
  if ('siteId' in todo) result.site_id = todo.siteId;
  if ('assignedTo' in todo) result.assigned_to = todo.assignedTo;
  
  return result;
}

// Fetch all todos
export async function fetchTodos(): Promise<Todo[]> {
  try {
    const { data, error } = await supabase
      .from('todos' as any)
      .select(`
        *,
        employees:assigned_to(name, avatar),
        sites:site_id(name)
      `) as any;
    
    if (error) {
      console.error('Error fetching todos:', error);
      return [];
    }
    
    return (data || []).map((todo: any) => {
      const adaptedTodo = adaptTodoFromDB(todo);
      return {
        ...adaptedTodo,
        assigneeName: todo.employees?.name,
        assigneeAvatar: todo.employees?.avatar,
        siteName: todo.sites?.name
      };
    });
  } catch (error) {
    console.error('Error in fetchTodos:', error);
    return [];
  }
}

// Fetch todos for a specific site
export async function fetchSiteTodos(siteId: string): Promise<Todo[]> {
  try {
    const { data, error } = await supabase
      .from('todos' as any)
      .select(`
        *,
        employees:assigned_to(name, avatar)
      `)
      .eq('site_id', siteId) as any;
    
    if (error) {
      console.error('Error fetching site todos:', error);
      return [];
    }
    
    return (data || []).map((todo: any) => {
      const adaptedTodo = adaptTodoFromDB(todo);
      return {
        ...adaptedTodo,
        assigneeName: todo.employees?.name,
        assigneeAvatar: todo.employees?.avatar
      };
    });
  } catch (error) {
    console.error('Error in fetchSiteTodos:', error);
    return [];
  }
}

// Create a new todo
export async function createTodo(todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Todo | null> {
  try {
    const { data, error } = await supabase
      .from('todos' as any)
      .insert(adaptTodoForInsert(todo))
      .select() as any;
    
    if (error) {
      console.error('Error creating todo:', error);
      return null;
    }
    
    return data && data.length > 0 ? adaptTodoFromDB(data[0]) : null;
  } catch (error) {
    console.error('Error in createTodo:', error);
    return null;
  }
}

// Update a todo
export async function updateTodo(id: string, todoUpdate: Partial<Todo>): Promise<Todo | null> {
  try {
    const { data, error } = await supabase
      .from('todos' as any)
      .update(adaptTodoForUpdate(todoUpdate))
      .eq('id', id)
      .select() as any;
    
    if (error) {
      console.error('Error updating todo:', error);
      return null;
    }
    
    return data && data.length > 0 ? adaptTodoFromDB(data[0]) : null;
  } catch (error) {
    console.error('Error in updateTodo:', error);
    return null;
  }
}

// Delete a todo
export async function deleteTodo(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('todos' as any)
      .delete()
      .eq('id', id) as any;
    
    if (error) {
      console.error('Error deleting todo:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteTodo:', error);
    return false;
  }
}
