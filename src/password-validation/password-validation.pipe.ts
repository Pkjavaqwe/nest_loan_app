import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class PasswordValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const password = value.password;
    const uppercase = /[A-Z]/
   const lowercase = /[a-z]/
    const numneric = /[0-9]/
    const specialChar = /[@$!%*?&#]/
    if (!password) {
      throw new BadRequestException('Password is required');
    }

    if (password.length < 8) {
      throw new BadRequestException(
        'At least 8 characters are mandatory',
      );
    }

    if (!uppercase.test(password)) {
      throw new BadRequestException(
        'At least one uppercase letter is required',
      );
    }

    if (!lowercase.test(password)) {
      throw new BadRequestException(
        'At least one lowercase letter',
      );
    }

    if (!numneric.test(password)) {
      throw new BadRequestException(
        'At least one number is required',
      );
    }

    if (!specialChar.test(password)) {
      throw new BadRequestException(
        'At least one special character is required',
      );
    }
    return value;
  }
}
