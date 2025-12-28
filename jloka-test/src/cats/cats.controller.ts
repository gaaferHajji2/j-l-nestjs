import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Post, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './interfaces/cat.interface';
import { CatsFilter } from './cats.filter';
import { AuthGuard } from 'src/auth-guard/auth-guard.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { LoggingInterceptor } from 'src/logging/logging.interceptor';

@Controller('cats')
@UseInterceptors(LoggingInterceptor)
export class CatsController {
    constructor(private readonly catsService: CatsService) {}

    @Post()
    @Roles(['admin'])
    @UseGuards(RolesGuard)
    async create(@Body() createCatDto: CreateCatDto): Promise<CreateCatDto> {
        this.catsService.create(createCatDto)
        return createCatDto
    }

    @Get()
    @UseGuards(AuthGuard)
    async findAll(): Promise<Cat[]> {
        return this.catsService.findAll();
        // throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
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
    // @UseFilters(new CatsFilter())
    @UseFilters(CatsFilter)
    async getException() {
        throw new BadRequestException()
    }
}
