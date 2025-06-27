import { Controller, Get, Post, Body, Req, UseGuards, Param, Delete } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MeetingsService } from './meetings.service';

interface JwtUser {
  userId: string;
  email: string;
}

@Controller('meetings')
export class MeetingsController {
  constructor(private meetingsService: MeetingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createMeeting(@Body() body: { title: string; description: string; scheduledTime: string }, @Req() req: Request) {
    const jwtUser = req.user as JwtUser;
    
    // Check if user is a tutor
    if (!jwtUser || !jwtUser.userId) {
      throw new Error('Invalid token');
    }

    const meetingData = {
      title: body.title,
      description: body.description,
      scheduledTime: new Date(body.scheduledTime),
      tutorId: jwtUser.userId,
    };

    return this.meetingsService.create(meetingData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-meetings')
  async getMyMeetings(@Req() req: Request) {
    const jwtUser = req.user as JwtUser;
    
    if (!jwtUser || !jwtUser.userId) {
      throw new Error('Invalid token');
    }

    return this.meetingsService.findByTutorId(jwtUser.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllMeetings(@Req() req: Request) {
    const jwtUser = req.user as JwtUser;
    
    if (!jwtUser || !jwtUser.userId) {
      throw new Error('Invalid token');
    }

    return this.meetingsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getMeeting(@Param('id') id: string) {
    return this.meetingsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteMeeting(@Param('id') id: string, @Req() req: Request) {
    const jwtUser = req.user as JwtUser;
    
    if (!jwtUser || !jwtUser.userId) {
      throw new Error('Invalid token');
    }

    // TODO: Add authorization check to ensure only the tutor can delete their own meeting
    return this.meetingsService.delete(id);
  }
} 