import { Module } from '@nestjs/common';
import { PracticeController } from './practice.controller';
import { PracticeService } from './practice.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { ExercisesModule } from '../exercises/exercises.module';

@Module({
  imports: [PrismaModule, ExercisesModule],
  controllers: [PracticeController],
  providers: [PracticeService],
  exports: [PracticeService],
})
export class PracticeModule {}
