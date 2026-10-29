import { DurableObject } from 'cloudflare:workers';
import { CounterCore } from './core.js';
import { handle } from './handler.js';

const PURGE_EVERY_MS = 24 * 60 * 60 * 1000;

// One instance (named "main") holds every total. SQLite storage, which the Workers Free plan supports.
export class Counter extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    const sql = ctx.storage.sql;
    this.core = new CounterCore((q, ...p) => sql.exec(q, ...p).toArray(), fn => ctx.storage.transactionSync(fn));
    ctx.blockConcurrencyWhile(async () => {
      if (!(await ctx.storage.getAlarm())) await ctx.storage.setAlarm(Date.now() + PURGE_EVERY_MS);
    });
  }
  async alarm() {
    this.core.purge();
    await this.ctx.storage.setAlarm(Date.now() + PURGE_EVERY_MS);
  }
  note(rec) { return this.core.note(rec); }
  rows(a) { return this.core.rows(a); }
}

export default { fetch: (request, env) => handle(request, env) };
