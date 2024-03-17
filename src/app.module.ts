import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommonEntitySubscriber } from './shared/subscribers/user.subscriber';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'user_management_db',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      subscribers: [CommonEntitySubscriber],
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
