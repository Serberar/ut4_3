import { Module } from '@nestjs/common';
import { sectionProviders } from './section.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [DatabaseModule],
    providers: [...sectionProviders],
})
export class sectionsModule {}
