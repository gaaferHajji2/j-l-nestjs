import { IsString, Max, Min } from "class-validator";


export class SignInDto {
    @IsString()
    @Min(1)
    @Max(50)
    username: string;
    @IsString()
    @Min(1)
    @Max(50)
    password: string;
}