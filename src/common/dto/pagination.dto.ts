import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto {
    
    @IsOptional()
    @Type(() => Number) 
    @IsPositive()
    @Min(1)
    per_page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    page?: number;
}