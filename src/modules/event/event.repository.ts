import { Event } from './domain/event';

export abstract class EventRepository {
  abstract getById(id: string): Promise<Event | null>;
  abstract save(event: Event): Promise<void>;
}
