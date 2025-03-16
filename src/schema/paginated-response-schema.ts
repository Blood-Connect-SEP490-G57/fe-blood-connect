/**
 * File: paginated-response-schema.ts
 * Mục đích: Định nghĩa kiểu dữ liệu cho response phân trang.
 * Bao gồm: danh sách dữ liệu, thông tin phân trang (currentPage, pageSize, totalItems, totalPages)
 * và một đối tượng countsByType (nếu có) chứa số lượng theo từng loại.
 */

/**
 * Interface PaginatedResponse dùng để định nghĩa kiểu dữ liệu cho response phân trang.
 * @template T - Kiểu dữ liệu của các phần tử trong danh sách data.
 */
export interface PaginatedResponse<T> {
  data: T[] // Danh sách dữ liệu của trang hiện tại
  currentPage: number // Số trang hiện tại (thường là 0-index hoặc 1-index tùy theo cấu hình)
  pageSize: number // Số lượng item trên mỗi trang
  totalItems: number // Tổng số item trên toàn bộ dữ liệu
  totalPages: number // Tổng số trang
  /**
   * countsByType là một đối tượng tùy chọn dùng để chứa số lượng theo từng loại.
   * Ví dụ: { info: 5, warning: 3, urgent: 2 }
   */
  countsByType?: {
    info: number
    warning: number
    urgent: number
  }
}

/* Nếu bạn sử dụng thư viện zod để validate response, có thể định nghĩa schema như sau: */
import { z } from 'zod'

export const PaginatedResponseSchema = <T>(itemSchema: z.ZodType<T>) =>
  z.object({
    data: z.array(itemSchema),
    currentPage: z.number(),
    pageSize: z.number(),
    totalItems: z.number(),
    totalPages: z.number(),
    countsByType: z.optional(
      z.object({
        info: z.number(),
        warning: z.number(),
        urgent: z.number()
      })
    )
  })
