import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { SharedContextService } from '../shared-context.service';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
@EventSubscriber()
export class CommonEntitySubscriber implements EntitySubscriberInterface<User> {
  constructor(
    @Inject(SharedContextService)
    private readonly sharedContextService: SharedContextService,
  ) {}

  listenTo(): typeof User {
    return User;
  }

  async afterInsert(event: InsertEvent<User>): Promise<void> {
    if (event.entity) {
      await this.updateCreatedBy(event.entity);
    }
  }

  async afterUpdate(event: UpdateEvent<User>): Promise<void> {
    if (event.entity) {
      await this.updateUpdatedBy(event.entity as User);
    }
  }

  private async updateCreatedBy(entity: User): Promise<void> {
    const currentUser = this.sharedContextService.get('currentUser');

    if (currentUser) {
      entity.createdBy = currentUser.id;
    }
  }

  private async updateUpdatedBy(entity: User): Promise<void> {
    const currentUser = this.sharedContextService.get('currentUser');

    if (currentUser) {
      entity.lastUpdatedBy = currentUser.id;
    }
  }
}
