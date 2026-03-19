import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

import { Section } from '../sections/section.entity';
import { Budget } from '../budgets/budget.entity'; 
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Work {
  @ApiProperty({example: '1', description: 'ID del trabajo'})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({example: 'Asientos delanteros', description: 'Texto descriptivo del elemento'})
  @Column({ default: '' })
  description: string;

  @ApiProperty({example: 'Asientos', description: 'Nombre visualizado en frontal'})
  @Column({ unique: true })
  name: string;

  @ApiProperty({example: '100.00', description: 'Precio 1'})
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price1: number;

  @ApiProperty({example: '150.00', description: 'Precio 2'})
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price2: number;

  @ApiProperty({example: '200.00', description: 'Precio 3'})
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price3: number;

  @ApiProperty({example: '250.00', description: 'Precio 4'})
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price4: number;

  @ApiProperty({description: 'Modificación sobre el precio final del presupuesto'})
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  priceGapMod: number;

  @ApiProperty({example: {
    "id": 1,
    "description": "reparacion de asientos",
    "name": "car-body",
    "vehicle": "car"
  },description: 'Sección'})
  @ManyToOne(() => Section, section => section.works, { nullable: true })
  section: Section;

  @ApiProperty({
    example: {
      "id": 74,
      "bulletinE12V": 12,
      "bulletinE230V": 230,
      "bulletinG": 150,
      "certificate": 100,
      "description": "Modelo Opel Astra",
      "user": 15,
      "vehicle": "car",
      "createdAt": "2024-03-06T17:38:56.000Z",
      "deletedAt": null,
      "client": {
        "id": 2,
        "description": "Cliente preferente",
        "email": "cliente@domain.com",
        "firstName": "Juan",
        "lastName": "García",
        "phone": "666666666",
        "type": "particular"
      }    
    },
    description: 'Presupuesto asignado al trabajo'
  })
  @ManyToOne(() => Budget, budget => budget.works, { nullable: true }) 
  budget: Budget; 

  @ApiProperty({example: '2024-03-06 18:38:56', description: 'Fecha de eliminación del trabajo'})
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;

}
