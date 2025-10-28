import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";
import { IsSlug } from "src/common/validators/is-slug.decorator";


export class CreateVariableDto {

    @MinLength(3)
    @IsString()
    @IsSlug()
    name: string

    @IsString()
    @MinLength(1)
    value?: string;
    
    @MinLength(3)
    @IsString()
    @IsOptional()
    description?: string | null;

    @IsBoolean()
    @IsOptional()
    is_sensitive: boolean
}
