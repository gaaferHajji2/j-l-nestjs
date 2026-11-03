import { ConfigService } from "@nestjs/config"
import postgres from 'postgres'
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js"

export const DRIZZLE = Symbol('DRIZZLE')

export type DrizzleDB = PostgresJsDatabase<{}>

export const DrizzleProvider = {
    provide: DRIZZLE,
    inject: [ConfigService],
    useFactory: (configService: ConfigService): DrizzleDB => {
        const connectionString = configService.getOrThrow<string>('POSTGRES_DATABASE_URL')
        const client = postgres(connectionString)
        return drizzle(client, {})
    }
}