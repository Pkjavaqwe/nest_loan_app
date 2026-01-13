import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseServiceService implements OnModuleInit {
 constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const dbHost = this.configService.get('database.host');
    console.log(`Connecting to database at ${dbHost}`);
  }
}
