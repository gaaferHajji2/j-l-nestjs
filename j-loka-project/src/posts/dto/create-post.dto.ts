/* eslint-disable prettier/prettier */

import { IsArray, IsDate, IsEnum, IsJSON, IsNotEmpty, IsOptional, IsString, IsUrl, Length, Matches, MinDate, MinLength, ValidateNested } from "class-validator";
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
    @Length(2, 255)
    @IsNotEmpty()
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'slug must contains only small letters, digits, hyphen and can\'t start with -'
    }) // from qwen.ai
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
    @IsJSON() // from qwen.ai
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
    @IsString({ each: true }) // that means that tags are array of string
    @MinLength(1, { each: true }) // that means that string in tags must contains at least 1-character
    @IsOptional()
    tags?: string[];

    @IsArray()
    @ValidateNested({ each: true })
    @IsOptional()
    @Type(() => MetaOptionsKeyValue)
    metaOptions: MetaOptionsKeyValue[];
}
