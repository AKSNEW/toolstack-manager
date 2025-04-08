
import { supabase } from "@/integrations/supabase/client";
import { UnionMessage } from "@/lib/types";
import { adaptUnionMessageFromDB, adaptUnionMessageForInsert } from "@/lib/supabase-union-adapters";

// Fetch all union messages
export async function fetchUnionMessages(): Promise<UnionMessage[]> {
  const { data, error } = await supabase
    .from('union_messages')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching union messages:', error);
    throw error;
  }
  
  return data?.map(adaptUnionMessageFromDB) || [];
}

// Create a new union message
export async function createUnionMessage(message: Omit<UnionMessage, 'id'>): Promise<UnionMessage> {
  const { data, error } = await supabase
    .from('union_messages')
    .insert(adaptUnionMessageForInsert(message))
    .select()
    .single();
  
  if (error) {
    console.error('Error creating union message:', error);
    throw error;
  }
  
  return adaptUnionMessageFromDB(data);
}

// Update message status
export async function updateMessageStatus(id: string, status: 'new' | 'in-review' | 'resolved'): Promise<void> {
  const { error } = await supabase
    .from('union_messages')
    .update({ status })
    .eq('id', id);
  
  if (error) {
    console.error('Error updating message status:', error);
    throw error;
  }
}

// Update message votes
export async function updateMessageVotes(id: string, votes: any[]): Promise<void> {
  const { error } = await supabase
    .from('union_messages')
    .update({ votes })
    .eq('id', id);
  
  if (error) {
    console.error('Error updating message votes:', error);
    throw error;
  }
}
