import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSupabaseImageUrl = (filename: string) => {
  if (!filename) return '';
  if (filename.startsWith('http')) return filename;
  return `https://yepjhvjjssjjrwbgltyo.supabase.co/storage/v1/object/public/products/${filename}`;
};

