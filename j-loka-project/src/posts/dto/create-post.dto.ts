/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { IsNotEmpty, IsString, Length } from "class-validator";
import { PostStatus } from "../enum/post-status.enum";
import { PostType } from "../enum/post-type.enum";

export class CreatePostDto {
    @IsString()
    @Length(4, 255)
    @IsNotEmpty()
    title: string;
    postType: PostType;
    slug: string;
    status: PostStatus;
    content?: string;
    schema?:string;
    featuredImageUrl?: string;
    publishedOn?: Date;
    tags?: string[];
    metaOptions: object[];
}
