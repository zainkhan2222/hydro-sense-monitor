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
      alerts: {
        Row: {
          acknowledged: boolean | null
          acknowledged_at: string | null
          acknowledged_by: string | null
          id: string
          parameter: string
          reading_id: string
          severity: string
          station_id: string
          timestamp: string | null
          value: number
        }
        Insert: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          id?: string
          parameter: string
          reading_id: string
          severity: string
          station_id: string
          timestamp?: string | null
          value: number
        }
        Update: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          id?: string
          parameter?: string
          reading_id?: string
          severity?: string
          station_id?: string
          timestamp?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "alerts_reading_id_fkey"
            columns: ["reading_id"]
            isOneToOne: false
            referencedRelation: "readings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
        ]
      }
      devices: {
        Row: {
          created_at: string | null
          firmware_version: string | null
          id: string
          last_connection: string | null
          name: string
          station_id: string
          status: string | null
          supported_parameters: string[]
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          firmware_version?: string | null
          id?: string
          last_connection?: string | null
          name: string
          station_id: string
          status?: string | null
          supported_parameters: string[]
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          firmware_version?: string | null
          id?: string
          last_connection?: string | null
          name?: string
          station_id?: string
          status?: string | null
          supported_parameters?: string[]
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devices_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      readings: {
        Row: {
          conductivity: number | null
          created_at: string | null
          device_id: string | null
          dissolved_oxygen: number | null
          id: string
          ph: number | null
          station_id: string
          tds: number | null
          temperature: number | null
          timestamp: string | null
          turbidity: number | null
        }
        Insert: {
          conductivity?: number | null
          created_at?: string | null
          device_id?: string | null
          dissolved_oxygen?: number | null
          id?: string
          ph?: number | null
          station_id: string
          tds?: number | null
          temperature?: number | null
          timestamp?: string | null
          turbidity?: number | null
        }
        Update: {
          conductivity?: number | null
          created_at?: string | null
          device_id?: string | null
          dissolved_oxygen?: number | null
          id?: string
          ph?: number | null
          station_id?: string
          tds?: number | null
          temperature?: number | null
          timestamp?: string | null
          turbidity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "readings_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "readings_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
        ]
      }
      stations: {
        Row: {
          api_key: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          latitude: number | null
          location: string
          longitude: number | null
          name: string
          owner_id: string
          updated_at: string | null
        }
        Insert: {
          api_key?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          location: string
          longitude?: number | null
          name: string
          owner_id: string
          updated_at?: string | null
        }
        Update: {
          api_key?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          name?: string
          owner_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      thresholds: {
        Row: {
          created_at: string | null
          critical_max: number | null
          critical_min: number | null
          id: string
          max_value: number
          min_value: number
          parameter: string
          station_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          critical_max?: number | null
          critical_min?: number | null
          id?: string
          max_value: number
          min_value: number
          parameter: string
          station_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          critical_max?: number | null
          critical_min?: number | null
          id?: string
          max_value?: number
          min_value?: number
          parameter?: string
          station_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "thresholds_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
