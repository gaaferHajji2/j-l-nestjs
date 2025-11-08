/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { IsArray, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, Length, MinDate, ValidateNested } from "class-validator";
import { PostStatus } from "../enum/post-status.enum";
import { PostType } from "../enum/post-type.enum";
import { Type } from "class-transformer";
import { MetaOptionsKeyValue } from "./meta-options-key-value.dto";

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
    @MinDate(new Date('2000-01-01'))
    @Type(() => Date)
    publishedOn?: Date;

    @IsArray()
    @IsString()
    @IsOptional()
    tags?: string[];

    @IsArray()
    @ValidateNested({ each: true })
    @IsOptional()
    @Type(() => MetaOptionsKeyValue)
    metaOptions: MetaOptionsKeyValue[];
}
