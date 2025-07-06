// entities/Programme.ts

// Importe les décorateurs nécessaires de TypeORM
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
// Importe l'entité Athlete pour créer la relation inverse
import { Athlete } from './Athlete';

/**
 * @Entity() indique que cette classe est une entité TypeORM.
 * Par défaut, TypeORM cherchera une table nommée 'programme'.
 */
@Entity()
export class Programme {
  /**
   * @PrimaryGeneratedColumn() marque 'id' comme la clé primaire.
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * @Column() définit une colonne pour le nom du programme.
   */
  @Column({ type: 'varchar', length: 100, nullable: false })
  name!: string;

  /**
   * @Column() définit une colonne pour la description du programme.
   */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * @OneToMany() définit la relation inverse.
   * Un programme peut avoir plusieurs athlètes.
   * Le deuxième argument (athlete => athlete.programme) pointe vers la propriété 'programme' dans l'entité Athlete.
   */
  @OneToMany(() => Athlete, athlete => athlete.programme)
  athletes!: Athlete[]; // Cette propriété contiendra un tableau d'athlètes
}