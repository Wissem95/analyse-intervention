import { Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Role } from '../enums/role.enum';

@Entity('users')
export class User {
  private readonly logger = new Logger(User.name);
  private static readonly SALT_ROUNDS = 10;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column({ default: false })
  isEmailVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('simple-json', {
    nullable: true,
    name: 'address',
  })
  address?: {
    street: string;
    zipCode: string;
    city: string;
    additionalInfo?: string;
  };

  @OneToMany(() => Product, (product) => product.seller)
  products: Product[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.logger.debug('Début du hachage du mot de passe');
      this.logger.debug(`Mot de passe avant hachage: ${this.password}`);

      try {
        this.password = await bcrypt.hash(this.password, User.SALT_ROUNDS);
        this.logger.debug(`Mot de passe après hachage: ${this.password}`);
      } catch (error) {
        this.logger.error('Erreur lors du hachage du mot de passe:', error);
        throw error;
      }
    }
  }

  async validatePassword(plainPassword: string): Promise<boolean> {
    try {
      this.logger.debug('Début de la validation du mot de passe');
      this.logger.debug(`Mot de passe fourni: ${plainPassword}`);
      this.logger.debug(`Mot de passe haché stocké: ${this.password}`);

      if (!plainPassword || !this.password) {
        this.logger.debug('Mot de passe manquant');
        return false;
      }

      const isValid = await bcrypt.compare(plainPassword, this.password);
      this.logger.debug(`Résultat de la validation: ${isValid}`);
      return isValid;
    } catch (error) {
      this.logger.error('Erreur lors de la validation du mot de passe:', error);
      return false;
    }
  }
}
