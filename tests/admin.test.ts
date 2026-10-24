import http from 'node:http';
import dotenv from 'dotenv';
import { getClient } from '../lib/mongodb.js';
import loginHandler from '../api/auth/login.js';
import logoutHandler from '../api/auth/logout.js';
import meHandler from '../api/auth/me.js';
import statsHandler from '../api/admin/stats.js';
import bookingsHandler from '../api/admin/bookings.js';
import servicesHandler from '../api/admin/services.js';
import therapistsHandler from '../api/admin/therapists.js';
import roomsHandler from '../api/admin/rooms.js';

dotenv.config({ path: '.env.local' });

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;
const jwtSecret = process.env.JWT_SECRET;

if (!adminEmail || !adminPassword || !jwtSecret) {
  console.error('❌ Missing admin credentials or JWT_SECRET in .env.local');
  process.exit(1);
}

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedCount++;
  } else {
    console.error(`  ❌ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
    failedCount++;
  }
}

async function runAdminTests() {
  console.log('🧪 Starting Duo Spa Admin Auth & Management Test Suite...\n');

  // Create lightweight local server with live handlers
  const server = http.createServer(async (req, res) => {
    const urlObj = new URL(req.url || '/', `http://${req.headers.host || '127.0.0.1'}`);
    const pathname = urlObj.pathname;

    try {
      if (pathname === '/api/auth/login') {
        return await loginHandler(req as any, res as any);
      }
      if (pathname === '/api/auth/logout') {
        return await logoutHandler(req as any, res as any);
      }
      if (pathname === '/api/auth/me') {
        return await meHandler(req as any, res as any);
      }
      if (pathname === '/api/admin/stats') {
        return await statsHandler(req as any, res as any);
      }
      if (pathname === '/api/admin/bookings') {
        return await bookingsHandler(req as any, res as any);
      }
      if (pathname === '/api/admin/services') {
        return await servicesHandler(req as any, res as any);
      }
      if (pathname === '/api/admin/therapists') {
        return await therapistsHandler(req as any, res as any);
      }
      if (pathname === '/api/admin/rooms') {
        return await roomsHandler(req as any, res as any);
      }

      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Route not found' }));
    } catch (err: any) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: err.message }));
    }
  });

  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve());
  });

  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Server address could not be resolved');
  }
  const baseUrl = `http://127.0.0.1:${address.port}`;

  let authCookie = '';
  let authToken = '';

  try {
    // =========================================================================
    // Test 1: Unauthenticated Access to Protected Endpoints (Expect 401)
    // =========================================================================
    console.log('📌 Test Suite 1: Unauthenticated Access Guards (HTTP 401)');

    const unauthStatsRes = await fetch(`${baseUrl}/api/admin/stats`);
    assert(unauthStatsRes.status === 401, 'GET /api/admin/stats rejects unauthenticated caller with 401');

    const unauthBookingsRes = await fetch(`${baseUrl}/api/admin/bookings`);
    assert(unauthBookingsRes.status === 401, 'GET /api/admin/bookings rejects unauthenticated caller with 401');

    const unauthServicesRes = await fetch(`${baseUrl}/api/admin/services`);
    assert(unauthServicesRes.status === 401, 'GET /api/admin/services rejects unauthenticated caller with 401');

    const unauthTherapistsRes = await fetch(`${baseUrl}/api/admin/therapists`);
    assert(unauthTherapistsRes.status === 401, 'GET /api/admin/therapists rejects unauthenticated caller with 401');

    const unauthRoomsRes = await fetch(`${baseUrl}/api/admin/rooms`);
    assert(unauthRoomsRes.status === 401, 'GET /api/admin/rooms rejects unauthenticated caller with 401');

    const unauthMeRes = await fetch(`${baseUrl}/api/auth/me`);
    assert(unauthMeRes.status === 401, 'GET /api/auth/me rejects unauthenticated caller with 401');

    // =========================================================================
    // Test 2: Invalid Login Attempts
    // =========================================================================
    console.log('\n📌 Test Suite 2: Invalid Login Verification');

    // 2a. Missing credentials (empty body)
    const emptyLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    assert(emptyLoginRes.status === 400, 'Rejects empty login payload with HTTP 400');

    // 2b. Non-existent email
    const nonExistentRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'unknown-admin@duospa.ca', password: 'SomePassword123!' }),
    });
    assert(nonExistentRes.status === 401, 'Rejects unknown admin email with HTTP 401');

    // 2c. Wrong password
    const wrongPasswordRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminEmail, password: 'DefinitivelyWrongPassword123!' }),
    });
    assert(wrongPasswordRes.status === 401, 'Rejects incorrect password with HTTP 401');

    // =========================================================================
    // Test 3: Successful Admin Login & Session Cookie Generation
    // =========================================================================
    console.log('\n📌 Test Suite 3: Successful Admin Authentication');

    const validLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminEmail, password: adminPassword }),
    });

    assert(validLoginRes.status === 200, 'Valid credentials return HTTP 200');

    const loginData = await validLoginRes.json();
    assert(loginData.success === true, 'Login response has success: true');
    assert(loginData.admin?.role === 'superadmin', 'Admin role is superadmin');
    assert(typeof loginData.token === 'string' && loginData.token.split('.').length === 3, 'Returns valid 3-part HS256 JWT');
    authToken = loginData.token;

    // Check Set-Cookie header
    const setCookieHeader = validLoginRes.headers.get('set-cookie');
    assert(Boolean(setCookieHeader), 'Login response sets Set-Cookie header');
    assert(setCookieHeader?.includes('duo_admin_token='), 'Cookie name is duo_admin_token');
    assert(setCookieHeader?.includes('HttpOnly'), 'Cookie is flagged HttpOnly');
    assert(setCookieHeader?.includes('SameSite=Strict'), 'Cookie is flagged SameSite=Strict');

    if (setCookieHeader) {
      // Extract the raw cookie name=value for subsequent requests
      const cookieMatch = setCookieHeader.match(/duo_admin_token=[^;]+/);
      if (cookieMatch) {
        authCookie = cookieMatch[0];
      }
    }
    assert(Boolean(authCookie), 'Extracted duo_admin_token for session requests');

    // =========================================================================
    // Test 4: Session Identity Verification (/api/auth/me)
    // =========================================================================
    console.log('\n📌 Test Suite 4: Admin Session Introspection (/api/auth/me)');

    // 4a. Via HttpOnly Cookie
    const meCookieRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Cookie: authCookie },
    });
    assert(meCookieRes.status === 200, 'GET /api/auth/me with session cookie returns HTTP 200');
    const meCookieData = await meCookieRes.json();
    assert(meCookieData.admin?.email?.toLowerCase() === adminEmail.toLowerCase(), 'Identity email matches logged-in admin');
    assert(meCookieData.admin?.role === 'superadmin', 'Identity role matches superadmin');

    // 4b. Via Authorization: Bearer <token>
    const meBearerRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    assert(meBearerRes.status === 200, 'GET /api/auth/me with Bearer token returns HTTP 200');

    // =========================================================================
    // Test 5: Protected Admin Endpoints with Authenticated Session
    // =========================================================================
    console.log('\n📌 Test Suite 5: Protected Admin Endpoints Execution');

    // 5a. Admin Stats Dashboard KPIs
    const statsRes = await fetch(`${baseUrl}/api/admin/stats`, {
      headers: { Cookie: authCookie },
    });
    assert(statsRes.status === 200, 'GET /api/admin/stats returns HTTP 200');
    const statsData = await statsRes.json();
    assert(typeof statsData.stats?.totalBookings === 'number', 'Stats contains totalBookings count');
    assert(typeof statsData.stats?.upcomingBookings === 'number', 'Stats contains upcomingBookings count');
    assert(typeof statsData.stats?.todayAppointments === 'number', 'Stats contains todayAppointments count');
    assert(typeof statsData.stats?.cancelledBookings === 'number', 'Stats contains cancelledBookings count');
    assert(statsData.stats?.servicesCount === 8, 'Stats reports exactly 8 catalog services');
    assert(statsData.stats?.therapistsCount === 4, 'Stats reports 4 staff members');
    assert(statsData.stats?.roomsCount === 3, 'Stats reports 3 spa rooms');

    // 5b. Admin Bookings List
    const bookingsRes = await fetch(`${baseUrl}/api/admin/bookings`, {
      headers: { Cookie: authCookie },
    });
    assert(bookingsRes.status === 200, 'GET /api/admin/bookings returns HTTP 200');
    const bookingsData = await bookingsRes.json();
    assert(Array.isArray(bookingsData.bookings), 'Bookings endpoint returns an array of bookings');

    // 5c. Admin Services List
    const servicesRes = await fetch(`${baseUrl}/api/admin/services`, {
      headers: { Cookie: authCookie },
    });
    assert(servicesRes.status === 200, 'GET /api/admin/services returns HTTP 200');
    const servicesData = await servicesRes.json();
    assert(servicesData.count === 8, 'Admin services returns all 8 treatments');

    // 5d. Admin Therapists (with Demo Data Notice)
    const therapistsRes = await fetch(`${baseUrl}/api/admin/therapists`, {
      headers: { Cookie: authCookie },
    });
    assert(therapistsRes.status === 200, 'GET /api/admin/therapists returns HTTP 200');
    const therapistsData = await therapistsRes.json();
    assert(therapistsData.isDemoData === true, 'Therapists payload flags isDemoData: true');
    assert(Boolean(therapistsData.demoNotice), 'Therapists payload includes demo data disclaimer');

    // 5e. Admin Rooms (with Demo Data Notice)
    const roomsRes = await fetch(`${baseUrl}/api/admin/rooms`, {
      headers: { Cookie: authCookie },
    });
    assert(roomsRes.status === 200, 'GET /api/admin/rooms returns HTTP 200');
    const roomsData = await roomsRes.json();
    assert(roomsData.isDemoData === true, 'Rooms payload flags isDemoData: true');
    assert(Boolean(roomsData.demoNotice), 'Rooms payload includes demo data disclaimer');

    // =========================================================================
    // Test 6: Safe Service Modification & Rollback (PATCH /api/admin/services)
    // =========================================================================
    console.log('\n📌 Test Suite 6: Safe Service Price/Duration Editing & Rollback');

    const targetService = servicesData.services[0];
    const originalPrice = targetService.pricePerPerson;
    const testNewPrice = originalPrice + 5;

    // Apply test update
    const patchRes = await fetch(`${baseUrl}/api/admin/services`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: authCookie,
      },
      body: JSON.stringify({
        serviceId: targetService.slug,
        pricePerPerson: testNewPrice,
      }),
    });
    assert(patchRes.status === 200, 'PATCH /api/admin/services updates price successfully with HTTP 200');
    const patchData = await patchRes.json();
    assert(patchData.service?.pricePerPerson === testNewPrice, 'Updated price reflects in database response');

    // Immediately restore original price to maintain catalog integrity
    const restoreRes = await fetch(`${baseUrl}/api/admin/services`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: authCookie,
      },
      body: JSON.stringify({
        serviceId: targetService.slug,
        pricePerPerson: originalPrice,
      }),
    });
    assert(restoreRes.status === 200, 'Restored original service price with HTTP 200');
    const restoreData = await restoreRes.json();
    assert(restoreData.service?.pricePerPerson === originalPrice, 'Catalog integrity fully preserved');

    // =========================================================================
    // Test 7: Admin Logout (/api/auth/logout)
    // =========================================================================
    console.log('\n📌 Test Suite 7: Admin Session Termination (Logout)');

    const logoutRes = await fetch(`${baseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: { Cookie: authCookie },
    });
    assert(logoutRes.status === 200, 'POST /api/auth/logout returns HTTP 200');
    const logoutData = await logoutRes.json();
    assert(logoutData.success === true, 'Logout returns success: true');

    const logoutCookieHeader = logoutRes.headers.get('set-cookie');
    assert(Boolean(logoutCookieHeader), 'Logout returns Set-Cookie header');
    assert(
      logoutCookieHeader?.includes('Max-Age=0') || logoutCookieHeader?.includes('Expires='),
      'Set-Cookie instructs browser to clear duo_admin_token'
    );

    // =========================================================================
    // Test 8: Post-Logout Invalidation & Access Rejection
    // =========================================================================
    console.log('\n📌 Test Suite 8: Post-Logout Access Denial');

    // Attempting access with the cleared cookie value
    const postLogoutCookieMatch = logoutCookieHeader?.match(/duo_admin_token=[^;]*/);
    const clearedCookie = postLogoutCookieMatch ? postLogoutCookieMatch[0] : 'duo_admin_token=';

    const postLogoutMeRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Cookie: clearedCookie },
    });
    assert(postLogoutMeRes.status === 401, 'GET /api/auth/me with cleared cookie is rejected with HTTP 401');

    const postLogoutStatsRes = await fetch(`${baseUrl}/api/admin/stats`, {
      headers: { Cookie: clearedCookie },
    });
    assert(postLogoutStatsRes.status === 401, 'GET /api/admin/stats after logout is rejected with HTTP 401');
  } finally {
    server.close();
    try {
      const client = await getClient();
      await client.close();
    } catch {
      // ignore
    }
  }

  console.log('\n========================================');
  console.log(`🎯 Admin Test Summary: ${passedCount} Passed | ${failedCount} Failed`);
  console.log('========================================');

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAdminTests().catch((err) => {
  console.error('Fatal error during admin test run:', err);
  process.exit(1);
});
