import React, { useState, useRef, useEffect, useCallback } from 'react';
import { lessons, alphabet } from '../data/lessons';

interface ChatbotProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  image?: string;
  timestamp: number;
}

const allWords = lessons.flatMap(l => l.words);

// === SITUATION SURVIVAL GUIDES for foreigners ===
const survivalGuides: Record<string, string> = {
  airport: '✈️ **Arriving at Bandaranaike Airport:**\n\n1. Get a SIM card at Dialog/Mobitel counter (passport needed)\n2. Exchange money at bank counters (better rates than hotel)\n3. Official taxi counter is OUTSIDE arrivals — fixed prices\n4. Say: **ගුවන් තොටුපොළට ස්තුතියි** = "Thanks, airport"\n\n🛺 **To Colombo:** ~1hr, ~LKR 3,500 by taxi\n📱 Get 5GB data SIM for ~LKR 500\n\n⚠️ AVOID touts inside the terminal!',
  tuktuk: '🛺 **Tuk-Tuk Survival Guide:**\n\n**ALWAYS:**\n✅ Ask for meter: **මීටරය දාන්න** (mīṭaraya dānna)\n✅ Agree price BEFORE getting in\n✅ Use PickMe or Uber app for fair prices\n✅ Short trip ~LKR 100-300, across city ~LKR 500-800\n\n**NEVER:**\n❌ Accept first price (always 2-3x too high)\n❌ Get in without price agreement\n❌ Pay in foreign currency\n\n**Key phrases:**\n• Too much! = **ගොඩක් වැඩියි!** (goḍak vædiyi!)\n• How much? = **කීයද?** (kīyada?)\n• Stop here = **මෙතන නවත්තන්න** (methana navaththanna)',
  scam: '⚠️ **Common Scams & How to Avoid:**\n\n1. **"Temple is closed"** — Locals redirect you to a shop. Temple is NEVER closed during hours.\n2. **Gem scam** — "Special price just for you" gems worth nothing. Only buy from certified dealers.\n3. **Tuk-tuk detour** — Driver takes you to "friend\'s shop." Say **නැහැ, මට යන්න ඕනේ** (No, I need to go)\n4. **Currency tricks** — Count your change carefully. Know the denominations.\n5. **"Free" tour guide** — Then demands money. Agree price first or decline.\n\n💡 **Key phrase:** **මට ඕනේ නැහැ, ස්තුතියි** = "I don\'t need it, thanks"',
  temple: '🛕 **Temple Etiquette (VERY IMPORTANT):**\n\n1. ✅ **Remove shoes** = සපත්තු මුත්තන්න (sapaththu muththanna)\n2. ✅ Cover shoulders and knees\n3. ✅ No hats or sunglasses\n4. ✅ Walk clockwise around stupas\n5. ✅ Don\'t point feet at Buddha statues\n6. ✅ Don\'t pose with your back to Buddha\n7. ✅ Sit lower than monks\n8. ✅ Ask before photos: **ඡායාරූපයක් ගන්න පුළුවන්ද?**\n\n🙏 Say **සාදු සාදු සාදු** (sādhu sādhu sādhu) — like "amen"\n\n⚠️ Buddha tattoos can get you DEPORTED from Sri Lanka!',
  food_safety: '🍛 **Food & Water Safety:**\n\n✅ **Safe to eat:**\n• Restaurant rice & curry (freshly cooked)\n• Kottu roti from busy places\n• Fresh fruit (peel yourself)\n• Bottled water (check seal)\n• Hot tea/coffee\n\n⚠️ **Be careful:**\n• Street food from very quiet stalls\n• Tap water (NEVER drink)\n• Ice in cheap restaurants\n• Pre-cut fruit from vendors\n• Buffets sitting in the sun\n\n**Useful phrases:**\n• No ice = **අයිස් එපා** (ais epā)\n• Bottled water = **බෝතල් වතුර** (bōthal vathura)\n• Is this spicy? = **මේක කටු ද?** (mēka kaṭuda?)\n• Less spicy = **මිරිස් අඩුවෙන්** (miris aḍuven)',
  money: '💰 **Money Guide for Sri Lanka:**\n\n**Currency:** Sri Lankan Rupee (LKR)\n~1 USD = ~325 LKR (check current rate)\n\n**Tips:**\n• ATMs everywhere — use Commercial Bank, HNB\n• Visa/Mastercard accepted at most hotels/shops\n• Always carry cash for tuk-tuks, small shops, temples\n• Tip 10% at restaurants\n• Round up tuk-tuk fare\n\n**Key phrases:**\n• How much? = **කීයද?** (kīyada?)\n• Too expensive = **ගොඩක් වැඩියි** (goḍak vædiyi)\n• Do you take cards? = **කාඩ් පත ගන්නවද?** (kāඩ් patha gannavada?)\n• Change/coins = **සිල්ලර** (sillara)\n• Receipt = **රිසිට්පත** (risiṭpatha)',
  first_day: '🌴 **Your First Day in Sri Lanka — Cheat Sheet:**\n\n**Morning:**\n1. 🙏 Say **ආයුබෝවන්** (āyubōvan) to everyone = Hello\n2. ☕ Order tea: **කිරි තේ එකක්** (kiri thē ekak) = Milk tea\n3. 💰 Know: 1 USD ≈ 325 LKR\n\n**Getting Around:**\n4. 🛺 Tuk-tuk: **මීටරය දාන්න** = Use the meter!\n5. 🗺️ Where? = **කොහේද?** (kohēda?)\n\n**Eating:**\n6. 🍛 **බත් සහ කරි** = Rice & curry\n7. 🌶️ **මිරිස් අඩුවෙන්** = Less spicy please\n8. 💧 **බෝතල් වතුර** = Bottled water\n\n**Essentials:**\n9. ✅ **ස්තූතියි** = Thank you\n10. ❌ **නැහැ** = No\n11. 🆘 **උදව් කරන්න** = Help me\n12. 😅 **මට තේරෙන්නේ නැහැ** = I don\'t understand\n\n💡 Smile! Sri Lankans are the friendly people!',
  phone: '📱 **Phone & Internet:**\n\n**Getting a SIM card:**\n• Dialog, Mobitel, or Airtel at airport\n• Need: Passport + ~LKR 500-1000\n• Get: 5-10GB data + calls\n• Say: **මට සිම් කාඩ් එකක් ඕනේ** = I need a SIM card\n\n**WiFi:**\n• Most hotels/cafés have free WiFi\n• Ask: **WiFi මුරපදය මොකද?** = WiFi password?\n\n**Useful apps:**\n• PickMe — tuk-tuk/taxi booking\n• Google Translate — camera translation\n• Maps.me — offline maps\n• Uber — available in Colombo',
};

