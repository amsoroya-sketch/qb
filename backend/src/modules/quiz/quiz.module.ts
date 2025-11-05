import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { ExercisesModule } from '../exercises/exercises.module';

@Module({
  imports: [PrismaModule, ExercisesModule],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}
