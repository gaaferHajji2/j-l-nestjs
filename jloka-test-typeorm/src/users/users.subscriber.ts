import { EntitySubscriberInterface, InsertEvent } from "typeorm";
import { User } from "./user.entity";
import { DataSource } from "typeorm/browser";

class UserSubscriber implements EntitySubscriberInterface<User> {
    constructor(dataSource: DataSource) {
        dataSource.subscribers.push(this)
    }

    listenTo(): Function | string {
        return User;
    }

    beforeInsert(event: InsertEvent<User>): Promise<any> | void {
        console.log('BEFORE USER INSERTED: ', event.entity)
    }
}