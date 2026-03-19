import { Controller, Get, Post, Patch, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { Work } from './work.entity';
import { WorkService } from './work.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Works')
@Controller('works')
export class WorkController {
  constructor(private readonly workService: WorkService) {}

  @Get()
  @ApiOperation({ summary: 'Obtiene todos los trabajos' })
  @ApiResponse({ status: 200, description: 'Todos los trabajos encontrados', type: Work, isArray: true })
  async findAll(): Promise<Work[]> {
    return this.workService.findAllWorks();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un trabajo por su ID' })
  @ApiResponse({ status: 200, description: 'Trabajo encontrado', type: Work })
  async findOne(@Param('id') id: number): Promise<Work> {
    const work = await this.workService.findWorkById(id);
    if (!work) {
      throw new NotFoundException('Work not found');
    }
    return work;
  }

  @Get('vehicle/:name')
  @ApiOperation({ summary: 'Obtiene trabajos por el nombre del vehículo' })
  @ApiResponse({ status: 200, description: 'Trabajos encontrados', type: Work, isArray: true })
  async findByVehicle(@Param('name') name: string): Promise<Work[]> {
    return this.workService.findWorksByVehicle(name);
  }

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo trabajo' })
  @ApiResponse({ status: 201, description: 'Trabajo creado exitosamente', type: Work })
  async create(@Body() work: Work): Promise<Work> {
    return this.workService.createWork(work);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza un trabajo existente' })
  @ApiResponse({ status: 200, description: 'Trabajo actualizado exitosamente', type: Work })
  async update(@Param('id') id: number, @Body() work: Work): Promise<Work> {
    return this.workService.updateWork(id, work);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un Trabajo' })
  @ApiResponse({ status: 200, description: 'Trabajo eliminado exitosamente' })
  async remove(@Param('id') id: number): Promise<void> {
    await this.workService.removeWork(id);
  }

  @Patch('restore/:id')
  @ApiOperation({ summary: 'Restaura un Trabajo eliminado' })
  @ApiResponse({ status: 200, description: 'Trabajo restaurado exitosamente' })
  async restore(@Param('id') id: number): Promise<void> {
    await this.workService.restoreWork(id);
  }
}
