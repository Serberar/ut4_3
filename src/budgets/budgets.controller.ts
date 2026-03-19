import { Controller, Get, Post, Patch, Delete, Param, Body, Req, NotFoundException } from '@nestjs/common';
import { Budget } from './budget.entity';
import { BudgetService } from './budget.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('budgets')
@ApiTags('Budgets')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Get()
  @ApiOperation({ summary: 'Obtiene un presupuesto por su ID' })
  @ApiResponse({ status: 200, description: 'Presupuesto encontrado', type: Budget })
  async findAll(): Promise<Budget[]> {
    return this.budgetService.findAllBudgets();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un presupuesto por ID' })
  @ApiResponse({status: 200, description: 'Todos los presupuestos encontrados', type: Budget})
  async findOne(@Param('id') id: number): Promise<Budget> {
    const budget = await this.budgetService.findBudgetById(id);
    if (!budget) {
      throw new NotFoundException('Budget not found');
    }
    return budget;
  }

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo presupuesto' })
  @ApiResponse({ status: 201, description: 'Presupuesto creado exitosamente', type: Budget })
  async create(@Body() budget: Budget, @Req() req): Promise<Budget> {
    const userId = req.headers['th-user'];
    return this.budgetService.createBudget(budget, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza un presupuesto existente' })
  @ApiResponse({ status: 200, description: 'Presupuesto actualizado exitosamente', type: Budget })
  async update(@Param('id') id: number, @Body() budget: Budget): Promise<Budget> {
    return this.budgetService.updateBudget(id, budget);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un presupuesto' })
  @ApiResponse({ status: 200, description: 'Presupuesto eliminado exitosamente' })
  async remove(@Param('id') id: number): Promise<void> {
    await this.budgetService.removeBudget(id);
  }

  @Patch('restore/:id')
  @ApiOperation({ summary: 'Restaura un presupuesto eliminado' })
  @ApiResponse({ status: 200, description: 'Presupuesto restaurado exitosamente' })
  async restore(@Param('id') id: number): Promise<void> {
    await this.budgetService.restoreBudget(id);
  }

  @Get('last/:days')
  @ApiOperation({ summary: 'Obtiene los presupuestos de los últimos días' })
  @ApiResponse({ status: 200, description: 'Presupuestos encontrados', type: Budget, isArray: true })
  async findLastBudgets(@Param('days') days: number): Promise<Budget[]> {
    return this.budgetService.findLastBudgets(days);
  }
}
