// entities/ApiKey.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('api_key')
export class ApiKey {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, type: 'varchar', length: 255 })
  key!: string;

  @Column({ type: 'int' })
  userId!: number; // ou relier à une entité User si besoin

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;
}
