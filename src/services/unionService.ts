
import { supabase } from "@/integrations/supabase/client";
import { UnionMessage } from "@/lib/types";
import { adaptUnionMessageFromDB, adaptUnionMessageForInsert } from "@/lib/supabase-union-adapters";

// Fetch all union messages
export async function fetchUnionMessages(): Promise<UnionMessage[]> {
  // Using a generic query approach to bypass TypeScript type constraints
  const { data, error } = await supabase
    .from('union_messages')
    .select('*')
    .order('created_at', { ascending: false }) as any;
  
  if (error) {
    console.error('Error fetching union messages:', error);
    throw error;
  }
  
  return data?.map(adaptUnionMessageFromDB) || [];
}

// Create a new union message
export async function createUnionMessage(message: Omit<UnionMessage, 'id'>): Promise<UnionMessage> {
  // Using a generic query approach to bypass TypeScript type constraints
  const { data, error } = await supabase
    .from('union_messages')
    .insert(adaptUnionMessageForInsert(message))
    .select() as any;
  
  if (error) {
    console.error('Error creating union message:', error);
    throw error;
  }
  
  return adaptUnionMessageFromDB(data[0]);
}

// Update message status
export async function updateMessageStatus(id: string, status: 'new' | 'in-review' | 'resolved'): Promise<void> {
  // Using a generic query approach to bypass TypeScript type constraints
  const { error } = await supabase
    .from('union_messages')
    .update({ status })
    .eq('id', id) as any;
  
  if (error) {
    console.error('Error updating message status:', error);
    throw error;
  }
}

// Update message votes
export async function updateMessageVotes(id: string, votes: any[]): Promise<void> {
  // Using a generic query approach to bypass TypeScript type constraints
  const { error } = await supabase
    .from('union_messages')
    .update({ votes })
    .eq('id', id) as any;
  
  if (error) {
    console.error('Error updating message votes:', error);
    throw error;
  }
}
