import { MongoClient, Db } from 'mongodb'
import { ConfigService } from "@nestjs/config"

export const MONGO_DB = Symbol('MONGO_DB')

export const MongoProvider = {
    provide: MONGO_DB,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<Db> => {
        const uri = configService.getOrThrow<string>('MONGODB_URI')
        const dbName = configService.get('MONGO_DB_NAME', 'e_commerce_db')
        const client = new MongoClient(uri)
        await client.connect()
        return client.db(dbName)
    }
}