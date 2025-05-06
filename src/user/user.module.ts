import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserConsumer } from './consumers/user.consumer';
import { GovsyncModule } from 'src/govsync/govsync.module';

@Module({
  imports: [GovsyncModule],
  providers: [UserConsumer, UserService],
})
export class UserModule {}
