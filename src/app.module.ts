import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GovsyncModule } from './govsync/govsync.module';

@Module({
  imports: [GovsyncModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
