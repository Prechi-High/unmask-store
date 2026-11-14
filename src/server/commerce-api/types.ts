/** Future public OnMask integration boundary (V1 stub — no routes mounted yet). */
export type PublicStore = {
  storeId: string;
  name: string;
  slug: string;
  publicUrl: string;
};

export type PublicProduct = {
  productId: string;
  storeId: string;
  title: string;
  price: number;
  currency: string;
  imageUrl?: string;
  available: boolean;
};
