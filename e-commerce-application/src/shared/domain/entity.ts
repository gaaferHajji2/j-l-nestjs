import { UniqueId } from "./value-objects/unique-id.vo.js";


export abstract class Entity<T extends UniqueId = UniqueId>{}