import { PaginatedResponse } from '../schema/paginated-response-schema';
import { NotificationListResponse } from '../api/notification';
import axios from 'axios';

export class NotificationService {
  private static readonly BASE_URL = '/api/notifications/user';

  static async getNotifications(
    page = 0,
    size = 10,
    type?: number,
    unread?: boolean
  ): Promise<PaginatedResponse<NotificationListResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy: 'created',
      sortDir: 'desc',
    });

    if (type !== undefined) params.append('type', type.toString());
    if (unread !== undefined) params.append('unread', unread.toString());

    const response = await axios.get(`${this.BASE_URL}?${params}`);
    return response.data.data;
  }

  static async getUnreadCount(): Promise<number> {
    const response = await axios.get(`${this.BASE_URL}/unread`);
    return response.data.data;
  }

  static async markAllAsRead(): Promise<void> {
    await axios.put(`${this.BASE_URL}/readAll`);
  }

  static async markAsRead(notificationId: number): Promise<void> {
    await axios.put(`${this.BASE_URL}/${notificationId}/read`);
  }
}
