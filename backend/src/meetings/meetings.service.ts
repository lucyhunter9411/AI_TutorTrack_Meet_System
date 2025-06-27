import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Meeting, MeetingDocument } from './meeting.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectModel(Meeting.name) private meetingModel: Model<MeetingDocument>,
  ) {}

  async create(meetingData: {
    title: string;
    description: string;
    scheduledTime: Date;
    tutorId: string;
  }): Promise<MeetingDocument> {
    const meeting = new this.meetingModel({
      ...meetingData,
      tutorId: new Types.ObjectId(meetingData.tutorId),
    });
    return meeting.save();
  }

  async findByTutorId(tutorId: string): Promise<MeetingDocument[]> {
    return this.meetingModel
      .find({ tutorId: new Types.ObjectId(tutorId) })
      .populate('tutorId', 'email role')
      .populate('studentId', 'email role')
      .sort({ scheduledTime: 1 });
  }

  async findAll(): Promise<MeetingDocument[]> {
    return this.meetingModel
      .find()
      .populate('tutorId', 'email role')
      .populate('studentId', 'email role')
      .sort({ scheduledTime: 1 });
  }

  async findById(id: string): Promise<MeetingDocument | null> {
    return this.meetingModel
      .findById(id)
      .populate('tutorId', 'email role')
      .populate('studentId', 'email role');
  }

  async update(id: string, updateData: Partial<Meeting>): Promise<MeetingDocument | null> {
    return this.meetingModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('tutorId', 'email role')
      .populate('studentId', 'email role');
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.meetingModel.findByIdAndDelete(id);
    return !!result;
  }
} 