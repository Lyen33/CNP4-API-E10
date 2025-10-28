import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsSlug(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isSlug',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
          return typeof value === 'string' && slugRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} is not a valid slug (lowercase, numbers and hyphens).`;
        },
      },
    });
  };
}