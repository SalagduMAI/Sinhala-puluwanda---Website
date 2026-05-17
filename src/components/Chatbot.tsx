import { useState, useRef, useEffect } from 'react';
import { lessons } from '../data/lessons';

interface ChatbotProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: number;
  role: 'user' | 'bot';
  text: string;
  timestamp: number;
}

// Build a knowledge base from all lessons
const allWords = lessons.flatMap(l => l.words);

const quickReplies = [
  'How do I say hello?',
  'How to order food?',
  'How to ask for directions?',
  'How to say thank you?',
  'Emergency phrases',
  'How to bargain?',
  'Translate: Where is the hotel?',
  'How to say I love Sri Lanka?',
  'Numbers 1 to 10',
  'How to introduce myself?',
];

function findAnswer(input: string): string {
  const q = input.toLowerCase().trim();

  // Direct translation requests
  const translateMatch = q.match(/translate[:\s]+(.+)/i) || q.match(/how (?:do i |to )say[:\s]+(.+)/i) || q.match(/what is[:\s]+(.+?)(?:\s+in sinhala)?$/i);
  if (translateMatch) {
    const term = translateMatch[1].trim().toLowerCase().replace(/[?."']/g, '');
    const found = allWords.find(w =>
      w.english.toLowerCase().includes(term) ||
      term.includes(w.english.toLowerCase())
    );
    if (found) {
      let resp = `**${found.english}** → **${found.sinhala}** (${found.transliteration})`;
      if (found.example) resp += `\n\n📝 Example: *${found.example}*\n↳ ${found.exampleTranslation}`;
      return resp;
    }
  }

  // Sinhala to English lookup
  const sinhalaWord = allWords.find(w => q.includes(w.sinhala) || q.includes(w.transliteration.toLowerCase()));
  if (sinhalaWord) {
    let resp = `**${sinhalaWord.sinhala}** (${sinhalaWord.transliteration}) means **${sinhalaWord.english}**`;
    if (sinhalaWord.example) resp += `\n\n📝 Example: *${sinhalaWord.example}*\n↳ ${sinhalaWord.exampleTranslation}`;
    return resp;
  }

  // Topic matching
  if (q.includes('hello') || q.includes('greet') || q.includes('hi ')) {
    return '🙏 **Hello** in Sinhala is **ආයුබෝවන්** (āyubōvan).\n\nThis literally means "May you live long!" — it\'s used for both hello and welcome.\n\n💡 Casual: You can also say **කොහොමද** (kohomada) = "How are you?"';
  }
  if (q.includes('thank')) {
    return '🙏 **Thank you** = **ස්තූතියි** (sthūthiyi)\n\n**Thank you very much** = **බොහොම ස්තූතියි** (bohoma sthūthiyi)\n\n💡 Sri Lankans really appreciate when foreigners say this!';
  }
  if (q.includes('food') || q.includes('order') || q.includes('eat') || q.includes('restaurant') || q.includes('menu')) {
    return '🍽️ **Ordering food in Sinhala:**\n\n• Menu = කෑම ලැයිස්තුව (kǣma læyisthuva)\n• Rice & curry = බත් සහ කරි (bath saha kari)\n• Water = වතුර (vathura)\n• Less spicy = මිරිස් අඩුවෙන් (miris aḍuven)\n• Delicious! = ඉතාම රසයි! (ithāma rasayi!)\n• The bill = බිල්පත (bilpatha)\n• How much? = කීයද? (kīyada?)\n\n💡 Tip: Most restaurants understand pointing at the menu too!';
  }
  if (q.includes('direction') || q.includes('where') || q.includes('how to get') || q.includes('find')) {
    return '🗺️ **Asking for directions:**\n\n• Where? = කොහේද? (kohēda?)\n• Go straight = ඉදිරියට යන්න (idiriyaṭa yanna)\n• Turn left = වමට හැරෙන්න (vamaṭa hærenna)\n• Turn right = දකුණට හැරෙන්න (dakuṇaṭa hærenna)\n• Stop here = මෙතන නවත්තන්න (methana navaththanna)\n• How far? = කොච්චර දුරද? (kochchara durada?)\n\n💡 Tip: Showing a map on your phone helps a lot!';
  }
  if (q.includes('emergency') || q.includes('help') || q.includes('doctor') || q.includes('hospital') || q.includes('police') || q.includes('sick')) {
    return '🚨 **Emergency phrases:**\n\n• Help me! = මට උදව් කරන්න! (maṭa udav karanna!)\n• I am sick = මම අසනීපයි (mama asanīpayi)\n• I need a doctor = වෛද්‍යවරයෙක් ඕනේ (vaidyavarayek ōnē)\n• Hospital = රෝහල (rōhala)\n• Call police = පොලීසිය කැඳවන්න (polīsiya kændavanna)\n• Ambulance = ඇම්බියුලන්ස් (æmbiyulans)\n\n📞 Emergency numbers: Police 119, Ambulance 110, Fire 111';
  }
  if (q.includes('bargain') || q.includes('shop') || q.includes('price') || q.includes('expensive') || q.includes('cheap') || q.includes('buy') || q.includes('market')) {
    return '🛒 **Shopping & bargaining:**\n\n• How much? = මේක කීයද? (mēka kīyada?)\n• Too expensive! = ගොඩක් වැඩියි! (goḍak vædiyi!)\n• Reduce price = අඩු කරන්න (aḍu karanna)\n• I want this = මට මේක ඕනේ (maṭa mēka ōnē)\n• Do you take cards? = කාඩ් පත ගන්නවද? (kāḍ patha gannavada?)\n\n💡 Tip: Always bargain at markets & with tuk-tuks! Start at 50% of asking price.';
  }
  if (q.includes('tuk') || q.includes('taxi') || q.includes('transport') || q.includes('bus') || q.includes('train')) {
    return '🛺 **Getting around:**\n\n• I need a tuk-tuk = මට ත්‍රී වීල් එකක් ඕනේ (maṭa thrī vīl ekak ōnē)\n• Use the meter! = මීටරය දාන්න (mīṭaraya dānna)\n• To the airport = ගුවන් තොටුපොළට (guvan toṭupoḷaṭa)\n• Stop here = මෙතන නවත්තන්න (methana navaththanna)\n• How long? = කොපමණ වෙලාවද? (kopamaṇa velāvada?)\n\n💡 Tip: Always insist on the meter! Or agree on price before getting in.';
  }
  if (q.includes('number') || q.includes('count') || q.includes('1 to 10') || q.includes('one two')) {
    return '🔢 **Numbers 1–10:**\n\n1 = එක (eka) · 2 = දෙක (deka) · 3 = තුන (thuna)\n4 = හතර (hathara) · 5 = පහ (paha) · 6 = හය (haya)\n7 = හත (hatha) · 8 = අට (aṭa) · 9 = නවය (navaya)\n10 = දහය (dahaya)\n\n💡 Also useful: 20 = විස්ස (vissa), 100 = සියය (siyaya)';
  }
  if (q.includes('love') || q.includes('beautiful') || q.includes('like')) {
    return '❤️ **Expressing feelings:**\n\n• I love Sri Lanka = මම ලංකාවට ආදරෙයි (mama Lankāvaṭa ādareyi)\n• Beautiful = ලස්සනයි (lassanayi)\n• Very kind = බොහොම කාරුණිකයි (bohoma kāruṇikayi)\n• I am happy = මම සතුටුයි (mama sathutui)\n• Nice to meet you = ඔබව දැකීම සතුටක් (obava dækīma sathutakǃ)';
  }
  if (q.includes('introduce') || q.includes('name') || q.includes('myself')) {
    return '👋 **Introducing yourself:**\n\n• My name is... = මගේ නම... (magē nama...)\n• What is your name? = ඔයාගේ නම මොකද? (oyāgē nama mokada?)\n• Where are you from? = ඔයා කොහෙන්ද? (oyā kohenda?)\n• I am from... = මම ... වලින් (mama ... valin)\n• Nice to meet you = ඔබව දැකීම සතුටක්\n\n💡 Sri Lankans love asking where you\'re from!';
  }
  if (q.includes('hotel') || q.includes('room') || q.includes('wifi') || q.includes('check')) {
    return '🏨 **At the hotel:**\n\n• I have a reservation = මට වෙන්කිරීමක් තියෙනවා\n• WiFi password? = WiFi මුරපදය මොකද?\n• No hot water = උණුවතුර නැහැ\n• Breakfast time? = උදේ කෑම කීයටද?\n• Call a taxi = ටැක්සියක් කැඳවන්න\n• Check-out time? = චෙක්-අවුට් කීයටද?\n\n💡 Most hotels in tourist areas speak some English.';
  }
  if (q.includes('sorry') || q.includes('excuse') || q.includes('apologize')) {
    return '🙏 **Apologizing:**\n\n• Sorry / Excuse me = සමාවෙන්න (samāvenna)\n• I don\'t understand = මට තේරෙන්නේ නැහැ (maṭa thērennē næhæ)\n• Do you speak English? = ඉංග්‍රීසි කතා කරනවද? (iṅgrīsi kathā karanavada?)\n\n💡 Sri Lankans are very forgiving and patient with language learners!';
  }
  if (q.includes('goodbye') || q.includes('bye') || q.includes('see you')) {
    return '👋 **Saying goodbye:**\n\n• Goodbye = ගිහින් එන්නම් (gihin ennam) — literally "I\'ll go and come"\n• See you tomorrow = හෙට හමුවෙමු (heṭa hamuvemu)\n• Have a good day = සුබ දවසක් (suba davasak)\n• Good night = සුබ රාත්‍රියක් (suba rāthriyak)\n\n💡 ගිහින් එන්නම් implies you\'ll see each other again — very warm!';
  }
  if (q.includes('weather') || q.includes('rain') || q.includes('hot') || q.includes('cold')) {
    return '🌤️ **Weather talk:**\n\n• Today is hot = අද උෂ්ණයි (ada uṣṇayi)\n• It\'s raining = වැස්ස වහිනවා (væssa vahinavā)\n• Beautiful day = ලස්සන දවසක් (lassana davasak)\n• Very cold = ගොඩක් සීතලයි (goḍak sīthalayi)\n\n💡 Sri Lanka is tropical — expect warmth and occasional monsoon rain!';
  }

  // Generic fallback
  const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
  return `🤔 I\'m not sure about that specific phrase, but here\'s something useful:\n\n**${randomWord.english}** = **${randomWord.sinhala}** (${randomWord.transliteration})${randomWord.example ? `\n\n📝 Example: *${randomWord.example}*\n↳ ${randomWord.exampleTranslation}` : ''}\n\n💡 Try asking me:\n• "How do I say hello?"\n• "Translate: Where is the hotel?"\n• "Emergency phrases"\n• "How to order food?"`;
}

export default function Chatbot({ darkMode, isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: 'bot', text: 'ආයුබෝවන්! 🙏 I\'m your Sinhala language assistant.\n\nAsk me anything about Sinhala! I can:\n• 🔤 Translate words & phrases\n• 🗣️ Help with pronunciation\n• 🆘 Give emergency phrases\n• 🍽️ Help you order food\n• 🛺 Navigate transport\n• 🛒 Bargain at shops\n\nType a question or tap a suggestion below!', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: 'user', text: text.trim(), timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const answer = findAnswer(text);
      const botMsg: Message = { id: Date.now() + 1, role: 'bot', text: answer, timestamp: Date.now() };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 400 + Math.random() * 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Chat window */}
      <div className={`relative w-full sm:max-w-lg h-full sm:h-[85vh] sm:max-h-[700px] sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl ${
        darkMode ? 'bg-slate-950 border border-slate-800' : 'bg-white border border-slate-200'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-saffron-500 to-saffron-600 text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl backdrop-blur-sm">🤖</div>
            <div>
              <h3 className="font-bold text-sm">Sinhala Helper</h3>
              <p className="text-[10px] text-white/70 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-leaf-400 rounded-full inline-block" />
                Online — Ask me anything
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/20 transition-colors" aria-label="Close chat">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white rounded-br-md'
                  : darkMode
                    ? 'bg-slate-900 border border-slate-800 text-slate-300 rounded-bl-md'
                    : 'bg-slate-100 text-slate-800 rounded-bl-md'
              }`}>
                {msg.text.split('\n').map((line, i) => {
                  let formatted = line
                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.+?)\*/g, '<em>$1</em>');
                  return <p key={i} className={i > 0 ? 'mt-1.5' : ''} dangerouslySetInnerHTML={{ __html: formatted || '&nbsp;' }} />;
                })}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className={`rounded-2xl px-4 py-3 rounded-bl-md ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-slate-100'}`}>
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-saffron-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-saffron-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-saffron-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick replies */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto flex-shrink-0 scrollbar-hide">
            {quickReplies.slice(0, 5).map((r, i) => (
              <button key={i} onClick={() => sendMessage(r)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:scale-105 ${
                  darkMode ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-saffron-700' : 'bg-slate-100 text-slate-600 border border-slate-200 hover:border-saffron-300'
                }`}>
                {r}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className={`p-3 border-t flex-shrink-0 ${darkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
          <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
            <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)}
              placeholder="Ask in English... e.g. 'How to say thank you?'"
              className={`flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all ${
                darkMode ? 'bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:border-saffron-600' : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-saffron-400'
              }`} />
            <button type="submit" disabled={!input.trim()}
              className="px-4 py-3 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100 shadow-lg shadow-saffron-500/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
