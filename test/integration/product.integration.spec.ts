import { INestApplication } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as request from 'supertest'
import { ProductEntity } from "src/common/entities/product.entity";
import { ProductModule } from "src/product/product.module";
import { closeTestingApp, createTestingModule } from "../helpers/test-utils";
import { Repository } from "typeorm";
import { ProductTypeEntity } from "src/common/entities/productType";
import { ImageEntity } from "src/common/entities/image.entity";
import { ImagesModule } from "src/images/images.module";

describe('Product integration tests', () => {
    let app: INestApplication;
    let productRepository: Repository<ProductEntity>
    let productTypeRepository: Repository<ProductTypeEntity>;
    let imageRepository: Repository<ImageEntity>
    const BASE_URL = '/producto'

    // Se ejecuta UNA vez antes de todos los tests
    beforeAll(async () => {
        app = await createTestingModule([ProductModule, ImagesModule]);
        productRepository = app.get(getRepositoryToken(ProductEntity));
        productTypeRepository = app.get(getRepositoryToken(ProductTypeEntity));
        imageRepository = app.get(getRepositoryToken(ImageEntity))
    });

    // Se ejecuta UNA vez después de todos los tests
    afterAll(async () => {
        await closeTestingApp(app);
    });

    // Limpiar datos antes de cada test
    beforeEach(async () => {
        // Limpiamos las tablas antes de cada test
        await productRepository.createQueryBuilder().delete().execute();
        await productTypeRepository.createQueryBuilder().delete().execute();
        await imageRepository.createQueryBuilder().delete().execute();



        // Insertamos un ProductType valido en la base de datos
        await productTypeRepository.save({
            id: 1,
            name: 'Paletas',
        });
    });

    describe('POST /producto', () => {
        it('Mostrar la creación correcta de un producto', async () => {
            // Definimos el DTO manualmente
            const createProductDto = {
                productTypeId: 1,
                name: 'Paleta Nox AT10',
                description: 'Paleta Nox AT10 diseñada por Agustin Tapia',
                price: 230000,
                stock: 10,
                isActive: true 
            }

            const response = await request(app.getHttpServer())
                            .post(BASE_URL)
                            .send(createProductDto)
                            .expect(201);
            
            // Verificamos que retorne el objeto correctamente.
            expect(response.body).toMatchObject({
                id: expect.any(Number),
                productType: {
                    id: 1,
                    name: 'Paletas',
                },
                name: createProductDto.name,
                description: createProductDto.description,
                price: createProductDto.price,
                stock: createProductDto.stock,
                isActive: createProductDto.isActive
            })

            // Verificamos que se guardó en la BD
            const productInDb = await productRepository.findOne({
            where: { name: createProductDto.name },
            relations: ['productType'],
            });

            expect(productInDb).toBeDefined();
            if(productInDb){
                expect(productInDb.productType.name).toBe('Paletas');
            }
        })
    });

    describe('GET /producto/:id', () => {
        it('Buscar y mostrar un producto correctamente', async() => {
            // Guardamos un ProductType en la base de datos
            const productType = await productTypeRepository.save({name: 'Paletas'})
            
            // Guardamos un Producto en la base de datos
            const product = await productRepository.save({
                productType: productType,
                name: 'Paleta Pro',
                description: 'Paleta de pádel profesional',
                price: 230000,
                stock: 10,
                isActive: true
            })

            // Guardamos datos de unas imagenes
            const images = await imageRepository.save({
                product: product,
                url: 'url',
                name: 'Foto 1 de Paleta Nox',
                size: '128KB'
            })

            // Hacemos la request
            const response = await request(app.getHttpServer()).get(`${BASE_URL}/${product.id}`).expect(200)

            // Verificamos la respuesta
            expect(response.body).toMatchObject({
                id: product.id,
                productType: { id: productType.id, name: productType.name },
                images: [
                    {
                    id: expect.any(Number),
                    url: 'url',
                    name: 'Foto 1 de Paleta Nox',
                    size: '128KB',
                    },
                ],
                name: 'Paleta Pro',
                description: 'Paleta de pádel profesional',
                price: 230000,
                stock: 10,
                isActive: true,
            });
        })
    })
});