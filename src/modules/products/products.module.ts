import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../categories/categories.module';
import { Category } from '../categories/entities/category.entity';
import { StorageModule } from '../storage/storage.module';
import { FavoritesController } from './controllers/favorites.controller';
import { ProductsController } from './controllers/products.controller';
import { SavedFiltersController } from './controllers/saved-filters.controller';
import { ProductFavorite } from './entities/product-favorite.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductView } from './entities/product-view.entity';
import { Product } from './entities/product.entity';
import { SavedFilter } from './entities/saved-filter.entity';
import { ProductFavoritesService } from './services/product-favorites.service';
import { ProductImagesService } from './services/product-images.service';
import { ProductViewsService } from './services/product-views.service';
import { ProductsService } from './services/products.service';
import { SavedFiltersService } from './services/saved-filters.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductImage,
      ProductView,
      ProductFavorite,
      Category,
      SavedFilter,
    ]),
    CategoriesModule,
    StorageModule,
  ],
  controllers: [
    ProductsController,
    SavedFiltersController,
    FavoritesController,
  ],
  providers: [
    ProductsService,
    ProductImagesService,
    ProductViewsService,
    SavedFiltersService,
    ProductFavoritesService,
  ],
  exports: [
    ProductsService,
    ProductViewsService,
    SavedFiltersService,
    ProductFavoritesService,
  ],
})
export class ProductsModule {}
