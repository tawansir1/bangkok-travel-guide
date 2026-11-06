/* =========================================================
   data.js — all content and transit data in one place.
   Pages read from here, so you only edit facts once.

   Fares checked November 2026. They change often:
   always confirm at bts.co.th / metro.bemplc.co.th.
   ========================================================= */

/* ---------- Transit lines ---------- */
const LINES = {
  sukhumvit: { name: 'BTS Sukhumvit Line', short: 'BTS', color: '#6cb33f', system: 'bts' },
  silom:     { name: 'BTS Silom Line',     short: 'BTS', color: '#00704a', system: 'bts' },
  blue:      { name: 'MRT Blue Line',      short: 'MRT', color: '#1a4fa0', system: 'mrt' },
  arl:       { name: 'Airport Rail Link',  short: 'ARL', color: '#c8102e', system: 'arl' },
  gold:      { name: 'Gold Line',          short: 'Gold', color: '#b8932f', system: 'gold' },
  boat:      { name: 'Chao Phraya Express Boat (orange flag)', short: 'Boat', color: '#f08a1c', system: 'boat' },
  ferry:     { name: 'Cross-river ferry',  short: 'Ferry', color: '#8a6d3b', system: 'ferry' },
  walk:      { name: 'Walk',               short: 'Walk', color: '#9aa1ad', system: 'walk' }
};

