/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {

    public getAllPostsForUser(userId: string) {
        return [{
            'name': 'Post-01',
            userId,
            'date': '2000-01-01'
        }, {
            'name': 'Post-02',
            userId,
            'date': '2000-01-01'
        }, {
            'name': 'Post-03',
            userId,
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
