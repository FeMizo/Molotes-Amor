export interface CartItem {
  id: string;
  name: string;
  kind?: "product" | "combo";
  price: number;
  image: string;
  quantity: number;
  maxQuantity?: number;
}

export interface SavedForLaterItem extends CartItem {
  savedAt: string;
}
