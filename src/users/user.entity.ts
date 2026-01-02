import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, AfterInsert, AfterUpdate, AfterRemove } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '../auth/enums/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude() // Never expose password in responses
  password: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  // Lifecycle hooks for logging (Grider pattern)
  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id:', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id:', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id:', this.id);
  }
}
