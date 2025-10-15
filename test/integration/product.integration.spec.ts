import { INestApplication } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as request from 'supertest'
import { ProductEntity } from "src/common/entities/product.entity";
import { ProductModule } from "src/product/product.module";
import { closeTestingApp, createTestingModule } from "../helpers/test-utils";
import { Repository } from "typeorm";
import { ProductTypeEntity } from "src/common/entities/productType";

describe('Product integration tests', () => {
    let app: INestApplication;
    let productRepository: Repository<ProductEntity>
    let productTypeRepository: Repository<ProductTypeEntity>;

    // Se ejecuta UNA vez antes de todos los tests
    beforeAll(async () => {
        app = await createTestingModule([ProductModule]);
        productRepository = app.get(getRepositoryToken(ProductEntity));
        productTypeRepository = app.get(getRepositoryToken(ProductTypeEntity));
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


        // Insertamos un ProductType valido en la base de datos
        await productTypeRepository.save({
            id: 1,
            name: 'Paletas',
        });
    });

    describe('POST /product', () => {
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
                            .post('/product')
                            .send(createProductDto)
                            .expect(201);
            
            // Verificamos que retorne el objeto correctamente.
            expect(response.body).toMatchObject({
                id: expect.any(Number),
                productType: {
                    id: 1,
                    name: 'Paletas',
                    description: 'Tipo de producto: paletas de pádel',
                },
                name: createProductDto.name,
                descrption: createProductDto.description,
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
    })
});