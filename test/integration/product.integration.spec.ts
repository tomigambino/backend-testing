import { INestApplication, ExecutionContext } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as request from 'supertest'
import { ProductEntity } from "src/common/entities/product.entity";
import { ProductModule } from "src/product/product.module";
import { closeTestingApp, createTestingModule } from "../helpers/test-utils";
import { Repository } from "typeorm";
import { ProductTypeEntity } from "src/common/entities/productType";
import { ImageEntity } from "src/common/entities/image.entity";
import { ImagesModule } from "src/images/images.module";
import { JwtAuthModule } from "src/common/jwt/jwt.module";
import { AuthGuard } from "src/auth/auth.guard";


describe('Product integration tests', () => {
    let app: INestApplication;
    let productRepository: Repository<ProductEntity>
    let productTypeRepository: Repository<ProductTypeEntity>;
    let imageRepository: Repository<ImageEntity>
    const BASE_URL = '/producto'

    beforeAll(async () => {
        // Mock del AuthGuard
        const mockAuthGuard = {
            canActivate: (context: ExecutionContext) => {
                const request = context.switchToHttp().getRequest();
                // Simular que hay un usuario autenticado
                request.customer = {
                    id: 1,
                    email: 'test@test.com',
                    role: 'Owner',
                };
                return true; // Siempre permite el acceso
            },
        };

        app = await createTestingModule(
            [ProductModule, ImagesModule, JwtAuthModule],
            [],
            [],
            { guard: AuthGuard, guardMock: mockAuthGuard } // Pasar el mock
        );
        
        productRepository = app.get(getRepositoryToken(ProductEntity));
        productTypeRepository = app.get(getRepositoryToken(ProductTypeEntity));
        imageRepository = app.get(getRepositoryToken(ImageEntity));
    });

    afterAll(async () => {
        await closeTestingApp(app);
    });

    beforeEach(async () => {
        await productRepository.createQueryBuilder().delete().execute();
        await productTypeRepository.createQueryBuilder().delete().execute();
        await imageRepository.createQueryBuilder().delete().execute();

        await productTypeRepository.save({
            id: 1,
            name: 'Paletas',
        });
    });

    describe('POST /producto', () => {
        it('Mostrar la creación correcta de un producto', async () => {
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
                // YA NO NECESITAS EL TOKEN
                .send(createProductDto)
                .expect(201);
            
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
            const productType = await productTypeRepository.save({name: 'Paletas'})
            
            const product = await productRepository.save({
                productType: productType,
                name: 'Paleta Pro',
                description: 'Paleta de pádel profesional',
                price: 230000,
                stock: 10,
                isActive: true
            })

            const images = await imageRepository.save({
                product: product,
                url: 'url',
                name: 'Foto 1 de Paleta Nox',
                size: '128KB'
            })

            const response = await request(app.getHttpServer())
                .get(`${BASE_URL}/${product.id}`)
                .expect(200)

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