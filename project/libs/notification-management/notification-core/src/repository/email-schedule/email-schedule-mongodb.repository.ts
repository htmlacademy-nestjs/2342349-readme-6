import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseMongoRepository } from '@project/data-access';
import { Model } from 'mongoose';
import { EmailScheduleEntity } from '../../entity/email-schedule/email-schedule.entity';
import { EmailScheduleFactory } from '../../entity/email-schedule/email-schedule.factory';
import { EmailScheduleModel } from '../../entity/email-schedule/email-schedule.model';
import { EmailScheduleRepository } from './email-schedule.repository.interface';

@Injectable()
export class EmailScheduleMongodbRepository extends BaseMongoRepository<EmailScheduleEntity, EmailScheduleModel> implements EmailScheduleRepository {
  constructor(
    entityFactory: EmailScheduleFactory,
    @InjectModel(EmailScheduleModel.name) emailScheduleModel: Model<EmailScheduleModel>
  ) {
    super(entityFactory, emailScheduleModel);
  }

  public async getLastSubscriptionPostDate(): Promise<Date | null> {
    const scheduleData = await this.model.findOne();

    return scheduleData?.lastPostDate;
  }

  public async updateLastSubscriptionPostDate(postDate: Date): Promise<boolean> {
    const result = await this.model.updateOne(
      {},
      {
        $set: { lastPostDate: postDate }
      }
    );

    return result !== null;
  }
}
