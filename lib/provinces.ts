export const provinces = [
  "Phnom Penh",
  "Banteay Meanchey",
  "Battambang",
  "Kampong Cham",
  "Kampong Chhnang",
  "Kampong Speu",
  "Kampong Thom",
  "Kampot",
  "Kandal",
  "Kep",
  "Koh Kong",
  "Kratie",
  "Mondulkiri",
  "Oddar Meanchey",
  "Pailin",
  "Preah Sihanouk",
  "Preah Vihear",
  "Prey Veng",
  "Pursat",
  "Ratanakiri",
  "Siem Reap",
  "Stung Treng",
  "Svay Rieng",
  "Takeo",
  "Tboung Khmum",
];

export const countryCities: Record<string, string[]> = {
  Cambodia: provinces,
  Thailand: [
    "Bangkok", "Chiang Mai", "Chiang Rai", "Phuket", "Pattaya",
    "Khon Kaen", "Nakhon Ratchasima", "Hat Yai", "Udon Thani", "Surat Thani",
  ],
  Vietnam: [
    "Ho Chi Minh City", "Hanoi", "Da Nang", "Hai Phong", "Can Tho",
    "Nha Trang", "Hue", "Vung Tau", "Bien Hoa", "Da Lat",
  ],
  Laos: [
    "Vientiane", "Luang Prabang", "Pakse", "Savannakhet", "Thakhek",
    "Vang Vieng", "Phonsavan", "Sam Neua", "Oudomxay", "Luang Namtha",
  ],
  Myanmar: [
    "Yangon", "Mandalay", "Naypyidaw", "Bagan", "Mawlamyine",
    "Taunggyi", "Pathein", "Monywa", "Meiktila", "Myitkyina",
  ],
  Malaysia: [
    "Kuala Lumpur", "George Town", "Johor Bahru", "Ipoh", "Kuching",
    "Kota Kinabalu", "Shah Alam", "Malacca", "Alor Setar", "Miri",
  ],
  Singapore: ["Singapore"],
  Indonesia: [
    "Jakarta", "Surabaya", "Bandung", "Medan", "Semarang",
    "Makassar", "Palembang", "Denpasar", "Yogyakarta", "Manado",
  ],
  Philippines: [
    "Manila", "Quezon City", "Davao", "Cebu City", "Zamboanga",
    "Taguig", "Antipolo", "Pasig", "Cagayan de Oro", "Makati",
  ],
  Japan: [
    "Tokyo", "Osaka", "Kyoto", "Yokohama", "Nagoya",
    "Sapporo", "Fukuoka", "Kobe", "Hiroshima", "Sendai",
  ],
  "South Korea": [
    "Seoul", "Busan", "Incheon", "Daegu", "Daejeon",
    "Gwangju", "Suwon", "Ulsan", "Changwon", "Jeju",
  ],
  China: [
    "Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chengdu",
    "Hangzhou", "Wuhan", "Xi'an", "Nanjing", "Chongqing",
  ],
  Taiwan: [
    "Taipei", "Kaohsiung", "Taichung", "Tainan", "Hsinchu",
    "Taoyuan", "Keelung", "Chiayi", "Pingtung", "Yilan",
  ],
  India: [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
    "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
  ],
  USA: [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California",
    "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
    "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
    "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
    "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
  ],
  Canada: [
    "Alberta", "British Columbia", "Manitoba", "New Brunswick",
    "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia",
    "Nunavut", "Ontario", "Prince Edward Island", "Quebec",
    "Saskatchewan", "Yukon",
  ],
  France: [
    "Paris", "Marseille", "Lyon", "Toulouse", "Nice",
    "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille",
  ],
  Australia: [
    "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide",
    "Gold Coast", "Canberra", "Hobart", "Darwin", "Cairns",
  ],
};

export const countries = Object.keys(countryCities);
