import * as migration_20260630_184436 from './20260630_184436';
import * as migration_20260708_142647 from './20260708_142647';

export const migrations = [
  {
    up: migration_20260630_184436.up,
    down: migration_20260630_184436.down,
    name: '20260630_184436',
  },
  {
    up: migration_20260708_142647.up,
    down: migration_20260708_142647.down,
    name: '20260708_142647'
  },
];
