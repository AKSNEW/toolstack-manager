
import { UnionMessage } from "./types";

// Type aliases for database rows
// Since the 'union_messages' table doesn't exist in the generated types yet, we'll create compatible types
export interface UnionMessageRow {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  anonymous: boolean;
  category: string;
  status: string;
  votes: any[];
  updated_at?: string;
}

export interface UnionMessageInsert {
  content: string;
  created_at: string;
  author_id: string;
  anonymous: boolean;
  category: string;
  status: string;
  votes: any[];
}

// Convert database union message row to app UnionMessage type
export function adaptUnionMessageFromDB(message: UnionMessageRow): UnionMessage {
  return {
    id: message.id,
    content: message.content,
    createdAt: message.created_at,
    authorId: message.author_id,
    anonymous: message.anonymous,
    category: message.category as 'complaint' | 'suggestion' | 'question',
    status: message.status as 'new' | 'in-review' | 'resolved',
    votes: message.votes || []
  };
}

// Convert app UnionMessage type to database format for new inserts
export function adaptUnionMessageForInsert(message: Omit<UnionMessage, 'id'>): UnionMessageInsert {
  return {
    content: message.content,
    created_at: message.createdAt,
    author_id: message.authorId,
    anonymous: message.anonymous,
    category: message.category,
    status: message.status,
    votes: message.votes
  };
}

// Convert app UnionMessage type to database format for updates
export function adaptUnionMessageToDB(message: Partial<UnionMessage>): Partial<UnionMessageRow> {
  const result: Partial<UnionMessageRow> = {};
  
  if ('content' in message) result.content = message.content;
  if ('createdAt' in message) result.created_at = message.createdAt;
  if ('authorId' in message) result.author_id = message.authorId;
  if ('anonymous' in message) result.anonymous = message.anonymous;
  if ('category' in message) result.category = message.category;
  if ('status' in message) result.status = message.status;
  if ('votes' in message) result.votes = message.votes;
  
  return result;
}
