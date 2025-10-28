import { IsOptional, IsString, MinLength } from "class-validator";
import { IsSlug } from "src/common/validators/is-slug.decorator";

export class CreateEnviromentDto {

    @MinLength(3)
    @IsString()
    @IsSlug()
    name: string

    @MinLength(3)
    @IsString()
    @IsOptional()
    description?: string | null;

}
