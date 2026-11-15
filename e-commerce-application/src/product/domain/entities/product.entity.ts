import { AggregateRoot } from "../../../shared/domain/aggregate-root.js";
import { Money } from "../../../shared/domain/value-objects/money.vo.js";
import { ProductId } from "../value-object/product-id.vo.js";
import { Sku } from "../value-object/sku.vo.js";

export interface ProductProps {
    id: ProductId
    name: string
    description: string
    price: Money
    sku: Sku
    stock: number
    isActive: boolean
    lowStockThreshold: number
    createdAt: Date
    updatedAt: Date
}

// Aggregate Root will allow the entity to emit events
export class Product extends AggregateRoot {
    private _id: ProductId
    private _name: string
    private _description: string
    private _price: Money
    private _sku: Sku
    private _stock: number
    private _isActive: boolean
    private _lowStockThreshold: number
    private _createdAt: Date
    private _updatedAt: Date

    private constructor(props: ProductProps) {
        // Any class that inherite from the Aggregate Root must call super()
        super();
        this._id = props.id
        this._name = props.name
        this._description = props.description
        this._price = props.price
        this._sku = props.sku
        this._stock = props.stock
        this._isActive = props.isActive
        this._lowStockThreshold = props.lowStockThreshold
        this._createdAt = props.createdAt
        this._updatedAt = props.updatedAt
    }
}