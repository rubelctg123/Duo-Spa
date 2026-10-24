import dotenv from 'dotenv';
import { MongoClient, type Db } from 'mongodb';
import { calculateAvailability } from '../lib/availability.js';
import { createBookingAtomic, type CreateBookingInput } from '../lib/bookingEngine.js';

dotenv.config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'duo_spa';

if (!uri) {
  console.error('❌ MONGODB_URI is not set in .env.local');
  process.exit(1);
}

// Test harness helper
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

async function runTests() {
  console.log('🧪 Starting Duo Spa API & Atomic Concurrency Test Suite...\n');
  const client = new MongoClient(uri!);
  await client.connect();
  const db: Db = client.db(dbName);

  const testCleanupCodes: string[] = [];

  try {
    // =========================================================================
    // Test 1: Services Catalog Retrieval
    // =========================================================================
    console.log('📌 Test Suite 1: Services Catalog');
    const services = await db.collection('services').find({ isActive: true }).toArray();
    assert(services.length === 8, 'Services count equals 8 active treatments', `Found ${services.length}`);
    const duoService = services.find((s) => s.format === 'duo');
    assert(Boolean(duoService), 'Duo service is present in catalog');
    assert(Boolean(duoService?.pricePerPerson && duoService?.totalPrice), 'Duo pricing structure is valid');

    // =========================================================================
    // Test 2: Availability Calculation (Open Day vs Closed Monday)
    // =========================================================================
    console.log('\n📌 Test Suite 2: Availability Calculation');

    // 2a. A Tuesday (Open day, e.g. 2026-11-17 is a Tuesday)
    const openDayResult = await calculateAvailability(db, {
      serviceId: duoService!.slug || duoService!._id.toString(),
      date: '2026-11-17',
    });
    assert(openDayResult.success === true, 'Availability on Tuesday returns success: true');
    assert(openDayResult.isClosed === false, 'Tuesday is marked as open (isClosed: false)');
    assert(openDayResult.slots.length > 0, 'Time slots array is non-empty');
    assert(openDayResult.slots[0].available === true, 'Slot 09:30 is initially available');

    // 2b. A Monday (Closed day, e.g. 2026-11-16 is a Monday)
    const mondayResult = await calculateAvailability(db, {
      serviceId: duoService!.slug || duoService!._id.toString(),
      date: '2026-11-16',
    });
    assert(mondayResult.success === true, 'Availability on Monday returns success: true');
    assert(mondayResult.isClosed === true, 'Monday is correctly marked as closed (isClosed: true)');
    assert(
      mondayResult.slots.every((s) => !s.available),
      'All slots on Monday are marked available: false'
    );

    // =========================================================================
    // Test 3: Input Validation on Booking Creation
    // =========================================================================
    console.log('\n📌 Test Suite 3: Input Validation Guards');

    // 3a. Invalid email
    const invalidEmailResult = await createBookingAtomic(client, db, {
      serviceId: duoService!.slug,
      date: '2026-11-17',
      timeSlot: '11:00',
      primaryGuest: {
        firstName: 'Jean',
        lastName: 'Tremblay',
        email: 'not-an-email',
        phone: '(450) 555-1234',
      },
      secondGuest: {
        firstName: 'Marie',
        lastName: 'Tremblay',
        email: 'marie@example.com',
        phone: '(450) 555-5678',
      },
      acceptedPolicy: true,
      acceptedPrivacy: true,
    });
    assert(invalidEmailResult.success === false && invalidEmailResult.statusCode === 400, 'Rejects invalid email with HTTP 400');

    // 3b. Missing 2nd guest on duo service
    const missingGuest2Result = await createBookingAtomic(client, db, {
      serviceId: duoService!.slug,
      date: '2026-11-17',
      timeSlot: '11:00',
      primaryGuest: {
        firstName: 'Jean',
        lastName: 'Tremblay',
        email: 'jean@example.com',
        phone: '(450) 555-1234',
      },
      acceptedPolicy: true,
      acceptedPrivacy: true,
    });
    assert(missingGuest2Result.success === false && missingGuest2Result.statusCode === 400, 'Rejects duo booking without 2nd guest details');

    // 3c. Unaccepted policy
    const policyResult = await createBookingAtomic(client, db, {
      serviceId: duoService!.slug,
      date: '2026-11-17',
      timeSlot: '11:00',
      primaryGuest: {
        firstName: 'Jean',
        lastName: 'Tremblay',
        email: 'jean@example.com',
        phone: '(450) 555-1234',
      },
      secondGuest: {
        firstName: 'Marie',
        lastName: 'Tremblay',
        email: 'marie@example.com',
        phone: '(450) 555-5678',
      },
      acceptedPolicy: false,
      acceptedPrivacy: true,
    });
    assert(policyResult.success === false && policyResult.statusCode === 400, 'Rejects booking when cancellation policy is not accepted');

    // =========================================================================
    // Test 4: Successful Atomic Booking Creation
    // =========================================================================
    console.log('\n📌 Test Suite 4: Successful Atomic Booking');
    const validBookingPayload: CreateBookingInput = {
      serviceId: duoService!.slug,
      selectedAddonIds: ['addon-aroma'],
      date: '2026-11-17',
      timeSlot: '14:45',
      primaryGuest: {
        firstName: 'TestCustomer1',
        lastName: 'AutomatedTest',
        email: 'testcustomer1@duospa-test.internal',
        phone: '(450) 555-9901',
      },
      secondGuest: {
        firstName: 'TestCustomer2',
        lastName: 'AutomatedTest',
        email: 'testcustomer2@duospa-test.internal',
        phone: '(450) 555-9902',
      },
      acceptedPolicy: true,
      acceptedPrivacy: true,
    };

    const book1 = await createBookingAtomic(client, db, validBookingPayload);
    assert(book1.success === true && book1.statusCode === 201, 'Booking 1 created successfully with HTTP 201');
    assert(book1.bookingCode?.startsWith('DUO-JOL-') === true, 'Booking code format matches DUO-JOL-XXXXX');
    assert(book1.booking?.assignedRoomName?.includes('Suite Duo') === true, 'Assigned to a physical Duo Suite');
    assert(book1.booking?.assignedTherapistIds?.length === 2, 'Assigned exactly 2 synchronized therapists');

    if (book1.bookingCode) testCleanupCodes.push(book1.bookingCode);

    // =========================================================================
    // Test 5: Concurrency & Overlap Prevention (Simultaneous Overbooking Attempts)
    // =========================================================================
    console.log('\n📌 Test Suite 5: Simultaneous Booking & Concurrency Collision Test');

    // Booking 2 at the exact same hour (14:45): Duo Spa has 2 suites, so booking 2 should take Suite 2 + remaining 2 therapists
    const validBookingPayload2: CreateBookingInput = {
      ...validBookingPayload,
      primaryGuest: {
        firstName: 'TestCustomer3',
        lastName: 'AutomatedTest',
        email: 'testcustomer3@duospa-test.internal',
        phone: '(450) 555-9903',
      },
      secondGuest: {
        firstName: 'TestCustomer4',
        lastName: 'AutomatedTest',
        email: 'testcustomer4@duospa-test.internal',
        phone: '(450) 555-9904',
      },
    };
    const book2 = await createBookingAtomic(client, db, validBookingPayload2);
    assert(book2.success === true && book2.statusCode === 201, 'Booking 2 takes the second duo suite and remaining staff');
    if (book2.bookingCode) testCleanupCodes.push(book2.bookingCode);

    // Now all 2 duo suites and 4 therapists are 100% booked for 14:45 on 2026-11-17!
    // Now fire TWO SIMULTANEOUS booking requests for the exact same exhausted slot:
    const attempt3Payload: CreateBookingInput = {
      ...validBookingPayload,
      primaryGuest: { ...validBookingPayload.primaryGuest, email: 'attempt3@duospa-test.internal' },
    };
    const attempt4Payload: CreateBookingInput = {
      ...validBookingPayload,
      primaryGuest: { ...validBookingPayload.primaryGuest, email: 'attempt4@duospa-test.internal' },
    };

    console.log('  ⚡ Firing 2 simultaneous concurrent booking attempts on the exhausted slot...');
    const [result3, result4] = await Promise.all([
      createBookingAtomic(client, db, attempt3Payload),
      createBookingAtomic(client, db, attempt4Payload),
    ]);

    assert(
      result3.success === false && result3.statusCode === 409,
      'Concurrent attempt 3 was rejected with HTTP 409 Conflict'
    );
    assert(
      result4.success === false && result4.statusCode === 409,
      'Concurrent attempt 4 was rejected with HTTP 409 Conflict'
    );
    assert(
      result3.error?.includes('disponible') === true,
      'Conflict returned user-friendly French explanation'
    );

    // =========================================================================
    // Test 6: Verify Real Availability Reflects Bookings
    // =========================================================================
    console.log('\n📌 Test Suite 6: Post-Booking Availability Reflection');
    const postBookingAvailability = await calculateAvailability(db, {
      serviceId: duoService!.slug,
      date: '2026-11-17',
    });

    const slot1445 = postBookingAvailability.slots.find((s) => s.time === '14:45');
    assert(slot1445?.available === false, 'Slot 14:45 now accurately reports available: false');
    assert(Boolean(slot1445?.reason), 'Slot 14:45 provides reason for unavailability');

    const otherSlot = postBookingAvailability.slots.find((s) => s.time === '09:30');
    assert(otherSlot?.available === true, 'Other time slot (09:30) remains available: true');
  } finally {
    // =========================================================================
    // Test Cleanup: Remove ONLY the test bookings created during this test run
    // =========================================================================
    if (testCleanupCodes.length > 0) {
      console.log(`\n🧹 Cleaning up ${testCleanupCodes.length} test bookings...`);
      const deleteResult = await db.collection('bookings').deleteMany({
        bookingCode: { $in: testCleanupCodes },
      });
      console.log(`  ✅ Cleaned up ${deleteResult.deletedCount} test records.`);
    }

    await client.close();
  }

  console.log('\n========================================');
  console.log(`🎯 Test Summary: ${passedCount} Passed | ${failedCount} Failed`);
  console.log('========================================');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
