import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { ExercisesModule } from '../exercises/exercises.module';
import { CacheModule } from '../../common/cache/cache.module';

@Module({
  imports: [PrismaModule, ExercisesModule, CacheModule],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}
