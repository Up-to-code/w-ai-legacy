// Countries data for phone input
export interface Country {
  code: string;
  name: string;
  nameEn: string;
  flag: string;
}

export const COUNTRIES: Country[] = [
  { code: "+966", name: "السعودية", nameEn: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+971", name: "الإمارات", nameEn: "UAE", flag: "🇦🇪" },
  { code: "+965", name: "الكويت", nameEn: "Kuwait", flag: "🇰🇼" },
  { code: "+974", name: "قطر", nameEn: "Qatar", flag: "🇶🇦" },
  { code: "+973", name: "البحرين", nameEn: "Bahrain", flag: "🇧🇭" },
  { code: "+968", name: "عمان", nameEn: "Oman", flag: "🇴🇲" },
  { code: "+967", name: "اليمن", nameEn: "Yemen", flag: "🇾🇪" },
  { code: "+20", name: "مصر", nameEn: "Egypt", flag: "🇪🇬" },
  { code: "+962", name: "الأردن", nameEn: "Jordan", flag: "🇯🇴" },
  { code: "+961", name: "لبنان", nameEn: "Lebanon", flag: "🇱🇧" },
  { code: "+963", name: "سوريا", nameEn: "Syria", flag: "🇸🇾" },
  { code: "+964", name: "العراق", nameEn: "Iraq", flag: "🇮🇶" },
  { code: "+212", name: "المغرب", nameEn: "Morocco", flag: "🇲🇦" },
  { code: "+213", name: "الجزائر", nameEn: "Algeria", flag: "🇩🇿" },
  { code: "+216", name: "تونس", nameEn: "Tunisia", flag: "🇹🇳" },
  { code: "+218", name: "ليبيا", nameEn: "Libya", flag: "🇱🇾" },
  { code: "+249", name: "السودان", nameEn: "Sudan", flag: "🇸🇩" },
  { code: "+1", name: "أمريكا/كندا", nameEn: "USA/Canada", flag: "🇺🇸" },
  { code: "+44", name: "بريطانيا", nameEn: "UK", flag: "🇬🇧" },
  { code: "+33", name: "فرنسا", nameEn: "France", flag: "🇫🇷" },
  { code: "+49", name: "ألمانيا", nameEn: "Germany", flag: "🇩🇪" },
  { code: "+90", name: "تركيا", nameEn: "Turkey", flag: "🇹🇷" },
  { code: "+91", name: "الهند", nameEn: "India", flag: "🇮🇳" },
  { code: "+92", name: "باكستان", nameEn: "Pakistan", flag: "🇵🇰" },
  { code: "+86", name: "الصين", nameEn: "China", flag: "🇨🇳" },
];

// Find country by code
export function findCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find(c => c.code === code);
}

// Detect country code from phone number
export function detectCountryFromPhone(phone: string): string | null {
  if (!phone.startsWith('+')) return null;
  
  const sorted = [...COUNTRIES].sort((a, b) => b.code.length - a.code.length);
  for (const country of sorted) {
    if (phone.startsWith(country.code)) {
      return country.code;
    }
  }
  return null;
}

// Filter countries by search query
export function filterCountries(countries: Country[], search: string): Country[] {
  const query = search.trim().toLowerCase();
  if (!query) return countries;
  
  return countries.filter(c =>
    c.name.includes(query) ||
    c.nameEn.toLowerCase().includes(query) ||
    c.code.includes(query)
  );
}
