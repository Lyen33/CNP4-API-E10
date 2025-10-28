import { PipeTransform, BadRequestException } from '@nestjs/common';

export class SlugValidationPipe implements PipeTransform {
  transform(value: any) {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

    if (typeof value !== 'string' || !slugRegex.test(value)) {
      throw new BadRequestException(`"${value}" is not a valid slug`);
    }

    return value;
  }
}