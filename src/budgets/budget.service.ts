import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Budget } from './budget.entity';
import { Client } from '../clients/client.entity';
import { Work } from '../works/work.entity';

@Injectable()
export class BudgetService {
  constructor(
    @Inject('BUDGET_REPOSITORY')
    private budgetRepository: Repository<Budget>,
    @Inject('CLIENT_REPOSITORY')
    private clientRepository: Repository<Client>,
    @Inject('WORK_REPOSITORY')
    private workRepository: Repository<Work>,
  ) { }

  async findAllBudgets(): Promise<Budget[]> {
    return this.budgetRepository.find({
      relations: ['works']
    });
  }

  async findBudgetById(id: number): Promise<Budget> {
    const budget = await this.budgetRepository.findOne({
      where: { id },
      relations: ['works']
    });
    if (!budget) {
      throw new NotFoundException('Budget not found');
    }
    return budget;
  }

  async findLastBudgets(days: number): Promise<Budget[]> {
    const lastDate = new Date();
    lastDate.setDate(lastDate.getDate() - days);
    return this.budgetRepository
      .createQueryBuilder('budget')
      .where('budget.createdAt >= :lastDate', { lastDate })
      .getMany();
  }

  async createBudget(budgetData: any, userId: number): Promise<Budget> {
    let client: Client | undefined;
    if (budgetData.client.email) {
      client = await this.clientRepository.findOne({ where: { email: budgetData.client.email } });
    } else if (budgetData.client.phone) {
      client = await this.clientRepository.findOne({ where: { phone: budgetData.client.phone } });
    }

    const works = [];
    for (const workData of budgetData.works) {

      const workId = workData.id;
      const work = await this.workRepository.findOne({ where: { id: workId } });

      if (!work) {
        throw new NotFoundException('Work not found');
      }

      works.push(work);
    }

    const newBudget = this.budgetRepository.create({
      bulletinE12V: budgetData.bulletinE12V,
      bulletinE230V: budgetData.bulletinE230V,
      bulletinG: budgetData.bulletinG,
      certificate: budgetData.certificate,
      client: client,
      description: budgetData.description,
      user: userId,
      vehicle: budgetData.vehicle,
      works: works,
      createdAt: new Date()
    });

    return this.budgetRepository.save(newBudget);
  }

  async updateBudget(id: number, updatedData: Partial<Budget>): Promise<Budget> {
    const existingBudget = await this.findBudgetById(id);
    const updatedBudget = Object.assign(existingBudget, updatedData);
    return this.budgetRepository.save(updatedBudget);
  }



  async removeBudget(id: number): Promise<void> {
    await this.findBudgetById(id);
    await this.budgetRepository.softDelete(id);
  }



  async restoreBudget(id: number): Promise<void> {
    const result = await this.budgetRepository.restore(id);
    if (!result.affected) {
      throw new NotFoundException('Budget not found');
    }
  }

}
