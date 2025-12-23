import { PoolConfig } from "pg";
import { PGVectorStoreArgs } from "@langchain/community/vectorstores/pgvector";
import {
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DB_USER,
} from './config'

const poolConfig: PoolConfig = {
    host: DB_HOST,
    port: parseInt(DB_PORT || "5432"),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
};

export const vectorStoreConfig: PGVectorStoreArgs = {
    postgresConnectionOptions: poolConfig,
    tableName: "embeddings",
    columns: {
        idColumnName: "id",
        vectorColumnName: "vector",
        contentColumnName: "content",
        metadataColumnName: "metadata",
    },
};