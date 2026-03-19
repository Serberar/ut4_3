import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Client } from '../clients/client.entity';
import { Work } from '../works/work.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Budget {
  @ApiProperty({example: '1', description: 'ID del presupuesto', default: 0 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({example: '12', description: 'Importe del boletín eléctrico a 12V', default: 0 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  bulletinE12V: number;

  @ApiProperty({example: '230', description: 'Importe del boletín eléctrico a 230V', default: 0 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  bulletinE230V: number;

  @ApiProperty({example: '150.00', description: 'Importe boletín de gas', default: 0 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  bulletinG: number;

  @ApiProperty({example: '100.00', description: 'Importe del certificado de taller', default: 0 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  certificate: number;

  @ApiProperty({example: 'Modelo Opel Astra', description: 'Texto descriptivo del elemento'})
  @Column({ default: '' })
  description: string;

  @ApiProperty({example: '15', description: 'Id del usuario que realiza el presupuesto'})
  @Column()
  user: number;

  @ApiProperty({example: 'car', description: 'Tipo de vehículo al que está asociada la sección'})
  @Column({ enum: ['all-terrain', 'car', 'motorbike', 'tow-vehicle'] })
  vehicle: string;

  @ApiProperty({example: '2024-01-06 17:37:32', description: 'Fecha de creación del presupuesto'})
  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: true })
  createdAt: Date;

  @ApiProperty({example: '2024-03-06 18:38:56', description: 'Fecha de eliminación del presupuesto'})
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;

  @ApiProperty({example: [
    {
      "id": 1,
      "description": "",
      "name": "1 pieza",
      "price1": "250",
      "price2": "45",
      "price3": "35",
      "price4": "25",
      "priceGapMod": "0",
      "deletedAt": null
    }
  ], description: 'Trabajo asociado a un presupuesto'})
  @OneToMany(() => Work, work => work.budget)
  works: Work[];

  @ApiProperty({
    example: {
      "id": 2,
      "description": "Cliente preferente",
      "email": "cliente@domain.com",
      "firstName": "Juan",
      "lastName": "García",
      "phone": "666666666",
      "type": "particular"
    },
    description: 'Cliente que solicita el presupuesto'
  })
  @ManyToOne(() => Client, client => client.budgets, { eager: true, cascade: true })
  client: Client;
}