import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiRegister } from '../decorators/api-register.decorator';
import { LoginResponseDto } from '../dto/login-response.dto';
import { LoginDto } from '../dto/login.dto';
import { RegisterResponseDto } from '../dto/register-response.dto';
import { RegisterDto } from '../dto/register.dto';
import { ILoginResponse } from '../interfaces/auth.interface';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiRegister()
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<RegisterResponseDto> {
    this.logger.debug(`Tentative d'enregistrement pour ${registerDto.email}`);
    const result = await this.authService.register(registerDto);
    this.logger.debug(`Enregistrement réussi pour ${registerDto.email}`);
    return result;
  }

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully logged in',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  async login(@Body() loginDto: LoginDto): Promise<ILoginResponse> {
    try {
      this.logger.debug(`Tentative de connexion pour ${loginDto.email}`);
      const result = await this.authService.login(loginDto);
      this.logger.debug(`Connexion réussie pour ${loginDto.email}`);
      return result;
    } catch (error) {
      this.logger.error(`Erreur de connexion pour ${loginDto.email}:`, error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
