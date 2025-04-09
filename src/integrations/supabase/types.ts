export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accounting_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      crews: {
        Row: {
          created_at: string | null
          foreman: string
          id: string
          members: string[]
          name: string
          subcrews: string[] | null
          supervisor: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          foreman: string
          id?: string
          members?: string[]
          name: string
          subcrews?: string[] | null
          supervisor: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          foreman?: string
          id?: string
          members?: string[]
          name?: string
          subcrews?: string[] | null
          supervisor?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      diagram_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          diagram_id: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at: string
          diagram_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          diagram_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diagram_comments_diagram_id_fkey"
            columns: ["diagram_id"]
            isOneToOne: false
            referencedRelation: "wiring_diagrams"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          avatar: string
          birth_date: string | null
          created_at: string | null
          department: string
          email: string
          id: string
          name: string
          phone: string
          position: string
          telegram: string | null
          user_id: string | null
          whatsapp: string | null
        }
        Insert: {
          avatar: string
          birth_date?: string | null
          created_at?: string | null
          department: string
          email: string
          id?: string
          name: string
          phone: string
          position: string
          telegram?: string | null
          user_id?: string | null
          whatsapp?: string | null
        }
        Update: {
          avatar?: string
          birth_date?: string | null
          created_at?: string | null
          department?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          position?: string
          telegram?: string | null
          user_id?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      library_items: {
        Row: {
          author: string | null
          author_id: string
          created_at: string | null
          description: string
          external_link: string | null
          file_url: string | null
          id: string
          name: string
          type: string
          updated_at: string | null
          year: string | null
        }
        Insert: {
          author?: string | null
          author_id: string
          created_at?: string | null
          description: string
          external_link?: string | null
          file_url?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string | null
          year?: string | null
        }
        Update: {
          author?: string | null
          author_id?: string
          created_at?: string | null
          description?: string
          external_link?: string | null
          file_url?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string | null
          year?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          id: string
          telegram: string | null
          updated_at: string | null
          username: string | null
          whatsapp: string | null
        }
        Insert: {
          avatar_url?: string | null
          id: string
          telegram?: string | null
          updated_at?: string | null
          username?: string | null
          whatsapp?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          telegram?: string | null
          updated_at?: string | null
          username?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      subcrews: {
        Row: {
          created_at: string | null
          foreman: string
          id: string
          members: string[]
          name: string
          specialization: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          foreman: string
          id?: string
          members?: string[]
          name: string
          specialization: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          foreman?: string
          id?: string
          members?: string[]
          name?: string
          specialization?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      toolbox_items: {
        Row: {
          author_id: string
          category: string
          created_at: string | null
          description: string
          id: string
          image: string
          links: string[] | null
          name: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          category: string
          created_at?: string | null
          description: string
          id?: string
          image: string
          links?: string[] | null
          name: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          image?: string
          links?: string[] | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tools: {
        Row: {
          category: string
          created_at: string | null
          description: string
          id: string
          image: string
          is_edc: boolean | null
          links: string[] | null
          location: string
          name: string
          status: string
          updated_at: string | null
          votes: Json | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          id?: string
          image: string
          is_edc?: boolean | null
          links?: string[] | null
          location: string
          name: string
          status: string
          updated_at?: string | null
          votes?: Json | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          image?: string
          is_edc?: boolean | null
          links?: string[] | null
          location?: string
          name?: string
          status?: string
          updated_at?: string | null
          votes?: Json | null
        }
        Relationships: []
      }
      union_messages: {
        Row: {
          anonymous: boolean | null
          author_id: string
          category: string
          content: string
          created_at: string | null
          id: string
          status: string
          updated_at: string | null
          votes: Json | null
        }
        Insert: {
          anonymous?: boolean | null
          author_id: string
          category: string
          content: string
          created_at?: string | null
          id?: string
          status: string
          updated_at?: string | null
          votes?: Json | null
        }
        Update: {
          anonymous?: boolean | null
          author_id?: string
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          votes?: Json | null
        }
        Relationships: []
      }
      wiring_diagrams: {
        Row: {
          category: string
          created_at: string
          created_by: string
          description: string
          id: string
          image_url: string
          title: string
          updated_at: string | null
          votes: Json | null
        }
        Insert: {
          category: string
          created_at: string
          created_by: string
          description: string
          id?: string
          image_url: string
          title: string
          updated_at?: string | null
          votes?: Json | null
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          image_url?: string
          title?: string
          updated_at?: string | null
          votes?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      find_or_create_employee: {
        Args: { user_id: string; user_email: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
