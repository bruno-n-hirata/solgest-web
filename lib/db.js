import { neon } from '@neondatabase/serverless';

let sql;

if (!globalThis._neonSql) {
    globalThis._neonSql = neon(process.env.DATABASE_URL);
}

sql = globalThis._neonSql;

export { sql };
