import { PartialType } from "@nestjs/mapped-types";
import { CreateProductTypeDto } from "./create-productType.dto";

export class PatchProductTypeDto extends PartialType(CreateProductTypeDto) {}