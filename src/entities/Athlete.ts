// entities/Athlete.ts

// Importe les décorateurs nécessaires de TypeORM pour définir une entité
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * @Entity() indique que cette classe est une entité TypeORM et la lie à une table de base de données.
 * Le nom de la table 'donne_sport' est spécifié pour correspondre au schéma SQL.
 */
@Entity({ name: 'donne_sport' })
export class Athlete {
  /**
   * @PrimaryGeneratedColumn() marque la colonne 'id' comme la clé primaire
   * et indique qu'elle est auto-générée par la base de données.
   */
  @PrimaryGeneratedColumn()
  id!: number; // Le '!' indique que la propriété sera initialisée par TypeORM

  //@Column() donne les propriétés des colonnes de la table.
  
  @Column({ type: 'varchar', length: 50, nullable: false })
  Name!: string;

  @Column({ type: 'char', length: 10, nullable: false })
  Gender!: string;

  @Column({ type: 'float', nullable: false })
  Runtime!: number;

  @Column({ type: 'int', nullable: false })
  Age!: number;

  @Column({ type: 'float', nullable: false })
  Weight!: number;

  @Column({ type: 'float', nullable: false })
  Oxygen_consumption!: number;

  @Column({ type: 'int', nullable: false })
  Run_pulse!: number;

  @Column({ type: 'int', nullable: false })
  Res_pulse!: number;

  @Column({ type: 'int', nullable: false })
  Maximum_pulse!: number;

  @Column({ type: 'int', nullable: false })
  Performance!: number;
}
