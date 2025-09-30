import { Hono, Context } from "hono";
import { jwt, sign } from 'hono/jwt'
import type { Env } from './core-utils';
import { UserEntity, HabitEntity } from "./entities";
import { ok, bad, notFound, Index } from './core-utils';
import { Habit, User, HabitLog } from "@shared/types";
async function hashPassword(password: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  const auth = new Hono<{ Bindings: Env }>();
  auth.post('/register', async (c) => {
    const body = await c.req.json<Partial<User>>();
    if (!body.email || !body.password || !body.name) {
      return bad(c, 'Name, email, and password are required');
    }
    const emailIndex = new UserEntity(c.env, `email:${body.email}`);
    if (await emailIndex.exists()) {
        return bad(c, 'User with this email already exists');
    }
    const hashedPassword = await hashPassword(body.password);
    const newUser: User = {
      id: crypto.randomUUID(),
      name: body.name,
      email: body.email,
      password: hashedPassword,
    };
    await UserEntity.create(c.env, newUser);
    const emailIdxEntity = new UserEntity(c.env, `email:${newUser.email}`);
    await emailIdxEntity.save({ ...UserEntity.initialState, id: newUser.id });
    const { password, ...userResponse } = newUser;
    return ok(c, userResponse);
  });
  auth.post('/login', async (c) => {
    const body = await c.req.json<{ email?: string; password?: string }>();
    if (!body.email || !body.password) {
      return bad(c, 'Email and password are required');
    }
    const emailIndex = new UserEntity(c.env, `email:${body.email}`);
    if (!await emailIndex.exists()) {
        return notFound(c, 'Invalid credentials');
    }
    const { id: userId } = await emailIndex.getState();
    const userEntity = new UserEntity(c.env, userId);
    if (!await userEntity.exists()) {
      return notFound(c, 'Invalid credentials');
    }
    const user = await userEntity.getState();
    const hashedPassword = await hashPassword(body.password);
    if (user.password !== hashedPassword) {
      return notFound(c, 'Invalid credentials');
    }
    const payload = {
      sub: user.id,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
    };
    const secret = c.env.JWT_SECRET || 'a-secure-secret-for-dev';
    const token = await sign(payload, secret);
    const { password, ...userResponse } = user;
    return ok(c, { user: userResponse, token });
  });
  app.route('/api/auth', auth);
  const api = new Hono<{ Bindings: Env, Variables: { user: { id: string } } }>();
  api.use('*', jwt({ secret: (c: Context): string => c.env.JWT_SECRET || 'a-secure-secret-for-dev' }));
  api.use('*', async (c, next) => {
    try {
      const payload = c.get('jwtPayload');
      if (payload && payload.sub) {
        c.set('user', { id: payload.sub as string });
        await next();
      } else {
        return c.json({ success: false, error: 'Unauthorized: Invalid token payload' }, 401);
      }
    } catch (e) {
      return c.json({ success: false, error: 'Unauthorized: Invalid token' }, 401);
    }
  });
  api.put('/user/profile', async (c) => {
    const userId = c.get('user').id;
    const body = await c.req.json<{ name?: string }>();
    if (!body.name) return bad(c, 'Name is required');
    const userEntity = new UserEntity(c.env, userId);
    if (!await userEntity.exists()) return notFound(c, 'User not found');
    const updatedUser = await userEntity.mutate(current => ({ ...current, name: body.name as string }));
    const { password, ...userResponse } = updatedUser;
    return ok(c, userResponse);
  });
  api.get('/habits', async (c) => {
    const userId = c.get('user').id;
    const habitIndex = new Index<string>(c.env, `habits:${userId}`);
    const habitIds = await habitIndex.list();
    const habits = await Promise.all(
      habitIds.map(id => new HabitEntity(c.env, id).getState())
    );
    return ok(c, { items: habits, next: null });
  });
  api.post('/habits', async (c) => {
    const body = await c.req.json<Partial<Habit>>();
    const userId = c.get('user').id;
    if (!body.name) return bad(c, 'Habit name is required');
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      userId,
      name: body.name,
      color: body.color || '#3b82f6',
      frequency: body.frequency || { type: 'daily' },
      logs: [],
      goal: body.goal,
      createdAt: Date.now(),
    };
    await HabitEntity.create(c.env, newHabit);
    const habitIndex = new Index<string>(c.env, `habits:${userId}`);
    await habitIndex.add(newHabit.id);
    return ok(c, newHabit);
  });
  api.put('/habits/:id', async (c) => {
    const id = c.req.param('id');
    const userId = c.get('user').id;
    const body = await c.req.json<Partial<Habit>>();
    const habitEntity = new HabitEntity(c.env, id);
    if (!await habitEntity.exists()) return notFound(c, 'Habit not found');
    const currentHabit = await habitEntity.getState();
    if (currentHabit.userId !== userId) {
      return c.json({ success: false, error: 'Forbidden' }, 403);
    }
    const { logs, ...updateData } = body;
    const updatedHabit = await habitEntity.mutate(current => ({ ...current, ...updateData }));
    return ok(c, updatedHabit);
  });
  api.post('/habits/:id/log', async (c) => {
    const id = c.req.param('id');
    const userId = c.get('user').id;
    const body = await c.req.json<{ date: string; value: number }>();
    if (!body.date || body.value === undefined) return bad(c, 'Date and value are required');
    const habitEntity = new HabitEntity(c.env, id);
    if (!await habitEntity.exists()) return notFound(c, 'Habit not found');
    const currentHabit = await habitEntity.getState();
    if (currentHabit.userId !== userId) {
      return c.json({ success: false, error: 'Forbidden' }, 403);
    }
    const updatedHabit = await habitEntity.mutate(current => {
      const newLog: HabitLog = { date: body.date, value: body.value };
      const updatedLogs = current.logs.filter(log => log.date !== body.date);
      updatedLogs.push(newLog);
      return { ...current, logs: updatedLogs };
    });
    return ok(c, updatedHabit);
  });
  api.delete('/habits/:id', async (c) => {
    const id = c.req.param('id');
    const userId = c.get('user').id;
    const habitEntity = new HabitEntity(c.env, id);
    if (!await habitEntity.exists()) return notFound(c, 'Habit not found');
    const currentHabit = await habitEntity.getState();
    if (currentHabit.userId !== userId) {
      return c.json({ success: false, error: 'Forbidden' }, 403);
    }
    const deleted = await HabitEntity.delete(c.env, id);
    if (!deleted) return notFound(c, 'Habit not found');
    const habitIndex = new Index<string>(c.env, `habits:${userId}`);
    await habitIndex.remove(id);
    return ok(c, { id, deleted });
  });
  app.route('/api', api);
}