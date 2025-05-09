import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class GovsyncService {
  private readonly API_GOVCARPETA_BASE_URL =
    process.env.API_GOVCARPETA_BASE_URL;

  constructor(private readonly httpService: HttpService) {}

  async handleVerifyUser(
    userId: string,
  ): Promise<{ data: any; message: any; statusCode: any }> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.API_GOVCARPETA_BASE_URL}/validateCitizen/${userId}`,
        ),
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

  async handleCreateUser(createUserDto: CreateUserDto): Promise<any> {
    try {
      const { id, ...rest } = createUserDto;
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.API_GOVCARPETA_BASE_URL}/registerCitizen`,
          {
            id: Number(createUserDto.id),
            ...rest,
          },
        ),
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
