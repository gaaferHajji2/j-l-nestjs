import { IsInt, IsNotEmpty } from "class-validator";
import { CreatePostDto } from "./create-post.dto";
import { ApiProperty, PartialType } from "@nestjs/swagger";


export class PatchPostDto extends PartialType(CreatePostDto) {
    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    id!: number;
}