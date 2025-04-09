
import { supabase } from "@/integrations/supabase/client";
import { LibraryItem } from "@/lib/types";
import { adaptLibraryItemFromDB, adaptLibraryItemForInsert, adaptLibraryItemToDB } from "@/lib/supabase-library-adapters";

// Fetch all library items
export async function fetchLibraryItems(): Promise<LibraryItem[]> {
  // Using a generic query approach to bypass TypeScript type constraints
  const { data, error } = await supabase
    .from('library_items')
    .select('*')
    .order('created_at', { ascending: false }) as any;
  
  if (error) {
    console.error('Error fetching library items:', error);
    throw error;
  }
  
  return data?.map(adaptLibraryItemFromDB) || [];
}

// Create a new library item
export async function createLibraryItem(item: Omit<LibraryItem, 'id'>): Promise<LibraryItem> {
  // Using a generic query approach to bypass TypeScript type constraints
  const { data, error } = await supabase
    .from('library_items')
    .insert(adaptLibraryItemForInsert(item))
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
    .from('library_items')
    .update(adaptLibraryItemToDB(item))
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
    .from('library_items')
    .delete()
    .eq('id', id) as any;
  
  if (error) {
    console.error('Error deleting library item:', error);
    throw error;
  }
}
