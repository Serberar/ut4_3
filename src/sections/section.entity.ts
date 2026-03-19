import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Work } from '../works/work.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Section {
  @ApiProperty({example: '1', description: 'ID de la sección'})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({example: 'Modelo Opel Astra', description: 'Texto descriptivo del elemento'})
  @Column({ default: '' })
  description: string;

  @ApiProperty({example: 'seats', description: 'Nombre de la sección'})
  @Column({ unique: true })
  name: string;

  @ApiProperty({example: 'car', description: 'Tipo de vehículo al que está asociada la sección'})
  @Column({ type: 'enum', enum: ['all-terrain', 'car', 'motorbike', 'tow-vehicle'] })
  vehicle: string;

  @ApiProperty({description: 'Tipo de vehículo al que está asociada la sección'})
  @OneToMany(() => Work, work => work.section)
  works: Work[];

}
