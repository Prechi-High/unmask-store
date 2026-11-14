export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          created_at: string
          id: string
          owner_user_id: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          owner_user_id: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          owner_user_id?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_events: {
        Row: {
          account_id: string | null
          actor_user_id: string | null
          brand_id: string | null
          created_at: string
          event_type: string
          id: string
          payload: Json
          seller_id: string | null
        }
        Insert: {
          account_id?: string | null
          actor_user_id?: string | null
          brand_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          payload?: Json
          seller_id?: string | null
        }
        Update: {
          account_id?: string | null
          actor_user_id?: string | null
          brand_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json
          seller_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_events_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_events_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_events_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_invitation_codes: {
        Row: {
          brand_id: string
          code: string
          created_at: string
          created_by: string | null
          enabled: boolean
          expires_at: string | null
          id: string
          max_uses: number | null
          slug: string
          updated_at: string
          use_count: number
        }
        Insert: {
          brand_id: string
          code: string
          created_at?: string
          created_by?: string | null
          enabled?: boolean
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          slug: string
          updated_at?: string
          use_count?: number
        }
        Update: {
          brand_id?: string
          code?: string
          created_at?: string
          created_by?: string | null
          enabled?: boolean
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          slug?: string
          updated_at?: string
          use_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "brand_invitation_codes_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_memberships: {
        Row: {
          brand_id: string
          created_at: string
          id: string
          joined_at: string
          role: string
          seller_id: string
          status: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          id?: string
          joined_at?: string
          role?: string
          seller_id: string
          status?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          id?: string
          joined_at?: string
          role?: string
          seller_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_memberships_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brand_memberships_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_profiles: {
        Row: {
          account_id: string
          contact_email: string
          country: string
          created_at: string
          id: string
          legal_name: string | null
          name: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          account_id: string
          contact_email: string
          country?: string
          created_at?: string
          id?: string
          legal_name?: string | null
          name: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          account_id?: string
          contact_email?: string
          country?: string
          created_at?: string
          id?: string
          legal_name?: string | null
          name?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_profiles_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          cart_id: string
          created_at: string
          id: string
          product_id: string
          quantity: number
          unit_price: number
          variant_id: string | null
        }
        Insert: {
          cart_id: string
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          unit_price: number
          variant_id?: string | null
        }
        Update: {
          cart_id?: string
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "store_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string
          customer_id: string | null
          id: string
          session_token: string | null
          status: string
          store_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          id?: string
          session_token?: string | null
          status?: string
          store_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          id?: string
          session_token?: string | null
          status?: string
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "carts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carts_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          metadata: Json
          phone: string | null
          store_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          metadata?: Json
          phone?: string | null
          store_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          metadata?: Json
          phone?: string | null
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      onmask_connections: {
        Row: {
          created_at: string
          id: string
          metadata: Json
          scopes: string[] | null
          seller_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json
          scopes?: string[] | null
          seller_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json
          scopes?: string[] | null
          seller_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "onmask_connections_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          line_total: number
          order_id: string
          product_id: string
          quantity: number
          title: string
          unit_price: number
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          line_total: number
          order_id: string
          product_id: string
          quantity: number
          title: string
          unit_price: number
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          line_total?: number
          order_id?: string
          product_id?: string
          quantity?: number
          title?: string
          unit_price?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "store_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          currency: string
          customer_id: string | null
          id: string
          metadata: Json
          order_number: string
          payment_status: string
          shipping_address: Json | null
          status: string
          store_id: string
          subtotal: number
          total: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          customer_id?: string | null
          id?: string
          metadata?: Json
          order_number: string
          payment_status?: string
          shipping_address?: Json | null
          status?: string
          store_id: string
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          customer_id?: string | null
          id?: string
          metadata?: Json
          order_number?: string
          payment_status?: string
          shipping_address?: Json | null
          status?: string
          store_id?: string
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          account_id: string | null
          amount: number
          created_at: string
          currency: string
          id: string
          kind: string
          metadata: Json
          order_id: string | null
          provider: string
          provider_reference: string | null
          provider_transaction_id: string | null
          status: string
          store_id: string | null
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          created_at?: string
          currency?: string
          id?: string
          kind: string
          metadata?: Json
          order_id?: string | null
          provider?: string
          provider_reference?: string | null
          provider_transaction_id?: string | null
          status?: string
          store_id?: string | null
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          kind?: string
          metadata?: Json
          order_id?: string | null
          provider?: string
          provider_reference?: string | null
          provider_transaction_id?: string | null
          status?: string
          store_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_order_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_entitlements: {
        Row: {
          created_at: string
          id: string
          key: string
          plan_id: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          plan_id: string
          value: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          plan_id?: string
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "plan_entitlements_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          audience: string
          billing_interval: string
          code: string
          created_at: string
          currency: string
          id: string
          metadata: Json
          name: string
          price: number
          status: string
          updated_at: string
        }
        Insert: {
          audience: string
          billing_interval?: string
          code: string
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json
          name: string
          price: number
          status?: string
          updated_at?: string
        }
        Update: {
          audience?: string
          billing_interval?: string
          code?: string
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json
          name?: string
          price?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt: string | null
          created_at: string
          id: string
          product_id: string
          sort_order: number
          url: string
        }
        Insert: {
          alt?: string | null
          created_at?: string
          id?: string
          product_id: string
          sort_order?: number
          url: string
        }
        Update: {
          alt?: string | null
          created_at?: string
          id?: string
          product_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "store_products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          created_at: string
          id: string
          inventory_quantity: number
          options: Json
          price: number | null
          product_id: string
          sku: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          inventory_quantity?: number
          options?: Json
          price?: number | null
          product_id: string
          sku?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          inventory_quantity?: number
          options?: Json
          price?: number | null
          product_id?: string
          sku?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "store_products"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_type: string | null
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          account_type?: string | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          account_type?: string | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      sellers: {
        Row: {
          account_id: string | null
          business_name: string
          contact_email: string
          core_user_id: string
          country: string
          created_at: string
          id: string
          legal_name: string | null
          onboarding_step: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          business_name: string
          contact_email: string
          core_user_id: string
          country?: string
          created_at?: string
          id?: string
          legal_name?: string | null
          onboarding_step?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          business_name?: string
          contact_email?: string
          core_user_id?: string
          country?: string
          created_at?: string
          id?: string
          legal_name?: string | null
          onboarding_step?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sellers_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping: {
        Row: {
          created_at: string
          currency: string
          id: string
          name: string
          rate: number
          regions: string[] | null
          store_id: string
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          name: string
          rate?: number
          regions?: string[] | null
          store_id: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          name?: string
          rate?: number
          regions?: string[] | null
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipping_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      store_activation_events: {
        Row: {
          actor_user_id: string | null
          created_at: string
          event_type: string
          id: string
          payload: Json
          seller_id: string | null
          store_id: string | null
        }
        Insert: {
          actor_user_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          payload?: Json
          seller_id?: string | null
          store_id?: string | null
        }
        Update: {
          actor_user_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json
          seller_id?: string | null
          store_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "store_activation_events_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_activation_events_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      store_domains: {
        Row: {
          created_at: string
          hostname: string
          id: string
          status: string
          store_id: string
          type: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          hostname: string
          id?: string
          status?: string
          store_id: string
          type?: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          hostname?: string
          id?: string
          status?: string
          store_id?: string
          type?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "store_domains_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      store_products: {
        Row: {
          brand_name: string | null
          category: string | null
          compare_at_price: number | null
          created_at: string
          currency: string
          description: string
          hero_image_url: string | null
          id: string
          in_stock: boolean
          ingredients: string | null
          inventory_quantity: number
          onmask_product_id: string | null
          price: number
          product_url_slug: string
          shipping_info: string | null
          size_volume: string | null
          sku: string | null
          status: string
          store_id: string
          tags: string[] | null
          title: string
          unmask_product_id: string | null
          updated_at: string
          usage_info: string | null
          visibility: string
        }
        Insert: {
          brand_name?: string | null
          category?: string | null
          compare_at_price?: number | null
          created_at?: string
          currency?: string
          description?: string
          hero_image_url?: string | null
          id?: string
          in_stock?: boolean
          ingredients?: string | null
          inventory_quantity?: number
          onmask_product_id?: string | null
          price: number
          product_url_slug: string
          shipping_info?: string | null
          size_volume?: string | null
          sku?: string | null
          status?: string
          store_id: string
          tags?: string[] | null
          title: string
          unmask_product_id?: string | null
          updated_at?: string
          usage_info?: string | null
          visibility?: string
        }
        Update: {
          brand_name?: string | null
          category?: string | null
          compare_at_price?: number | null
          created_at?: string
          currency?: string
          description?: string
          hero_image_url?: string | null
          id?: string
          in_stock?: boolean
          ingredients?: string | null
          inventory_quantity?: number
          onmask_product_id?: string | null
          price?: number
          product_url_slug?: string
          shipping_info?: string | null
          size_volume?: string | null
          sku?: string | null
          status?: string
          store_id?: string
          tags?: string[] | null
          title?: string
          unmask_product_id?: string | null
          updated_at?: string
          usage_info?: string | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      store_settings: {
        Row: {
          checkout_enabled: boolean
          created_at: string
          id: string
          published: boolean
          sections: Json
          social_links: Json
          store_id: string
          theme_id: string
          updated_at: string
        }
        Insert: {
          checkout_enabled?: boolean
          created_at?: string
          id?: string
          published?: boolean
          sections?: Json
          social_links?: Json
          store_id: string
          theme_id?: string
          updated_at?: string
        }
        Update: {
          checkout_enabled?: boolean
          created_at?: string
          id?: string
          published?: boolean
          sections?: Json
          social_links?: Json
          store_id?: string
          theme_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_settings_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: true
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      store_subscriptions: {
        Row: {
          amount: number | null
          checkout_reference: string | null
          created_at: string
          currency: string
          ends_at: string | null
          id: string
          paid_at: string | null
          payment_metadata: Json
          payment_provider: string | null
          payment_reference: string | null
          payment_status: string | null
          plan_code: string
          provider_transaction_id: string | null
          seller_id: string
          starts_at: string | null
          status: string
          store_id: string
          updated_at: string
        }
        Insert: {
          amount?: number | null
          checkout_reference?: string | null
          created_at?: string
          currency?: string
          ends_at?: string | null
          id?: string
          paid_at?: string | null
          payment_metadata?: Json
          payment_provider?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          plan_code?: string
          provider_transaction_id?: string | null
          seller_id: string
          starts_at?: string | null
          status?: string
          store_id: string
          updated_at?: string
        }
        Update: {
          amount?: number | null
          checkout_reference?: string | null
          created_at?: string
          currency?: string
          ends_at?: string | null
          id?: string
          paid_at?: string | null
          payment_metadata?: Json
          payment_provider?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          plan_code?: string
          provider_transaction_id?: string | null
          seller_id?: string
          starts_at?: string | null
          status?: string
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_subscriptions_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_subscriptions_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      store_themes: {
        Row: {
          created_at: string
          id: string
          name: string
          tokens: Json
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          tokens?: Json
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          tokens?: Json
        }
        Relationships: []
      }
      stores: {
        Row: {
          activated_at: string | null
          cover_image_url: string | null
          created_at: string
          currency: string
          description: string
          expires_at: string | null
          id: string
          logo_url: string | null
          name: string
          seller_id: string
          slug: string
          status: string
          tagline: string
          updated_at: string
        }
        Insert: {
          activated_at?: string | null
          cover_image_url?: string | null
          created_at?: string
          currency?: string
          description?: string
          expires_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          seller_id: string
          slug: string
          status?: string
          tagline?: string
          updated_at?: string
        }
        Update: {
          activated_at?: string | null
          cover_image_url?: string | null
          created_at?: string
          currency?: string
          description?: string
          expires_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          seller_id?: string
          slug?: string
          status?: string
          tagline?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stores_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          account_id: string
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          payment_metadata: Json
          payment_provider: string | null
          payment_reference: string | null
          plan_id: string
          provider_transaction_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          account_id: string
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          payment_metadata?: Json
          payment_provider?: string | null
          payment_reference?: string | null
          plan_id: string
          provider_transaction_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          account_id?: string
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          payment_metadata?: Json
          payment_provider?: string | null
          payment_reference?: string | null
          plan_id?: string
          provider_transaction_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_brand_id: { Args: never; Returns: string }
      current_seller_id: { Args: never; Returns: string }
      is_store_public: { Args: { p_store_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