/* Stations in line order. [code, name] */
const STATIONS = {
  sukhumvit: [
    ['N24', 'Khu Khot'], ['N23', 'Yaek Kor Por Aor'], ['N22', 'Royal Thai Air Force Museum'],
    ['N21', 'Bhumibol Adulyadej Hospital'], ['N20', 'Saphan Mai'], ['N19', 'Sai Yud'],
    ['N18', 'Phahon Yothin 59'], ['N17', 'Wat Phra Sri Mahathat'], ['N16', '11th Infantry Regiment'],
    ['N15', 'Bang Bua'], ['N14', 'Royal Forest Department'], ['N13', 'Kasetsart University'],
    ['N12', 'Sena Nikhom'], ['N11', 'Ratchayothin'], ['N10', 'Phahon Yothin 24'],
    ['N9', 'Ha Yaek Lat Phrao'], ['N8', 'Mo Chit'], ['N7', 'Saphan Khwai'], ['N5', 'Ari'],
    ['N4', 'Sanam Pao'], ['N3', 'Victory Monument'], ['N2', 'Phaya Thai'], ['N1', 'Ratchathewi'],
    ['CEN', 'Siam'], ['E1', 'Chit Lom'], ['E2', 'Phloen Chit'], ['E3', 'Nana'], ['E4', 'Asok'],
    ['E5', 'Phrom Phong'], ['E6', 'Thong Lo'], ['E7', 'Ekkamai'], ['E8', 'Phra Khanong'],
    ['E9', 'On Nut'], ['E10', 'Bang Chak'], ['E11', 'Punnawithi'], ['E12', 'Udom Suk'],
    ['E13', 'Bang Na'], ['E14', 'Bearing'], ['E15', 'Samrong'], ['E16', 'Pu Chao'],
    ['E17', 'Chang Erawan'], ['E18', 'Royal Thai Naval Academy'], ['E19', 'Pak Nam'],
    ['E20', 'Srinagarindra'], ['E21', 'Phraek Sa'], ['E22', 'Sai Luat'], ['E23', 'Kheha']
  ],
  silom: [
    ['W1', 'National Stadium'], ['CEN', 'Siam'], ['S1', 'Ratchadamri'], ['S2', 'Sala Daeng'],
    ['S3', 'Chong Nonsi'], ['S4', 'Saint Louis'], ['S5', 'Surasak'], ['S6', 'Saphan Taksin'],
    ['S7', 'Krung Thon Buri'], ['S8', 'Wongwian Yai'], ['S9', 'Pho Nimit'], ['S10', 'Talat Phlu'],
    ['S11', 'Wutthakat'], ['S12', 'Bang Wa']
  ],
  /* The Blue Line is a loop with a tail: Tha Phra (BL01) joins
     BL02, BL32 and BL33. The chain below runs BL02 → BL32;
     the extra links are added in EXTRA_LINKS. */
  blue: [
    ['BL02', 'Charan 13'], ['BL03', 'Fai Chai'], ['BL04', 'Bang Khun Non'], ['BL05', 'Bang Yi Khan'],
    ['BL06', 'Sirindhorn'], ['BL07', 'Bang Phlat'], ['BL08', 'Bang O'], ['BL09', 'Bang Pho'],
    ['BL10', 'Tao Poon'], ['BL11', 'Bang Sue'], ['BL12', 'Kamphaeng Phet'], ['BL13', 'Chatuchak Park'],
    ['BL14', 'Phahon Yothin'], ['BL15', 'Lat Phrao'], ['BL16', 'Ratchadaphisek'], ['BL17', 'Sutthisan'],
    ['BL18', 'Huai Khwang'], ['BL19', 'Thailand Cultural Centre'], ['BL20', 'Phra Ram 9'],
    ['BL21', 'Phetchaburi'], ['BL22', 'Sukhumvit'], ['BL23', 'Queen Sirikit National Convention Centre'],
    ['BL24', 'Khlong Toei'], ['BL25', 'Lumphini'], ['BL26', 'Si Lom'], ['BL27', 'Sam Yan'],
    ['BL28', 'Hua Lamphong'], ['BL29', 'Wat Mangkon'], ['BL30', 'Sam Yot'], ['BL31', 'Sanam Chai'],
    ['BL32', 'Itsaraphap']
  ],
  blueTail: [
    ['BL01', 'Tha Phra'], ['BL33', 'Bang Phai'], ['BL34', 'Bang Wa'], ['BL35', 'Phetkasem 48'],
    ['BL36', 'Phasi Charoen'], ['BL37', 'Bang Khae'], ['BL38', 'Lak Song']
  ],
  arl: [
    ['A1', 'Suvarnabhumi Airport'], ['A2', 'Lat Krabang'], ['A3', 'Ban Thap Chang'], ['A4', 'Hua Mak'],
    ['A5', 'Ramkhamhaeng'], ['A6', 'Makkasan'], ['A7', 'Ratchaprarop'], ['A8', 'Phaya Thai']
  ],
  gold: [
    ['G1', 'Krung Thon Buri'], ['G2', 'Charoen Nakhon (ICONSIAM)'], ['G3', 'Khlong San']
  ],
  /* Orange flag boat piers, south to north (only the useful ones) */
  boat: [
    ['P-CEN', 'Sathorn Pier'], ['P-N3', 'Si Phraya Pier'], ['P-N5', 'Ratchawong Pier'],
    ['P-N8', 'Tha Tien Pier'], ['P-N9', 'Tha Chang Pier'], ['P-N10', 'Wang Lang Pier'],
    ['P-N13', 'Phra Arthit Pier']
  ]
};

/* Links that are not "next station on the same line".
   [from, to, line, minutes] */
const EXTRA_LINKS = [
  ['BL32', 'BL01', 'blue', 2.5],
  ['BL01', 'BL02', 'blue', 2.5],
  ['P-N8', 'WATARUN', 'ferry', 8]          // includes waiting for the ferry
  // BL01 → BL33 is already in the blueTail list
];

/* Walking transfers between lines. [a, b, minutes] */
const TRANSFERS = [
  ['N8', 'BL13', 6], ['N9', 'BL14', 5], ['E4', 'BL22', 5], ['S2', 'BL26', 5],
  ['S12', 'BL34', 6], ['N2', 'A8', 6], ['BL21', 'A6', 8], ['S6', 'P-CEN', 4],
  ['S7', 'G1', 4], ['BL31', 'P-N8', 9], ['BL29', 'P-N5', 10]
];

/* Stations that only exist as a destination (no line of their own) */
const EXTRA_NODES = { WATARUN: 'Wat Arun Pier' };

