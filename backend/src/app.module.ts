import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CprModule } from './cpr/cpr.module';
import { CreditorModule } from './creditor/creditor.module';
import { EmitterModule } from './emitter/emitter.module';
import { DeliveryPlaceModule } from './delivery-place/delivery-place.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CprModule,
    CreditorModule,
    EmitterModule,
    DeliveryPlaceModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
