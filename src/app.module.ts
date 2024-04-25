import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [AuthModule, DatabaseModule, UserModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env'
  })],
})
export class AppModule {}
