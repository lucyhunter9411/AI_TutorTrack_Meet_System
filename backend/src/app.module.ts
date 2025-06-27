import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MeetingsModule } from './meetings/meetings.module';
import * as dotenv from 'dotenv';
dotenv.config();

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) throw new Error('MONGODB_URI is not set');

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri),
    AuthModule,
    UsersModule,
    MeetingsModule,
  ],
})
export class AppModule {}