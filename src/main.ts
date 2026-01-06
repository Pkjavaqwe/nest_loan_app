import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    cookieSession({
      keys: [process.env.COOKIE_KEY || 'key123'],
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true
    }),
  );
  const globalAuthGuard = app.get(JwtAuthGuard)
  app.useGlobalGuards(globalAuthGuard);

  await app.listen(3020);
  console.log('Server running on http://localhost:3020');
}
bootstrap();
