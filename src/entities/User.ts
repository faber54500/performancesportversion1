// entities/User.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * @Entity() indique que cette classe est une entité TypeORM et la lie à une table de base de données.
 * Le nom de la table 'users' est spécifié.
 */
@Entity({ name: 'users' })
export class User {
  /**
   * @PrimaryGeneratedColumn() marque la colonne 'id' comme la clé primaire
   * et indique qu'elle est auto-générée par la base de données.
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * @Column() pour le nom d'utilisateur, doit être unique pour chaque utilisateur.
   */
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  username!: string;

  /**
   * @Column() pour l'adresse e-mail, doit être unique et non nulle.
   */
  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  email!: string;

  /**
   * @Column() pour le mot de passe haché. Ne jamais stocker les mots de passe en clair.
   * La longueur doit être suffisante pour accueillir un hachage Bcrypt.
   */
  @Column({ type: 'varchar', length: 255, nullable: false })
  password!: string;

  /**
   * @Column() pour le rôle de l'utilisateur (ex: 'user', 'admin').
   * Utile pour l'autorisation (accès à certaines routes ou fonctionnalités).
   */
  @Column({ type: 'varchar', length: 20, default: 'user', nullable: false })
  role!: 'user' | 'admin';

  // Vous pouvez ajouter d'autres champs pertinents pour votre application, par exemple:
  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // createdAt!: Date;

  // @Column({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP', nullable: true })
  // updatedAt?: Date;
}