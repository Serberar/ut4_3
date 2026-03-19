import { Module } from '@nestjs/common';
import { WorkController } from './work.controller';
import { WorkService } from './work.service';
import { workProviders } from './work.providers';
import { DatabaseModule } from '../database/database.module';
import { sectionProviders } from '../sections/section.providers';

@Module({
    imports: [DatabaseModule],
    controllers: [WorkController],
    providers: [...sectionProviders, ...workProviders, WorkService],
})
export class WorksModule {}
