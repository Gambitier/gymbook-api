import { AuthModule } from '@modules/auth/auth.module';
import { PlanController } from '@modules/gym/plan/plan.controller';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({}), AuthModule],
  controllers: [PlanController],
  providers: [],
})
export class GymModule {}
