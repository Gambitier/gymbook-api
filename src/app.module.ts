import { AuthModule } from '@modules/auth/auth.module';
import { JwtGuard, RolesGuard } from '@modules/auth/common';
import { CommunicationModule } from '@modules/communication/communication.module';
import { DatabaseErrorHandlerModule } from '@modules/database-error-handler/database.error.handler.module';
import { GymModule } from '@modules/gym/gym.module';
import { UserModule } from '@modules/user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { logggerModuleConfig, mailerModuleConfigs } from 'src/configs';
import { AllExceptionsFilter } from 'src/filters/all-exceptions.filter';
import { APIResponseInterceptor } from 'src/interceptors/api.response.interceptor';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [
    LoggerModule.forRootAsync(logggerModuleConfig),
    // TwilioModule.forRootAsync(twilioModuleConfig),
    MailerModule.forRootAsync(mailerModuleConfigs),
    UserModule,
    AuthModule,
    DatabaseErrorHandlerModule,
    CommunicationModule,
    GymModule,
  ],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: APIResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {
  onModuleInit(): void {
    console.log('Initializing server modules 📡 ');
  }

  onApplicationBootstrap(): void {
    console.log('Initialized server, waiting for requests 🚀');
  }
}
