export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      activities: {
        Row: {
          created_at: string;
          description: string | null;
          entity_id: string | null;
          entity_type: string;
          event_type: string;
          id: string;
          metadata: Json | null;
          title: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          entity_id?: string | null;
          entity_type: string;
          event_type: string;
          id?: string;
          metadata?: Json | null;
          title: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          entity_id?: string | null;
          entity_type?: string;
          event_type?: string;
          id?: string;
          metadata?: Json | null;
          title?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      client_credentials: {
        Row: {
          client_id: string;
          created_at: string;
          id: string;
          iv: string;
          label: string;
          notes: string | null;
          password_encrypted: string;
          updated_at: string;
          url: string | null;
          user_id: string;
          username: string | null;
        };
        Insert: {
          client_id: string;
          created_at?: string;
          id?: string;
          iv: string;
          label: string;
          notes?: string | null;
          password_encrypted: string;
          updated_at?: string;
          url?: string | null;
          user_id: string;
          username?: string | null;
        };
        Update: {
          client_id?: string;
          created_at?: string;
          id?: string;
          iv?: string;
          label?: string;
          notes?: string | null;
          password_encrypted?: string;
          updated_at?: string;
          url?: string | null;
          user_id?: string;
          username?: string | null;
        };
        Relationships: [];
      };
      client_files: {
        Row: {
          category: string;
          client_id: string;
          created_at: string;
          id: string;
          mime_type: string | null;
          name: string;
          size: number | null;
          storage_path: string;
          user_id: string;
        };
        Insert: {
          category?: string;
          client_id: string;
          created_at?: string;
          id?: string;
          mime_type?: string | null;
          name: string;
          size?: number | null;
          storage_path: string;
          user_id: string;
        };
        Update: {
          category?: string;
          client_id?: string;
          created_at?: string;
          id?: string;
          mime_type?: string | null;
          name?: string;
          size?: number | null;
          storage_path?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      clients: {
        Row: {
          address_city: string | null;
          address_complement: string | null;
          address_district: string | null;
          address_number: string | null;
          address_state: string | null;
          address_street: string | null;
          address_zip: string | null;
          client_type: string;
          contact_person: string | null;
          contract_months: number | null;
          contract_value: number;
          cpa_limit: number | null;
          created_at: string;
          document: string | null;
          due_day: number;
          email: string | null;
          id: string;
          legal_name: string | null;
          name: string;
          notes: string | null;
          phone: string | null;
          segment: string | null;
          start_date: string | null;
          state_registration: string | null;
          status: string;
          trade_name: string | null;
          updated_at: string;
          user_id: string;
          website: string | null;
        };
        Insert: {
          address_city?: string | null;
          address_complement?: string | null;
          address_district?: string | null;
          address_number?: string | null;
          address_state?: string | null;
          address_street?: string | null;
          address_zip?: string | null;
          client_type?: string;
          contact_person?: string | null;
          contract_months?: number | null;
          contract_value?: number;
          cpa_limit?: number | null;
          created_at?: string;
          document?: string | null;
          due_day: number;
          email?: string | null;
          id?: string;
          legal_name?: string | null;
          name: string;
          notes?: string | null;
          phone?: string | null;
          segment?: string | null;
          start_date?: string | null;
          state_registration?: string | null;
          status?: string;
          trade_name?: string | null;
          updated_at?: string;
          user_id: string;
          website?: string | null;
        };
        Update: {
          address_city?: string | null;
          address_complement?: string | null;
          address_district?: string | null;
          address_number?: string | null;
          address_state?: string | null;
          address_street?: string | null;
          address_zip?: string | null;
          client_type?: string;
          contact_person?: string | null;
          contract_months?: number | null;
          contract_value?: number;
          cpa_limit?: number | null;
          created_at?: string;
          document?: string | null;
          due_day?: number;
          email?: string | null;
          id?: string;
          legal_name?: string | null;
          name?: string;
          notes?: string | null;
          phone?: string | null;
          segment?: string | null;
          start_date?: string | null;
          state_registration?: string | null;
          status?: string;
          trade_name?: string | null;
          updated_at?: string;
          user_id?: string;
          website?: string | null;
        };
        Relationships: [];
      };
      expenses: {
        Row: {
          amount: number;
          category: string;
          created_at: string;
          description: string;
          entity_type: string;
          expense_date: string;
          id: string;
          is_recurring: boolean;
          notes: string | null;
          receipt_url: string | null;
          recurrence_day: number | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount?: number;
          category?: string;
          created_at?: string;
          description: string;
          entity_type?: string;
          expense_date?: string;
          id?: string;
          is_recurring?: boolean;
          notes?: string | null;
          receipt_url?: string | null;
          recurrence_day?: number | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          category?: string;
          created_at?: string;
          description?: string;
          entity_type?: string;
          expense_date?: string;
          id?: string;
          is_recurring?: boolean;
          notes?: string | null;
          receipt_url?: string | null;
          recurrence_day?: number | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          amount: number;
          client_id: string | null;
          created_at: string;
          description: string | null;
          due_date: string;
          id: string;
          notes: string | null;
          paid_at: string | null;
          reference_month: string;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount?: number;
          client_id?: string | null;
          created_at?: string;
          description?: string | null;
          due_date: string;
          id?: string;
          notes?: string | null;
          paid_at?: string | null;
          reference_month: string;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          client_id?: string | null;
          created_at?: string;
          description?: string | null;
          due_date?: string;
          id?: string;
          notes?: string | null;
          paid_at?: string | null;
          reference_month?: string;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payments_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      push_subscriptions: {
        Row: {
          auth: string;
          created_at: string;
          endpoint: string;
          id: string;
          p256dh: string;
          user_agent: string | null;
          user_id: string;
        };
        Insert: {
          auth: string;
          created_at?: string;
          endpoint: string;
          id?: string;
          p256dh: string;
          user_agent?: string | null;
          user_id: string;
        };
        Update: {
          auth?: string;
          created_at?: string;
          endpoint?: string;
          id?: string;
          p256dh?: string;
          user_agent?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          client_id: string | null;
          created_at: string;
          description: string | null;
          due_date: string | null;
          id: string;
          priority: string;
          status: string;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          client_id?: string | null;
          created_at?: string;
          description?: string | null;
          due_date?: string | null;
          id?: string;
          priority?: string;
          status?: string;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          client_id?: string | null;
          created_at?: string;
          description?: string | null;
          due_date?: string | null;
          id?: string;
          priority?: string;
          status?: string;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      generate_monthly_payments: {
        Args: { _reference_month: string };
        Returns: {
          created_count: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
