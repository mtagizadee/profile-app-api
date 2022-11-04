import { Image } from 'src/images/entities/image.entity';
import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';

@Entity({ name: 'users' })
export class User {
    @PrimaryColumn()
    id: string;

    @Column({
        type: 'varchar',
        unique: true
    })
    email: string;

    @Column({ type: 'varchar' })
    password: string;

    @OneToMany(() => Image, (image) => image.user)
    images: Image[];
}
