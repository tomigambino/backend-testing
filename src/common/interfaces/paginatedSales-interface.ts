import { SaleEntity } from "../entities/sale";

export interface PaginatedSales {
  data: SaleEntity[];
  total: number;
  page: number;
  limit: number;
}