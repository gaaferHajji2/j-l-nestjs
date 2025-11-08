/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { IsArray, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator";
import { PostStatus } from "../enum/post-status.enum";
import { PostType } from "../enum/post-type.enum";

export class CreatePostDto {
    @IsString()
    @Length(4, 255)
    @IsNotEmpty()
    title: string;

    @IsEnum(PostType)
    @IsNotEmpty()
    postType: PostType;

    @IsString()
    @Length(4, 255)
    @IsNotEmpty()
    slug: string;

    @IsEnum(PostStatus)
    @IsNotEmpty()
    status: PostStatus;

    @IsString()
    @Length(1, 5000)
    @IsOptional()
    content?: string;

    @IsString()
    @Length(1, 5000)
    @IsOptional()
    schema?:string;

    @IsUrl()
    @IsOptional()
    @Length(1, 255)
    featuredImageUrl?: string;

    @IsDate()
    @IsOptional()
    publishedOn?: Date;

    @IsArray()
    @IsString()
    @IsOptional()
    tags?: string[];

    @IsArray()
    @IsOptional()
    metaOptions: object[];
}
