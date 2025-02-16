import { BaseModel } from '@src/database/entities/base';
import { Entity, Column, ManyToMany } from 'typeorm';
import { Product } from './product';

@Entity({ name: 'categories' })
export class Category extends BaseModel {
  @Column()
  name: string;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];
}
