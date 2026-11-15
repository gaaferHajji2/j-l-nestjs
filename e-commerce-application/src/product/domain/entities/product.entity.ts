import { AggregateRoot } from "../../../shared/domain/aggregate-root.js";
import { ProductId } from "../value-object/product-id.vo.js";
import { Sku } from "../value-object/sku.vo.js";

export interface Product {
    id: ProductId;
    name: string;
    description: string;
    sku: Sku;
    stock: number;
    isActive: boolean;
    lowStockThreshold: number;
    createAt: Date;
    updatedAt: Date;
}

// Aggregate Root will allow the entity to emit events
export class Product extends AggregateRoot {

}