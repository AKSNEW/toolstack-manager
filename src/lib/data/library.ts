
import { LibraryItem } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { adaptLibraryItemFromDB, adaptLibraryItemForInsert, adaptLibraryItemForUpdate } from '../supabase-library-adapters';
import { employees } from './employees';

// Initial library data for fallback
const initialLibraryItems: LibraryItem[] = [
  {
    id: 'li1',
    name: 'Правила устройства электроустановок (ПУЭ)',
    type: 'standard',
    description: 'Основной нормативный документ, устанавливающий требования к электроустановкам.',
    author: 'Минэнерго России',
    authorId: 'e1',
    year: '2002',
    externalLink: 'https://example.com/pue',
  },
  {
    id: 'li2',
    name: 'Электромонтажные работы: основы профессии',
    type: 'book',
    description: 'Практическое руководство по электромонтажным работам для начинающих специалистов.',
    author: 'Иванов А.П.',
    authorId: 'e3',
    year: '2018',
    fileUrl: 'https://example.com/book1.pdf',
  },
];

// This is a temporary mutable array that will be used until all components are migrated to use direct DB calls
export let libraryItems: LibraryItem[] = [...initialLibraryItems];

// Function to fetch library items from database
export async function fetchLibraryItems(): Promise<LibraryItem[]> {
  try {
    const { data, error } = await supabase
      .from('library_items' as any)
      .select(`
        *,
        employees:author_id(name, avatar)
      `) as any;
    
    if (error) {
      console.error('Error fetching library items:', error);
      return libraryItems; // Return the local data as fallback
    }
    
    if (!data || data.length === 0) {
      // If no library items exist in the database yet, seed with initial data
      await seedInitialLibraryItems();
      return libraryItems;
    }
    
    // Update the local library items array
    const fetchedItems = data.map((item: any) => {
      const adaptedItem = adaptLibraryItemFromDB(item);
      return {
        ...adaptedItem,
        authorName: item.employees?.name || ''
      };
    });
    
    libraryItems = fetchedItems;
    return fetchedItems;
  } catch (error) {
    console.error('Error in fetchLibraryItems:', error);
    return libraryItems; // Return the local data as fallback
  }
}

// Function to create a new library item
export async function createLibraryItem(item: Omit<LibraryItem, 'id'>): Promise<LibraryItem | null> {
  try {
    const itemData = adaptLibraryItemForInsert(item);
    
    const { data, error } = await supabase
      .from('library_items' as any)
      .insert(itemData)
      .select(`
        *,
        employees:author_id(name, avatar)
      `) as any;
    
    if (error) {
      console.error('Error creating library item:', error);
      return null;
    }
    
    if (!data || data.length === 0) {
      console.error('No data returned after library item creation');
      return null;
    }
    
    const newItem = adaptLibraryItemFromDB(data[0]);
    const authorName = data[0].employees?.name || '';
    
    // Update local array
    const itemWithAuthor = { ...newItem, authorName };
    libraryItems.push(itemWithAuthor);
    
    return itemWithAuthor;
  } catch (error) {
    console.error('Error in createLibraryItem:', error);
    return null;
  }
}

// Function to update a library item
export async function updateLibraryItem(id: string, itemUpdate: Partial<LibraryItem>): Promise<LibraryItem | null> {
  try {
    const updates = adaptLibraryItemForUpdate(itemUpdate);
    
    const { data, error } = await supabase
      .from('library_items' as any)
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        employees:author_id(name, avatar)
      `) as any;
    
    if (error) {
      console.error('Error updating library item:', error);
      return null;
    }
    
    if (!data || data.length === 0) {
      console.error('No data returned after library item update');
      return null;
    }
    
    const updatedItem = adaptLibraryItemFromDB(data[0]);
    const authorName = data[0].employees?.name || '';
    
    // Update the local array
    libraryItems = libraryItems.map(item => item.id === id ? { ...updatedItem, authorName } : item);
    
    return { ...updatedItem, authorName };
  } catch (error) {
    console.error('Error in updateLibraryItem:', error);
    return null;
  }
}

// Function to delete a library item
export async function deleteLibraryItem(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('library_items' as any)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting library item:', error);
      return false;
    }
    
    // Update the local array
    libraryItems = libraryItems.filter(item => item.id !== id);
    
    return true;
  } catch (error) {
    console.error('Error in deleteLibraryItem:', error);
    return false;
  }
}

// Function to seed initial library items if none exist
async function seedInitialLibraryItems() {
  try {
    for (const item of initialLibraryItems) {
      // Create each initial library item in the database
      await supabase
        .from('library_items' as any)
        .insert({
          name: item.name,
          type: item.type,
          description: item.description,
          author: item.author,
          author_id: item.authorId,
          file_url: item.fileUrl || null,
          external_link: item.externalLink || null,
          year: item.year || null
        });
    }
    
    // Refetch library items after seeding
    const { data } = await supabase.from('library_items' as any).select('*');
    if (data) {
      libraryItems = data.map(item => adaptLibraryItemFromDB(item));
    }
  } catch (error) {
    console.error('Error in seedInitialLibraryItems:', error);
  }
}

// Initialize by fetching library items
fetchLibraryItems().catch(console.error);
