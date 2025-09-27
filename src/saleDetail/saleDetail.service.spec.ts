import { Test, TestingModule } from "@nestjs/testing"
import { SaleDetailService } from "./saleDetail.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { SaleDetailEntity } from "src/common/entities/saleDetail"
import { ProductService } from "src/product/product.service"
import Module from "module"
import { create } from "domain"
import { CreateSaleDetailDto } from "./dto/create-saleDetail.dto"

describe('SaleDetailService', () => {
    let saleDetailService: SaleDetailService
    const mockSaleDetailRepository = {
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        save: jest.fn(),
        delete: jest.fn()
    }

    // SaleEntity y ProductEntity
    const mockProductService = {
        findProductById: jest.fn(), // Método que SaleDetailService usa de este service
    }

    beforeEach(async () => {
        // Esta función limpia todos los mocks ANTES de cada test
        jest.clearAllMocks();
        jest.restoreAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [SaleDetailService,
                {
                    provide: getRepositoryToken(SaleDetailEntity),
                    useValue: mockSaleDetailRepository
                },
                {
                    provide: ProductService,
                    useValue: mockProductService, // ← Mock de la dependencia
                }
            ],
        }).compile();

        saleDetailService = module.get<SaleDetailService>(SaleDetailService);

    })


    describe('createSaleDetail', () => {
        it('Crear un detalle de venta y devolverlo', async () => {
            // Se define el dto que se le va a pasar a la función createSaleDetail()
            const createSaleDetailDto = {
                productId: 1,
                quantity: 3
            }

            // Definimos la respuesta que devolverá la función findProductById()
            const mockProduct = {
                id: 1,
                name: 'Pelota de Mundial 2010',
                price: 5000
            }

            // Total que esperamos
            const expectedTotal = createSaleDetailDto.quantity*mockProduct.price;
            
            // Mock del objeto creado por el repo
            const mockCreatedSaleDetail = {
                product: mockProduct,
                quantity: createSaleDetailDto.quantity,
                totalDetail: expectedTotal
            }

            // Mock del objeto guardado (con id simulado)
            const mockSavedSaleDetail = {
                id: 1,
                sale: [],
                product: mockProduct,
                quantity: createSaleDetailDto.quantity,
                totalDetail: expectedTotal
            }

            // Configuramos los mocks
            mockProductService.findProductById.mockResolvedValue(mockProduct);
            mockSaleDetailRepository.create.mockReturnValue(mockCreatedSaleDetail);
            mockSaleDetailRepository.save.mockResolvedValue(mockSavedSaleDetail);

            // Obtenemos el resultado del servicio (ACC -Actuar)
            const result = await saleDetailService.createSaleDetail(createSaleDetailDto)

            // Verificamos el resulado (ASSERT - Verificar)
            expect(result).toEqual(mockCreatedSaleDetail);

            // Controla las llamadas al buscar el producto por id
            expect(mockProductService.findProductById)
            .toHaveBeenCalledWith(createSaleDetailDto.productId);
            
            // Controla las llamadas a la hora de crear el saleDetail
            expect(mockSaleDetailRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    product: mockProduct,
                    quantity: createSaleDetailDto.quantity,
                    totalDetail: expectedTotal 
                })
            );

            expect(mockSaleDetailRepository.save).toHaveBeenCalledWith(mockCreatedSaleDetail);
        })

        describe('findAllSaleDetails', () => {
            it('Buscar todos los detalle de venta y mostrarlos', async () => {
                const mockSaleDetails = [
                    {
                        product: { id: 1, name: 'Pelota', price: 5000 },
                        quantity: 2,
                        totalDetail: 10000,
                    },
                    {
                        id: 2,
                        product: { id: 2, name: 'Camiseta', price: 8000 },
                        quantity: 1,
                        totalDetail: 8000,
                    },
                ];

                // Configuramos el mock del repositorio
                mockSaleDetailRepository.find.mockResolvedValue(mockSaleDetails);

                // Act
                const result = await saleDetailService.findAllSaleDetails();

                // Assert
                expect(result).toEqual(mockSaleDetails);
                expect(mockSaleDetailRepository.find).toHaveBeenCalledWith({
                relations: ['product'],
                });
                
            })
        })

        describe('findSaleDetailById', () => {
            it('Buscar un detalle de venta por id y mostrarlo si existe', async () => {
                const mockSaleDetail = {
                    id: 1,
                    product: {id: 1, name: 'Pelota', price: 5000},
                    quantity: 2,
                    totalDetail: 10000,
                };

                mockSaleDetailRepository.findOne.mockResolvedValue(mockSaleDetail);

                const result = await saleDetailService.findSaleDetailById(1);

                expect(result).toEqual(mockSaleDetail);
                expect(mockSaleDetailRepository.findOne).toHaveBeenCalledWith({
                    where: { id:1 },
                    relations: ['product'],
                });
            });
        })

        describe('updateSaleDetail', () => {
            it('Actualizar un detalle de venta y devolverlo', async () => {
                const createSaleDetailDto = {
                    productId: 1,
                    quantity: 3
                }
                const mockProduct = { 
                    id: 1, 
                    name: 'Pelota', 
                    price: 5000
                }
                const mockSaleDetail = Object.assign(new SaleDetailEntity(), {
                    id: 1,
                    product: { id: 1, name: 'Pelota', price: 5000 },
                    quantity: 2,
                    totalDetail: 10000
                });

                jest.spyOn(saleDetailService, 'findSaleDetailById').mockResolvedValue(mockSaleDetail);
                mockProductService.findProductById.mockResolvedValue(mockProduct);
                mockSaleDetailRepository.save.mockResolvedValue({
                    id: 1,
                    product: mockProduct,
                    quantity: createSaleDetailDto.quantity,
                    totalDetail: createSaleDetailDto.quantity * mockProduct.price,
                })

                const result = await saleDetailService.updateSaleDetail(1, createSaleDetailDto);

                expect(result.totalDetail).toBe(15000);
                expect(mockProductService.findProductById).toHaveBeenCalledWith(createSaleDetailDto.productId);
                expect(mockSaleDetailRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                    id: 1,
                    product: mockProduct,
                    quantity: createSaleDetailDto.quantity,
                    totalDetail: 15000,                   
                }))
            })
        })

        describe('partialUpdateSaleDetail', () => {
            it('Actualizar la cantidad del detalle', async () => {
                const createSaleDetailDto = { quantity: 4 }
                const mockProduct = { 
                    id: 1, 
                    name: 'Pelota', 
                    price: 5000
                }
                const mockSaleDetail = Object.assign(new SaleDetailEntity(), {
                    id: 1,
                    product: { id: 1, name: 'Pelota', price: 5000 },
                    quantity: 2,
                    totalDetail: 10000
                });

                jest.spyOn(saleDetailService, 'findSaleDetailById').mockResolvedValue(mockSaleDetail);
                mockSaleDetailRepository.save.mockResolvedValue({
                    ...mockSaleDetail, // Ver que hace esto
                    quantity: createSaleDetailDto.quantity,
                    totalDetail: createSaleDetailDto.quantity * mockProduct.price,
                });

                const result = await saleDetailService.partialUpdateSaleDetail(1, createSaleDetailDto);

                expect(result.totalDetail).toBe(20000);
                expect(mockSaleDetailRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                    id: 1,
                    quantity: createSaleDetailDto.quantity,
                    totalDetail: 20000,
                }))
            })
        })

        describe('deleteSaleDetail', () => {
            it('Eliminar un detalle de venta si existe', async () => {
                mockSaleDetailRepository.delete.mockResolvedValue({ affected: 1 });

                await expect(saleDetailService.deleteSaleDetail(1)).resolves.not.toThrow();
                expect(mockSaleDetailRepository.delete).toHaveBeenCalledWith(1);
            });

            it('Lanzar NotFoundException si no existe', async () => {
                mockSaleDetailRepository.delete.mockResolvedValue({ affected: 0 });

                await expect(saleDetailService.deleteSaleDetail(99))
                .rejects
                .toThrow('Sale Detail Not Found');
            });
        });

        describe('calculateTotalSaleDetail', () => {
            it('Calcular el total del detalle', () => {
                const result = saleDetailService.calculateTotalSaleDetail(3, 5000);
                expect(result).toBe(15000);
            });

            it('Lanza error si la cantidad es menor o igual a 0', () => {
                expect(() => saleDetailService.calculateTotalSaleDetail(0, 5000))
                .toThrow('Quantity and product price must be positive numbers.');
            });

            it('Lanza error si el precio es menor o igual a 0', () => {
                expect(() => saleDetailService.calculateTotalSaleDetail(3, 0))
                .toThrow('Quantity and product price must be positive numbers.');
            });
        });       
    })
})