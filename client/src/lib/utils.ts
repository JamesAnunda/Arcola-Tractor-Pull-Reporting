import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateStatus(stockQuantity: number, reorderLevel: number): 'In Stock' | 'Low Stock' | 'Out of Stock' {
  if (stockQuantity <= 0) {
    return 'Out of Stock';
  } else if (stockQuantity <= reorderLevel) {
    return 'Low Stock';
  } else {
    return 'In Stock';
  }
}
