import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
  console.log('🚀 Server running on http://localhost:3000');
  console.log('\n📋 Auth endpoints:');
  console.log('  POST /auth/register - Register a new user');
  console.log('  POST /auth/login    - Login and get JWT token');
  console.log('\n📋 Loan endpoints:');
  console.log('  POST /loans/request              - Customer requests loan');
  console.log('  POST /loans/request-for-customer - Sales requests on behalf of customer');
  console.log('  POST /loans/:id/approve          - Financer approves loan');
  console.log('  POST /loans/:id/reject           - Financer rejects loan');
  console.log('  GET  /loans/pending              - Financer views pending loans');
  console.log('  GET  /loans/all                  - Financer views all loans');
  console.log('  GET  /loans/my-loans             - Customer views own loans');
  console.log('  GET  /loans/my-requests          - Sales views their requests');
}
bootstrap();
