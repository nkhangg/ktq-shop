import KtqQueueConstant from '@/constants/ktq-queue.constant';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class KtqQueuesService {
    constructor(@InjectQueue(KtqQueueConstant.QUEUE_NAME) private readonly ktqEmailQueue: Queue) {}

    async addEmailJob(data: { reset_link: string; to: string; name: string }) {
        return await this.ktqEmailQueue.add(KtqQueueConstant.QUEUE_FORGOT_PASSWORD, data);
    }
}
