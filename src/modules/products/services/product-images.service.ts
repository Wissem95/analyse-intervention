import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as sharp from 'sharp';
import { Repository } from 'typeorm';
import { StorageService } from '../../../modules/storage/services/storage.service';
import { ProductImage } from '../entities/product-image.entity';

@Injectable()
export class ProductImagesService {
  private readonly logger = new Logger(ProductImagesService.name);

  constructor(
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      // Optimiser l'image
      const optimizedBuffer = await sharp(file.buffer)
        .resize(800, 800, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 80 })
        .toBuffer();

      // Générer un nom de fichier unique
      const filename = `${Date.now()}-${file.originalname}`;

      // Sauvegarder l'image optimisée
      return this.storageService.uploadFile(
        { ...file, buffer: optimizedBuffer },
        'products',
      );
    } catch (error) {
      this.logger.error(`Erreur lors de l'upload de l'image: ${error.message}`);
      throw new BadRequestException("Erreur lors du traitement de l'image");
    }
  }

  async uploadImages(files: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }

  async deleteImage(filename: string): Promise<void> {
    try {
      await this.storageService.deleteFile(filename, 'products');
    } catch (error) {
      this.logger.error(
        `Erreur lors de la suppression de l'image: ${error.message}`,
      );
      throw error;
    }
  }

  async deleteImages(images: ProductImage[]): Promise<void> {
    const deletePromises = images.map((image) =>
      this.deleteImage(image.filename).catch((error) => {
        this.logger.error(
          `Erreur lors de la suppression de l'image ${image.filename}: ${error.message}`,
        );
      }),
    );
    await Promise.all(deletePromises);
  }
}