const quickReplies = [
  'First day survival guide',
  'Tuk-tuk tips',
  'How to order food',
  'Emergency phrases',
  'Temple etiquette',
  'Common scams to avoid',
  'Translate: Where is the hotel?',
  'Money & currency guide',
  'How to bargain',
  'Phone & SIM card',
  'Grammar basics',
  'Cultural tips',
];

const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

// Safe markdown parser that outputs React elements to prevent XSS
function parseMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    if (!line.trim()) {
      return <p key={lineIdx} className="h-4" aria-hidden="true">&nbsp;</p>;
    }

    const elements: React.ReactNode[] = [];
    let remaining = line;
    let keyCounter = 0;

    while (remaining.length > 0) {
      const boldIdx = remaining.indexOf('**');
      const italicIdx = remaining.indexOf('*');

      if (boldIdx === -1 && italicIdx === -1) {
        elements.push(remaining);
        break;
      }

      const isBold = boldIdx !== -1 && (italicIdx === -1 || boldIdx <= italicIdx);
      const token = isBold ? '**' : '*';
      const tokenIdx = isBold ? boldIdx : italicIdx;

      if (tokenIdx > 0) {
        elements.push(remaining.substring(0, tokenIdx));
      }

      const nextRemaining = remaining.substring(tokenIdx + token.length);
      const closeIdx = nextRemaining.indexOf(token);

      if (closeIdx === -1) {
        elements.push(token);
        remaining = nextRemaining;
      } else {
        const innerText = nextRemaining.substring(0, closeIdx);
        if (isBold) {
          elements.push(<strong key={keyCounter++} className="font-bold">{innerText}</strong>);
        } else {
          elements.push(<em key={keyCounter++} className="italic">{innerText}</em>);
        }
        remaining = nextRemaining.substring(closeIdx + token.length);
      }
    }

    return (
      <p key={lineIdx} className={lineIdx > 0 ? 'mt-1' : ''}>
        {elements}
      </p>
    );
  });
}

