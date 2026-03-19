import { DataSource } from 'typeorm';
import { Budget } from './budget.entity';

export const budgetsProviders = [
    {
        provide: 'BUDGET_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Budget),
        inject: ['DATA_SOURCE']
    }
];
