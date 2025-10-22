import { INestApplication } from "@nestjs/common"
import { getRepositoryToken } from "@nestjs/typeorm";
import { ProductEntity } from "src/common/entities/product.entity";
import { SaleEntity } from "src/common/entities/sale";
import { SaleDetailEntity } from "src/common/entities/saleDetail";
import { ProductModule } from "src/product/product.module";
import { SaleDetailModule } from "src/saleDetail/saleDetail.module";
import { closeTestingApp, createTestingModule } from "test/helpers/test-utils";
import { Repository } from "typeorm";
import * as request from 'supertest'



describe('SaleDetail integration test', () => {
    let app: INestApplication;
    let saleDetailRepository: Repository<SaleDetailEntity>;
    let productRepository: Repository<ProductEntity>;
    const BASE_URL = '/detalleVenta';

    beforeAll(async () => {
        app = await createTestingModule([SaleDetailModule, ProductModule]);
        saleDetailRepository = app.get(getRepositoryToken(SaleDetailEntity));
        productRepository = app.get(getRepositoryToken(ProductEntity));
    })

    afterAll(async () => {
        await closeTestingApp(app);
    })

    // Limpiamos datos antes de cada test
    beforeEach(async () => {
        // Limpiamos las tablas antes de cada test
        await saleDetailRepository.createQueryBuilder().delete().execute();
        await productRepository.createQueryBuilder().delete().execute();

        // Insertamos un producto base
        await productRepository.save({
            id: 1,
            name: 'Paleta Nox AT10',
            description: 'Paleta de pádel',
            price: 15000,
            stock: 10,
            isActive: true, 
        })

    })

    describe('POST /detalleVenta', () => {
        it('Crear un detalle de venta correctamente', async () => {

            const product = await productRepository.save({
                name: 'Paleta Nox AT10',
                description: 'Paleta de pádel',
                price: 15000,
                stock: 10,
                isActive: true,
            });

            const createSaleDetailDto = {
                productId: product.id,
                quantity: 3,
            };

            const expectedTotal = createSaleDetailDto.quantity * product.price; 

            const response = await request(app.getHttpServer())
                .post(BASE_URL)
                .send(createSaleDetailDto)
                .expect(201);

            expect(response.body).toMatchObject({
                id: expect.any(Number),
                product: { id: product.id, name: 'Paleta Nox AT10'},
                quantity: createSaleDetailDto.quantity,
                totalDetail: expectedTotal,
            })
            
            const detailInDb = await saleDetailRepository.findOne({
                where: { id: response.body.id },
                relations: ['product'],
            });

            expect(detailInDb).toBeDefined();
            if (detailInDb) {
                expect(detailInDb.product.id).toBe(product.id);
                expect(detailInDb.quantity).toBe(createSaleDetailDto.quantity);
                expect(detailInDb.totalDetail).toBe(expectedTotal);
            }
        })
    })

    describe('GET /detalleVenta', () => {
        /*
        it('Obtener un detalle de venta correctamente', async () => {
            const product = await productRepository.findOneBy({ id: 1});
            const sale = await saleRepository. findOneBy({ id: 1 });

            const saleDetail = await saleDetailRepository.save({
                // Implementar
            })
        })
        */
    })

})
