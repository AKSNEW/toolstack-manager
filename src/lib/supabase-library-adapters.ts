
import { LibraryItem } from "./types";
import { Database } from "@/integrations/supabase/types";

// Type aliases for database rows
type LibraryItemRow = Database['public']['Tables']['library_items']['Row'];
type LibraryItemInsert = Database['public']['Tables']['library_items']['Insert'];

// Convert database library item row to app LibraryItem type
export function adaptLibraryItemFromDB(item: LibraryItemRow): LibraryItem {
  return {
    id: item.id,
    name: item.name,
    type: item.type as 'book' | 'instruction' | 'standard',
    author: item.author,
    year: item.year,
    description: item.description,
    externalLink: item.external_link,
    fileUrl: item.file_url,
    authorId: item.author_id,
    createdAt: item.created_at
  };
}

// Convert app LibraryItem type to database format for new inserts
export function adaptLibraryItemForInsert(item: Omit<LibraryItem, 'id'>): LibraryItemInsert {
  return {
    name: item.name,
    type: item.type,
    author: item.author,
    year: item.year,
    description: item.description,
    external_link: item.externalLink,
    file_url: item.fileUrl,
    author_id: item.authorId,
    created_at: item.createdAt
  };
}

// Convert app LibraryItem type to database format for updates
export function adaptLibraryItemToDB(item: Partial<LibraryItem>): Partial<LibraryItemRow> {
  const result: Partial<LibraryItemRow> = {};
  
  if ('name' in item) result.name = item.name;
  if ('type' in item) result.type = item.type;
  if ('author' in item) result.author = item.author;
  if ('year' in item) result.year = item.year;
  if ('description' in item) result.description = item.description;
  if ('externalLink' in item) result.external_link = item.externalLink;
  if ('fileUrl' in item) result.file_url = item.fileUrl;
  if ('authorId' in item) result.author_id = item.authorId;
  if ('createdAt' in item) result.created_at = item.createdAt;
  
  return result;
}
