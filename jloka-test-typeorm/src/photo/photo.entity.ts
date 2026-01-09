import { User } from "src/users/user.entity";
import { Column, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export class Photo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    path: string;

    @ManyToOne(() => User, (user) => user.photos)
    user: User;
}