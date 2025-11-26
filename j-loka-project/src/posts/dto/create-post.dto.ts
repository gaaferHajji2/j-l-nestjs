/* eslint-disable prettier/prettier */
import { IsArray, IsDate, IsEnum, IsJSON, IsNotEmpty, IsOptional, IsString, IsUrl, Length, Matches, MinDate, MinLength, ValidateNested } from "class-validator";
import { PostStatus } from "../enum/post-status.enum";
import { PostType } from "../enum/post-type.enum";
import { Type } from "class-transformer";
import { MetaOptionsKeyValue } from "./meta-options-key-value.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreatePostDto {
    @ApiProperty()
    @IsString()
    @Length(2, 255)
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        enum: PostType,
    })
    @IsEnum(PostType)
    @IsNotEmpty()
    postType: PostType;

    @ApiProperty({
        example: "jloka-example-01"
    })
    @IsString()
    @Length(2, 255)
    @IsNotEmpty()
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'slug must contains only small letters, digits, hyphen and can\'t start with -'
    }) // from qwen.ai
    slug: string;

    @ApiProperty({
        enum: PostStatus,
    })
    @IsEnum(PostStatus)
    @IsNotEmpty()
    status: PostStatus;

    @ApiPropertyOptional()
    @IsString()
    @Length(1, 5000)
    @IsOptional()
    content?: string;

    @ApiPropertyOptional({
        
    })
    @Length(1, 5000)
    @IsOptional()
    @IsJSON() // from qwen.ai
    schema?:string;

    @ApiPropertyOptional({
        example: 'https://example.com'
    })
    @IsUrl()
    @IsOptional()
    @Length(1, 255)
    featuredImageUrl?: string;

    @ApiPropertyOptional()
    @IsDate()
    @IsOptional()
    @MinDate(new Date('2000-01-01'))
    @Type(() => Date)
    publishedOn?: Date;

    @ApiPropertyOptional()
    @IsArray()
    @IsString({ each: true }) // that means that tags are array of string
    @MinLength(1, { each: true }) // that means that string in tags must contains at least 1-character
    @IsOptional()
    tags?: string[];

    @ApiPropertyOptional({
        type: 'array',
        required: false,
        items: {
            type: 'object',
            properties: {
                key: {
                    type: 'string',
                    description: 'key of meta options',
                    example: 'name'
                },

                value: {
                    type: 'any',
                    description: 'value of meta options',
                    example: 'jloka-01'
                },
            },
        },
    })
    @IsArray()
    @ValidateNested({ each: true })
    @IsOptional()
    @Type(() => MetaOptionsKeyValue)
    metaOptions?: MetaOptionsKeyValue[];
}