function findAnswer(input: string): string {
  const q = input.toLowerCase().trim();

  // === PHOTO/IMAGE SCAN RESPONSE ===
  if (q === '__image_scanned__') {
    return '📸 **Photo Received!**\n\nSince this application runs entirely client-side, I cannot automatically extract text (OCR) from your image.\n\n🔍 **How to get a translation:**\n1. Type the Sinhala letters you see in the photo\n2. Or describe what the sign/menu item says\n3. I will translate it for you!\n\n**Common signs in Sri Lanka:**\n• **ඇතුල් වීම** = Entrance\n• **පිටවීම** = Exit\n• **වැසිකිළිය** = Toilet/Restroom\n• **ආපනශාලාව** = Restaurant\n• **ඖෂධ ශාලාව** = Pharmacy\n• **බස් නැවතුම** = Bus Stop\n• **රෝහල** = Hospital\n• **පොලීසිය** = Police\n• **පිවිසීම තහනම්** = No Entry\n\n💡 Type the Sinhala text you see, and I\'ll explain what it means!';
  }

  // === SURVIVAL GUIDES (foreigners) ===
  if (q.includes('first day') || q.includes('just arrived') || q.includes('cheat sheet') || q.includes('survival guide') || q.includes('new to sri lanka') || q.includes('just landed')) return survivalGuides.first_day;
  if (q.includes('tuk') && (q.includes('tip') || q.includes('guide') || q.includes('safe') || q.includes('how'))) return survivalGuides.tuktuk;
  if (q.includes('scam') || q.includes('cheat') || q.includes('fraud') || q.includes('trick') || q.includes('rip off') || q.includes('careful')) return survivalGuides.scam;
  if (q.includes('temple') && (q.includes('etiquette') || q.includes('rule') || q.includes('visit') || q.includes('how') || q.includes('dress'))) return survivalGuides.temple;
  if ((q.includes('food') && q.includes('safe')) || q.includes('water safe') || q.includes('drink water') || q.includes('street food') || q.includes('get sick')) return survivalGuides.food_safety;
  if (q.includes('money') && (q.includes('guide') || q.includes('tip') || q.includes('exchange') || q.includes('currency') || q.includes('atm') || q.includes('rupee'))) return survivalGuides.money;
  if (q.includes('airport') || q.includes('just landed') || q.includes('arrived') || (q.includes('sim') && q.includes('card')) || q.includes('first thing')) return survivalGuides.airport;
  if (q.includes('phone') || q.includes('internet') || q.includes('sim') || q.includes('data plan') || q.includes('wifi') || q.includes('app')) return survivalGuides.phone;

  // === FREE-FORM CONVERSATION ===
  if (q.includes('who are you') || q.includes('what are you') || q === 'hi' || q === 'hello' || q === 'hey') {
    return '🤖 **ආයුබෝවන්!** I\'m your Sri Lanka survival assistant!\n\nI\'m designed specifically to help **foreigners visiting Sri Lanka** communicate with local Sinhalese people.\n\nI can help you:\n🗣️ Translate any phrase\n🛺 Navigate tuk-tuks, buses\n🍛 Order food safely\n🏥 Handle emergencies\n🛕 Visit temples properly\n⚠️ Avoid common scams\n📸 Scan photos of signs\n📐 Learn grammar\n\nWhat situation are you in? Just describe it!';
  }
  if (q.includes('i\'m lost') || q.includes('im lost') || q.includes('i am lost') || q.includes('can\'t find')) {
    return '😰 **Lost? Here\'s what to do:**\n\n1. **Don\'t panic** — Sri Lankans are very helpful!\n2. **Ask anyone:** **සමාවෙන්න, මට උදව් කරන්න** = "Excuse me, help me"\n3. **Show your hotel name** on your phone\n4. **Ask:** **මේ හෝටලයට කොහොමද යන්නේ?** = "How to get to this hotel?"\n5. Use **Google Maps** offline (download map before)\n6. **Call your hotel** — front desk will guide the tuk-tuk driver\n\n📞 Tourist Police: **011-242-1052**\n📞 Police Emergency: **119**\n\n💡 Screenshot your hotel address in Sinhala!';
  }
  if (q.includes('i\'m sick') || q.includes('im sick') || q.includes('feeling sick') || q.includes('diarrhea') || q.includes('vomit') || q.includes('fever') || q.includes('stomach')) {
    return '🏥 **Feeling Sick? Immediate Steps:**\n\n**Say to anyone:** **මට වෛද්‍යවරයෙක් ඕනේ** = "I need a doctor"\n\n**Common issues for tourists:**\n• Stomach: **මගේ බඩ රිදෙනවා** = My stomach hurts\n• Fever: **මට උණ තියෙනවා** = I have a fever\n• Allergy: **මට අසාත්මිකතාවයක් තියෙනවා** = I have an allergy\n\n**Pharmacies** (ඖෂධ ශාලාව) are everywhere — no prescription needed for basics.\n\n📞 **Ambulance: 110**\n📞 **Tourist Police: 011-242-1052**\n\n💡 Keep your hotel number saved — they\'ll help arrange a doctor!';
  }
  if (q.includes('raining') || q.includes('monsoon') || q.includes('when to visit') || q.includes('best time') || q.includes('season')) {
    return '🌧️ **Weather & Best Time to Visit:**\n\n**Two monsoon seasons:**\n• Southwest: May–September (wet on west coast)\n• Northeast: October–January (wet on east coast)\n\n**Best times:**\n• West/South coast: December–March ☀️\n• East coast: April–September ☀️\n• Hill country: January–April ☀️\n• Cultural Triangle: January–September\n\n**What to say:**\n• Is it going to rain? = **වැස්ස එයිද?** (væssa eyida?)\n• It\'s hot = **උෂ්ණයි** (uṣṇayi)\n• I need an umbrella = **මට කුඩයක් ඕනේ** (maṭa kuḍayak ōnē)';
  }
  if (q.includes('polite') || q.includes('respect') || q.includes('offend') || q.includes('rude') || q.includes('manners') || q.includes('do and don')) {
    return '🙏 **Do\'s and Don\'ts in Sri Lanka:**\n\n**DO ✅:**\n• Use right hand for eating/giving\n• Remove shoes at temples/homes\n• Say **ආයුබෝවන්** with palms together\n• Dress modestly at religious sites\n• Ask before photographing people\n• Stand for national anthem\n\n**DON\'T ❌:**\n• Touch someone\'s head\n• Point with your finger (use whole hand)\n• Show the soles of your feet\n• Turn your back to Buddha statues\n• Get Buddha tattoos (deportation risk!)\n• Disrespect monks or religious items\n• Raise your voice in anger publicly\n\n💡 **When in doubt:** Smile and say **සමාවෙන්න** (sorry)!';
  }
  if (q.includes('safe') && (q.includes('sri lanka') || q.includes('travel') || q.includes('is it'))) {
    return '🛡️ **Is Sri Lanka Safe?**\n\nYes! Sri Lanka is generally **very safe** for tourists.\n\n✅ **Safe:** Violent crime against tourists is very rare\n✅ People are incredibly hospitable and helpful\n✅ Solo female travelers are welcome (use common sense)\n\n⚠️ **Watch out for:**\n• Petty theft in crowded areas (bag snatching)\n• Tuk-tuk/taxi overcharging\n• Gem/jewelry scams\n• Unlicensed tour guides\n• Strong ocean currents (swim where locals swim)\n\n📞 **Emergency:** Police 119, Ambulance 110, Fire 111\n📞 **Tourist Police:** 011-242-1052\n\n💡 Keep photocopies of your passport separately!';
  }

  // === APP NAVIGATION ===
  if (q.includes('how to use') || q.includes('what can i do') || q.includes('features') || q.includes('help me use')) {
    return '📱 **How to use this app:**\n\n1. 📖 **Alphabet** — 60 Sinhala letters with male/female voice\n2. 📚 **12 Lessons** — 144 real-world phrases with flip cards\n3. 🧪 **Quizzes** — Test & earn XP after each lesson\n4. 🃏 **Word Match** — Memory game for vocabulary\n5. 💬 **6 Conversations** — Real dialogues step-by-step\n6. 🤖 **AI Chatbot** — That\'s me! Ask anything\n7. 📸 **Photo Scan** — Scan signs/menus (camera icon)\n8. 📊 **Dashboard** — Track XP, level, achievements\n\n💡 Start with "First day survival guide"!';
  }
  if (q.includes('lesson') && (q.includes('what') || q.includes('list') || q.includes('available') || q.includes('show') || q.includes('all'))) {
    const list = lessons.map(l => `${l.icon} **${l.title}** (${l.words.length} phrases)`).join('\n');
    return `📚 **All 12 Lessons:**\n\n${list}\n\n💡 Start with Lesson 1 "Survival Basics"!`;
  }
  if (q.includes('alphabet') && (q.includes('tell') || q.includes('about') || q.includes('how many') || q.includes('learn'))) {
    return `📖 **Sinhala Alphabet:** ${alphabet.length} letters total\n• 18 vowels (ස්වර)\n• 42 consonants (ව්‍යංජන)\n• 5 pre-nasalized stops unique to Sinhala\n\n🔊 Toggle male/female voice in the Alphabet section!`;
  }
  if (q.includes('achievement') || q.includes('badge') || q.includes('xp') || q.includes('level') || q.includes('points')) {
    return '🏆 **XP System:** Learn word +10 XP · Quiz correct +15 XP · Perfect quiz +50 XP · Match game +30 XP · Level up every 100 XP\n\n14 Achievements to unlock — check Dashboard (📊)!';
  }

  // === GRAMMAR ===
  if (q.includes('grammar') || q.includes('sentence structure') || q.includes('word order')) return '📐 **Sinhala Grammar:**\n\n**Word Order:** Subject → Object → Verb (SOV)\n• "I eat rice" = මම බත් කනවා (I + rice + eat)\n\n**Rules:**\n1. Verbs at END\n2. Adjectives BEFORE nouns\n3. Questions: add -ද? at end\n4. Negation: නැහැ (næhæ)\n5. No verb conjugation by person!\n\n💡 Ask me about pronouns, tenses, or plurals!';
  if (q.includes('pronoun')) return '👤 **Pronouns:**\n• I = මම · You = ඔයා (informal) / ඔබ (formal)\n• He = ඔහු · She = ඇය · We = අපි · They = ඔවුන්\n💡 Use ඔබ with elders for respect!';
  if (q.includes('verb') || q.includes('tense')) return '🔄 **Verbs:** Present: ...නවා · Past: varies · Future: ...නවා/...නම්\n\nCommon: කනවා (eat) · බොනවා (drink) · යනවා (go) · එනවා (come) · කරනවා (do) · බලනවා (see)';
  if (q.includes('plural')) return '📝 **Plurals:** ළමයා→ළමයි · ගස→ගස් · මල→මල් · Drop last vowel or add -වරු/-ලා';

  // === STANDARD TRANSLATIONS ===
  const translateMatch = q.match(/translate[:\s]+(.+)/i) || q.match(/how (?:do i |to )say[:\s]+(.+)/i) || q.match(/what(?:'s| is)[:\s]+(.+?)(?:\s+in sinhala)?$/i);
  if (translateMatch) {
    const term = translateMatch[1].trim().toLowerCase().replace(/[?."']/g, '');
    const found = allWords.find(w => w.english.toLowerCase().includes(term) || term.includes(w.english.toLowerCase()));
    if (found) {
      let r = `**${found.english}** → **${found.sinhala}** (${found.transliteration})`;
      if (found.example) r += `\n\n📝 *${found.example}*\n↳ ${found.exampleTranslation}`;
      return r;
    }
  }
  const sw = allWords.find(w => q.includes(w.sinhala) || q.includes(w.transliteration.toLowerCase()));
  if (sw) {
    let r = `**${sw.sinhala}** (${sw.transliteration}) = **${sw.english}**`;
    if (sw.example) r += `\n📝 *${sw.example}* — ${sw.exampleTranslation}`;
    return r;
  }

  if (q.includes('hello') || q.includes('greet')) return '🙏 **Hello** = **ආයුබෝවන්** (āyubōvan)\n💡 Casual: **කොහොමද** = How are you?';
  if (q.includes('thank')) return '🙏 **Thank you** = **ස්තූතියි** · **Very much** = **බොහොම ස්තූතියි**';
  if (q.includes('food') || q.includes('order') || q.includes('eat') || q.includes('restaurant') || q.includes('menu')) return '🍽️ **Food:** Menu=කෑම ලැයිස්තුව · Rice&curry=බත් සහ කරි · Water=වතුර · Less spicy=මිරිස් අඩුවෙන් · Bill=බිල්පත · How much?=කීයද?\n\n💡 Full lesson: Lesson 2!';
  if (q.includes('direction') || q.includes('where') || q.includes('how to get')) return '🗺️ Where?=කොහේද? · Straight=ඉදිරියට · Left=වමට · Right=දකුණට · Stop=මෙතන නවත්තන්න · How far?=කොච්චර දුරද?\n\n💡 Full lesson: Lesson 3!';
  if (q.includes('emergency') || q.includes('help') || q.includes('doctor') || q.includes('hospital') || q.includes('police')) return '🚨 Help!=මට උදව් කරන්න! · Sick=මම අසනීපයි · Doctor=වෛද්‍යවරයෙක් ඕනේ · Hospital=රෝහල · Police=පොලීසිය\n\n📞 Police 119 · Ambulance 110 · Fire 111 · Tourist Police 011-242-1052';
  if (q.includes('bargain') || q.includes('shop') || q.includes('price') || q.includes('expensive') || q.includes('market')) return '🛒 How much?=මේක කීයද? · Too much!=ගොඩක් වැඩියි! · Reduce=අඩු කරන්න · Cards?=කාඩ් පත ගන්නවද?\n\n💡 Start at 50% of asking price!';
  if (q.includes('tuk') || q.includes('taxi') || q.includes('transport')) return survivalGuides.tuktuk;
  if (q.includes('number') || q.includes('count')) return '🔢 1=එක 2=දෙක 3=තුන 4=හතර 5=පහ 6=හය 7=හත 8=අට 9=නවය 10=දහය 20=විස්ස 100=සියය';
  if (q.includes('love') || q.includes('beautiful')) return '❤️ I love Sri Lanka=මම ලංකාවට ආදරෙයි · Beautiful=ලස්සනයි · Happy=සතුටුයි';
  if (q.includes('introduce') || q.includes('name') || q.includes('myself')) return '👋 My name=මගේ නම... · Your name?=ඔයාගේ නම මොකද? · From where?=ඔයා කොහෙන්ද? · Nice to meet you=ඔබව දැකීම සතුටක්';
  if (q.includes('hotel') || q.includes('room') || q.includes('check')) return '🏨 Reservation=මට වෙන්කිරීමක් තියෙනවා · WiFi?=WiFi මුරපදය මොකද? · Breakfast?=උදේ කෑම කීයටද? · Taxi=ටැක්සියක් කැඳවන්න';
  if (q.includes('sorry') || q.includes('excuse')) return '🙏 Sorry=සමාවෙන්න · Don\'t understand=මට තේරෙන්නේ නැහැ · English?=ඉංග්‍රීසි කතා කරනවද?';
  if (q.includes('goodbye') || q.includes('bye')) return '👋 Goodbye=ගිහින් එන්නම් (I\'ll go & come) · Tomorrow=හෙට හමුවෙමු · Good night=සුබ රාත්‍රියක්';
  if (q.includes('weather') || q.includes('rain') || q.includes('hot') || q.includes('cold')) return '🌤️ Hot=උෂ්ණයි · Rain=වැස්ස වහිනවා · Cold=සීතලයි · Umbrella=කුඩය';
  if (q.includes('culture') || q.includes('custom') || q.includes('etiquette') || q.includes('tip')) return survivalGuides.temple;
  if (q.includes('dark mode') || q.includes('theme')) return '🌙 Toggle sun/moon icon in navbar. Full glassmorphism dark theme!';

  const rw = allWords[Math.floor(Math.random() * allWords.length)];
  return `🤔 I don't have that exact phrase, but here's something useful:\n\n**${rw.english}** = **${rw.sinhala}** (${rw.transliteration})${rw.example ? `\n📝 *${rw.example}* — ${rw.exampleTranslation}` : ''}\n\n💡 Try asking:\n• "First day survival guide"\n• "Common scams to avoid"\n• "Temple etiquette"\n• "I\'m lost, help!"\n• "Is Sri Lanka safe?"`;
}

export default function Chatbot({ darkMode, isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const typingTimeoutRef = useRef<number | null>(null);
  const focusTimeoutRef = useRef<number | null>(null);

  // Initialize chatbot messages safely on mount
  useEffect(() => {
    setMessages([
      {
        id: generateUUID(),
        role: 'bot',
        text: '🙏 **ආයුබෝවන්! Welcome to Sri Lanka!**\n\nI\'m your survival assistant for communicating with Sinhalese people.\n\n🆕 **New in v6.1.3:**\n• 📸 Scan photos of signs/menus\n• 🛺 Tuk-tuk & scam survival guides\n• 🛕 Temple etiquette\n• 💰 Money & currency tips\n• 🏥 Medical emergency phrases\n\nAsk me anything or tap a suggestion below!',
        timestamp: Date.now()
      }
    ]);
  }, []);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current !== null) window.clearTimeout(typingTimeoutRef.current);
      if (focusTimeoutRef.current !== null) window.clearTimeout(focusTimeoutRef.current);
    };
  }, []);

  // Scroll messages viewport
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Handle focus when modal opens
  useEffect(() => {
    if (isOpen) {
      focusTimeoutRef.current = window.setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Focus trap + Escape closing for accessibility (a11y)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const elements = Array.from(focusableElements) as HTMLElement[];
        if (elements.length === 0) return;

        const first = elements[0];
        const last = elements[elements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    
    const userMsgId = generateUUID();
    const botMsgId = generateUUID();

    setMessages(prev => {
      const next = [...prev, { id: userMsgId, role: 'user' as const, text: text.trim(), timestamp: Date.now() }];
      return next.slice(-40); // cap context size to last 40 messages
    });
    
    setInput('');
    setIsTyping(true);

    if (typingTimeoutRef.current !== null) {
      window.clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      setMessages(prev => {
        const next = [...prev, { id: botMsgId, role: 'bot' as const, text: findAnswer(text), timestamp: Date.now() }];
        return next.slice(-40);
      });
      setIsTyping(false);
    }, 400 + Math.random() * 400);
  }, []);

  // Photo scan handler — client side representation only (no API backend)
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic file validation
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size exceeds 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const userMsgId = generateUUID();
      const botMsgId = generateUUID();

      setMessages(prev => [
        ...prev,
        {
          id: userMsgId,
          role: 'user' as const,
          text: '📸 I scanned this photo:',
          image: dataUrl,
          timestamp: Date.now()
        }
      ].slice(-40));
      
      setIsTyping(true);

      if (typingTimeoutRef.current !== null) {
        window.clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = window.setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: botMsgId,
            role: 'bot' as const,
            timestamp: Date.now(),
            text: '📸 **Photo received!** Since this app runs entirely offline/client-side, I cannot automatically extract text (OCR) from your image.\n\n🔍 **How to get a translation:**\n1. Type the Sinhala letters you see in the photo\n2. Or describe the sign/menu item\n3. I will translate it for you!\n\n**Common signs in Sri Lanka:**\n• **ඇතුල් වීම** = Entrance\n• **පිටවීම** = Exit\n• **වැසිකිළිය** = Toilet/Restroom\n• **ආපනශාලාව** = Restaurant\n• **ඖෂධ ශාලාව** = Pharmacy\n• **බස් නැවතුම** = Bus Stop\n• **රෝහල** = Hospital\n• **පොලීසිය** = Police\n• **පිවිසීම තහනම්** = No Entry\n\n💡 Type the Sinhala text you see, and I\'ll explain what it means!'
          }
        ].slice(-40));
        setIsTyping(false);
      }, 1000 + Math.random() * 500);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} aria-hidden="true" />
      
      {/* Modal Container */}
      <div 
        ref={modalRef} 
        role="dialog" 
        aria-modal="true" 
        aria-label="Survival Chatbot Helper"
        className={`relative w-full sm:max-w-lg h-[100dvh] sm:h-[88vh] sm:max-h-[760px] sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl animate-scale-in ${
          darkMode ? 'bg-slate-950 border border-slate-800' : 'bg-white border border-slate-200'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-saffron-500 to-saffron-600 text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl backdrop-blur-sm" aria-hidden="true">🤖</div>
            <div>
              <h3 className="font-bold text-sm">Sri Lanka Survival Helper</h3>
              <p className="text-[10px] text-white/70 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-leaf-400 rounded-full animate-pulse" />
                For foreigners • Translation • Safety • Culture
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/20 transition-colors" aria-label="Close Chatbot">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages list */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white rounded-br-md' 
                  : darkMode ? 'bg-slate-900 border border-slate-800 text-slate-300 rounded-bl-md' : 'bg-slate-100 text-slate-800 rounded-bl-md'
              }`}>
                {msg.image && (
                  <img src={msg.image} alt="Scanned view" className="w-full max-h-48 object-cover rounded-xl mb-2 border border-white/20" />
                )}
                <div className="space-y-1">
                  {parseMarkdown(msg.text)}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className={`rounded-2xl px-4 py-3 rounded-bl-md ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-slate-100'}`} aria-label="Bot is typing">
                <div className="flex gap-1.5" aria-hidden="true">
                  <span className="w-2 h-2 rounded-full bg-saffron-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-saffron-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-saffron-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick replies */}
        {messages.length <= 2 && (
          <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto flex-shrink-0 scrollbar-none">
            {quickReplies.slice(0, 6).map((r, i) => (
              <button key={i} onClick={() => sendMessage(r)}
                className={`flex-shrink-0 px-2.5 py-1.5 rounded-full text-[10px] font-medium hover:scale-105 transition-all ${
                  darkMode ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600' : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div className={`p-3 border-t flex-shrink-0 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
            {/* Camera scanner */}
            <button 
              type="button" 
              onClick={() => fileRef.current?.click()}
              className={`flex-shrink-0 p-3 rounded-xl transition-all hover:scale-105 ${
                darkMode ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-saffron-700 hover:text-saffron-400' : 'bg-slate-100 text-slate-500 border border-slate-200 hover:border-saffron-300 hover:text-saffron-500'
              }`}
              aria-label="Scan sign or menu photo"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="hidden" />

            <input 
              ref={inputRef} 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)}
              placeholder="Describe your situation..."
              className={`flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all ${
                darkMode ? 'bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:border-saffron-600' : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-saffron-400'
              }`} 
            />
            
            <button 
              type="submit" 
              disabled={!input.trim()}
              className="flex-shrink-0 px-4 py-3 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-40 shadow-lg shadow-saffron-500/20"
              aria-label="Send Message"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
          <p className={`text-[9px] mt-1.5 text-center ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
            📸 Tap camera to upload photo • Type questions or situations
          </p>
        </div>
      </div>
    </div>
  );
}
