import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GovsyncService {
  private readonly API_BASE_URL = process.env.API_BASE_URL;

  constructor(private readonly httpService: HttpService) {}

  async handleVerifyUser(
    userId: string,
  ): Promise<{ data: any; message: any; statusCode: any }> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.API_BASE_URL}/validateCitizen/${userId}`),
      );

      return {
        data: response.data,
        message: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      return {
        data: null,
        message: error.message,
        statusCode: error.response?.status || 500,
      };
    }
  }
}
