import { AuthModule } from '@modules/auth/auth.module';
import { DatabaseErrorHandlerModule } from '@modules/database-error-handler/database.error.handler.module';
import { BatchController } from '@modules/gym/batch/batch.controller';
import { PlanController } from '@modules/gym/plan/plan.controller';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [JwtModule.register({}), AuthModule, DatabaseErrorHandlerModule],
  controllers: [PlanController, BatchController],
  providers: [PrismaService],
})
export class GymModule {}
