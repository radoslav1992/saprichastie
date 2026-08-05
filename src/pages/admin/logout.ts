import type { APIRoute } from 'astro';
import { ADMIN_COOKIE, COOKIE_OPTIONS } from '../../lib/admin-auth';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete(ADMIN_COOKIE, { ...COOKIE_OPTIONS, maxAge: undefined });
  return redirect('/admin/login', 303);
};
