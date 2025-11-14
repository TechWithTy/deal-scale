/**
 * Contact information for a dropshipping supplier.
 */
export type SupplierContactInfo = {
	/** Supplier contact email address */
	email?: string;
	/** Supplier WhatsApp number (E.164 format) */
	whatsapp?: string;
	/** Supplier phone number (E.164 format) */
	phone?: string;
	/** Supplier website URL */
	website?: string;
	/** Supplier LinkedIn or social profile */
	socialProfileUrl?: string;
	/** Physical address of the supplier */
	address?: string;
	/** Additional contact notes */
	notes?: string;
};

/**
 * Supplier authenticity verification details.
 */
export type SupplierVerification = {
	/** Has the supplier been verified as authentic? */
	isVerified: boolean;
	/** ISO8601 timestamp of the most recent verification */
	verifiedAt?: string;
	/** Name or ID of the verifying entity */
	verifiedBy?: string;
	/** Any supporting documents or links */
	documents?: string[];
	/** Notes regarding verification */
	notes?: string;
};

/**
 * Dropshipping integration details for a product.
 */
export type DropshippingIntegration = {
	/** Supplier website/product URL */
	supplierUrl: string;
	/** Wholesale purchase cost from supplier */
	purchaseCost: number;
	/** Resale price set in the store */
	resalePrice: number;
	/** Calculated profit margin as a percentage (0-100) */
	profitMargin: number;
	/** ISO8601 timestamp of the last successful sync with supplier */
	lastSynced: string;
	/** Current sync status with supplier feed or API */
	syncStatus: "active" | "paused" | "error" | "pending" | "disconnected";
	/** SKU as mapped to supplier's catalog, if available */
	mappedSku?: string;
	/** Supplier name or ID for reference */
	supplierName?: string;
	/** Product availability status at supplier */
	supplierStockStatus?:
		| "in_stock"
		| "out_of_stock"
		| "limited"
		| "discontinued";
	/** Quantity available at supplier, if provided */
	supplierStockQty?: number;
	/** Any error message or last sync note */
	lastSyncMessage?: string;
	/** Indicates if automatic repricing is enabled */
	autoRepricingEnabled?: boolean;
	/** Next scheduled sync time (ISO8601), if applicable */
	nextSyncAt?: string;
	/** Extra metadata for custom integrations */
	metadata?: Record<string, unknown>;

	/** Contact information for the supplier */
	contactInfo?: SupplierContactInfo;
	/** Supplier authenticity verification details */
	verification?: SupplierVerification;
};
