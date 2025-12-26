import {IsString, IsInt, IsNotEmpty, Min, Max} from 'class-validator'
export class CreateCatDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsInt()
    @Min(1)
    @Max(50)
    age: number;
    @IsString()
    @IsNotEmpty()
    breed: string;
}