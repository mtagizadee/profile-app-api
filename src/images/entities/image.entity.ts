import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

export type ImageType = 'header' | 'avatar' | 'image';

@Entity({ name: 'images' })
export class Image {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        unique: true
    })
    url: string;

    @Column({ type: 'varchar' })
    type: ImageType;

    @ManyToOne(() => User, (user) => user.images, { onDelete: 'CASCADE' })
    user: User;
}
