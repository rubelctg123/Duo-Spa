import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import { SAMPLE_TREATMENTS } from '../src/data/treatmentsData';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'duo_spa';
const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const adminInitialPassword = process.env.ADMIN_INITIAL_PASSWORD;

async function seed() {
  if (!uri) {
    console.error('❌ MONGODB_URI is not defined. Please create .env.local based on .env.example.');
    process.exit(1);
  }

  console.log('🌿 Connecting to MongoDB Atlas...');
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    console.log(`✅ Connected successfully to database: "${dbName}"`);

    // =========================================================================
    // 1. Seed / Upsert Services (Treatments & Packages)
    // =========================================================================
    console.log('\n📦 Seeding services catalog from mock data...');
    const servicesCollection = db.collection('services');

    let upsertedCount = 0;
    for (const treatment of SAMPLE_TREATMENTS) {
      const doc = {
        slug: treatment.id,
        name: treatment.name,
        category: treatment.category,
        format: treatment.format,
        durationMinutes: treatment.durationMinutes,
        durationLabel: treatment.durationLabel,
        pricePerPerson: treatment.pricePerPerson,
        totalPrice: treatment.totalPrice,
        badge: treatment.badge || null,
        popular: Boolean(treatment.popular),
        shortDescription: treatment.shortDescription,
        fullDescription: treatment.fullDescription,
        benefits: treatment.benefits,
        includes: treatment.includes,
        restrictions: treatment.restrictions || null,
        image: treatment.image,
        availableAddons: treatment.availableAddons,
        isActive: true,
        updatedAt: new Date(),
      };

      await servicesCollection.updateOne(
        { slug: treatment.id },
        {
          $set: doc,
          $setOnInsert: { createdAt: new Date() }
        },
        { upsert: true }
      );
      upsertedCount++;
    }
    console.log(`✅ Services synced: ${upsertedCount} treatments verified/upserted.`);

    // =========================================================================
    // 2. Seed Default Physical Rooms & Suites
    // =========================================================================
    console.log('\n🚪 Checking rooms collection...');
    const roomsCollection = db.collection('rooms');
    const existingRoomsCount = await roomsCollection.countDocuments();

    if (existingRoomsCount === 0) {
      const initialRooms = [
        {
          name: 'Suite Duo Cocon',
          type: 'duo_suite',
          capacity: 2,
          description: 'Suite privative spacieuse avec deux tables de massage synchronisées et éclairage tamisé.',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Suite Duo Sérénité',
          type: 'duo_suite',
          capacity: 2,
          description: 'Deuxième suite duo équipée d’un espace de détente privatif et aromathérapie intégrée.',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Cabine Solo Harmonie',
          type: 'solo_cabin',
          capacity: 1,
          description: 'Cabine individuelle feutrée dédiée aux soins de massothérapie et soins du visage solo.',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      await roomsCollection.insertMany(initialRooms);
      console.log(`✅ Inserted ${initialRooms.length} initial rooms/suites.`);
    } else {
      console.log(`ℹ️ Rooms collection already contains ${existingRoomsCount} entries. Skipping room seed.`);
    }

    // =========================================================================
    // 3. Seed Certified Therapists
    // =========================================================================
    console.log('\n💆 Checking therapists collection...');
    const therapistsCollection = db.collection('therapists');
    const existingTherapistsCount = await therapistsCollection.countDocuments();

    if (existingTherapistsCount === 0) {
      // Standard schedule: Tue-Sun 09:00 - 20:00 (Mondays closed)
      const standardSchedule = [
        { dayOfWeek: 0, isWorking: true, startHour: '09:00', endHour: '20:00' }, // Sunday
        { dayOfWeek: 1, isWorking: false, startHour: '09:00', endHour: '20:00' }, // Monday (closed)
        { dayOfWeek: 2, isWorking: true, startHour: '09:00', endHour: '20:00' }, // Tuesday
        { dayOfWeek: 3, isWorking: true, startHour: '09:00', endHour: '20:00' }, // Wednesday
        { dayOfWeek: 4, isWorking: true, startHour: '09:00', endHour: '20:00' }, // Thursday
        { dayOfWeek: 5, isWorking: true, startHour: '09:00', endHour: '20:00' }, // Friday
        { dayOfWeek: 6, isWorking: true, startHour: '09:00', endHour: '20:00' }, // Saturday
      ];

      const initialTherapists = [
        {
          name: 'Émilie Tremblay',
          email: 'emilie.t@example.com',
          phone: '(450) 555-0101',
          canDoDuo: true,
          skills: ['massage-suedois', 'tissus-profonds', 'visage', 'pierres-chaudes'],
          schedule: standardSchedule,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Maxime Gagnon',
          email: 'maxime.g@example.com',
          phone: '(450) 555-0102',
          canDoDuo: true,
          skills: ['massage-suedois', 'tissus-profonds', 'therapeutique'],
          schedule: standardSchedule,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Sophie Martin',
          email: 'sophie.m@example.com',
          phone: '(450) 555-0103',
          canDoDuo: true,
          skills: ['massage-suedois', 'visage', 'aromatherapie'],
          schedule: standardSchedule,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Camille Lavoie',
          email: 'camille.l@example.com',
          phone: '(450) 555-0104',
          canDoDuo: true,
          skills: ['massage-suedois', 'tissus-profonds', 'visage'],
          schedule: standardSchedule,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      await therapistsCollection.insertMany(initialTherapists);
      console.log(`✅ Inserted ${initialTherapists.length} initial therapists.`);
    } else {
      console.log(`ℹ️ Therapists collection already contains ${existingTherapistsCount} entries. Skipping therapist seed.`);
    }

    // =========================================================================
    // 4. One-Time Secure Admin User Initialization
    // =========================================================================
    console.log('\n🔐 Checking admin user status...');
    const adminUsersCollection = db.collection('adminUsers');
    const existingAdminCount = await adminUsersCollection.countDocuments();

    if (existingAdminCount > 0) {
      console.log(`ℹ️ Admin user already exists (${existingAdminCount} record found). Skipping admin creation.`);
    } else if (adminEmail && adminInitialPassword) {
      console.log('🔒 Initializing primary superadmin account...');
      const passwordHash = await bcrypt.hash(adminInitialPassword, 12);
      await adminUsersCollection.insertOne({
        email: adminEmail,
        passwordHash,
        name: 'Administrateur Principal',
        role: 'superadmin',
        isActive: true,
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('✅ Superadmin account successfully created.');
      console.log('💡 Security Reminder: You may now remove ADMIN_INITIAL_PASSWORD from your .env.local file.');
    } else {
      console.log('ℹ️ ADMIN_EMAIL and ADMIN_INITIAL_PASSWORD not detected in .env.local.');
      console.log('   (You can configure them later and run `npm run seed` to initialize your admin account).');
    }

    // =========================================================================
    // 5. Create Performance & Integrity Indexes
    // =========================================================================
    console.log('\n⚡ Setting up database indexes...');
    await servicesCollection.createIndex({ slug: 1 }, { unique: true });
    await servicesCollection.createIndex({ isActive: 1, category: 1 });
    await roomsCollection.createIndex({ type: 1, isActive: 1 });
    await therapistsCollection.createIndex({ isActive: 1, canDoDuo: 1 });
    await adminUsersCollection.createIndex({ email: 1 }, { unique: true });

    const bookingsCollection = db.collection('bookings');
    await bookingsCollection.createIndex({ bookingCode: 1 }, { unique: true });
    await bookingsCollection.createIndex({ startDateTime: 1, endDateTime: 1, status: 1 });
    await bookingsCollection.createIndex({ assignedRoomId: 1, startDateTime: 1, endDateTime: 1 });
    await bookingsCollection.createIndex({ assignedTherapistIds: 1, startDateTime: 1, endDateTime: 1 });
    console.log('✅ Database indexes successfully established.');

    console.log('\n🎉 Phase 1 seed script finished successfully!');
  } catch (error) {
    console.error('❌ Error during seeding process:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔒 Database connection closed.');
  }
}

seed();
