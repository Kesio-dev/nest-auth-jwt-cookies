import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  file: string;

  @Column({ default: 0 })
  points: number;

  @ManyToOne(() => User, user => user.posts)
  user: User;
}