import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'nextdestination';


const COLLECTION_DESTINATIONS = process.env.COLLECTION_DESTINATIONS || 'destinations';
const COLLECTION_JOURNALS = process.env.COLLECTION_JOURNALS || 'journals';

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in .env');
  process.exit(1);
}

const cities = [
  'Tokyo','Osaka','Kyoto','Seoul','Taipei','Hong Kong','Bangkok','Singapore','Bali','Sydney',
  'Vancouver','Seattle','San Francisco','Los Angeles','New York','Boston','Paris','London','Rome',
  'Barcelona','Lisbon','Berlin','Amsterdam','Prague','Vienna','Istanbul','Dubai','Mexico City',
  'Lima','Buenos Aires','Rio de Janeiro'
];

const vibes = [
  'food crawl','museum day','street photography','hiking','beach time','night markets',
  'coffee tour','architecture walk','temples','shopping','art galleries','local trains'
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

function makeDestination(i) {
  const place = pick(cities);
  return {
    name: `${place} #${i + 1}`,
    description: `Plan a ${pick(vibes)} in ${place}.`,
    budget: randInt(300, 4000),
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

function makeJournal(i) {
  const place = pick(cities);
  return {
    destinationId: null,
    name: `${place} (Visited) #${i + 1}`,
    description: `Remember the ${pick(vibes)} in ${place}.`,
    budget: randInt(300, 4000),
    rating: randInt(1, 5),
    review: `Highlights: ${pick(vibes)}, ${pick(vibes)}. Would go again.`,
    visitedAt: new Date(Date.now() - randInt(1, 900) * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

const client = new MongoClient(MONGODB_URI);
await client.connect();

const db = client.db(DB_NAME);
const destinations = db.collection(COLLECTION_DESTINATIONS);
const journals = db.collection(COLLECTION_JOURNALS);

console.log('Clearing collections...');
await destinations.deleteMany({});
await journals.deleteMany({});

console.log('Inserting 1000+ records...');
const plannedDocs = Array.from({ length: 600 }, (_, i) => makeDestination(i));
const journalDocs = Array.from({ length: 450 }, (_, i) => makeJournal(i));

await destinations.insertMany(plannedDocs);
await journals.insertMany(journalDocs);

console.log('Done. Inserted:', {
  destinations: plannedDocs.length,
  journals: journalDocs.length,
  total: plannedDocs.length + journalDocs.length
});

await client.close();