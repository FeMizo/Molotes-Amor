export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  maxQuantity?: number;
}

export interface SavedForLaterItem extends CartItem {
  savedAt: string;
}
