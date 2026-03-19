import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { clientProviders } from './clients.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [ClientController],
    providers: [...clientProviders, ClientService],
  })
export class ClientsModule {}