/* ---------- Fares (THB) ----------
   BTS core (Mo Chit–On Nut, National Stadium–Wongwian Yai):
   17–47 THB by stations travelled. Min/max confirmed;
   the steps in between follow BTSC's chart and may shift.
   BTS extensions: distance-based 17–45 THB since Nov 2025.
   The exact steps are not published here, so this is an estimate.
   A trip using core + extension is capped at 65 THB.
   MRT Blue Line: new table from 3 July 2026.
   ARL: 15–45 THB. Gold Line: flat 17 THB.
   Orange flag boat: flat 19 THB (April 2026).
   Cross-river ferry: about 4 THB. */
const FARES = {
  btsCore: [0, 17, 25, 28, 32, 35, 40, 43, 47],   // index = stations travelled
  btsExt: hops => Math.min(45, 17 + 4 * (hops - 1)),
  btsCap: 65,
  mrtBlue: [0, 17, 20, 22, 25, 27, 29, 32, 34, 37, 39, 42, 44],
  arl: [0, 15, 20, 25, 30, 35, 40, 45],
  gold: 17,
  boat: 19,
  ferry: 4,
  checked: 'November 2026'
};

const BTS_CORE = new Set([
  'N8', 'N7', 'N5', 'N4', 'N3', 'N2', 'N1', 'CEN',
  'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9',
  'W1', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'
]);

/* Rough track length per stop, used for the taxi comparison (km) */
const KM_PER_HOP = { bts: 1.2, mrt: 1.3, arl: 3.8, gold: 0.6, boat: 0.9, ferry: 0.3, walk: 0 };

/* Bangkok taxi meter (sedan) */
const TAXI = {
  flag: 35,                         // first km
  brackets: [[10, 6.5], [20, 7], [40, 8], [60, 8.5], [80, 9], [Infinity, 10.5]],
  perMinuteInTraffic: 3,
  airportSurcharge: 50
};

/* ---------- Photos ----------
   Photos come from Wikimedia Commons (free to use with credit).
   "photo" is the file name on Commons. To use your own photo
   instead, put it next to index.html and write e.g.
   photo: 'wat-arun.jpg' (a name without spaces counts as local). */
function photoUrl(place, width) {
  if (!/\s/.test(place.photo)) return place.photo;   // your own file
  return 'https://commons.wikimedia.org/wiki/Special:FilePath/' +
    encodeURIComponent(place.photo) + '?width=' + width;
}
function photoPage(place) {
  if (!/\s/.test(place.photo)) return null;
  return 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(place.photo.replace(/ /g, '_'));
}

/* ---------- Places ----------
   station: the node the route planner uses.
   walk: minutes from that station to the place. */
