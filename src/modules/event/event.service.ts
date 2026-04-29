import { Injectable } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { Event } from './domain/event';
import { ExtensionService } from '../extension/extension.service';

@Injectable()
export class EventService {
  constructor(
    private readonly repo: EventRepository,
    private readonly extensions: ExtensionService,
  ) {}

  async getById(id: string): Promise<Event> {
    const event = await this.repo.getById(id);

    if (!event) {
      throw new Error(`Event ${id} not found`);
    }

    return event;
  }

  async create(event: Event): Promise<void> {
    if (!event.id) {
      throw new Error('Event.id is required');
    }

    await this.repo.save(event);
  }
}
