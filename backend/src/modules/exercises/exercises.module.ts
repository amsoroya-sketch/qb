import { Module } from '@nestjs/common';
import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';
import { ExerciseGeneratorService } from './exercise-generator.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ExercisesController],
  providers: [ExercisesService, ExerciseGeneratorService],
  exports: [ExercisesService, ExerciseGeneratorService],
})
export class ExercisesModule {}
