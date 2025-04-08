
import { WiringDiagram, DiagramComment } from "./types";
import { Database } from "@/integrations/supabase/types";

// Type aliases for database rows
// Since the 'wiring_diagrams' table doesn't exist in the generated types yet, we'll create compatible types
interface DiagramRow {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  created_by: string;
  created_at: string;
  votes: any[];
  updated_at?: string;
}

interface DiagramInsert {
  title: string;
  description: string;
  image_url: string;
  category: string;
  created_by: string;
  created_at: string;
  votes: any[];
}

interface DiagramCommentRow {
  id: string;
  diagram_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at?: string;
}

interface DiagramCommentInsert {
  diagram_id: string;
  author_id: string;
  content: string;
  created_at: string;
}

// Convert database diagram row to app WiringDiagram type
export function adaptDiagramFromDB(diagram: DiagramRow): WiringDiagram {
  return {
    id: diagram.id,
    title: diagram.title,
    description: diagram.description,
    imageUrl: diagram.image_url,
    category: diagram.category,
    createdBy: diagram.created_by,
    createdAt: diagram.created_at,
    comments: [],
    votes: diagram.votes || []
  };
}

// Convert app WiringDiagram type to database format for new inserts
export function adaptDiagramForInsert(diagram: Omit<WiringDiagram, 'id' | 'comments'>): DiagramInsert {
  return {
    title: diagram.title,
    description: diagram.description,
    image_url: diagram.imageUrl,
    category: diagram.category,
    created_by: diagram.createdBy,
    created_at: diagram.createdAt,
    votes: diagram.votes
  };
}

// Convert app WiringDiagram type to database format for updates
export function adaptDiagramToDB(diagram: Partial<WiringDiagram>): Partial<DiagramRow> {
  const result: Partial<DiagramRow> = {};
  
  if ('title' in diagram) result.title = diagram.title;
  if ('description' in diagram) result.description = diagram.description;
  if ('imageUrl' in diagram) result.image_url = diagram.imageUrl;
  if ('category' in diagram) result.category = diagram.category;
  if ('createdBy' in diagram) result.created_by = diagram.createdBy;
  if ('createdAt' in diagram) result.created_at = diagram.createdAt;
  if ('votes' in diagram) result.votes = diagram.votes;
  
  return result;
}

// Convert database comment row to app DiagramComment type
export function adaptDiagramCommentFromDB(comment: DiagramCommentRow): DiagramComment {
  return {
    id: comment.id,
    diagramId: comment.diagram_id,
    authorId: comment.author_id,
    content: comment.content,
    createdAt: comment.created_at
  };
}

// Convert app DiagramComment type to database format for new inserts
export function adaptDiagramCommentForInsert(comment: Omit<DiagramComment, 'id'>): DiagramCommentInsert {
  return {
    diagram_id: comment.diagramId,
    author_id: comment.authorId,
    content: comment.content,
    created_at: comment.createdAt
  };
}
