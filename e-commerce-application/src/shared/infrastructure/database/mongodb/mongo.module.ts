import { Global, Module } from "@nestjs/common"
import { MongoProvider } from "./mongo.provider.js";

// We can import it once and use it through all the application.
@Global()
@Module({
    providers: [MongoProvider],
    exports: [MongoProvider]
})
export class MongoModule {

}