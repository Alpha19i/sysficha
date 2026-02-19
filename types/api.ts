import type { Ficha } from "@/types/ficha";

export type PaginatedFichas = {
  items: Ficha[];
  page: number;
  limit: number;
  total: number;
};
