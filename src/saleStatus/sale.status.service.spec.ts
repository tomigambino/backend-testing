import { Test, TestingModule } from "@nestjs/testing";
import { SaleStateService } from "./saleStatus.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { SaleStatusEntity } from "src/common/entities/saleStatus";

describe('SaleStateService', () => {
    let saleStateService: SaleStateService;
    const mockRepo = {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            save: jest.fn(),
            delete: jest.fn()
        }

    beforeEach(async () => {
        //Limpia todos los mocks ANTES de cada test
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [SaleStateService, {
                provide: getRepositoryToken(SaleStatusEntity),
                useValue: mockRepo
            }]
        }).compile()

        saleStateService = module.get(SaleStateService);
    })  

    describe('createSaleState', () => {
        it('Crear un estado de venta y mostrarlo', async () => {
            const mockData = {id: 1, value: 'Pendiente'};
            mockRepo.create.mockReturnValue({ value: 'Pendiente' });
            mockRepo.save.mockResolvedValue(mockData);

            const newSaleState = await saleStateService.createSaleState(mockData);

            expect(newSaleState).toEqual(mockData);
        })
        it('Retorna el estado de venta guardado incluso si value está vacío', async () => {
            const mockData = {id:1, value: ''};
            mockRepo.create.mockReturnValue({ value: '' });
            mockRepo.save.mockResolvedValue(mockData);

            const newSaleState = await saleStateService.createSaleState(mockData);

            expect(newSaleState).toEqual(mockData)
        })
    })
})