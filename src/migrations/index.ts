import * as migration_20250516_145223_initial from './20250516_145223_initial';
import * as migration_20250722_083627 from './20250722_083627';

export const migrations = [
  {
    up: migration_20250516_145223_initial.up,
    down: migration_20250516_145223_initial.down,
    name: '20250516_145223_initial',
  },
  {
    up: migration_20250722_083627.up,
    down: migration_20250722_083627.down,
    name: '20250722_083627'
  },
];
