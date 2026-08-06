import type { APIRoute } from 'astro';
import { ADMIN_COOKIE, COOKIE_OPTIONS } from '../../lib/admin-auth';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete(ADMIN_COOKIE, { path: COOKIE_OPTIONS.path });
  return redirect('/admin/login', 303);
};
