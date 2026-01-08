// mostly scaffolded from Kysely docs, swapping out new Kysely Db with existing DB

import * as path from 'path'
import { promises as fs } from 'fs'
import {
    Migrator,
    FileMigrationProvider,
} from 'kysely'
import { db } from '@/src/server/db'

async function migrateToLatest() {
    console.log('************** migrate.ts starting… *****************')

    const migrator = new Migrator({
        db,
        provider: new FileMigrationProvider({
            fs,
            path,
            migrationFolder: __dirname,
        }),
    })

    const { error, results } = await migrator.migrateToLatest()

    results?.forEach((it) => {
        if (it.status === 'Success') {
            console.log(`migration "${it.migrationName}" was executed successfully`)
        } else if (it.status === 'Error') {
            console.error(`failed to execute migration "${it.migrationName}"`)
        }
    })

    if (error) {
        throw error
    }
}

async function migrateWithRetry(
    attempts = 10,
    delayMs = 2000,
): Promise<void> {
    for (let i = 0; i < attempts; i++) {
        try {
            await migrateToLatest()
            return
        } catch (err) {
            const attempt = i + 1
            console.log(
                `DB not ready (attempt ${attempt}/${attempts}), retrying in ${delayMs}ms...`,
            )

            if (attempt === attempts) {
                throw err
            }

            await new Promise((res) => setTimeout(res, delayMs))
        }
    }
}


//executes migrations w/retries only when invoked directly from CLI
if (require.main === module) {
    migrateWithRetry()
        .then(async () => {
            await db.destroy()
            process.exit(0)
        })
        .catch(async (err) => {
            console.error('failed to migrate after retries')
            console.error(err)
            await db.destroy()
            process.exit(1)
        })
}
