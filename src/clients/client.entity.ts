import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Budget } from '../budgets/budget.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Client {
  @ApiProperty({example: '1', description: 'ID del cliente'})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({example: 'Cliente Preferente', description: 'Texto descriptivo del cliente'})
  @Column({ default: '' })
  description: string;

  @ApiProperty({example: 'cliente@domain.com', description: 'Correo electrónico del cliente'})
  @Column({ unique: true, nullable: true })
  email: string; 

  @ApiProperty({example: 'Juan', description: 'Nombre del cliente'})
  @Column({ default: '' })
  firstName: string;

  @ApiProperty({example: 'García', description: 'Apellido del cliente'})
  @Column()
  lastName: string;

  @ApiProperty({example: '666666666', description: 'Teléfono del cliente'})
  @Column()
  phone: string;

  @ApiProperty({example: 'Particular', description: 'Tipo de cliente'})
  @Column({ enum: ['particular', 'empresa'] })
  type: string;


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
    description: 'Presupuestos asignados a un cliente'
  })
  @OneToMany(() => Budget, budget => budget.client)
  budgets: Budget[];


  get name(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}