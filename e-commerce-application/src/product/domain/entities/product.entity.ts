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

    static create(name: string, description: string, sku: string, price: Money, stock: number) {
        Product.validateName(name)
        Product.validateStock(stock)

        const now = new Date()
        return new Product({
            id: new ProductId(),
            name,
            description,
            price,
            sku: Sku.create(sku),
            stock,
            isActive: true,
            lowStockThreshold: 5,
            createdAt: now,
            updatedAt: now,
        })
    }

    static validateName(name: string) {
        if(name.length < 2 || name.length > 255) {
            throw new Error('Name Length Must be Between 2 and 255 characters')
        }
    }

    static validateStock(stock: number) {
        if(stock < 0) {
            throw new Error('Stock cannot be Negative')
        }
    }
}