import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column()
  passwordHash!: string;

  @Column()
  fullName!: string;

  @Column({ default: false })
  isActive!: boolean;
}

