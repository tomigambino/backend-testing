import { SaleDetailEntity } from "src/common/entities/saleDetail"
import { SaleDetailService } from "./saleDetail.service"
import { Test, TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { ProductEntity } from "src/common/entities/product.entity"
import { CreateSaleDetailDto } from "./dto/create-saleDetail.dto"
import { ImageEntity } from "src/common/entities/image.entity"


describe('SaleDetailService', () => {
    let saleDetailService: SaleDetailService;
    const mockRepo = {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            save: jest.fn(),
            delete: jest.fn()
    }

    const mockProductService = {
        findProductById: jest.fn()
    }

    beforeEach(async () => {
        //Limpia todos los mocks ANTES de cada test
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [SaleDetailService, {
                provide: getRepositoryToken(SaleDetailEntity),
                useValue: mockRepo
            }]
        }).compile()

        saleDetailService = module.get(SaleDetailService);
    })
    /*
    describe('createSaleDetail', () => {
        const mockProductType: ProductEntity = {
            id: 1,
            name: 'Electrónica'
        } as ProductEntity;
        
        const mockImage1: ImageEntity = {
            id: 1,
            product: mockProductPartial as ProductEntity,
            url: 'https://hodcwckiqgtejtxpdyzm.supabase.co/storage/v1/object/public/images-testing/products/2/Camiseta%201.jpg',
            name: 'Camiseta 1.jpg',
            size: '10.74KB'
        }

        const mockProductPartial: Partial<ProductEntity> = {
            id: 1,
            name: 'Test Product',
            price: 100,
            productType: 
        }

        const createSaleDetailDto: CreateSaleDetailDto = {
            productId: 1,
            quantity: 5
        }
        it('Crear un detalle de venta y mostrarlo', async () => {
            
        })
    })*/

})