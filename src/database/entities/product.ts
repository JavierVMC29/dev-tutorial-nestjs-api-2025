import { BaseModel } from '@src/database/entities/base';
import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { Category } from './category';

@Entity({ name: 'products' })
export class Product extends BaseModel {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToMany(() => Category, (category) => category.products, {
    cascade: true,
  })
  @JoinTable({
    name: 'product_categories',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];
}
