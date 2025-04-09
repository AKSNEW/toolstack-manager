
import { supabase } from "@/integrations/supabase/client";
import { LibraryItem } from "@/lib/types";
import { adaptLibraryItemFromDB, adaptLibraryItemForInsert, adaptLibraryItemToDB } from "@/lib/supabase-library-adapters";

// Fetch all library items
export async function fetchLibraryItems(): Promise<LibraryItem[]> {
  try {
    // Using a generic query approach to bypass TypeScript type constraints
    const { data, error } = await supabase
      .from('library_items' as any)
      .select('*, employees!inner(name)')
      .order('created_at', { ascending: false }) as any;
    
    if (error) {
      console.error('Error fetching library items:', error);
      throw error;
    }
    
    return data?.map((item: any) => ({
      ...adaptLibraryItemFromDB(item),
      authorName: item.employees?.name || 'Неизвестный пользователь'
    })) || [];
  } catch (error) {
    console.error('Error in fetchLibraryItems:', error);
    return [];
  }
}

// Create a new library item
export async function createLibraryItem(item: Omit<LibraryItem, 'id'>): Promise<LibraryItem> {
  // Using a generic query approach to bypass TypeScript type constraints
  const { data, error } = await supabase
    .from('library_items' as any)
    .insert(adaptLibraryItemForInsert(item) as any)
    .select() as any;
  
  if (error) {
    console.error('Error creating library item:', error);
    throw error;
  }
  
  return adaptLibraryItemFromDB(data[0]);
}

// Update library item
export async function updateLibraryItem(id: string, item: Partial<LibraryItem>): Promise<void> {
  // Using a generic query approach to bypass TypeScript type constraints
  const { error } = await supabase
    .from('library_items' as any)
    .update(adaptLibraryItemToDB(item) as any)
    .eq('id', id) as any;
  
  if (error) {
    console.error('Error updating library item:', error);
    throw error;
  }
}

// Delete library item
export async function deleteLibraryItem(id: string): Promise<void> {
  // Using a generic query approach to bypass TypeScript type constraints
  const { error } = await supabase
    .from('library_items' as any)
    .delete()
    .eq('id', id) as any;
  
  if (error) {
    console.error('Error deleting library item:', error);
    throw error;
  }
}

// Download library item file
export async function downloadLibraryFile(url: string): Promise<void> {
  try {
    // Create a hidden anchor element
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = url.split('/').pop() || 'download';
    
    // Append to body, click and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}
