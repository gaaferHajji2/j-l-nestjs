import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Post, UseFilters } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './interfaces/cat.interface';
import { CatsFilter } from './cats.filter';

@Controller('cats')
export class CatsController {
    constructor(private readonly catsService: CatsService) {}

    @Post()
    async create(@Body() createCatDto: CreateCatDto): Promise<CreateCatDto> {
        this.catsService.create(createCatDto)
        return createCatDto
    }

    @Get()
    async findAll(): Promise<Cat[]> {
        // return this.catsService.findAll();
        throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
        // throw new HttpException(
        //     { status: HttpStatus.FORBIDDEN, message: 'This is a custom message'}, 
        //     HttpStatus.FORBIDDEN, 
        //     { cause: 'Custom Reason'}
        // )
        // throw new BadRequestException('Error-01', 
        //     { cause: new Error(), description: 'Simple description about Error-01'}
        // )
    }

    @Get('/catsFilter')
    @UseFilters(new CatsFilter())
    @UseFilters(CatsFilter)
    async getException() {
        throw new BadRequestException()
    }
}
