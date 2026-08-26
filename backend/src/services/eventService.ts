import { randomUUID } from 'crypto';
import { eventRepository, EventRepository } from '../repositories/eventRepository.js';
import { CreateEventInput, UpdateEventInput, EventQueryInput } from '../validators/eventValidators.js';
import { EventResponse, EventRecord } from '../types/event.js';
import { AppError } from '../middleware/errorHandler.js';

export class EventService {
  constructor(private eventRepo: EventRepository) {}

  private mapEventToResponse(record: EventRecord): EventResponse {
    return {
      id: record.id,
      userId: record.user_id,
      title: record.title,
      description: record.description,
      startAt: new Date(record.start_at).toISOString(),
      endAt: new Date(record.end_at).toISOString(),
      location: record.location,
      createdAt: new Date(record.created_at).toISOString(),
      updatedAt: new Date(record.updated_at).toISOString(),
    };
  }

  async getEvents(userId: string, query: EventQueryInput): Promise<EventResponse[]> {
    const records = await this.eventRepo.findEventsByUser(userId, query);
    return records.map((record) => this.mapEventToResponse(record));
  }

  async getEventById(id: string, userId: string): Promise<EventResponse> {
    const record = await this.eventRepo.findEventByIdAndUser(id, userId);
    if (!record) {
      throw new AppError('Không tìm thấy sự kiện hoặc bạn không có quyền truy cập', 404, 'EVENT_NOT_FOUND');
    }
    return this.mapEventToResponse(record);
  }

  async createEvent(userId: string, input: CreateEventInput): Promise<EventResponse> {
    const startAt = new Date(input.startAt);
    const endAt = new Date(input.endAt);

    if (startAt >= endAt) {
      throw new AppError('Thời gian bắt đầu phải trước thời gian kết thúc', 400, 'INVALID_DATE_RANGE');
    }

    const eventId = randomUUID();

    await this.eventRepo.createEvent({
      id: eventId,
      userId,
      title: input.title,
      description: input.description,
      startAt,
      endAt,
      location: input.location,
    });

    return this.getEventById(eventId, userId);
  }

  async updateEvent(id: string, userId: string, input: UpdateEventInput): Promise<EventResponse> {
    const existing = await this.eventRepo.findEventByIdAndUser(id, userId);
    if (!existing) {
      throw new AppError('Không tìm thấy sự kiện hoặc bạn không có quyền truy cập', 404, 'EVENT_NOT_FOUND');
    }

    const targetStart = input.startAt ? new Date(input.startAt) : new Date(existing.start_at);
    const targetEnd = input.endAt ? new Date(input.endAt) : new Date(existing.end_at);

    if (targetStart >= targetEnd) {
      throw new AppError('Thời gian bắt đầu phải trước thời gian kết thúc', 400, 'INVALID_DATE_RANGE');
    }

    const updated = await this.eventRepo.updateEvent(id, userId, {
      title: input.title,
      description: input.description,
      startAt: input.startAt ? targetStart : undefined,
      endAt: input.endAt ? targetEnd : undefined,
      location: input.location,
    });

    if (!updated) {
      throw new AppError('Cập nhật sự kiện thất bại', 400, 'EVENT_UPDATE_FAILED');
    }

    return this.getEventById(id, userId);
  }

  async deleteEvent(id: string, userId: string): Promise<void> {
    const deleted = await this.eventRepo.deleteEvent(id, userId);
    if (!deleted) {
      throw new AppError('Không tìm thấy sự kiện hoặc bạn không có quyền truy cập', 404, 'EVENT_NOT_FOUND');
    }
  }
}

export const eventService = new EventService(eventRepository);