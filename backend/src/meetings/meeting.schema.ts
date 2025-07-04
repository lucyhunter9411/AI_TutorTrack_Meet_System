import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MeetingDocument = Meeting & Document;

@Schema({ timestamps: true })
export class Meeting {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  scheduledTime: Date;

  @Prop({ required: true, min: 15, max: 120 }) // 15 minutes to 2 hours
  duration: number; // Duration in minutes

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  tutorId: Types.ObjectId;

  @Prop({ default: 'scheduled' })
  status: string; // scheduled, ongoing, completed, cancelled

  @Prop({ type: Types.ObjectId, ref: 'User' })
  studentId?: Types.ObjectId;

  @Prop()
  meetingUrl?: string;
}

export const MeetingSchema = SchemaFactory.createForClass(Meeting); 