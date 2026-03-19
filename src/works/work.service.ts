import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Work } from './work.entity';
import { Section } from '../sections/section.entity';

@Injectable()
export class WorkService {
  constructor(
    @Inject('WORK_REPOSITORY')
    private readonly workRepository: Repository<Work>,
    @Inject('SECTION_REPOSITORY') 
    private readonly sectionRepository: Repository<Section>
  ) {}

  async findAllWorks(): Promise<Work[]> {
    return this.workRepository.find({
      relations: ['section','budget']
    });
  }

  async findWorkById(id: number): Promise<Work> {
    const work = await this.workRepository.findOne({ 
      where: { id },
      relations: ['section','budget'] 
  });
    if (!work) {
        throw new NotFoundException('Work not found');
    }
    return work;
}

  async findWorksByVehicle(name: string): Promise<Work[]> {
    return this.workRepository
      .createQueryBuilder('work')
      .innerJoin('work.section', 'section')
      .where('section.vehicle = :name', { name })
      .getMany();
  }

  async createWork(workData: Partial<Work>): Promise<Work> {
    const sectionId = workData.section?.id;
    if (sectionId) {
        const section = await this.sectionRepository.findOne({ where: { id: sectionId } });
        if (!section) {
            throw new NotFoundException('Section not found');
        }

        const newWork = this.workRepository.create({
            ...workData,
            section: section
        });

        return this.workRepository.save(newWork);
    } else {
        throw new NotFoundException('Section ID not provided');
    }
}

async updateWork(id: number, updatedData: Partial<Work>): Promise<Work> {
  const existingWork = await this.findWorkById(id); 
  const updatedWork = Object.assign(existingWork, updatedData);
  return this.workRepository.save(updatedWork);
}


async removeWork(id: number): Promise<void> {
  const work = await this.findWorkById(id); 
  if (!work) {
    throw new NotFoundException('Work not found');
  }
  
  work.deletedAt = new Date();
  await this.workRepository.save(work);
}



async restoreWork(id: number): Promise<void> {
  const restoredWork = await this.workRepository.restore(id);
  if (!restoredWork) {
    throw new NotFoundException('Work not found');
  }
}

}
