createSnapshotOfLocal();

async function createSnapshotOfLocal() {
  // eslint-disable-next-line
  const { execSync } = require('child_process');

  console.log('========== Create Snapshot ==========');

  const now = new Date();
  const inquirer = await import('inquirer');
  const { name } =
    (await (inquirer as any).default.prompt({
      message: 'enter a name for the snapshot',
      name: 'name',
    })) || now.toISOString();

  execSync(
    `PGPASSWORD=$POKEMON_DB_POSTGRES_PASSWORD pg_dump -h $POKEMON_DB_POSTGRES_HOST -p 5432 -U postgres -a --inserts -f libs/pokemon-db/supabase/snapshots/prod-${name}.sql -t public.pokemon -t public.moves -t public.learnable_moves`
  );
}
