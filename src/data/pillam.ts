export interface Pillam {
  id: string;
  name: string;
  nameEnglish: string;
  symbol: string;
  symbolName: string;
  sound: string;
  vowelEffect: string;
  exampleBase: string;       // e.g. 'ක'
  exampleCombined: string;   // e.g. 'කා'
  exampleWord: string;       // e.g. 'කෑම'
  exampleMeaning: string;    // e.g. 'Food'
  description: string;
}

export const PILLAM_LIST: Pillam[] = [
  {
    id: 'hal-kirima',
    name: 'හල් කිරීම',
    nameEnglish: 'Hal Kirima (Virama)',
    symbol: '්',
    symbolName: 'හල් ලකුණ',
    sound: 'Silences inherent vowel (/a/) -> consonant stop',
    vowelEffect: 'No vowel (pure consonant sound)',
    exampleBase: 'ක',
    exampleCombined: 'ක්',
    exampleWord: 'මල්',
    exampleMeaning: 'Flowers',
    description: 'Cancels the default "a" vowel sound to make a pure consonant stop (k, t, p, l).'
  },
  {
    id: 'aela-pilla',
    name: 'ඇලපිල්ල',
    nameEnglish: 'Aela Pilla',
    symbol: 'ා',
    symbolName: 'ඇලපිල්ල',
    sound: 'Long "ā" / "aah" sound (like "father")',
    vowelEffect: '+ ā (aah)',
    exampleBase: 'ක',
    exampleCombined: 'කා',
    exampleWord: 'කාමරය (kāmaraya)',
    exampleMeaning: 'Room',
    description: 'Extends the "a" sound to a long open "ā" (aah).'
  },
  {
    id: 'aeda-pilla',
    name: 'ඇදපිල්ල',
    nameEnglish: 'Aeda Pilla',
    symbol: 'ැ',
    symbolName: 'ඇදපිල්ල',
    sound: 'Short "æ" sound (like "cat" or "hat")',
    vowelEffect: '+ æ (ae)',
    exampleBase: 'ක',
    exampleCombined: 'කැ',
    exampleWord: 'කැමැත්ත (kæmætta)',
    exampleMeaning: 'Wish / Desire',
    description: 'Produces the short "æ" vowel sound characteristic of Sinhala.'
  },
  {
    id: 'diga-aeda-pilla',
    name: 'දිග ඇදපිල්ල',
    nameEnglish: 'Diga Aeda Pilla',
    symbol: 'ෑ',
    symbolName: 'දිග ඇදපිල්ල',
    sound: 'Long "ǣ" sound (like "bad" held long)',
    vowelEffect: '+ ǣ (aae)',
    exampleBase: 'ක',
    exampleCombined: 'කෑ',
    exampleWord: 'කෑම (kǣma)',
    exampleMeaning: 'Food',
    description: 'Long version of the "æ" sound.'
  },
  {
    id: 'ispilla',
    name: 'ඉස්පිල්ල',
    nameEnglish: 'Ispilla',
    symbol: 'ි',
    symbolName: 'ඉස්පිල්ල',
    sound: 'Short "i" / "ee" sound (like "pin")',
    vowelEffect: '+ i (ee)',
    exampleBase: 'ක',
    exampleCombined: 'කි',
    exampleWord: 'කිරි (kiri)',
    exampleMeaning: 'Milk',
    description: 'Placed above consonants to create the short "i" sound.'
  },
  {
    id: 'diga-ispilla',
    name: 'දිග ඉස්පිල්ල',
    nameEnglish: 'Diga Ispilla',
    symbol: 'ී',
    symbolName: 'දිග ඉස්පිල්ල',
    sound: 'Long "ī" / "eee" sound (like "see" / "tree")',
    vowelEffect: '+ ī (eee)',
    exampleBase: 'ක',
    exampleCombined: 'කී',
    exampleWord: 'කීයද (kīyada)',
    exampleMeaning: 'How much',
    description: 'Placed above consonants to create the long "ī" sound.'
  },
  {
    id: 'paapilla',
    name: 'පාපිල්ල',
    nameEnglish: 'Paapilla',
    symbol: 'ු',
    symbolName: 'පාපිල්ල',
    sound: 'Short "u" / "oo" sound (like "put")',
    vowelEffect: '+ u (oo)',
    exampleBase: 'ක',
    exampleCombined: 'කු',
    exampleWord: 'කුඩය (kuḍaya)',
    exampleMeaning: 'Umbrella',
    description: 'Attached to the foot of consonants for short "u" sound.'
  },
  {
    id: 'diga-paapilla',
    name: 'දිග පාපිල්ල',
    nameEnglish: 'Diga Paapilla',
    symbol: 'ූ',
    symbolName: 'දිග පාපිල්ල',
    sound: 'Long "ū" / "ooo" sound (like "moon")',
    vowelEffect: '+ ū (ooo)',
    exampleBase: 'ක',
    exampleCombined: 'කූ',
    exampleWord: 'කූඩුව (kūḍuva)',
    exampleMeaning: 'Cage / Basket',
    description: 'Attached to the foot of consonants for long "ū" sound.'
  },
  {
    id: 'gaetapilla',
    name: 'ගැටපිල්ල',
    nameEnglish: 'Gaetapilla (Vocalic R)',
    symbol: 'ෘ',
    symbolName: 'ගැටපිල්ල',
    sound: 'Vocalic "ru" / "roo" sound',
    vowelEffect: '+ ru (roo)',
    exampleBase: 'ක',
    exampleCombined: 'කෘ',
    exampleWord: 'කෘෂිකර්මය (krushikarmaya)',
    exampleMeaning: 'Agriculture',
    description: 'Sanskrit-derived vocalic "ru" modifier.'
  },
  {
    id: 'kombuva',
    name: 'කොම්බුව',
    nameEnglish: 'Kombuva',
    symbol: 'ෙ',
    symbolName: 'කොම්බුව',
    sound: 'Short "e" / "eh" sound (like "bed")',
    vowelEffect: '+ e (eh)',
    exampleBase: 'ක',
    exampleCombined: 'කෙ',
    exampleWord: 'කෙටි (keṭi)',
    exampleMeaning: 'Short',
    description: 'Placed BEFORE the consonant to create the short "e" sound.'
  },
  {
    id: 'diga-kombuva',
    name: 'දිග කොම්බුව (කොම්බුව සහ හල්කිරීම)',
    nameEnglish: 'Diga Kombuva',
    symbol: 'ේ',
    symbolName: 'දිග කොම්බුව',
    sound: 'Long "ē" / "ay" sound (like "day" or "say")',
    vowelEffect: '+ ē (ay)',
    exampleBase: 'ක',
    exampleCombined: 'කේ',
    exampleWord: 'තේ (thē)',
    exampleMeaning: 'Tea',
    description: 'Kombuva before + Hal kirima above consonant for long "ay" sound.'
  },
  {
    id: 'kombu-deka',
    name: 'කොම්බු දෙක',
    nameEnglish: 'Kombu Deka (Diphthong AI)',
    symbol: 'ෛ',
    symbolName: 'කොම්බු දෙක',
    sound: 'Diphthong "ai" / "eye" sound (like "sky")',
    vowelEffect: '+ ai (eye)',
    exampleBase: 'ක',
    exampleCombined: 'කෛ',
    exampleWord: 'කෛරාටික (kairātika)',
    exampleMeaning: 'Cunning',
    description: 'Double Kombuva placed before consonant for "ai" sound.'
  },
  {
    id: 'kombuva-aela',
    name: 'කොම්බුව සහ ඇලපිල්ල',
    nameEnglish: 'Kombuva + Aela Pilla',
    symbol: 'ො',
    symbolName: 'කොම්බුව සහ ඇලපිල්ල',
    sound: 'Short "o" / "oh" sound (like "hot")',
    vowelEffect: '+ o (oh)',
    exampleBase: 'ක',
    exampleCombined: 'කො',
    exampleWord: 'කොළඹ (koḷamba)',
    exampleMeaning: 'Colombo',
    description: 'Surrounds consonant: Kombuva in front, Aela Pilla behind for short "o".'
  },
  {
    id: 'kombuva-hal-aela',
    name: 'කොම්බුව, හල්කිරීම සහ ඇලපිල්ල',
    nameEnglish: 'Diga O (Long O)',
    symbol: 'ෝ',
    symbolName: 'දිග ඔ-කාරය',
    sound: 'Long "ō" / "ooh" sound (like "boat" / "gold")',
    vowelEffect: '+ ō (ooh)',
    exampleBase: 'ක',
    exampleCombined: 'කෝ',
    exampleWord: 'කෝපි (kōpi)',
    exampleMeaning: 'Coffee',
    description: 'Produces the rich long "ō" sound.'
  },
  {
    id: 'kombuva-gayanukitta',
    name: 'කොම්බුව සහ ගයනුකිත්ත',
    nameEnglish: 'Kombuva + Gayanukitta (AU)',
    symbol: 'ෞ',
    symbolName: 'ඖ-කාරය',
    sound: 'Diphthong "au" / "ow" sound (like "cow")',
    vowelEffect: '+ au (ow)',
    exampleBase: 'ක',
    exampleCombined: 'කෞ',
    exampleWord: 'කෞතුකාගාරය (kauthukāgāraya)',
    exampleMeaning: 'Museum',
    description: 'Surrounds consonant with Kombuva and Gayanukitta for "ow" diphthong.'
  },
  {
    id: 'anusvaraya',
    name: 'අනුස්වාරය (බිංදුව)',
    nameEnglish: 'Anusvaraya (Binduwa)',
    symbol: 'ං',
    symbolName: 'බිංදුව',
    sound: 'Nasal "ng" / "ung" sound (like "sing")',
    vowelEffect: '+ ng (ung)',
    exampleBase: 'ක',
    exampleCombined: 'කං',
    exampleWord: 'සිංහල (sinhala)',
    exampleMeaning: 'Sinhala',
    description: 'Adds a soft nasal "ng" sound at the end of the syllable.'
  }
];

