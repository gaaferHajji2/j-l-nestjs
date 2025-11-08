/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty } from 'class-validator';

export class MetaOptionsKeyValue {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  value: any;
}