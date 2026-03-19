import { DataSource } from 'typeorm';
import { Work } from './work.entity';

export const workProviders = [
    {
        provide: 'WORK_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Work),
        inject: ['DATA_SOURCE']
    }
];