export const PILLAM_CONSONANTS = [
  { char: 'ක', name: 'Ka' },
  { char: 'ග', name: 'Ga' },
  { char: 'ච', name: 'Cha' },
  { char: 'ජ', name: 'Ja' },
  { char: 'ට', name: 'Ta' },
  { char: 'ඩ', name: 'Da' },
  { char: 'ත', name: 'Tha' },
  { char: 'ද', name: 'Dha' },
  { char: 'න', name: 'Na' },
  { char: 'ප', name: 'Pa' },
  { char: 'බ', name: 'Ba' },
  { char: 'ම', name: 'Ma' },
  { char: 'ය', name: 'Ya' },
  { char: 'ර', name: 'Ra' },
  { char: 'ල', name: 'La' },
  { char: 'ව', name: 'Va' },
  { char: 'ස', name: 'Sa' },
  { char: 'හ', name: 'Ha' },
  { char: 'ළ', name: 'La' },
  { char: 'ෆ', name: 'Fa' },
];

/**
 * Combines any base consonant with a Pillam modifier to form the exact Sinhala glyph.
 */
export function combinePillam(consonant: string, pillamSymbol: string): string {
  if (pillamSymbol === '්') return consonant + '\u0DCA';
  if (pillamSymbol === 'ා') return consonant + '\u0DCF';
  if (pillamSymbol === 'ැ') return consonant + '\u0DD0';
  if (pillamSymbol === 'ෑ') return consonant + '\u0DD1';
  if (pillamSymbol === 'ි') return consonant + '\u0DD2';
  if (pillamSymbol === 'ී') return consonant + '\u0DD3';
  if (pillamSymbol === 'ු') return consonant + '\u0DD4';
  if (pillamSymbol === 'ූ') return consonant + '\u0DD6';
  if (pillamSymbol === 'ෘ') return consonant + '\u0DD8';
  if (pillamSymbol === 'ෙ') return consonant + '\u0DD9';
  if (pillamSymbol === 'ේ') return consonant + '\u0DDA';
  if (pillamSymbol === 'ෛ') return consonant + '\u0DDB';
  if (pillamSymbol === 'ො') return consonant + '\u0DDC';
  if (pillamSymbol === 'ෝ') return consonant + '\u0DDD';
  if (pillamSymbol === 'ෞ') return consonant + '\u0DDE';
  if (pillamSymbol === 'ං') return consonant + '\u0D82';
  return consonant;
}
