import { Image } from 'src/images/entities/image.entity';
import { Entity, Column, PrimaryColumn, OneToMany, BeforeInsert } from 'typeorm';
import { hash } from 'argon2';

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

    @Column({ type: 'varchar' })
    firstName: string;

    @Column({ type: 'varchar' })
    secondName: string;

    @OneToMany(() => Image, (image) => image.user)
    images: Image[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password);
    }

    getFullName() {
        return `${this.firstName} ${this.secondName}`;
    }
}
