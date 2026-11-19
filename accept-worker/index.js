import { DurableObject } from 'cloudflare:workers';
import { AcceptCore } from './core.js';
import { handle } from './handler.js';
import { forwardEmailSender } from './mail.js';

const PURGE_EVERY_MS = 24 * 60 * 60 * 1000;

// One instance (named "main") holds every link. SQLite storage, which the Workers Free plan supports.
export class Accept extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    const sql = ctx.storage.sql;
    const mail = env.MAIL_TOKEN && env.MAIL_FROM ? forwardEmailSender({ token: env.MAIL_TOKEN, from: env.MAIL_FROM }) : null;
    this.core = new AcceptCore((q, ...p) => sql.exec(q, ...p).toArray(), fn => ctx.storage.transactionSync(fn), { mail, siteUrl: env.SITE_URL });
    ctx.blockConcurrencyWhile(async () => {
      if (!(await ctx.storage.getAlarm())) await ctx.storage.setAlarm(Date.now() + PURGE_EVERY_MS);
    });
  }
  async alarm() {
    this.core.purge();
    await this.ctx.storage.setAlarm(Date.now() + PURGE_EVERY_MS);
  }
  create(b) { return this.core.create(b); }
  view(id, o) { return this.core.view(id, o); }
  accept(id, b) { return this.core.accept(id, b); }
  status(codes) { return this.core.status(codes); }
}

export default {
  fetch: (request, env) => handle(request, env, { stub: env.ACCEPT.get(env.ACCEPT.idFromName('main')) }),
};
