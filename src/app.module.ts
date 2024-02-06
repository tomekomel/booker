import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BookingModule } from './booking/booking.module';
import { DatabaseModule } from './database/database.module';
import { dbConfig } from './database/database.config';
import { AuthorisationMiddleware } from './authorisation/authorisation.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule.initialise(dbConfig),
    BookingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthorisationMiddleware).forRoutes('bookings');
  }
}
