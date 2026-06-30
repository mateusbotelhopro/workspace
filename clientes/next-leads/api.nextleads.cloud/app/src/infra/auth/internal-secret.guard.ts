import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class InternalSecretGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const expectedSecret = process.env.INTERNAL_API_SECRET;

    if (!expectedSecret) throw new UnauthorizedException('INTERNAL_API_SECRET não configurado');

    const receivedSecret =
      request.headers['x-nextleads-secret'] || request.headers['X-Nextleads-Secret'];

    if (receivedSecret !== expectedSecret) throw new UnauthorizedException('Token interno inválido');

    return true;
  }
}
