import { Test, TestingModule } from "@nestjs/testing"
import { ProductService } from "./product.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { ProductEntity } from "src/common/entities/product.entity"
import { ProductTypeService } from "src/productType/productType.service"
import { BadRequestException, NotFoundException } from "@nestjs/common"

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
        jest.restoreAllMocks();
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
        it('Crear un producto correctamente y mostrarlo', async () => {
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
            mockProductRepository.create.mockReturnValue(mockCreatedProduct)
            mockProductRepository.save.mockResolvedValue(mockSaveProduct)

            // Obtenemos el resultado del service (ACC - ACtuar)
            const result = await productService.createProduct(createProductDto)

            // Verificamos el resultado (ASSERT - Verificar)
            expect(result).toEqual(mockSaveProduct)
            expect(result.images).toEqual([]);
            expect(mockProductTypeService.findProductTypeById)
            .toHaveBeenCalledWith(createProductDto.productTypeId);
            // Le sacamos el productTypeId del dto ya que en el create le pasamos directamente la entidad de productType
            expect(mockProductRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({
                name: createProductDto.name,
                description: createProductDto.description,
                price: createProductDto.price,
                stock: createProductDto.stock,
                isActive: createProductDto.isActive,
                productType: mockProductType
            })
            );
            expect(mockProductRepository.save)
            .toHaveBeenCalledWith(mockCreatedProduct);
        })
        it('Crear producto con tipo de producto invalido', async () => {
            // Definimos el dto que le vamos a pasar a la función createProduct()
            const createProductDto = {
                productTypeId: 2,
                name: 'Pelota de UEFA Champions League',
                description:'Pelota original usada en UEFA Champions League',
                price: 3000,
                stock: 10,
                isActive: true
            }

            // Configuramos los mocks
            mockProductTypeService.findProductTypeById.mockRejectedValue(new NotFoundException(`Product Type with ID ${createProductDto.productTypeId} not found`))


            // Verificamos el resultado directamente aca, 
            // porque si creamos una constante result el NotFoundException queda en esa linea y no llega al expect
            await expect(productService.createProduct(createProductDto))
            .rejects
            .toThrow(NotFoundException);

            // Verificamos que los metodos create y save no sean llamados
            expect(mockProductRepository.create).not.toHaveBeenCalled();
            expect(mockProductRepository.save).not.toHaveBeenCalled();
        })
    })
    describe('findProductById', () => {
        it('Buscar un producto por id y mostrarlo', async () => {
            const productId = 1;
            // Mockeamos el productType que va a tener el producto
            const mockProductType = {
                id: 1,
                name: 'Pelota'
            }

            // Mockeamos la respuesta del repositorio
            const mockFindOneProduct = {
                id: 1,
                productType: mockProductType,
                images: [],
                name: 'Pelota de Mundial 2010',
                description:'Pelota original usada en el mundial 2010',
                price: 10000,
                stock: 15,
                isActive: true
            };

            // Configuramos el mock
            mockProductRepository.findOne.mockResolvedValue(mockFindOneProduct);

            // Obtenemos el resultado del service (ACC - ACtuar)
            const result = await productService.findProductById(productId);

            // Verificamos el resultado (ASSERT - Verificar)
            expect(result).toEqual(mockFindOneProduct);
            expect(result.id).toBe(productId);
            expect(result.images).toEqual([]);
            // Verificamos que el metodo findOne del repositorio sea llamado con el id correcto
            expect(mockProductRepository.findOne).toHaveBeenCalledWith({
                where: { id: productId },
                relations: ['productType', 'images'],
            });
        })
        it('Buscar producto por un id que no existe', async () => {
            const productId = 2;

            // Configuramos el mock para que devuelva la excepcion NotFoundException
            mockProductRepository.findOne.mockResolvedValue(null);

            // Verificamos el resultado directamente aca, 
            // porque si creamos una constante result el NotFoundException queda en esa linea y no llega al expect
            await expect(productService.findProductById(productId)).rejects.toThrow(NotFoundException);
        })
    })
    describe('findAllProducts', () => {
        it('Buscar y mostrar todos los productos', async () => {
            // Mockeamos los productTypes que van a tener los productos
            const mockProductType1 = {
                id: 1,
                name: 'Pelota'
            }
            const mockProductType2 = {
                id: 2,
                name: 'Camiseta'
            }
            // Mockeamos la respuesta del repositorio
            const mockFindAllProducts = [
                {
                    id: 1,
                    productType: mockProductType1,
                    images: [],
                    name: 'Pelota de Mundial 2010',
                    description:'Pelota original usada en el mundial 2010',
                    price: 10000,
                    stock: 15,
                    isActive: true
                },
                {
                    id: 2,
                    productType: mockProductType2,
                    images: [],
                    name: 'Camiseta de Mundial 2010',
                    description:'Camiseta original usada en el mundial 2010',
                    price: 5000,
                    stock: 20,
                    isActive: true
                },
                {
                    id: 3,
                    productType: mockProductType1,
                    images: [],
                    name: 'Balón de Futbol',
                    description: 'Balón de Futbol de alta calidad',
                    price: 3000,
                    stock: 25,
                    isActive: true
                }
            ];

            // Configuramos el mock
            mockProductRepository.find.mockResolvedValue(mockFindAllProducts);

            // Obtenemos el resultado del service (ACC - ACtuar)
            const result = await productService.findAllProducts();

            // Verificamos el resultado (ASSERT - Verificar)
            expect(result).toEqual(mockFindAllProducts);
            expect(result.length).toBe(3);
            expect(result[0].id).toBe(1);
            expect(result[1].id).toBe(2);
            expect(result[2].id).toBe(3);
            // Verificamos que el metodo find del repositorio sea llamado
            expect(mockProductRepository.find).toHaveBeenCalled();
            // Verificamos que el metodo find del repositorio sea llamado con las relaciones correctas
            expect(mockProductRepository.find).toHaveBeenCalledWith({
                relations: ['productType', 'images'],
            });
        })
        it('Buscamos todos los productos pero no hay ninguno', async () => {
            // Configuramos el mock para que devuelva un array vacío
            mockProductRepository.find.mockResolvedValue([]);

            // Obtenemos el resultado del service (ACC - ACtuar)
            const result = await productService.findAllProducts();

            // Verificamos el resultado (ASSERT - Verificar)
            expect(result).toEqual([]);
            expect(result.length).toBe(0);
        })
    })

    describe('findAllProductsByProductType', () => {
        it('Buscar y mostrar todos los productos por tipo de producto', async () => {
            const productTypeId = 1;
            // Mockeamos el productType que va a tener el producto
            const mockProductType = {
                id: 1,
                name: 'Pelota'
            }
            // Mockeamos la respuesta del repositorio
            const mockFindAllProductsByProductType = [
                {
                    id: 1,
                    productType: mockProductType,
                    images: [],
                    name: 'Pelota de Mundial 2010',
                    description:'Pelota original usada en el mundial 2010',
                    price: 10000,
                    stock: 15,
                    isActive: true
                },
                {
                    id: 3,
                    productType: mockProductType,
                    images: [],
                    name: 'Balón de Futbol',
                    description: 'Balón de Futbol de alta calidad',
                    price: 3000,
                    stock: 25,
                    isActive: true
                }
            ];

            // Configuramos el mock
            mockProductRepository.find.mockResolvedValue(mockFindAllProductsByProductType);

            // Obtenemos el resultado del service (ACC - ACtuar)
            const result = await productService.findAllProductsByProductType(productTypeId);

            // Verificamos el resultado (ASSERT - Verificar)
            expect(result).toEqual(mockFindAllProductsByProductType);
            expect(result.length).toBe(2);
            expect(result[0].id).toBe(1);
            expect(result[1].id).toBe(3);
            // Verificamos que el metodo find del repositorio sea llamado
            expect(mockProductRepository.find).toHaveBeenCalled();
            // Verificamos que el metodo find del repositorio sea llamado con las relaciones correctas
            expect(mockProductRepository.find).toHaveBeenCalledWith({
                relations: ['productType', 'images'],
                where: {
                    productType: {
                        id: productTypeId
                    }
                }
            });
        })
        it('Buscar productos por un tipo de producto que no tiene productos', async () => {
            const productTypeId = 2;

            // Configuramos el mock para que devuelva un array vacío
            mockProductRepository.find.mockResolvedValue([]);

            // Verificamos el resultado directamente aca, 
            // porque si creamos una constante result el NotFoundException queda en esa linea y no llega al expect
            await expect(productService.findAllProductsByProductType(productTypeId))
            .rejects
            .toThrow(NotFoundException);

            // Verificamos que el metodo find del repositorio sea llamado
            expect(mockProductRepository.find).toHaveBeenCalled();
        })
        it('Buscar productos por un tipo de producto que no existe', async () => {
            const productTypeId = 999;

            // Configuramos el mock para que devuelva un array vacío
            mockProductRepository.find.mockResolvedValue([]);

            // Verificamos el resultado directamente aca,
            // porque si creamos una constante result el NotFoundException queda en esa linea y no llega al expect
            await expect(productService.findAllProductsByProductType(productTypeId))
            .rejects
            .toThrow(NotFoundException);

            // Verificamos que el metodo find del repositorio sea llamado
            expect(mockProductRepository.find).toHaveBeenCalled();
        })
        
    })
    describe('findProductsByIds', () => {
        it('Buscar y mostrar productos por sus ids', async () => {
            const idsParam = '1,2,3'

            // Mockeamos los productTypes que van a tener los productos
            const mockProductType1 = {
                id: 1,
                name: 'Pelota'
            }
            const mockProductType2 = {
                id: 2,
                name: 'Camiseta'
            }

            const mockProducts = [
                {
                    id: 1,
                    productType: mockProductType1,
                    images: [],
                    name: 'Pelota de Mundial 2010',
                    description:'Pelota original usada en el mundial 2010',
                    price: 10000,
                    stock: 15,
                    isActive: true
                },
                {
                    id: 2,
                    productType: mockProductType2,
                    images: [],
                    name: 'Camiseta de Mundial 2010',
                    description:'Camiseta original usada en el mundial 2010',
                    price: 5000,
                    stock: 20,
                    isActive: true
                },
                {
                    id: 3,
                    productType: mockProductType1,
                    images: [],
                    name: 'Balón de Futbol',
                    description: 'Balón de Futbol de alta calidad',
                    price: 3000,
                    stock: 25,
                    isActive: true
                }
            ];

            // Mockeamos el método interno findProductById
            const spy = jest.spyOn(productService, 'findProductById')
            // Simulamos la función findProductById como un mock
            .mockImplementation((id: number) =>
                Promise.resolve(mockProducts.find(p => p.id === id) as any)
            );

            const result = await productService.findProductsByIds(idsParam);

            expect(result).toEqual(mockProducts);
            expect(spy).toHaveBeenCalledTimes(3);
            expect(spy).toHaveBeenCalledWith(1);
            expect(spy).toHaveBeenCalledWith(2);
            expect(spy).toHaveBeenCalledWith(3);
        })
        it('Buscar productos por ids con parametro vacio', async () => {
            const idsParam = ''

            expect(productService.findProductsByIds(idsParam)).rejects.toThrow(BadRequestException);
        })
        it('Buscar productos por ids que no existen', async () => {
            // Id del producto inexistente
            const idProduct = '999'

            // Mockeamos el método interno findProductById
            jest.spyOn(productService, 'findProductById')
            // Simulamos la función findProductById como un mock que devolvera NotFoundException
            .mockImplementation(() => {throw new NotFoundException(`Producto con ID ${idProduct} no encontrado`);})

            // Verificamos que devuelva el método de error
            expect(productService.findProductsByIds(idProduct)).rejects.toThrow(NotFoundException);
        })
    })
    describe('partialUpdateProduct', () => {
        it('Actualizar un producto existente con productType de manera correcta y mostrarlo', async () => {
            const productId = 1;

            // Mockeamos el producto que se obtendra con id 1
            const mockInitialProductType = {
                id: 1,
                name: 'Pelota'
            }

            const mockProduct =
                {
                    id: 1,
                    productType: mockInitialProductType,
                    images: [],
                    name: 'Pelota de Mundial 2010',
                    description:'Pelota original usada en el mundial 2010',
                    price: 10000,
                    stock: 15,
                    isActive: true
                }

            // Mockeamos el updateProductDto
            const updateProductDto = {
                productTypeId: 2,
                name: 'Remera de Argentina',
                description: 'Remera de Argentina usada en el mundial 2010',
                price: 6000,
                stock: 7,
                isActive: true
            }

            // Mockeamos el producto que se almacenara en la base de datos
            const mockProductTypeUpdated = {
                id: 2,
                name: 'Camiseta'
            }

            const mockUpdateProductSave = {
                id: 1,
                productType: mockProductTypeUpdated,
                images: [],
                name: 'Pelota de Mundial 2010',
                description: 'Remera de Argentina usada en el mundial 2010',
                price: 6000,
                stock: 7,
                isActive: true
            }

            // Mockeamos el método interno findProductById()
            jest.spyOn(productService, 'findProductById').mockResolvedValue(mockProduct as any)

            // Mockeamos el método findProductTypeById del servicio ProductType
            mockProductTypeService.findProductTypeById.mockResolvedValue(mockInitialProductType)

            // Mockeamos el save
            mockProductRepository.save.mockResolvedValue(mockUpdateProductSave)

            // Obtenemos el resultado del service (ACC - ACtuar)
            const result = await productService.partialUpdateProduct(productId, updateProductDto);

            // Verificamos el resultado (ASSERT - Verificar)
            expect(result).toEqual(mockUpdateProductSave);
            // Verificamos que el metodo save del repositorio sea llamado
            expect(mockProductRepository.save).toHaveBeenCalled();
        })
        it('Actualizar un producto existente sin productType existente', async () => {
            const productId = 1;

            // Mockeamos el updateProductDto
            const mockUpdateProductDto = {
                productTypeId: 2,
                name: 'Remera de Argentina',
                description: 'Remera de Argentina usada en el mundial 2010',
                price: 6000,
                stock: 7,
                isActive: true
            }

            // Mockeamos el producto que se obtendra con id 1
            const mockInitialProductType = {
                id: 1,
                name: 'Pelota'
            }

            const mockProduct = {
                id: 1,
                productType: mockInitialProductType,
                images: [],
                name: 'Pelota de Mundial 2010',
                description:'Pelota original usada en el mundial 2010',
                price: 10000,
                stock: 15,
                isActive: true
            }
            // Mockeamos el método interno findProductById()
            jest.spyOn(productService, 'findProductById').mockResolvedValue(mockProduct as any)

            // Mockeamos el método findProductTypeById del servicio ProductType
            mockProductTypeService.findProductTypeById.mockRejectedValue(new NotFoundException(`Product Type with ID ${mockUpdateProductDto.productTypeId} not found`))

            // Verificamos el resultado (ASSERT - Verificar)
            expect(productService.partialUpdateProduct(productId, mockUpdateProductDto)).rejects.toThrow(NotFoundException);
            // Verificamos que el metodo save del repositorio NO sea llamado
            expect(mockProductRepository.save).not.toHaveBeenCalled();
        })
        it('Actualizar un producto con id inexistente devolviendo NotFoundException', async () => {
            const productId = 999;
            
            // Mockeamos el updateProductDto
            const mockUpdateProductDto = {
                productTypeId: 2,
                name: 'Remera de Argentina',
                description: 'Remera de Argentina usada en el mundial 2010',
                price: 6000,
                stock: 7,
                isActive: true
            }

            // Mockeamos el método findProductTypeById del servicio ProductType
            expect(productService.partialUpdateProduct(productId, mockUpdateProductDto)).rejects.toThrow(NotFoundException)
        })
    })
    describe('deleteProduct', () => {
        it('Eliminar un producto existente', async () => {
            const productId = 1;

            // Mockeamos el método delete del repositorio
            mockProductRepository.delete.mockResolvedValue({ affected: 1 });

            // La función no devuelve nada, por lo que esperamos que el resultado sea undefined
            await expect(productService.deleteProduct(productId))
            .resolves
            .toBeUndefined();
            
        })
        it('debería lanzar NotFoundException si el producto no existe', async () => {
            const productId = 99;

            // Mockeamos el delete para simular que no borró nada
            mockProductRepository.delete.mockResolvedValue({ affected: 0 });

            await expect(productService.deleteProduct(productId))
                .rejects
                .toThrow(NotFoundException);
        });
    })
})