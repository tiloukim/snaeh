import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Khmer zodiac animal signs (same logic as app)
const animalSigns = [
  "Monkey", "Rooster", "Dog", "Pig", "Rat", "Ox",
  "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat",
];

function getAnimalSign(dateStr: string): string {
  return animalSigns[new Date(dateStr).getFullYear() % 12];
}

function calcAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDob(): string {
  const minAge = 20, maxAge = 35;
  const now = new Date();
  const year = now.getFullYear() - minAge - Math.floor(Math.random() * (maxAge - minAge + 1));
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// --- Name data ---
const maleFirst = [
  "Sokha", "Dara", "Vicheka", "Rithya", "Sophal", "Chantha", "Kosal", "Piseth",
  "Vuthy", "Makara", "Sambath", "Rattana", "Samnang", "Vibol", "Sokchea",
  "Narith", "Sokhom", "Pheakdey", "Veasna", "Vannak", "Rithy", "Sovann",
  "Kanha", "Sarath", "Bunna", "Kimheng", "Bora", "Ponleu", "Reaksmey", "Theara",
];

const femaleFirst = [
  "Sophea", "Chantrea", "Sreymom", "Bopha", "Mealea", "Kunthea", "Rachana",
  "Socheata", "Phalla", "Srey Leak", "Channary", "Thida", "Kolap", "Champa",
  "Neary", "Pichenda", "Romduol", "Sopheap", "Chenda", "Davy", "Mony",
  "Srey Pich", "Lina", "Nita", "Vanna", "Serey", "Sokunthea", "Botum", "Rany", "Mealea",
];

const lastNames = [
  "Sok", "Chan", "Chea", "Heng", "Kim", "Ly", "Mao", "Nhem", "Ouk", "Phan",
  "Sam", "Seng", "Tan", "Ung", "Vong", "Yin", "Kong", "Lim", "Pen", "Ros",
  "Suon", "Tep", "Sar", "Noun", "Keo", "Phon", "Long", "Touch", "Hem", "Khun",
];

// --- Bio templates ---
const maleBios = [
  "I love exploring temples and discovering hidden spots around Cambodia 🏛️",
  "Gym, good food, and good vibes. Looking for someone to share adventures with",
  "Software engineer by day, foodie by night. Let's grab boba together",
  "Passionate about photography and capturing beautiful moments",
  "Musician at heart. I play guitar and love live music nights in PP",
  "Traveler and dreamer. Been to 10 countries and counting",
  "I work in hospitality and know all the best restaurants in town",
  "Basketball player looking for my teammate in life",
  "Business owner who loves cooking Khmer food on weekends",
  "Architecture student fascinated by Angkorian design",
  "Coffee addict and bookworm. Let's talk over a latte",
  "I teach English and love learning about different cultures",
  "Motorbike enthusiast. Weekend rides to the countryside are my therapy",
  "Film buff and amateur director. Let's watch movies together",
  "Just moved back from Australia. Rediscovering my roots",
];

const femaleBios = [
  "Dancer and yoga lover. Looking for positive energy and genuine connections",
  "Pastry chef who loves creating sweet things — and sweet memories",
  "Marketing professional who enjoys sunset walks along the riverside",
  "Art lover and painter. My weekends are spent at galleries and cafes",
  "I run a small boutique and love fashion. Style is my language",
  "Nurse with a big heart. Compassion is my superpower",
  "Teaching kids by day, dancing by night. Life is too short to sit still",
  "Travel enthusiast. My dream is to visit every ASEAN country",
  "University student studying law. Ambitious but fun-loving",
  "Foodie who can cook amazing lok lak. The way to my heart is through food too",
  "Bookworm and coffee lover. Cozy cafe dates are my thing",
  "Fitness enthusiast and health-conscious. Let's hike Phnom Kulen together",
  "I love singing karaoke and having a good time with friends",
  "Social media manager with a passion for storytelling",
  "Just looking for someone honest and kind. Simple but real",
];

// --- Location data ---
const provinces = [
  "Phnom Penh", "Siem Reap", "Battambang", "Kampong Cham", "Kandal",
  "Preah Sihanouk", "Kampot", "Takeo", "Kampong Speu", "Prey Veng",
  "Kratie", "Banteay Meanchey", "Kep", "Svay Rieng", "Kampong Thom",
];

const diasporaLocations = [
  { country: "USA", province: "California" },
  { country: "USA", province: "Massachusetts" },
  { country: "USA", province: "Texas" },
  { country: "France", province: "Paris" },
  { country: "Australia", province: "Sydney" },
  { country: "Australia", province: "Melbourne" },
  { country: "Canada", province: "Ontario" },
  { country: "South Korea", province: "Seoul" },
  { country: "Japan", province: "Tokyo" },
  { country: "Thailand", province: "Bangkok" },
];

function generateProfile() {
  const gender = Math.random() < 0.5 ? "male" : "female";
  const firstName = gender === "male" ? pick(maleFirst) : pick(femaleFirst);
  const lastName = pick(lastNames);
  const name = `${firstName} ${lastName}`;

  const dob = randomDob();
  const age = calcAge(dob);
  const zodiac = getAnimalSign(dob);

  const bio = gender === "male" ? pick(maleBios) : pick(femaleBios);

  // 85% Cambodia, 15% diaspora
  let country: string, province: string;
  if (Math.random() < 0.85) {
    country = "Cambodia";
    province = pick(provinces);
  } else {
    const loc = pick(diasporaLocations);
    country = loc.country;
    province = loc.province;
  }

  // looking_for: weighted toward opposite gender
  let lookingFor: string;
  const r = Math.random();
  if (gender === "male") {
    lookingFor = r < 0.8 ? "female" : r < 0.95 ? "everyone" : "male";
  } else {
    lookingFor = r < 0.8 ? "male" : r < 0.95 ? "everyone" : "female";
  }

  const encodedName = encodeURIComponent(name);
  const bgColor = gender === "male" ? "4A90D9" : "E84393";
  const photoUrl = `https://ui-avatars.com/api/?name=${encodedName}&size=400&background=${bgColor}&color=fff&bold=true`;

  return {
    name,
    age,
    gender,
    bio,
    country,
    province,
    city: null,
    zipcode: null,
    photo_url: photoUrl,
    looking_for: lookingFor,
    zodiac,
    date_of_birth: dob,
    updated_at: new Date().toISOString(),
  };
}

async function main() {
  const profileData = Array.from({ length: 100 }, generateProfile);

  console.log(`Creating ${profileData.length} dummy profiles...`);
  console.log(`Sample: ${profileData[0].name}, ${profileData[0].age}yo, ${profileData[0].gender}, ${profileData[0].province}, ${profileData[0].zodiac}`);

  let created = 0;
  let failed = 0;

  for (const p of profileData) {
    // Create a fake auth user first (FK constraint: profiles.id → auth.users.id)
    const fakeEmail = `dummy-${crypto.randomUUID().slice(0, 8)}@seed.snaeh.app`;
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: fakeEmail,
      password: crypto.randomUUID(),
      email_confirm: true,
    });

    if (authError || !authUser.user) {
      console.error(`Auth user creation failed for ${p.name}:`, authError?.message);
      failed++;
      continue;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({ ...p, id: authUser.user.id }, { onConflict: "id" });

    if (profileError) {
      console.error(`Profile insert failed for ${p.name}:`, profileError.message);
      failed++;
    } else {
      created++;
    }
  }

  console.log(`Done! Created: ${created}, Failed: ${failed}`);
}

main();
