/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class GetUsersParamDto {
    @ApiProperty({
        description: "The id of user that maybe uuidv4",
        example: 1
    })
    @IsInt()
    @Type(() => Number)
    id: number;
}