const PLACES = [
  {
    id: 'grand-palace',
    name: 'Grand Palace & Wat Phra Kaew',
    thai: 'พระบรมมหาราชวัง และวัดพระแก้ว',
    type: 'Temple',
    station: 'BL31', walk: 10,
    photo: 'Wat Phra Kaew, Grand Palace, Bangkok, Thailand.jpg',
    summary: 'Home of the Emerald Buddha and the former royal residence.',
    body: [
      'The palace was built in 1782 when Bangkok became the capital. Inside the same walls is Wat Phra Kaew, the most important temple in Thailand, which holds a small Buddha carved from green jade.',
      'Plan two to three hours. The grounds are large, there is very little shade, and the crowds build quickly after 10 am.'
    ],
    facts: [
      ['Open', 'Daily 8:30–15:30 (ticket sales)'],
      ['Ticket', '500 THB for foreign visitors'],
      ['Dress code', 'Shoulders and knees covered, no see-through clothes'],
      ['Time needed', '2–3 hours']
    ],
    tips: [
      'Ignore anyone outside who says the palace is closed today. It is a well-known scam.',
      'Walk 10 minutes south afterwards to Wat Pho.'
    ]
  },
  {
    id: 'wat-pho',
    name: 'Wat Pho',
    thai: 'วัดโพธิ์',
    type: 'Temple',
    station: 'BL31', walk: 5,
    photo: 'Bangkok Wat Pho reclining Buddha.jpg',
    summary: 'The 46-metre Reclining Buddha and Thailand’s first public school.',
    body: [
      'Wat Pho is older than Bangkok itself. Its best-known resident is the Reclining Buddha, covered in gold leaf, with mother-of-pearl patterns on the soles of the feet.',
      'The temple is also the home of traditional Thai massage. The massage school on the grounds still takes walk-in customers.'
    ],
    facts: [
      ['Open', 'Daily 8:00–18:30'],
      ['Ticket', '300 THB, free under 120 cm'],
      ['Dress code', 'Shoulders and knees covered'],
      ['Time needed', '1–1.5 hours']
    ],
    tips: [
      'Go in the late afternoon when the tour groups have left.',
      'Tha Tien pier is right behind the temple for the ferry to Wat Arun.'
    ]
  },
  {
    id: 'wat-arun',
    name: 'Wat Arun',
    thai: 'วัดอรุณราชวราราม',
    type: 'Temple',
    station: 'WATARUN', walk: 2,
    photo: 'Wat Arun from Chao Phraya River.jpg',
    summary: 'The Temple of Dawn, covered in pieces of Chinese porcelain.',
    body: [
      'The central tower is about 80 metres tall and decorated with broken porcelain that was used as ballast on Chinese trading ships.',
      'It looks best from the other side of the river at sunset, so many people visit in the afternoon and then cross back for dinner with a view.'
    ],
    facts: [
      ['Open', 'Daily 8:00–18:00'],
      ['Ticket', '200 THB'],
      ['Dress code', 'Shoulders and knees covered'],
      ['Time needed', '1 hour']
    ],
    tips: [
      'The ferry from Tha Tien takes about 3 minutes and costs a few baht.',
      'Climb the lower terraces of the tower for a view over the river.'
    ]
  },
  {
    id: 'yaowarat',
    name: 'Yaowarat (Chinatown)',
    thai: 'เยาวราช',
    type: 'Food',
    station: 'BL29', walk: 5,
    photo: 'Yaowarat at night (32455695783).jpg',
    summary: 'Neon signs and a street that becomes one long food market at night.',
    body: [
      'Yaowarat Road has been the centre of Bangkok’s Chinese community for more than 200 years. Gold shops and herbal medicine stores fill the day; after sunset the pavements fill with food stalls.',
      'Come hungry and share dishes so you can try more. Most stalls sell one thing only, and the longest queue is usually the right choice.'
    ],
    facts: [
      ['Best time', 'From 18:00, stalls close around midnight'],
      ['Closed', 'Many stalls rest on Mondays'],
      ['Budget', '300–500 THB for a full food walk'],
      ['Time needed', '2–3 hours']
    ],
    tips: [
      'Bring cash in small notes.',
      'Try the toasted buns with custard and the rolled noodle soup.'
    ]
  },
  {
    id: 'chatuchak',
    name: 'Chatuchak Weekend Market',
    thai: 'ตลาดนัดจตุจักร',
    type: 'Market',
    station: 'BL13', walk: 4,
    photo: 'Chatuchak Weekend Market Soi.jpg',
    summary: 'More than 10,000 stalls of clothes, plants, art and snacks.',
    body: [
      'Chatuchak is one of the largest weekend markets in the world. It is split into 27 numbered sections, from vintage clothes to pets to home decor.',
      'It gets very hot by midday. Start early, carry water, and pick up a free map at the information point near the clock tower.'
    ],
    facts: [
      ['Open', 'Saturday and Sunday, about 9:00–18:00'],
      ['Ticket', 'Free'],
      ['Budget', 'Bring cash, most stalls do not take cards'],
      ['Time needed', 'Half a day']
    ],
    tips: [
      'Use the clock tower in the middle as your meeting point.',
      'Coconut ice cream served in a coconut shell is the classic snack.'
    ]
  },
  {
    id: 'iconsiam',
    name: 'ICONSIAM',
    thai: 'ไอคอนสยาม',
    type: 'Modern',
    station: 'G2', walk: 3,
    photo: 'Iconsiam at Night.jpg',
    summary: 'A riverside mall with an indoor floating market on the ground floor.',
    body: [
      'ICONSIAM opened in 2018 on the west bank of the Chao Phraya. Its ground floor, SookSiam, recreates a floating market with food and crafts from every region of Thailand.',
      'The terrace outside faces the river and is a good free place to watch the boats in the evening.'
    ],
    facts: [
      ['Open', 'Daily 10:00–22:00'],
      ['Ticket', 'Free'],
      ['Budget', 'SookSiam dishes 60–150 THB'],
      ['Time needed', '2 hours']
    ],
    tips: [
      'A free shuttle boat also runs from Sathorn Pier.',
      'Ride the Gold Line from Krung Thon Buri, it stops at the mall.'
    ]
  },
  {
    id: 'chao-phraya',
    name: 'Chao Phraya River',
    thai: 'แม่น้ำเจ้าพระยา',
    type: 'River',
    station: 'P-CEN', walk: 0,
    photo: 'Chao Phraya Express Boat Orange Flag 2.jpg',
    summary: 'The cheapest sightseeing tour in Bangkok is the public express boat.',
    body: [
      'The river was Bangkok’s main road long before the city had cars. Temples, palaces and old warehouses still face the water.',
      'The orange flag express boat stops at the main sights and costs the same for any distance. Start at Sathorn Pier, right below Saphan Taksin BTS station.'
    ],
    facts: [
      ['Runs', 'Daily, roughly 6:00–19:00'],
      ['Fare', '19 THB per ride, pay on board'],
      ['Useful piers', 'Sathorn, Ratchawong, Tha Tien, Tha Chang, Phra Arthit'],
      ['Time needed', '30–45 minutes end to end']
    ],
    tips: [
      'Stand near the back of the boat for photos.',
      'Avoid the boats at rush hour, 7–9 am and 5–7 pm.'
    ]
  },
  {
    id: 'lumphini',
    name: 'Lumphini Park',
    thai: 'สวนลุมพินี',
    type: 'Park',
    station: 'BL25', walk: 2,
    photo: 'Lumphini Park.jpg',
    summary: 'Bangkok’s central park, with lakes, joggers and large monitor lizards.',
    body: [
      'Lumphini is the green middle of the business district. Early morning and evening are when locals come to run, dance and do tai chi.',
      'The water monitors are harmless if you leave them alone. Some are over two metres long.'
    ],
    facts: [
      ['Open', 'Daily 4:30–21:00'],
      ['Ticket', 'Free'],
      ['Best time', 'After 17:00 when it cools down'],
      ['Time needed', '1 hour']
    ],
    tips: [
      'At 18:00 everyone stops for the national anthem. Stand still with them.',
      'Rent a swan pedal boat on the lake.'
    ]
  }
];

