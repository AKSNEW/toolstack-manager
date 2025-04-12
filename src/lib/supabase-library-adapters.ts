
import { LibraryItem } from "../types";

// Convert database library row to app LibraryItem type
export function adaptLibraryItemFromDB(item: any): LibraryItem {
  return {
    id: item.id,
    name: item.name,
    type: item.type,
    description: item.description,
    author: item.author || '',
    authorId: item.author_id || '',
    authorName: item.employees?.name || '',
    fileUrl: item.file_url || '',
    externalLink: item.external_link || '',
    year: item.year || '',
  };
}

// Convert app LibraryItem type to database format for new inserts
export function adaptLibraryItemForInsert(item: Omit<LibraryItem, 'id'>): any {
  return {
    name: item.name,
    type: item.type,
    description: item.description,
    author: item.author || '',
    author_id: item.authorId || '',
    file_url: item.fileUrl || '',
    external_link: item.externalLink || '',
    year: item.year || '',
  };
}

// Convert app LibraryItem type to database format for updates
export function adaptLibraryItemForUpdate(item: Partial<LibraryItem>): any {
  const result: any = {};
  
  if ('name' in item) result.name = item.name;
  if ('type' in item) result.type = item.type;
  if ('description' in item) result.description = item.description;
  if ('author' in item) result.author = item.author;
  if ('authorId' in item) result.author_id = item.authorId;
  if ('fileUrl' in item) result.file_url = item.fileUrl;
  if ('externalLink' in item) result.external_link = item.externalLink;
  if ('year' in item) result.year = item.year;
  
  return result;
}
