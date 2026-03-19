import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { BudgetController } from './budgets.controller';
import { BudgetService } from './budget.service';
import { budgetsProviders } from './budgets.providers';
import { clientProviders } from '../clients/clients.providers';
import { workProviders } from '../works/work.providers';

@Module({
    imports: [DatabaseModule],
    controllers: [BudgetController],
    providers: [...workProviders, ...budgetsProviders, ...clientProviders, BudgetService],
  })
  export class BudgetsModule {}
