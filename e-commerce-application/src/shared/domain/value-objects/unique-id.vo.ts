import { randomUUID } from "crypto"

export class UniqueId {
    private readonly value: string

    constructor(id?: string) {
        this.value = id ?? randomUUID()
    }
}