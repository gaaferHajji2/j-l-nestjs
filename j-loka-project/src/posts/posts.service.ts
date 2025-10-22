/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {

    constructor(private readonly usersService: UsersService) {

    }

    public getAllPostsForUser(userId: string) {

        const user = this.usersService.getUserById(parseInt(userId));

        return [{
            'name': 'Post-01',
            user,
            'date': '2000-01-01'
        }, {
            'name': 'Post-02',
            user,
            'date': '2000-01-01'
        }, {
            'name': 'Post-03',
            user,
            'date': '2000-01-01'
        }]
    }

    public getAllPosts() {
        return [{
            'name': 'Post-01',
            userId: 123,
            'date': '2000-01-01'
        }, {
            'name': 'Post-02',
            userId: 456,
            'date': '2000-01-01'
        }, {
            'name': 'Post-03',
            userId: 789,
            'date': '2000-01-01'
        }]
    }

    public getPostById() {}

    public createPost(createPostDto: CreatePostDto) {}

}
