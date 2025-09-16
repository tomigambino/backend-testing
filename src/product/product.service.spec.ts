import { Test, TestingModule } from "@nestjs/testing"
import { ProductService } from "./product.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { ProductEntity } from "src/common/entities/product.entity"
import { ProductTypeService } from "src/productType/productType.service"

describe('productService', () => {
    let productService: ProductService
    const mockProductRepository = {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            save: jest.fn(),
            delete: jest.fn()
        }

    // Mock del ProductTypeService (dependencia)  
  const mockProductTypeService = {
    findProductTypeById: jest.fn(), // Método que ProductsService usa de este service
  };

    beforeEach(async () => {
        //Limpia todos los mocks ANTES de cada test
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [ProductService, 
                {
                provide: getRepositoryToken(ProductEntity),
                useValue: mockProductRepository
                },
                {
                provide: ProductTypeService,
                useValue: mockProductTypeService, // ← Mock de la dependencia
                }
            ]
        }).compile();

        productService = module.get<ProductService>(ProductService);
    })

    describe('createProduct', () => {
        it('Crear un producto y mostrarlo', async () => {
            // Definimos el dto que le vamos a pasar a la función createProduct()
            const createProductDto = {
                productTypeId: 1,
                name:'Pelota de Mundial 2010',
                description:'Pelota original usada en el mundial 2010',
                price: 10000,
                stock: 15,
                isActive: true
            }

            // Definimos la respuesta que devolvera la función findProductTypeById()
            const mockProductType = {
                id: 1,
                name: 'Pelota'
            }

            // Definimos la respuesta del productRepository.create()
            const mockCreatedProduct = {
                productType: mockProductType,
                name: 'Pelota de Mundial 2010',
                description:'Pelota original usada en el mundial 2010',
                price: 10000,
                stock: 15,
                isActive: true
            }

            // Definimos la respuesta del productRepository.save()
            const mockSaveProduct = {
                id: 1,
                productType: mockProductType,
                images: [],
                name: 'Pelota de Mundial 2010',
                description:'Pelota original usada en el mundial 2010',
                price: 10000,
                stock: 15,
                isActive: true
            }

            // Configuramos los mocks
            mockProductTypeService.findProductTypeById.mockResolvedValue(mockProductType)
            mockProductRepository.create.mockResolvedValue(mockCreatedProduct)
            mockProductRepository.save.mockResolvedValue(mockSaveProduct)

            // Obtenemos el resultado del service (ACC - ACtuar)
            const result = await productService.createProduct(createProductDto)

            // Verificamos el resultado (ASSERT - Verificar)
            expect(result).toEqual(mockSaveProduct)
            expect(result.images).toEqual([]);
        })
    })
})