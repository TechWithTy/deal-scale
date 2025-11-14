export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	// Allows to automatically instantiate createClient with right options
	// instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
	__InternalSupabase: {
		PostgrestVersion: "12.2.12 (cd3cf9e)";
	};
	public: {
		Tables: {
			affiliate_payouts: {
				Row: {
					affiliate_id: string;
					amount: number;
					completed_at: string | null;
					created_at: string | null;
					currency: string | null;
					id: string;
					initiated_at: string | null;
					is_recurring: boolean | null;
					metadata: Json | null;
					notes: string | null;
					payment_method: Database["public"]["Enums"]["payment_method"];
					reference_id: string | null;
					schedule_id: string | null;
					status: string;
					updated_at: string | null;
				};
				Insert: {
					affiliate_id: string;
					amount: number;
					completed_at?: string | null;
					created_at?: string | null;
					currency?: string | null;
					id?: string;
					initiated_at?: string | null;
					is_recurring?: boolean | null;
					metadata?: Json | null;
					notes?: string | null;
					payment_method: Database["public"]["Enums"]["payment_method"];
					reference_id?: string | null;
					schedule_id?: string | null;
					status?: string;
					updated_at?: string | null;
				};
				Update: {
					affiliate_id?: string;
					amount?: number;
					completed_at?: string | null;
					created_at?: string | null;
					currency?: string | null;
					id?: string;
					initiated_at?: string | null;
					is_recurring?: boolean | null;
					metadata?: Json | null;
					notes?: string | null;
					payment_method?: Database["public"]["Enums"]["payment_method"];
					reference_id?: string | null;
					schedule_id?: string | null;
					status?: string;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "affiliate_payouts_affiliate_id_fkey";
						columns: ["affiliate_id"];
						isOneToOne: false;
						referencedRelation: "affiliate_profiles";
						referencedColumns: ["id"];
					},
				];
			};
			affiliate_profiles: {
				Row: {
					active_referrals: number | null;
					bank_account: Json | null;
					commission_rate: number | null;
					created_at: string | null;
					custom_promo_code: string | null;
					id: string;
					is_active: boolean | null;
					last_payout_date: string | null;
					lifetime_earnings: number | null;
					metadata: Json | null;
					minimum_payout: number | null;
					network_size: Database["public"]["Enums"]["network_size"];
					next_payout_date: string | null;
					payout_schedule:
						| Database["public"]["Enums"]["payout_schedule"]
						| null;
					pending_payout: number | null;
					real_estate_experience: Database["public"]["Enums"]["real_estate_experience"];
					social_handle: string;
					status: Database["public"]["Enums"]["affiliate_status"] | null;
					tax_info: Json | null;
					tier: Database["public"]["Enums"]["commission_tier"] | null;
					total_commissions: number | null;
					total_referrals: number | null;
					updated_at: string | null;
					user_id: string;
					website: string | null;
				};
				Insert: {
					active_referrals?: number | null;
					bank_account?: Json | null;
					commission_rate?: number | null;
					created_at?: string | null;
					custom_promo_code?: string | null;
					id?: string;
					is_active?: boolean | null;
					last_payout_date?: string | null;
					lifetime_earnings?: number | null;
					metadata?: Json | null;
					minimum_payout?: number | null;
					network_size: Database["public"]["Enums"]["network_size"];
					next_payout_date?: string | null;
					payout_schedule?:
						| Database["public"]["Enums"]["payout_schedule"]
						| null;
					pending_payout?: number | null;
					real_estate_experience: Database["public"]["Enums"]["real_estate_experience"];
					social_handle: string;
					status?: Database["public"]["Enums"]["affiliate_status"] | null;
					tax_info?: Json | null;
					tier?: Database["public"]["Enums"]["commission_tier"] | null;
					total_commissions?: number | null;
					total_referrals?: number | null;
					updated_at?: string | null;
					user_id: string;
					website?: string | null;
				};
				Update: {
					active_referrals?: number | null;
					bank_account?: Json | null;
					commission_rate?: number | null;
					created_at?: string | null;
					custom_promo_code?: string | null;
					id?: string;
					is_active?: boolean | null;
					last_payout_date?: string | null;
					lifetime_earnings?: number | null;
					metadata?: Json | null;
					minimum_payout?: number | null;
					network_size?: Database["public"]["Enums"]["network_size"];
					next_payout_date?: string | null;
					payout_schedule?:
						| Database["public"]["Enums"]["payout_schedule"]
						| null;
					pending_payout?: number | null;
					real_estate_experience?: Database["public"]["Enums"]["real_estate_experience"];
					social_handle?: string;
					status?: Database["public"]["Enums"]["affiliate_status"] | null;
					tax_info?: Json | null;
					tier?: Database["public"]["Enums"]["commission_tier"] | null;
					total_commissions?: number | null;
					total_referrals?: number | null;
					updated_at?: string | null;
					user_id?: string;
					website?: string | null;
				};
				Relationships: [];
			};
			affiliate_referrals: {
				Row: {
					affiliate_id: string;
					campaign: string | null;
					commission_earned: number | null;
					conversion_date: string | null;
					conversion_value: number | null;
					converted: boolean | null;
					created_at: string | null;
					id: string;
					ip_address: unknown | null;
					metadata: Json | null;
					referral_code: string;
					referred_user_id: string;
					source: string | null;
					updated_at: string | null;
					user_agent: string | null;
				};
				Insert: {
					affiliate_id: string;
					campaign?: string | null;
					commission_earned?: number | null;
					conversion_date?: string | null;
					conversion_value?: number | null;
					converted?: boolean | null;
					created_at?: string | null;
					id?: string;
					ip_address?: unknown | null;
					metadata?: Json | null;
					referral_code: string;
					referred_user_id: string;
					source?: string | null;
					updated_at?: string | null;
					user_agent?: string | null;
				};
				Update: {
					affiliate_id?: string;
					campaign?: string | null;
					commission_earned?: number | null;
					conversion_date?: string | null;
					conversion_value?: number | null;
					converted?: boolean | null;
					created_at?: string | null;
					id?: string;
					ip_address?: unknown | null;
					metadata?: Json | null;
					referral_code?: string;
					referred_user_id?: string;
					source?: string | null;
					updated_at?: string | null;
					user_agent?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "affiliate_referrals_affiliate_id_fkey";
						columns: ["affiliate_id"];
						isOneToOne: false;
						referencedRelation: "affiliate_profiles";
						referencedColumns: ["id"];
					},
				];
			};
			beta_credit_transactions: {
				Row: {
					amount: number;
					balance_after: number | null;
					balance_before: number | null;
					created_at: string | null;
					credit_type: Database["public"]["Enums"]["credit_type"];
					description: string | null;
					id: string;
					metadata: Json | null;
					performed_by: string | null;
					processed_at: string | null;
					reason: Database["public"]["Enums"]["credit_adjustment_reason"];
					reference_id: string | null;
					status: Database["public"]["Enums"]["transaction_status"] | null;
					user_id: string;
				};
				Insert: {
					amount: number;
					balance_after?: number | null;
					balance_before?: number | null;
					created_at?: string | null;
					credit_type: Database["public"]["Enums"]["credit_type"];
					description?: string | null;
					id?: string;
					metadata?: Json | null;
					performed_by?: string | null;
					processed_at?: string | null;
					reason: Database["public"]["Enums"]["credit_adjustment_reason"];
					reference_id?: string | null;
					status?: Database["public"]["Enums"]["transaction_status"] | null;
					user_id: string;
				};
				Update: {
					amount?: number;
					balance_after?: number | null;
					balance_before?: number | null;
					created_at?: string | null;
					credit_type?: Database["public"]["Enums"]["credit_type"];
					description?: string | null;
					id?: string;
					metadata?: Json | null;
					performed_by?: string | null;
					processed_at?: string | null;
					reason?: Database["public"]["Enums"]["credit_adjustment_reason"];
					reference_id?: string | null;
					status?: Database["public"]["Enums"]["transaction_status"] | null;
					user_id?: string;
				};
				Relationships: [];
			};
			beta_user_credits: {
				Row: {
					admin_credits: number | null;
					api_call_credits: number | null;
					created_at: string | null;
					enrichment_credits: number | null;
					id: string;
					metadata: Json | null;
					premium_feature_credits: number | null;
					prospecting_credits: number | null;
					total_credits: number | null;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					admin_credits?: number | null;
					api_call_credits?: number | null;
					created_at?: string | null;
					enrichment_credits?: number | null;
					id?: string;
					metadata?: Json | null;
					premium_feature_credits?: number | null;
					prospecting_credits?: number | null;
					total_credits?: number | null;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					admin_credits?: number | null;
					api_call_credits?: number | null;
					created_at?: string | null;
					enrichment_credits?: number | null;
					id?: string;
					metadata?: Json | null;
					premium_feature_credits?: number | null;
					prospecting_credits?: number | null;
					total_credits?: number | null;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
			cart_items: {
				Row: {
					added_at: string | null;
					cart_id: string;
					category: string | null;
					id: string;
					image: string | null;
					in_stock: boolean | null;
					metadata: Json | null;
					name: string;
					notes: string | null;
					price: number;
					product_id: string;
					quantity: number;
					requires_shipping: boolean | null;
					selected_variant: Json | null;
					subtotal: number;
					updated_at: string | null;
				};
				Insert: {
					added_at?: string | null;
					cart_id: string;
					category?: string | null;
					id?: string;
					image?: string | null;
					in_stock?: boolean | null;
					metadata?: Json | null;
					name: string;
					notes?: string | null;
					price: number;
					product_id: string;
					quantity: number;
					requires_shipping?: boolean | null;
					selected_variant?: Json | null;
					subtotal: number;
					updated_at?: string | null;
				};
				Update: {
					added_at?: string | null;
					cart_id?: string;
					category?: string | null;
					id?: string;
					image?: string | null;
					in_stock?: boolean | null;
					metadata?: Json | null;
					name?: string;
					notes?: string | null;
					price?: number;
					product_id?: string;
					quantity?: number;
					requires_shipping?: boolean | null;
					selected_variant?: Json | null;
					subtotal?: number;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "cart_items_cart_id_fkey";
						columns: ["cart_id"];
						isOneToOne: false;
						referencedRelation: "carts";
						referencedColumns: ["id"];
					},
				];
			};
			carts: {
				Row: {
					abandoned_at: string | null;
					completed_at: string | null;
					created_at: string | null;
					id: string;
					metadata: Json | null;
					status: Database["public"]["Enums"]["cart_status"] | null;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					abandoned_at?: string | null;
					completed_at?: string | null;
					created_at?: string | null;
					id?: string;
					metadata?: Json | null;
					status?: Database["public"]["Enums"]["cart_status"] | null;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					abandoned_at?: string | null;
					completed_at?: string | null;
					created_at?: string | null;
					id?: string;
					metadata?: Json | null;
					status?: Database["public"]["Enums"]["cart_status"] | null;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
			checkout_sessions: {
				Row: {
					amount: number;
					completed_at: string | null;
					created_at: string;
					credits_requested: number;
					currency: string;
					expires_at: string | null;
					id: string;
					metadata: Json | null;
					status: string;
					stripe_session_id: string;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					amount: number;
					completed_at?: string | null;
					created_at?: string;
					credits_requested: number;
					currency?: string;
					expires_at?: string | null;
					id?: string;
					metadata?: Json | null;
					status?: string;
					stripe_session_id: string;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					amount?: number;
					completed_at?: string | null;
					created_at?: string;
					credits_requested?: number;
					currency?: string;
					expires_at?: string | null;
					id?: string;
					metadata?: Json | null;
					status?: string;
					stripe_session_id?: string;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			credit_balances: {
				Row: {
					available_credits: number;
					created_at: string;
					credit_type: string | null;
					id: string;
					lifetime_earned: number;
					reserved_credits: number;
					total_credits: number;
					total_earned: number;
					total_spent: number;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					available_credits?: number;
					created_at?: string;
					credit_type?: string | null;
					id?: string;
					lifetime_earned?: number;
					reserved_credits?: number;
					total_credits?: number;
					total_earned?: number;
					total_spent?: number;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					available_credits?: number;
					created_at?: string;
					credit_type?: string | null;
					id?: string;
					lifetime_earned?: number;
					reserved_credits?: number;
					total_credits?: number;
					total_earned?: number;
					total_spent?: number;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			credit_purchases: {
				Row: {
					amount_paid: number;
					completed_at: string | null;
					created_at: string;
					credits_applied: boolean;
					credits_purchased: number;
					currency: string;
					id: string;
					metadata: Json | null;
					package_name: string | null;
					provider: string;
					status: string;
					stripe_customer_id: string | null;
					stripe_payment_intent_id: string | null;
					stripe_session_id: string;
					user_id: string;
					webhook_processed: boolean;
				};
				Insert: {
					amount_paid: number;
					completed_at?: string | null;
					created_at?: string;
					credits_applied?: boolean;
					credits_purchased: number;
					currency?: string;
					id?: string;
					metadata?: Json | null;
					package_name?: string | null;
					provider?: string;
					status?: string;
					stripe_customer_id?: string | null;
					stripe_payment_intent_id?: string | null;
					stripe_session_id: string;
					user_id: string;
					webhook_processed?: boolean;
				};
				Update: {
					amount_paid?: number;
					completed_at?: string | null;
					created_at?: string;
					credits_applied?: boolean;
					credits_purchased?: number;
					currency?: string;
					id?: string;
					metadata?: Json | null;
					package_name?: string | null;
					provider?: string;
					status?: string;
					stripe_customer_id?: string | null;
					stripe_payment_intent_id?: string | null;
					stripe_session_id?: string;
					user_id?: string;
					webhook_processed?: boolean;
				};
				Relationships: [];
			};
			credit_transactions: {
				Row: {
					amount: number;
					balance_after: number;
					balance_before: number;
					balance_id: string;
					created_at: string;
					description: string;
					expires_at: string | null;
					id: string;
					metadata: Json | null;
					payment_id: string | null;
					subscription_id: string | null;
					transaction_type: Database["public"]["Enums"]["credit_transaction_type"];
				};
				Insert: {
					amount: number;
					balance_after: number;
					balance_before: number;
					balance_id: string;
					created_at?: string;
					description: string;
					expires_at?: string | null;
					id?: string;
					metadata?: Json | null;
					payment_id?: string | null;
					subscription_id?: string | null;
					transaction_type: Database["public"]["Enums"]["credit_transaction_type"];
				};
				Update: {
					amount?: number;
					balance_after?: number;
					balance_before?: number;
					balance_id?: string;
					created_at?: string;
					description?: string;
					expires_at?: string | null;
					id?: string;
					metadata?: Json | null;
					payment_id?: string | null;
					subscription_id?: string | null;
					transaction_type?: Database["public"]["Enums"]["credit_transaction_type"];
				};
				Relationships: [
					{
						foreignKeyName: "credit_transactions_balance_id_fkey";
						columns: ["balance_id"];
						isOneToOne: false;
						referencedRelation: "credit_balances";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "credit_transactions_payment_id_fkey";
						columns: ["payment_id"];
						isOneToOne: false;
						referencedRelation: "payment_transactions";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "credit_transactions_subscription_id_fkey";
						columns: ["subscription_id"];
						isOneToOne: false;
						referencedRelation: "stripe_subscriptions";
						referencedColumns: ["id"];
					},
				];
			};
			feature_votes: {
				Row: {
					comment: string | null;
					created_at: string | null;
					feature_id: string;
					id: string;
					metadata: Json | null;
					source: Database["public"]["Enums"]["vote_source"] | null;
					tester_type: string | null;
					updated_at: string | null;
					user_id: string;
					weight: number | null;
				};
				Insert: {
					comment?: string | null;
					created_at?: string | null;
					feature_id: string;
					id?: string;
					metadata?: Json | null;
					source?: Database["public"]["Enums"]["vote_source"] | null;
					tester_type?: string | null;
					updated_at?: string | null;
					user_id: string;
					weight?: number | null;
				};
				Update: {
					comment?: string | null;
					created_at?: string | null;
					feature_id?: string;
					id?: string;
					metadata?: Json | null;
					source?: Database["public"]["Enums"]["vote_source"] | null;
					tester_type?: string | null;
					updated_at?: string | null;
					user_id?: string;
					weight?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "feature_votes_feature_id_fkey";
						columns: ["feature_id"];
						isOneToOne: false;
						referencedRelation: "features";
						referencedColumns: ["id"];
					},
				];
			};
			features: {
				Row: {
					created_at: string | null;
					description: string;
					estimated_effort: string | null;
					id: string;
					metadata: Json | null;
					priority_score: number | null;
					slug: string;
					status: Database["public"]["Enums"]["feature_status"] | null;
					tags: string[] | null;
					target_release: string | null;
					title: string;
					updated_at: string | null;
					votes_total: number | null;
					votes_weighted: number | null;
				};
				Insert: {
					created_at?: string | null;
					description: string;
					estimated_effort?: string | null;
					id?: string;
					metadata?: Json | null;
					priority_score?: number | null;
					slug: string;
					status?: Database["public"]["Enums"]["feature_status"] | null;
					tags?: string[] | null;
					target_release?: string | null;
					title: string;
					updated_at?: string | null;
					votes_total?: number | null;
					votes_weighted?: number | null;
				};
				Update: {
					created_at?: string | null;
					description?: string;
					estimated_effort?: string | null;
					id?: string;
					metadata?: Json | null;
					priority_score?: number | null;
					slug?: string;
					status?: Database["public"]["Enums"]["feature_status"] | null;
					tags?: string[] | null;
					target_release?: string | null;
					title?: string;
					updated_at?: string | null;
					votes_total?: number | null;
					votes_weighted?: number | null;
				};
				Relationships: [];
			};
			login_attempts: {
				Row: {
					created_at: string;
					device_fingerprint: string | null;
					email: string;
					failure_reason: string | null;
					id: string;
					ip_address: unknown | null;
					location_city: string | null;
					location_country: string | null;
					successful: boolean;
					user_agent: string | null;
					user_id: string | null;
				};
				Insert: {
					created_at?: string;
					device_fingerprint?: string | null;
					email: string;
					failure_reason?: string | null;
					id?: string;
					ip_address?: unknown | null;
					location_city?: string | null;
					location_country?: string | null;
					successful: boolean;
					user_agent?: string | null;
					user_id?: string | null;
				};
				Update: {
					created_at?: string;
					device_fingerprint?: string | null;
					email?: string;
					failure_reason?: string | null;
					id?: string;
					ip_address?: unknown | null;
					location_city?: string | null;
					location_country?: string | null;
					successful?: boolean;
					user_agent?: string | null;
					user_id?: string | null;
				};
				Relationships: [];
			};
			password_reset_tokens: {
				Row: {
					created_at: string;
					expires_at: string;
					id: string;
					ip_address: unknown | null;
					is_used: boolean;
					token: string;
					used_at: string | null;
					user_agent: string | null;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					expires_at: string;
					id?: string;
					ip_address?: unknown | null;
					is_used?: boolean;
					token: string;
					used_at?: string | null;
					user_agent?: string | null;
					user_id: string;
				};
				Update: {
					created_at?: string;
					expires_at?: string;
					id?: string;
					ip_address?: unknown | null;
					is_used?: boolean;
					token?: string;
					used_at?: string | null;
					user_agent?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
			payment_transactions: {
				Row: {
					amount: number;
					created_at: string;
					credits_allocated: number;
					currency: string;
					customer_id: string;
					description: string | null;
					failure_code: string | null;
					failure_message: string | null;
					id: string;
					livemode: boolean;
					payment_method_details: Json | null;
					payment_method_type: string | null;
					receipt_url: string | null;
					status: Database["public"]["Enums"]["payment_status"];
					stripe_charge_id: string | null;
					stripe_payment_intent_id: string | null;
					transaction_metadata: Json | null;
					updated_at: string;
				};
				Insert: {
					amount: number;
					created_at?: string;
					credits_allocated?: number;
					currency?: string;
					customer_id: string;
					description?: string | null;
					failure_code?: string | null;
					failure_message?: string | null;
					id?: string;
					livemode?: boolean;
					payment_method_details?: Json | null;
					payment_method_type?: string | null;
					receipt_url?: string | null;
					status?: Database["public"]["Enums"]["payment_status"];
					stripe_charge_id?: string | null;
					stripe_payment_intent_id?: string | null;
					transaction_metadata?: Json | null;
					updated_at?: string;
				};
				Update: {
					amount?: number;
					created_at?: string;
					credits_allocated?: number;
					currency?: string;
					customer_id?: string;
					description?: string | null;
					failure_code?: string | null;
					failure_message?: string | null;
					id?: string;
					livemode?: boolean;
					payment_method_details?: Json | null;
					payment_method_type?: string | null;
					receipt_url?: string | null;
					status?: Database["public"]["Enums"]["payment_status"];
					stripe_charge_id?: string | null;
					stripe_payment_intent_id?: string | null;
					transaction_metadata?: Json | null;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "payment_transactions_customer_id_fkey";
						columns: ["customer_id"];
						isOneToOne: false;
						referencedRelation: "stripe_customers";
						referencedColumns: ["id"];
					},
				];
			};
			permissions: {
				Row: {
					action: string | null;
					category: string | null;
					created_at: string | null;
					description: string | null;
					id: string;
					is_active: boolean;
					name: string;
					resource: string | null;
					updated_at: string | null;
				};
				Insert: {
					action?: string | null;
					category?: string | null;
					created_at?: string | null;
					description?: string | null;
					id?: string;
					is_active?: boolean;
					name: string;
					resource?: string | null;
					updated_at?: string | null;
				};
				Update: {
					action?: string | null;
					category?: string | null;
					created_at?: string | null;
					description?: string | null;
					id?: string;
					is_active?: boolean;
					name?: string;
					resource?: string | null;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			processed_events: {
				Row: {
					created_at: string;
					event_id: string;
					event_type: string;
					id: string;
					metadata: Json | null;
					processed_at: string;
					session_id: string | null;
					success: boolean;
					user_id: string | null;
				};
				Insert: {
					created_at?: string;
					event_id: string;
					event_type: string;
					id?: string;
					metadata?: Json | null;
					processed_at?: string;
					session_id?: string | null;
					success?: boolean;
					user_id?: string | null;
				};
				Update: {
					created_at?: string;
					event_id?: string;
					event_type?: string;
					id?: string;
					metadata?: Json | null;
					processed_at?: string;
					session_id?: string | null;
					success?: boolean;
					user_id?: string | null;
				};
				Relationships: [];
			};
			schema_versions: {
				Row: {
					applied_at: string | null;
					description: string | null;
					id: number;
					version: string;
				};
				Insert: {
					applied_at?: string | null;
					description?: string | null;
					id?: number;
					version: string;
				};
				Update: {
					applied_at?: string | null;
					description?: string | null;
					id?: number;
					version?: string;
				};
				Relationships: [];
			};
			stripe_customers: {
				Row: {
					address: Json | null;
					created_at: string;
					customer_metadata: Json | null;
					default_payment_method: string | null;
					email: string;
					id: string;
					invoice_prefix: string | null;
					is_active: boolean;
					livemode: boolean;
					name: string | null;
					phone: string | null;
					stripe_customer_id: string;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					address?: Json | null;
					created_at?: string;
					customer_metadata?: Json | null;
					default_payment_method?: string | null;
					email: string;
					id?: string;
					invoice_prefix?: string | null;
					is_active?: boolean;
					livemode?: boolean;
					name?: string | null;
					phone?: string | null;
					stripe_customer_id: string;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					address?: Json | null;
					created_at?: string;
					customer_metadata?: Json | null;
					default_payment_method?: string | null;
					email?: string;
					id?: string;
					invoice_prefix?: string | null;
					is_active?: boolean;
					livemode?: boolean;
					name?: string | null;
					phone?: string | null;
					stripe_customer_id?: string;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			stripe_subscriptions: {
				Row: {
					amount: number;
					cancel_at_period_end: boolean;
					canceled_at: string | null;
					created_at: string;
					currency: string;
					current_period_end: string;
					current_period_start: string;
					customer_id: string;
					ended_at: string | null;
					id: string;
					initial_credits: number;
					interval: string;
					interval_count: number;
					livemode: boolean;
					monthly_credits: number;
					status: Database["public"]["Enums"]["subscription_status"];
					stripe_price_id: string;
					stripe_subscription_id: string;
					subscription_metadata: Json | null;
					tier: Database["public"]["Enums"]["subscription_tier"];
					trial_end: string | null;
					trial_start: string | null;
					updated_at: string;
				};
				Insert: {
					amount: number;
					cancel_at_period_end?: boolean;
					canceled_at?: string | null;
					created_at?: string;
					currency?: string;
					current_period_end: string;
					current_period_start: string;
					customer_id: string;
					ended_at?: string | null;
					id?: string;
					initial_credits?: number;
					interval: string;
					interval_count?: number;
					livemode?: boolean;
					monthly_credits?: number;
					status: Database["public"]["Enums"]["subscription_status"];
					stripe_price_id: string;
					stripe_subscription_id: string;
					subscription_metadata?: Json | null;
					tier?: Database["public"]["Enums"]["subscription_tier"];
					trial_end?: string | null;
					trial_start?: string | null;
					updated_at?: string;
				};
				Update: {
					amount?: number;
					cancel_at_period_end?: boolean;
					canceled_at?: string | null;
					created_at?: string;
					currency?: string;
					current_period_end?: string;
					current_period_start?: string;
					customer_id?: string;
					ended_at?: string | null;
					id?: string;
					initial_credits?: number;
					interval?: string;
					interval_count?: number;
					livemode?: boolean;
					monthly_credits?: number;
					status?: Database["public"]["Enums"]["subscription_status"];
					stripe_price_id?: string;
					stripe_subscription_id?: string;
					subscription_metadata?: Json | null;
					tier?: Database["public"]["Enums"]["subscription_tier"];
					trial_end?: string | null;
					trial_start?: string | null;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "stripe_subscriptions_customer_id_fkey";
						columns: ["customer_id"];
						isOneToOne: false;
						referencedRelation: "stripe_customers";
						referencedColumns: ["id"];
					},
				];
			};
			stripe_webhook_events: {
				Row: {
					created_at: string;
					event_data: Json;
					event_type: string;
					id: string;
					last_error: string | null;
					livemode: boolean;
					processed: boolean;
					processed_at: string | null;
					processing_attempts: number;
					stripe_event_id: string;
				};
				Insert: {
					created_at?: string;
					event_data: Json;
					event_type: string;
					id?: string;
					last_error?: string | null;
					livemode?: boolean;
					processed?: boolean;
					processed_at?: string | null;
					processing_attempts?: number;
					stripe_event_id: string;
				};
				Update: {
					created_at?: string;
					event_data?: Json;
					event_type?: string;
					id?: string;
					last_error?: string | null;
					livemode?: boolean;
					processed?: boolean;
					processed_at?: string | null;
					processing_attempts?: number;
					stripe_event_id?: string;
				};
				Relationships: [];
			};
			testers: {
				Row: {
					applied_at: string | null;
					approved_at: string | null;
					company_info: Json;
					completed_at: string | null;
					created_at: string | null;
					current_crm: string | null;
					deal_documents: string[] | null;
					deals_closed_last_year:
						| Database["public"]["Enums"]["deals_closed"]
						| null;
					employee_count: Database["public"]["Enums"]["employee_count"] | null;
					feature_votes: string[] | null;
					feedback_commitment: boolean | null;
					icp_type: Database["public"]["Enums"]["icp_type"] | null;
					id: string;
					interested_features: string[] | null;
					metadata: Json | null;
					notes: string | null;
					pain_points: string[] | null;
					payment_agreement: boolean | null;
					primary_deal_sources: string[] | null;
					started_at: string | null;
					status: Database["public"]["Enums"]["tester_status"] | null;
					success_metrics: string | null;
					team_size_acquisitions: string | null;
					terms_accepted: boolean | null;
					tester_type: Database["public"]["Enums"]["tester_type"];
					updated_at: string | null;
					user_id: string;
					wanted_features: string[] | null;
				};
				Insert: {
					applied_at?: string | null;
					approved_at?: string | null;
					company_info?: Json;
					completed_at?: string | null;
					created_at?: string | null;
					current_crm?: string | null;
					deal_documents?: string[] | null;
					deals_closed_last_year?:
						| Database["public"]["Enums"]["deals_closed"]
						| null;
					employee_count?: Database["public"]["Enums"]["employee_count"] | null;
					feature_votes?: string[] | null;
					feedback_commitment?: boolean | null;
					icp_type?: Database["public"]["Enums"]["icp_type"] | null;
					id?: string;
					interested_features?: string[] | null;
					metadata?: Json | null;
					notes?: string | null;
					pain_points?: string[] | null;
					payment_agreement?: boolean | null;
					primary_deal_sources?: string[] | null;
					started_at?: string | null;
					status?: Database["public"]["Enums"]["tester_status"] | null;
					success_metrics?: string | null;
					team_size_acquisitions?: string | null;
					terms_accepted?: boolean | null;
					tester_type: Database["public"]["Enums"]["tester_type"];
					updated_at?: string | null;
					user_id: string;
					wanted_features?: string[] | null;
				};
				Update: {
					applied_at?: string | null;
					approved_at?: string | null;
					company_info?: Json;
					completed_at?: string | null;
					created_at?: string | null;
					current_crm?: string | null;
					deal_documents?: string[] | null;
					deals_closed_last_year?:
						| Database["public"]["Enums"]["deals_closed"]
						| null;
					employee_count?: Database["public"]["Enums"]["employee_count"] | null;
					feature_votes?: string[] | null;
					feedback_commitment?: boolean | null;
					icp_type?: Database["public"]["Enums"]["icp_type"] | null;
					id?: string;
					interested_features?: string[] | null;
					metadata?: Json | null;
					notes?: string | null;
					pain_points?: string[] | null;
					payment_agreement?: boolean | null;
					primary_deal_sources?: string[] | null;
					started_at?: string | null;
					status?: Database["public"]["Enums"]["tester_status"] | null;
					success_metrics?: string | null;
					team_size_acquisitions?: string | null;
					terms_accepted?: boolean | null;
					tester_type?: Database["public"]["Enums"]["tester_type"];
					updated_at?: string | null;
					user_id?: string;
					wanted_features?: string[] | null;
				};
				Relationships: [];
			};
			user_api_key_permissions: {
				Row: {
					api_key_id: string;
					granted_at: string | null;
					granted_by: string | null;
					id: string;
					permission_id: string;
				};
				Insert: {
					api_key_id: string;
					granted_at?: string | null;
					granted_by?: string | null;
					id?: string;
					permission_id: string;
				};
				Update: {
					api_key_id?: string;
					granted_at?: string | null;
					granted_by?: string | null;
					id?: string;
					permission_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_api_key_permissions_api_key_id_fkey";
						columns: ["api_key_id"];
						isOneToOne: false;
						referencedRelation: "api_keys_with_permissions";
						referencedColumns: ["api_key_id"];
					},
					{
						foreignKeyName: "user_api_key_permissions_api_key_id_fkey";
						columns: ["api_key_id"];
						isOneToOne: false;
						referencedRelation: "user_api_keys";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "user_api_key_permissions_permission_id_fkey";
						columns: ["permission_id"];
						isOneToOne: false;
						referencedRelation: "permissions";
						referencedColumns: ["id"];
					},
				];
			};
			user_api_keys: {
				Row: {
					created_at: string | null;
					expires_at: string | null;
					id: string;
					is_active: boolean;
					key_hash: string;
					key_prefix: string;
					last_used_at: string | null;
					metadata: Json | null;
					name: string;
					rate_limit_per_minute: number | null;
					scopes: string[] | null;
					updated_at: string | null;
					usage_count: number | null;
					user_id: string;
				};
				Insert: {
					created_at?: string | null;
					expires_at?: string | null;
					id?: string;
					is_active?: boolean;
					key_hash: string;
					key_prefix: string;
					last_used_at?: string | null;
					metadata?: Json | null;
					name: string;
					rate_limit_per_minute?: number | null;
					scopes?: string[] | null;
					updated_at?: string | null;
					usage_count?: number | null;
					user_id: string;
				};
				Update: {
					created_at?: string | null;
					expires_at?: string | null;
					id?: string;
					is_active?: boolean;
					key_hash?: string;
					key_prefix?: string;
					last_used_at?: string | null;
					metadata?: Json | null;
					name?: string;
					rate_limit_per_minute?: number | null;
					scopes?: string[] | null;
					updated_at?: string | null;
					usage_count?: number | null;
					user_id?: string;
				};
				Relationships: [];
			};
			user_oauth_credentials: {
				Row: {
					access_token: string;
					company_id: string | null;
					connected_account_id: string;
					created_at: string;
					expires_in: number;
					handle: string | null;
					id: string;
					last_refreshed_at: string | null;
					page_id: string | null;
					provider: string;
					refresh_token: string | null;
					scope: string | null;
					token_type: string;
					updated_at: string;
					user_id: string;
					username: string | null;
				};
				Insert: {
					access_token: string;
					company_id?: string | null;
					connected_account_id: string;
					created_at?: string;
					expires_in: number;
					handle?: string | null;
					id?: string;
					last_refreshed_at?: string | null;
					page_id?: string | null;
					provider: string;
					refresh_token?: string | null;
					scope?: string | null;
					token_type: string;
					updated_at?: string;
					user_id: string;
					username?: string | null;
				};
				Update: {
					access_token?: string;
					company_id?: string | null;
					connected_account_id?: string;
					created_at?: string;
					expires_in?: number;
					handle?: string | null;
					id?: string;
					last_refreshed_at?: string | null;
					page_id?: string | null;
					provider?: string;
					refresh_token?: string | null;
					scope?: string | null;
					token_type?: string;
					updated_at?: string;
					user_id?: string;
					username?: string | null;
				};
				Relationships: [];
			};
			user_profile_setup: {
				Row: {
					basic_info_completed: boolean;
					completed_at: string | null;
					created_at: string;
					email_verified: boolean;
					id: string;
					payment_method_added: boolean;
					phone_verified: boolean;
					preferences_set: boolean;
					progress_percentage: number;
					status: Database["public"]["Enums"]["profile_setup_status"];
					updated_at: string;
					user_id: string;
				};
				Insert: {
					basic_info_completed?: boolean;
					completed_at?: string | null;
					created_at?: string;
					email_verified?: boolean;
					id?: string;
					payment_method_added?: boolean;
					phone_verified?: boolean;
					preferences_set?: boolean;
					progress_percentage?: number;
					status?: Database["public"]["Enums"]["profile_setup_status"];
					updated_at?: string;
					user_id: string;
				};
				Update: {
					basic_info_completed?: boolean;
					completed_at?: string | null;
					created_at?: string;
					email_verified?: boolean;
					id?: string;
					payment_method_added?: boolean;
					phone_verified?: boolean;
					preferences_set?: boolean;
					progress_percentage?: number;
					status?: Database["public"]["Enums"]["profile_setup_status"];
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			user_profiles: {
				Row: {
					avatar_url: string | null;
					company: string | null;
					created_at: string;
					display_name: string | null;
					email_verified: boolean | null;
					feature_flags: Json | null;
					first_name: string | null;
					id: string;
					is_active: boolean | null;
					job_title: string | null;
					last_login: string | null;
					last_name: string | null;
					onboarding_completed: boolean | null;
					phone: string | null;
					phone_verified: boolean | null;
					preferences: Json | null;
					timezone: string | null;
					updated_at: string;
				};
				Insert: {
					avatar_url?: string | null;
					company?: string | null;
					created_at?: string;
					display_name?: string | null;
					email_verified?: boolean | null;
					feature_flags?: Json | null;
					first_name?: string | null;
					id: string;
					is_active?: boolean | null;
					job_title?: string | null;
					last_login?: string | null;
					last_name?: string | null;
					onboarding_completed?: boolean | null;
					phone?: string | null;
					phone_verified?: boolean | null;
					preferences?: Json | null;
					timezone?: string | null;
					updated_at?: string;
				};
				Update: {
					avatar_url?: string | null;
					company?: string | null;
					created_at?: string;
					display_name?: string | null;
					email_verified?: boolean | null;
					feature_flags?: Json | null;
					first_name?: string | null;
					id?: string;
					is_active?: boolean | null;
					job_title?: string | null;
					last_login?: string | null;
					last_name?: string | null;
					onboarding_completed?: boolean | null;
					phone?: string | null;
					phone_verified?: boolean | null;
					preferences?: Json | null;
					timezone?: string | null;
					updated_at?: string;
				};
				Relationships: [];
			};
			user_roles: {
				Row: {
					assigned_at: string;
					assigned_by: string;
					created_at: string;
					id: string;
					is_active: boolean;
					role: string;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					assigned_at?: string;
					assigned_by?: string;
					created_at?: string;
					id?: string;
					is_active?: boolean;
					role: string;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					assigned_at?: string;
					assigned_by?: string;
					created_at?: string;
					id?: string;
					is_active?: boolean;
					role?: string;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			user_sessions: {
				Row: {
					browser: string | null;
					created_at: string;
					device_fingerprint: string | null;
					expires_at: string;
					id: string;
					ip_address: unknown | null;
					is_mobile: boolean;
					last_accessed_at: string;
					location_city: string | null;
					location_country: string | null;
					platform: string | null;
					refresh_token: string;
					status: Database["public"]["Enums"]["session_status"];
					updated_at: string;
					user_agent: string | null;
					user_id: string;
				};
				Insert: {
					browser?: string | null;
					created_at?: string;
					device_fingerprint?: string | null;
					expires_at: string;
					id?: string;
					ip_address?: unknown | null;
					is_mobile?: boolean;
					last_accessed_at?: string;
					location_city?: string | null;
					location_country?: string | null;
					platform?: string | null;
					refresh_token: string;
					status?: Database["public"]["Enums"]["session_status"];
					updated_at?: string;
					user_agent?: string | null;
					user_id: string;
				};
				Update: {
					browser?: string | null;
					created_at?: string;
					device_fingerprint?: string | null;
					expires_at?: string;
					id?: string;
					ip_address?: unknown | null;
					is_mobile?: boolean;
					last_accessed_at?: string;
					location_city?: string | null;
					location_country?: string | null;
					platform?: string | null;
					refresh_token?: string;
					status?: Database["public"]["Enums"]["session_status"];
					updated_at?: string;
					user_agent?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
		};
		Views: {
			api_keys_with_permissions: {
				Row: {
					api_key_id: string | null;
					created_at: string | null;
					expires_at: string | null;
					explicit_permissions: string[] | null;
					is_active: boolean | null;
					key_name: string | null;
					key_prefix: string | null;
					last_used_at: string | null;
					scopes: string[] | null;
					usage_count: number | null;
					user_id: string | null;
				};
				Relationships: [];
			};
			credit_balance_summary: {
				Row: {
					available_credits: number | null;
					credits_purchased_last_30_days: number | null;
					credits_used_last_30_days: number | null;
					lifetime_earned: number | null;
					reserved_credits: number | null;
					total_credits: number | null;
					total_earned: number | null;
					total_spent: number | null;
					user_id: string | null;
				};
				Relationships: [];
			};
			payment_analytics: {
				Row: {
					avg_transaction_amount: number | null;
					payment_date: string | null;
					total_credits_sold: number | null;
					total_revenue: number | null;
					total_transactions: number | null;
					unique_customers: number | null;
				};
				Relationships: [];
			};
		};
		Functions: {
			calculate_vote_weight: {
				Args: { user_id_param: string };
				Returns: number;
			};
			get_api_key_permissions: {
				Args: { key_id_input: string };
				Returns: {
					action: string;
					category: string;
					permission_description: string;
					permission_name: string;
					resource: string;
				}[];
			};
			get_user_available_credits: {
				Args: { user_uuid: string };
				Returns: number;
			};
			update_api_key_usage: {
				Args: { key_id_input: string };
				Returns: boolean;
			};
			user_has_sufficient_credits: {
				Args: { required_credits: number; user_uuid: string };
				Returns: boolean;
			};
			validate_api_key: {
				Args: { key_hash_input: string };
				Returns: {
					expires_at: string;
					is_valid: boolean;
					key_id: string;
					scopes: string[];
					user_email: string;
					user_id: string;
				}[];
			};
		};
		Enums: {
			account_type: "checking" | "savings";
			affiliate_status:
				| "pending"
				| "approved"
				| "active"
				| "suspended"
				| "rejected";
			cart_status: "open" | "completed" | "abandoned";
			commission_tier: "standard" | "bronze" | "silver" | "gold" | "platinum";
			credit_adjustment_reason:
				| "purchase"
				| "beta_allocation"
				| "pilot_allocation"
				| "admin_grant"
				| "referral_bonus"
				| "usage"
				| "refund"
				| "correction";
			credit_transaction_type:
				| "PURCHASE"
				| "SUBSCRIPTION"
				| "BONUS"
				| "REFUND"
				| "USAGE"
				| "EXPIRY";
			credit_type:
				| "prospecting"
				| "enrichment"
				| "api_calls"
				| "premium_features"
				| "admin";
			deals_closed: "0_5" | "6_10" | "11_20" | "21_50" | "51_plus";
			employee_count: "1" | "2_5" | "6_10" | "11_25" | "26_50" | "51_plus";
			feature_status:
				| "planned"
				| "under_review"
				| "in_development"
				| "testing"
				| "released"
				| "cancelled";
			icp_type:
				| "growth_focused_wholesaler"
				| "systematizing_flipper_investor"
				| "savvy_cre_dealmaker"
				| "scaling_real_estate_agent";
			network_size:
				| "under_1000"
				| "1001_10000"
				| "10001_50000"
				| "50001_100000"
				| "over_100000";
			oauth_provider: "LINKEDIN" | "FACEBOOK" | "GOOGLE" | "GITHUB" | "TWITTER";
			pain_point:
				| "inconsistent_deal_flow"
				| "too_much_time_prospecting"
				| "leads_go_cold"
				| "low_conversion_rate"
				| "difficulty_scaling"
				| "high_lead_generation_costs"
				| "missing_off_market_deals";
			payment_method: "bank_transfer" | "paypal" | "stripe" | "check";
			payment_status:
				| "PENDING"
				| "SUCCEEDED"
				| "FAILED"
				| "CANCELED"
				| "REFUNDED";
			payout_schedule: "weekly" | "biweekly" | "monthly" | "quarterly";
			profile_setup_status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
			real_estate_experience: "yes" | "no" | "learning";
			session_status: "ACTIVE" | "EXPIRED" | "REVOKED" | "LOGGED_OUT";
			subscription_status:
				| "INCOMPLETE"
				| "INCOMPLETE_EXPIRED"
				| "TRIALING"
				| "ACTIVE"
				| "PAST_DUE"
				| "CANCELED"
				| "UNPAID"
				| "PAUSED";
			subscription_tier: "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
			tester_status:
				| "applied"
				| "approved"
				| "active"
				| "paused"
				| "completed"
				| "rejected";
			tester_type: "beta" | "pilot";
			token_status: "ACTIVE" | "REFRESH_REQUIRED" | "EXPIRED" | "REVOKED";
			transaction_status: "pending" | "completed" | "failed" | "cancelled";
			vote_source: "beta_program" | "pilot_program" | "public" | "admin";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
	keyof Database,
	"public"
>];

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
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
				DefaultSchema["Views"])
		? (DefaultSchema["Tables"] &
				DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
		Enums: {
			account_type: ["checking", "savings"],
			affiliate_status: [
				"pending",
				"approved",
				"active",
				"suspended",
				"rejected",
			],
			cart_status: ["open", "completed", "abandoned"],
			commission_tier: ["standard", "bronze", "silver", "gold", "platinum"],
			credit_adjustment_reason: [
				"purchase",
				"beta_allocation",
				"pilot_allocation",
				"admin_grant",
				"referral_bonus",
				"usage",
				"refund",
				"correction",
			],
			credit_transaction_type: [
				"PURCHASE",
				"SUBSCRIPTION",
				"BONUS",
				"REFUND",
				"USAGE",
				"EXPIRY",
			],
			credit_type: [
				"prospecting",
				"enrichment",
				"api_calls",
				"premium_features",
				"admin",
			],
			deals_closed: ["0_5", "6_10", "11_20", "21_50", "51_plus"],
			employee_count: ["1", "2_5", "6_10", "11_25", "26_50", "51_plus"],
			feature_status: [
				"planned",
				"under_review",
				"in_development",
				"testing",
				"released",
				"cancelled",
			],
			icp_type: [
				"growth_focused_wholesaler",
				"systematizing_flipper_investor",
				"savvy_cre_dealmaker",
				"scaling_real_estate_agent",
			],
			network_size: [
				"under_1000",
				"1001_10000",
				"10001_50000",
				"50001_100000",
				"over_100000",
			],
			oauth_provider: ["LINKEDIN", "FACEBOOK", "GOOGLE", "GITHUB", "TWITTER"],
			pain_point: [
				"inconsistent_deal_flow",
				"too_much_time_prospecting",
				"leads_go_cold",
				"low_conversion_rate",
				"difficulty_scaling",
				"high_lead_generation_costs",
				"missing_off_market_deals",
			],
			payment_method: ["bank_transfer", "paypal", "stripe", "check"],
			payment_status: [
				"PENDING",
				"SUCCEEDED",
				"FAILED",
				"CANCELED",
				"REFUNDED",
			],
			payout_schedule: ["weekly", "biweekly", "monthly", "quarterly"],
			profile_setup_status: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"],
			real_estate_experience: ["yes", "no", "learning"],
			session_status: ["ACTIVE", "EXPIRED", "REVOKED", "LOGGED_OUT"],
			subscription_status: [
				"INCOMPLETE",
				"INCOMPLETE_EXPIRED",
				"TRIALING",
				"ACTIVE",
				"PAST_DUE",
				"CANCELED",
				"UNPAID",
				"PAUSED",
			],
			subscription_tier: ["STARTER", "PROFESSIONAL", "ENTERPRISE"],
			tester_status: [
				"applied",
				"approved",
				"active",
				"paused",
				"completed",
				"rejected",
			],
			tester_type: ["beta", "pilot"],
			token_status: ["ACTIVE", "REFRESH_REQUIRED", "EXPIRED", "REVOKED"],
			transaction_status: ["pending", "completed", "failed", "cancelled"],
			vote_source: ["beta_program", "pilot_program", "public", "admin"],
		},
	},
} as const;
