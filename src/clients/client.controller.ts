import { Controller, Get, Param } from '@nestjs/common';
import { Client } from './client.entity';
import { ClientService } from './client.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('clients')
@ApiTags('Clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  @ApiOperation({ summary: 'Obtiene todos los clientes' })
  @ApiResponse({status: 200, description: 'Todos los clientes encontrados', type: Client})
  async findAll(): Promise<Client[]> {
    return this.clientService.findAll();
  }

}