/* Extra places you can type in the route planner (no guide page) */
const DESTINATIONS = [
  { id: 'siam-paragon', name: 'Siam Paragon', thai: 'สยามพารากอน', station: 'CEN', walk: 2 },
  { id: 'mbk', name: 'MBK Center', thai: 'เอ็มบีเค', station: 'W1', walk: 2 },
  { id: 'jim-thompson', name: 'Jim Thompson House', thai: 'บ้านจิมทอมป์สัน', station: 'W1', walk: 6 },
  { id: 'terminal-21', name: 'Terminal 21', thai: 'เทอร์มินอล 21', station: 'E4', walk: 2 },
  { id: 'khao-san', name: 'Khao San Road', thai: 'ถนนข้าวสาร', station: 'P-N13', walk: 10 },
  { id: 'airport', name: 'Suvarnabhumi Airport', thai: 'สนามบินสุวรรณภูมิ', station: 'A1', walk: 5 },
  { id: 'victory', name: 'Victory Monument', thai: 'อนุสาวรีย์ชัยสมรภูมิ', station: 'N3', walk: 2 },
  { id: 'emquartier', name: 'EmQuartier', thai: 'เอ็มควอเทียร์', station: 'E5', walk: 1 },
  { id: 'hua-lamphong', name: 'Hua Lamphong Station', thai: 'หัวลำโพง', station: 'BL28', walk: 2 }
];
