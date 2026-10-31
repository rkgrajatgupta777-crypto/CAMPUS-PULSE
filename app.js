/**
 * Campus Pulse - Intelligent Student Hub
 * Built for Google for Developers | PromptWars x CSSS
 */

// --- INITIAL STATE & DEMO DATA ---
const DEFAULT_NOTICES = [
  {
    id: "notice_1",
    title: "Google On-Campus Placement Drive 2026",
    category: "Placement",
    priority: "urgent",
    date: getRelativeDateString(0), // Today!
    time: "10:00 AM sharp",
    venue: "Main Auditorium (Block A)",
    description: "Associate Software Engineer hiring drive. Mandatory formal dress code.",
    actionItems: [
      "Bring 2 hard copies of updated resume",
      "Carry College ID card & Govt photo ID",
      "Register on TPO portal before reporting"
    ],
    links: ["https://forms.gle/xyzCampusDrive"],
    completed: false,
    rawText: "🚨 *URGENT NOTICE - PLACEMENT CELL* 🚨\nDear Final Year B.Tech Students,\nGoogle is conducting an on-campus hiring drive for Associate Software Engineer roles!\nDate: Today at 10:00 AM sharp\nVenue: Main Auditorium (Block A)\nMandatory: Bring 2 hard copies of resume, college ID card, and formal dress code.\nLink: https://forms.gle/xyzCampusDrive"
  },
  {
    id: "notice_2",
    title: "CS301 Database Systems - Internal Assignment 2 Due",
    category: "Deadline",
    priority: "urgent",
    date: getRelativeDateString(1), // Tomorrow!
    time: "4:00 PM",
    venue: "Room 204 (CS Dept)",
    description: "Submit written assignment solutions with query execution screenshots. Late submissions will receive zero credit.",
    actionItems: [
      "Print SQL execution query plans",
      "Submit physical spiral copy to Prof. Rao",
      "Attach student roll number slip"
    ],
    links: [],
    completed: false,
    rawText: "Academics Office Notice: All 2nd/3rd year CSE students must submit Assignment 2 for Database Management Systems on or before tomorrow by 4:00 PM at Room 204. Late submissions will not be accepted."
  },
  {
    id: "notice_3",
    title: "CSSS HackSprint 2026 Annual Hackathon",
    category: "Event",
    priority: "high",
    date: getRelativeDateString(3), // 3 days from now
    time: "9:00 AM - 5:00 PM",
    venue: "CS Lab 4 & Seminar Hall 2",
    description: "Annual 24-hour hackathon with cash prizes up to ₹50,000! Teams of 2 to 4 members.",
    actionItems: [
      "Form team of 2-4 members",
      "Submit team GitHub repo URL by Friday",
      "Bring extension cords and laptops"
    ],
    links: ["https://hacksprint2026.dev"],
    completed: false,
    rawText: "Hey guys! CSSS club is hosting HackSprint 2026 hackathon! Cash prizes up to 50k!! When: Saturday 9:00 AM to 5:00 PM. Where: CS Lab 4 & Seminar Hall 2. Team of 2-4. Register link: https://hacksprint2026.dev"
  },
  {
    id: "notice_4",
    title: "Mid-Term Exam Schedule Revision (Maths & Algorithms)",
    category: "Academic",
    priority: "medium",
    date: getRelativeDateString(5), // 5 days from now
    time: "2:00 PM - 5:00 PM",
    venue: "Examination Hall B (Science Block)",
    description: "Discrete Maths (CS202) exam rescheduled. Hall tickets available on university student ERP portal.",
    actionItems: [
      "Download revised hall ticket from ERP",
      "Non-programmable scientific calculators only allowed"
    ],
    links: ["https://erp.college.edu/exams"],
    completed: false,
    rawText: "Examination Branch: Please note that the mid-term exam for Discrete Mathematics has been moved to Examination Hall B at 2:00 PM. Please carry your ERP hall ticket."
  },
  {
    id: "notice_5",
    title: "Annual Cultural Fest 'Tarang 2026' Auditions",
    category: "General",
    priority: "low",
    date: getRelativeDateString(8), // Next week
    time: "5:00 PM",
    venue: "Open Air Theatre (OAT)",
    description: "Auditions for music band, choreography, drama, and anchor crew.",
    actionItems: [
      "Prepare a 2-minute performance piece",
      "Register at the cultural club desk"
    ],
    links: [],
    completed: true,
    rawText: "Cultural Committee: Auditions for Tarang 2026 starting next week at OAT 5:00 PM. All enthusiastic students are welcome!"
  }
];

// Helper to get ISO date string relative to current date (e.g. 0 = today, 1 = tomorrow)
function getRelativeDateString(daysOffset) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Global App State
let state = {
  notices: [],
  searchQuery: "",
  categoryFilter: "all",
  statusFilter: "all",
  viewMode: "cards", // "cards", "calendar", "timeline"
  calendarMonth: new Date().getMonth(),
  calendarYear: new Date().getFullYear(),
  selectedCalendarDate: getRelativeDateString(0),
  aiMode: "local", // "local" or "gemini"
  geminiApiKey: ""
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  loadStoredData();
  setupTheme();
  updateCategoryBadges();
  renderAllViews();
  checkUrgentAlerts();
});

// Load persistent data from LocalStorage
function loadStoredData() {
  try {
    const saved = localStorage.getItem('campus_pulse_notices');
    if (saved) {
      state.notices = JSON.parse(saved);
    } else {
      state.notices = [...DEFAULT_NOTICES];
      saveToStorage();
    }

    const savedMode = localStorage.getItem('campus_pulse_ai_mode');
    if (savedMode) state.aiMode = savedMode;

    const savedKey = localStorage.getItem('campus_pulse_gemini_key');
    if (savedKey) state.geminiApiKey = savedKey;

    updateEngineModeUI();
  } catch (e) {
    console.error('Error loading storage', e);
    state.notices = [...DEFAULT_NOTICES];
  }
}

function saveToStorage() {
  localStorage.setItem('campus_pulse_notices', JSON.stringify(state.notices));
}

// --- THEME HANDLING ---
function setupTheme() {
  const isDark = localStorage.getItem('campus_pulse_dark') === 'true' ||
    (!('campus_pulse_dark' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  updateThemeIcon();
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('campus_pulse_dark', isDark);
  updateThemeIcon();
}

function updateThemeIcon() {
  const isDark = document.documentElement.classList.contains('dark');
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    lucide.createIcons();
  }
}

// --- SMART INPUT & NLP EXTRACTION ---

// Sample notices for quick one-click testing
const SAMPLE_NOTICES = {
  whatsapp_exam: `🚨 *URGENT NOTICE - EXAMINATION CONTROLLER* 🚨
Dear Students,
The Mid-Term examination for CS402 Computer Networks has been rescheduled to tomorrow at 10:30 AM sharp in Seminar Hall C.
⚠️ Strict Notice:
- Bring college ID & signed Hall Ticket
- No smartwatches or phones allowed inside hall
- Seating chart is posted outside Dept notice board.
Check details: https://erp.college.edu/exam-reschedule`,

  whatsapp_placement: `💼 *CAMPUS RECRUITMENT DRIVE: MICROSOFT* 💼
Greetings from Training & Placement Cell!
Microsoft is visiting for Summer 2027 Internships (SDE role)!
📅 Date: ${getRelativeDateString(2)}
⏰ Reporting Time: 8:45 AM
📍 Venue: APJ Abdul Kalam Auditorium
Eligibility: CGPA 7.5+ in B.Tech CSE/IT/ECE.
Documents needed:
1) Two hard copies of resume with photograph
2) College ID & Govt ID proof
3) Formal attire strictly required.
🔗 Register by tonight 11:59 PM: https://forms.gle/msftCampusDrive2026`,

  whatsapp_hackathon: `⚡ Hey coders! Google Developer Groups (GDG) on Campus is organizing "PromptWars 2026"!
🗓️ Saturday (${getRelativeDateString(4)}) at 10:00 AM
📍 Innovation Hub / Lab 5
Exciting prizes, schwag kits, and mentor sessions from industry engineers!
Bring your laptops and enthusiasm. Team size 1-3 members.
Register here: https://gdg.community.dev/events/promptwars`,

  whatsapp_assignment: `📢 Sub: Submission of Cloud Computing Project Report
All 4th-year teams must submit their finalized capstone project reports to Prof. Banerjee in Room 312 by today 4:30 PM.
Include architecture diagrams, GitHub commits log, and test results.
Late submissions will lose 25% marks per day.`
};

function loadSampleNotice(key) {
  const text = SAMPLE_NOTICES[key];
  if (text) {
    const input = document.getElementById('rawNoticeInput');
    input.value = text;
    showToast('Sample notice loaded! Click "Extract & Categorize".', 'info');
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    input.classList.add('ring-2', 'ring-indigo-500');
    setTimeout(() => input.classList.remove('ring-2', 'ring-indigo-500'), 1200);
  }
}

function clearInput() {
  document.getElementById('rawNoticeInput').value = '';
  document.getElementById('extractionPreviewArea').classList.add('hidden');
}

function scrollToInput() {
  document.getElementById('smartInputSection').scrollIntoView({ behavior: 'smooth' });
  document.getElementById('rawNoticeInput').focus();
}

/**
 * Intelligent Client-Side NLP Engine
 * Extracts: title, date, time, venue, category, priority, action items, links
 */
function localSmartExtract(rawText) {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const cleanText = rawText.replace(/[*_~`]/g, '');

  // 1. EXTRACT TITLE
  let title = "";
  // Check for lines with emojis/brackets like *URGENT NOTICE...*
  const titleCandidate = lines.find(l => {
    const stripped = l.replace(/[*_~`#🚨📢💼⚡📝⚠️]/g, '').trim();
    return stripped.length > 5 && stripped.length < 80 && !stripped.toLowerCase().startsWith('dear');
  });

  if (titleCandidate) {
    title = titleCandidate.replace(/[*_~`#🚨📢💼⚡📝⚠️]/g, '').trim();
    // remove leading prefixes
    title = title.replace(/^(notice|urgent|attention|sub:|subject:)\s*[-:]?\s*/i, '');
  } else if (lines.length > 0) {
    title = lines[0].substring(0, 70);
  } else {
    title = "Campus Announcement";
  }

  // 2. EXTRACT CATEGORY
  let category = "General";
  const lower = cleanText.toLowerCase();

  if (/placement|recruitment|drive|interview|internship|hiring|tpo|resume|company|ctc|package|salary/i.test(lower)) {
    category = "Placement";
  } else if (/exam|mid-term|end-term|quiz|viva|syllabus|hall ticket|marks|course|class|lecture|professor/i.test(lower)) {
    category = "Academic";
  } else if (/hackathon|workshop|gdg|csss|club|fest|audition|sports|competition|prizes|team/i.test(lower)) {
    category = "Event";
  } else if (/submit|submission|assignment|deadline|due|project report|last date|fees/i.test(lower)) {
    category = "Deadline";
  }

  // 3. EXTRACT PRIORITY
  let priority = "medium";
  if (/urgent|critical|mandatory|strict|today|immediately|asap|final call|last date/i.test(lower)) {
    priority = "urgent";
  } else if (/important|tomorrow|rescheduled|prize|drive/i.test(lower)) {
    priority = "high";
  }

  // 4. EXTRACT DATE
  let date = getRelativeDateString(1); // default to tomorrow
  const today = new Date();

  if (/today/i.test(lower)) {
    date = getRelativeDateString(0);
    priority = "urgent";
  } else if (/tomorrow/i.test(lower)) {
    date = getRelativeDateString(1);
    if (priority !== "urgent") priority = "high";
  } else {
    // Check for explicit dates e.g. "Nov 5", "November 5, 2026", "2026-11-05", "12/11/2026"
    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const monthRegex = new RegExp(`(${monthNames.join('|')})[a-z]*\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s*(\\d{4}))?`, 'i');
    const monthMatch = cleanText.match(monthRegex);

    if (monthMatch) {
      const monthStr = monthMatch[1].toLowerCase().substring(0, 3);
      const mIdx = monthNames.indexOf(monthStr);
      const dayNum = parseInt(monthMatch[2], 10);
      const yearNum = monthMatch[3] ? parseInt(monthMatch[3], 10) : today.getFullYear();

      const targetDate = new Date(yearNum, mIdx, dayNum);
      const yyyy = targetDate.getFullYear();
      const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
      const dd = String(targetDate.getDate()).padStart(2, '0');
      date = `${yyyy}-${mm}-${dd}`;
    } else {
      // Check day names (e.g. "this Friday", "Saturday", "Monday")
      const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      for (let i = 0; i < dayNames.length; i++) {
        const dName = dayNames[i];
        if (new RegExp(`\\b${dName}\\b`, 'i').test(lower)) {
          const currentDay = today.getDay();
          let diff = i - currentDay;
          if (diff <= 0) diff += 7; // next occurrence
          date = getRelativeDateString(diff);
          break;
        }
      }
    }
  }

  // 5. EXTRACT TIME
  let time = "10:00 AM";
  const timeRegex = /(\b\d{1,2}(?::\d{2})?\s*(?:am|pm|sharp|hours|hrs)\b|\b\d{1,2}:\d{2}\b)/i;
  const timeMatch = cleanText.match(timeRegex);
  if (timeMatch) {
    time = timeMatch[0].trim();
  }

  // 6. EXTRACT VENUE
  let venue = "Campus Main Building";
  const venueKeywords = /(?:venue|where|location|room|audi|auditorium|hall|lab|oat|theatre|block|center|centre|lawn|online|google meet|zoom)[^:\n,.]*[:\-]?\s*([^,\n.]{3,45})/i;
  const venueMatch = cleanText.match(venueKeywords);
  if (venueMatch && venueMatch[0]) {
    venue = venueMatch[0].replace(/^(venue|where|location)[:\-]?\s*/i, '').trim();
  } else if (/audi|auditorium/i.test(cleanText)) {
    venue = "Main Auditorium";
  } else if (/lab/i.test(cleanText)) {
    venue = "Computer Lab";
  } else if (/online|meet|zoom/i.test(cleanText)) {
    venue = "Online (Google Meet)";
  }

  // 7. EXTRACT LINKS
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const links = cleanText.match(urlRegex) || [];

  // 8. EXTRACT ACTION ITEMS / BULLETS
  const actionItems = [];
  lines.forEach(line => {
    const trimmed = line.trim();
    if (/^[•\-*\d\)]\s*/.test(trimmed) || /bring|submit|register|carry|download|prepare/i.test(trimmed)) {
      const cleanAction = trimmed.replace(/^[•\-*\d\)\s]+/, '').replace(/[*_~`]/g, '').trim();
      if (cleanAction.length > 5 && cleanAction.length < 100 && !actionItems.includes(cleanAction)) {
        actionItems.push(cleanAction);
      }
    }
  });

  if (actionItems.length === 0) {
    actionItems.push("Check announcement details & note schedule in calendar");
  }

  return {
    title: title.length > 6 ? title : "Campus Notice & Update",
    category,
    priority,
    date,
    time,
    venue,
    description: lines.slice(1, 4).join(' ').replace(/[*_~`]/g, '').substring(0, 160) || "Notice details extracted from message.",
    actionItems: actionItems.slice(0, 4),
    links: links.slice(0, 2),
    rawText
  };
}

/**
 * Optional Gemini API Integration
 */
async function geminiSmartExtract(rawText, apiKey) {
  const prompt = `You are the Campus Pulse AI notice parser. Extract structured event/notice information from this messy message.
Message:
"""${rawText}"""

Today is ${new Date().toISOString().split('T')[0]}.

Return ONLY a valid JSON object matching this schema:
{
  "title": "Clean, concise title",
  "category": "Academic" | "Placement" | "Event" | "Deadline" | "General",
  "priority": "urgent" | "high" | "medium" | "low",
  "date": "YYYY-MM-DD",
  "time": "e.g. 10:00 AM",
  "venue": "Venue or Hall or Online",
  "description": "Short 1-2 sentence overview",
  "actionItems": ["Action item 1", "Action item 2"],
  "links": ["https://..."]
}`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
  const parsed = JSON.parse(textOutput);
  parsed.rawText = rawText;
  return parsed;
}

// Handler when user clicks "Extract & Categorize"
async function processNoticeInput() {
  const rawInput = document.getElementById('rawNoticeInput').value.trim();
  if (!rawInput) {
    showToast('Please paste a WhatsApp notice or email first!', 'warning');
    return;
  }

  const extractBtn = document.getElementById('extractBtn');
  extractBtn.disabled = true;
  extractBtn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>AI Parsing...</span>`;
  lucide.createIcons();

  let extracted = null;
  try {
    if (state.aiMode === 'gemini' && state.geminiApiKey) {
      showToast('Calling Gemini 1.5 Flash API...', 'info');
      extracted = await geminiSmartExtract(rawInput, state.geminiApiKey);
    } else {
      // Simulate quick AI thinking for delightful UX
      await new Promise(r => setTimeout(r, 350));
      extracted = localSmartExtract(rawInput);
    }

    renderExtractionPreview(extracted);
    showToast('AI successfully extracted details! Review and confirm.', 'success');
  } catch (err) {
    console.warn('AI API failed, falling back to local extractor', err);
    extracted = localSmartExtract(rawInput);
    renderExtractionPreview(extracted);
    showToast('Extracted using local intelligent engine!', 'info');
  } finally {
    extractBtn.disabled = false;
    extractBtn.innerHTML = `<i data-lucide="cpu" class="w-4 h-4"></i><span>Extract & Categorize</span>`;
    lucide.createIcons();
  }
}

// Render the interactive preview card before saving
function renderExtractionPreview(data) {
  const container = document.getElementById('extractionPreviewArea');
  container.classList.remove('hidden');

  container.innerHTML = `
    <div class="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-600 text-white">
            Extracted Card Preview
          </span>
          <span class="text-xs text-slate-500 font-medium">${data.category} • ${data.priority.toUpperCase()}</span>
        </div>
        <button onclick="document.getElementById('extractionPreviewArea').classList.add('hidden')" class="text-slate-400 hover:text-slate-600 text-xs">Dismiss</button>
      </div>

      <div class="space-y-1">
        <h4 class="font-bold text-slate-900 dark:text-white text-base">${escapeHtml(data.title)}</h4>
        <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
          <span>📅 <strong>Date:</strong> ${data.date}</span>
          <span>⏰ <strong>Time:</strong> ${escapeHtml(data.time)}</span>
          <span>📍 <strong>Venue:</strong> ${escapeHtml(data.venue)}</span>
        </div>
      </div>

      ${data.actionItems && data.actionItems.length > 0 ? `
        <div class="text-xs space-y-1 pt-1">
          <span class="font-semibold text-slate-700 dark:text-slate-300">Action Items:</span>
          <ul class="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400">
            ${data.actionItems.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <div class="pt-2 flex items-center justify-end space-x-2">
        <button onclick="openEditModalForExtracted(${escapeAttr(JSON.stringify(data))})" class="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-1">
          <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
          <span>Edit Details</span>
        </button>
        <button onclick="confirmAndAddNotice(${escapeAttr(JSON.stringify(data))})" class="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm shadow-emerald-600/30">
          <i data-lucide="check" class="w-3.5 h-3.5"></i>
          <span>Add to Campus Hub</span>
        </button>
      </div>
    </div>
  `;
  lucide.createIcons();
}

function confirmAndAddNotice(data) {
  const newNotice = {
    ...data,
    id: "notice_" + Date.now(),
    completed: false
  };

  state.notices.unshift(newNotice);
  saveToStorage();
  updateCategoryBadges();
  renderAllViews();
  checkUrgentAlerts();

  // Clear inputs
  document.getElementById('rawNoticeInput').value = '';
  document.getElementById('extractionPreviewArea').classList.add('hidden');

  showToast(`Added: "${newNotice.title}"!`, 'success');

  // Trigger celebration confetti
  if (typeof confetti === 'function') {
    confetti({ particleCount: 45, spread: 60, origin: { y: 0.7 } });
  }

  // Scroll to notices
  document.getElementById('cardsViewContainer').scrollIntoView({ behavior: 'smooth' });
}

// --- ORGANISED VIEW: RENDERING & FILTERS ---

function handleSearchFilterChange() {
  state.searchQuery = document.getElementById('searchInput').value.trim().toLowerCase();
  const clearBtn = document.getElementById('clearSearchBtn');
  if (clearBtn) {
    if (state.searchQuery) {
      clearBtn.classList.remove('hidden');
    } else {
      clearBtn.classList.add('hidden');
    }
  }
  renderAllViews();
}

function clearSearch() {
  document.getElementById('searchInput').value = '';
  state.searchQuery = '';
  document.getElementById('clearSearchBtn').classList.add('hidden');
  renderAllViews();
}

function setCategoryFilter(cat) {
  state.categoryFilter = cat;
  document.querySelectorAll('.cat-pill').forEach(btn => {
    if (btn.getAttribute('data-category') === cat) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  renderAllViews();
}

function setStatusFilter(status) {
  state.statusFilter = status;
  document.querySelectorAll('.status-pill').forEach(btn => {
    if (btn.getAttribute('data-status') === status) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  renderAllViews();
}

function setViewMode(mode) {
  state.viewMode = mode;
  document.querySelectorAll('.view-pill').forEach(b => b.classList.remove('active'));

  const cardsContainer = document.getElementById('cardsViewContainer');
  const calContainer = document.getElementById('calendarViewContainer');
  const timeContainer = document.getElementById('timelineViewContainer');

  cardsContainer.classList.add('hidden');
  calContainer.classList.add('hidden');
  timeContainer.classList.add('hidden');

  if (mode === 'cards') {
    document.getElementById('viewModeCards').classList.add('active');
    cardsContainer.classList.remove('hidden');
  } else if (mode === 'calendar') {
    document.getElementById('viewModeCalendar').classList.add('active');
    calContainer.classList.remove('hidden');
    renderCalendar();
  } else if (mode === 'timeline') {
    document.getElementById('viewModeTimeline').classList.add('active');
    timeContainer.classList.remove('hidden');
    renderTimeline();
  }
}

function resetFilters() {
  state.searchQuery = "";
  state.categoryFilter = "all";
  state.statusFilter = "all";
  document.getElementById('searchInput').value = "";
  setCategoryFilter('all');
  setStatusFilter('all');
  renderAllViews();
}

// Filter predicate
function getFilteredNotices() {
  const todayStr = getRelativeDateString(0);

  return state.notices.filter(item => {
    // 1. Category filter
    if (state.categoryFilter !== 'all' && item.category !== state.categoryFilter) {
      return false;
    }

    // 2. Status filter
    const daysDiff = getDaysDifference(item.date);
    if (state.statusFilter === 'today' && daysDiff !== 0 && item.priority !== 'urgent') {
      return false;
    }
    if (state.statusFilter === 'upcoming' && daysDiff < 0) {
      return false;
    }
    if (state.statusFilter === 'expired' && daysDiff >= 0) {
      return false;
    }

    // 3. Search query
    if (state.searchQuery) {
      const q = state.searchQuery;
      const haystack = [
        item.title,
        item.venue,
        item.category,
        item.description,
        ...(item.actionItems || [])
      ].join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });
}

function updateCategoryBadges() {
  const counts = { all: state.notices.length, Academic: 0, Placement: 0, Event: 0, Deadline: 0, General: 0 };
  state.notices.forEach(n => {
    if (counts[n.category] !== undefined) counts[n.category]++;
  });

  document.getElementById('badgeCatAll').textContent = counts.all;
  document.getElementById('badgeCatAcademic').textContent = counts.Academic;
  document.getElementById('badgeCatPlacement').textContent = counts.Placement;
  document.getElementById('badgeCatEvent').textContent = counts.Event;
  document.getElementById('badgeCatDeadline').textContent = counts.Deadline;
  document.getElementById('badgeCatGeneral').textContent = counts.General;

  // Stats bar
  const todayStr = getRelativeDateString(0);
  const urgentCount = state.notices.filter(n => !n.completed && (getDaysDifference(n.date) === 0 || n.priority === 'urgent')).length;
  const thisWeekCount = state.notices.filter(n => {
    const diff = getDaysDifference(n.date);
    return diff >= 0 && diff <= 7;
  }).length;
  const completedCount = state.notices.filter(n => n.completed).length;

  document.getElementById('statTotal').textContent = state.notices.length;
  document.getElementById('statToday').textContent = urgentCount;
  document.getElementById('statThisWeek').textContent = thisWeekCount;
  document.getElementById('statCompleted').textContent = completedCount;
}

// Render helper for all active views
function renderAllViews() {
  renderCardsGrid();
  if (state.viewMode === 'calendar') renderCalendar();
  if (state.viewMode === 'timeline') renderTimeline();
}

// Render cards grid
function renderCardsGrid() {
  const container = document.getElementById('noticesGrid');
  const emptyState = document.getElementById('emptyState');
  const filtered = getFilteredNotices();

  if (filtered.length === 0) {
    container.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  container.innerHTML = filtered.map(notice => createNoticeCardHtml(notice)).join('');
  lucide.createIcons();
}

function createNoticeCardHtml(notice) {
  const daysDiff = getDaysDifference(notice.date);
  const isToday = daysDiff === 0;
  const isPast = daysDiff < 0;
  const isTomorrow = daysDiff === 1;

  // Urgency status badge
  let statusBadge = '';
  if (notice.completed) {
    statusBadge = `<span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">Completed</span>`;
  } else if (isToday) {
    statusBadge = `
      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-600 text-white shadow-sm shadow-rose-500/30 animate-pulse">
        <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
        DUE TODAY
      </span>
    `;
  } else if (isTomorrow) {
    statusBadge = `<span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">Due Tomorrow</span>`;
  } else if (isPast) {
    statusBadge = `<span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-200 dark:bg-slate-800 text-slate-500">Expired</span>`;
  } else {
    statusBadge = `<span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">In ${daysDiff} days</span>`;
  }

  // Category badge & icon
  const catStyles = {
    Academic: { bg: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300', icon: 'graduation-cap' },
    Placement: { bg: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300', icon: 'briefcase' },
    Event: { bg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300', icon: 'zap' },
    Deadline: { bg: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300', icon: 'clock' },
    General: { bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300', icon: 'bell' }
  };
  const cat = catStyles[notice.category] || catStyles.General;

  const cardBorderClass = isToday
    ? 'border-rose-400 dark:border-rose-600/80 shadow-md ring-1 ring-rose-400/20'
    : notice.completed
      ? 'border-slate-200 dark:border-slate-800 opacity-70'
      : 'border-slate-200 dark:border-slate-800';

  return `
    <div class="notice-card bg-white dark:bg-slate-900 rounded-2xl border ${cardBorderClass} p-5 flex flex-col justify-between space-y-4">
      
      <!-- Card Top: Category & Status Badge -->
      <div class="flex items-center justify-between gap-2">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${cat.bg}">
          <i data-lucide="${cat.icon}" class="w-3.5 h-3.5"></i>
          <span>${notice.category}</span>
        </span>
        <div class="flex items-center space-x-1.5">
          ${statusBadge}
          <button onclick="toggleNoticeComplete('${notice.id}')" class="p-1 rounded-lg text-slate-400 hover:text-emerald-600 transition" title="${notice.completed ? 'Mark incomplete' : 'Mark completed'}">
            <i data-lucide="${notice.completed ? 'check-circle-2' : 'circle'}" class="w-4 h-4 ${notice.completed ? 'text-emerald-600' : ''}"></i>
          </button>
        </div>
      </div>

      <!-- Card Title & Description -->
      <div class="space-y-1.5">
        <h3 class="font-bold font-display text-base text-slate-900 dark:text-white leading-snug ${notice.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}">
          ${escapeHtml(notice.title)}
        </h3>
        <p class="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          ${escapeHtml(notice.description || '')}
        </p>
      </div>

      <!-- Date, Time & Venue Meta Box -->
      <div class="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-3 text-xs space-y-1.5 border border-slate-100 dark:border-slate-800/80">
        <div class="flex items-center text-slate-700 dark:text-slate-300 space-x-2">
          <i data-lucide="calendar" class="w-3.5 h-3.5 text-indigo-500 shrink-0"></i>
          <span class="font-medium">${formatDateNice(notice.date)}</span>
          <span class="text-slate-300 dark:text-slate-700">•</span>
          <span class="text-slate-500">${escapeHtml(notice.time || 'All Day')}</span>
        </div>
        <div class="flex items-center text-slate-700 dark:text-slate-300 space-x-2 truncate">
          <i data-lucide="map-pin" class="w-3.5 h-3.5 text-rose-500 shrink-0"></i>
          <span class="truncate font-medium">${escapeHtml(notice.venue || 'Campus')}</span>
        </div>
      </div>

      <!-- Action Items Checklist -->
      ${notice.actionItems && notice.actionItems.length > 0 ? `
        <div class="space-y-1">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Required Actions</div>
          <ul class="text-xs space-y-1">
            ${notice.actionItems.map(item => `
              <li class="flex items-start space-x-1.5 text-slate-600 dark:text-slate-300">
                <span class="text-indigo-500 font-bold">•</span>
                <span class="line-clamp-1">${escapeHtml(item)}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}

      <!-- Links (if any) -->
      ${notice.links && notice.links.length > 0 ? `
        <div class="flex items-center gap-1.5 flex-wrap">
          ${notice.links.map(l => `
            <a href="${escapeHtml(l)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center space-x-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
              <i data-lucide="link" class="w-3 h-3"></i>
              <span class="truncate max-w-[200px]">${escapeHtml(l)}</span>
            </a>
          `).join('')}
        </div>
      ` : ''}

      <!-- Card Action Footer -->
      <div class="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <!-- Calendar Integration Buttons -->
        <div class="flex items-center space-x-1">
          <a href="${getGoogleCalendarUrl(notice)}" target="_blank" class="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="Add to Google Calendar">
            <i data-lucide="calendar-plus" class="w-4 h-4"></i>
          </a>
          <button onclick="downloadIcsFile('${notice.id}')" class="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="Download .ICS file">
            <i data-lucide="download" class="w-4 h-4"></i>
          </button>
          <button onclick="copyNoticeText('${notice.id}')" class="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="Copy Notice">
            <i data-lucide="copy" class="w-4 h-4"></i>
          </button>
        </div>

        <!-- Edit & Delete -->
        <div class="flex items-center space-x-1">
          <button onclick="openEditModalById('${notice.id}')" class="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="Edit">
            <i data-lucide="edit-2" class="w-4 h-4"></i>
          </button>
          <button onclick="deleteNotice('${notice.id}')" class="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="Delete">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>

    </div>
  `;
}

// --- CALENDAR VIEW ---

function renderCalendar() {
  const monthTitle = document.getElementById('calendarMonthTitle');
  const daysGrid = document.getElementById('calendarDaysGrid');
  const d = new Date(state.calendarYear, state.calendarMonth, 1);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  monthTitle.textContent = `${monthNames[state.calendarMonth]} ${state.calendarYear}`;

  const firstDayIndex = d.getDay();
  const daysInMonth = new Date(state.calendarYear, state.calendarMonth + 1, 0).getDate();
  const prevMonthDays = new Date(state.calendarYear, state.calendarMonth, 0).getDate();

  let html = '';

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = prevMonthDays - i;
    html += `<div class="calendar-day-cell opacity-30 text-xs text-slate-400 p-1">${dayNum}</div>`;
  }

  // Current month days
  const todayStr = getRelativeDateString(0);
  for (let day = 1; day <= daysInMonth; day++) {
    const mm = String(state.calendarMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const dateStr = `${state.calendarYear}-${mm}-${dd}`;
    const isToday = dateStr === todayStr;
    const isSelected = dateStr === state.selectedCalendarDate;

    // Find notices on this date
    const dayNotices = state.notices.filter(n => n.date === dateStr);

    html += `
      <div 
        onclick="selectCalendarDate('${dateStr}')" 
        class="calendar-day-cell cursor-pointer p-1.5 border ${isSelected ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20' : isToday ? 'border-rose-400 bg-rose-50/30 dark:bg-rose-950/20' : 'border-slate-100 dark:border-slate-800'} rounded-xl"
      >
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-bold ${isToday ? 'w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px]' : 'text-slate-700 dark:text-slate-300'}">
            ${day}
          </span>
          ${dayNotices.length > 0 ? `<span class="text-[9px] font-bold px-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600">${dayNotices.length}</span>` : ''}
        </div>

        <div class="space-y-1 overflow-hidden">
          ${dayNotices.slice(0, 2).map(n => `
            <div class="text-[10px] truncate px-1 py-0.5 rounded font-medium ${n.priority === 'urgent' ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}">
              ${escapeHtml(n.title)}
            </div>
          `).join('')}
          ${dayNotices.length > 2 ? `<div class="text-[9px] text-slate-400 font-semibold">+${dayNotices.length - 2} more</div>` : ''}
        </div>
      </div>
    `;
  }

  daysGrid.innerHTML = html;
  renderCalendarSelectedDayEvents();
}

function prevCalendarMonth() {
  state.calendarMonth--;
  if (state.calendarMonth < 0) {
    state.calendarMonth = 11;
    state.calendarYear--;
  }
  renderCalendar();
}

function nextCalendarMonth() {
  state.calendarMonth++;
  if (state.calendarMonth > 11) {
    state.calendarMonth = 0;
    state.calendarYear++;
  }
  renderCalendar();
}

function goToCurrentMonth() {
  const now = new Date();
  state.calendarMonth = now.getMonth();
  state.calendarYear = now.getFullYear();
  state.selectedCalendarDate = getRelativeDateString(0);
  renderCalendar();
}

function selectCalendarDate(dateStr) {
  state.selectedCalendarDate = dateStr;
  renderCalendar();
}

function renderCalendarSelectedDayEvents() {
  const container = document.getElementById('calendarDayEventsList');
  const label = document.getElementById('calendarSelectedDayLabel');
  const dateStr = state.selectedCalendarDate || getRelativeDateString(0);
  label.textContent = `Notices for: ${formatDateNice(dateStr)}`;

  const dayNotices = state.notices.filter(n => n.date === dateStr);
  if (dayNotices.length === 0) {
    container.innerHTML = `<p class="text-xs text-slate-400 italic">No events or deadlines scheduled for this date.</p>`;
    return;
  }

  container.innerHTML = dayNotices.map(n => `
    <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
      <div class="space-y-0.5">
        <div class="flex items-center space-x-2">
          <span class="text-xs font-bold text-slate-900 dark:text-white">${escapeHtml(n.title)}</span>
          <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-600">${n.category}</span>
        </div>
        <div class="text-xs text-slate-500">
          ⏰ ${escapeHtml(n.time)} • 📍 ${escapeHtml(n.venue)}
        </div>
      </div>
      <button onclick="openEditModalById('${n.id}')" class="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
        View
      </button>
    </div>
  `).join('');
}

// --- TIMELINE VIEW ---

function renderTimeline() {
  const container = document.getElementById('timelineContent');
  const notices = [...state.notices].sort((a, b) => new Date(a.date) - new Date(b.date));

  const groups = {
    today: notices.filter(n => getDaysDifference(n.date) === 0),
    tomorrow: notices.filter(n => getDaysDifference(n.date) === 1),
    thisWeek: notices.filter(n => {
      const d = getDaysDifference(n.date);
      return d > 1 && d <= 7;
    }),
    upcoming: notices.filter(n => getDaysDifference(n.date) > 7),
    past: notices.filter(n => getDaysDifference(n.date) < 0)
  };

  function renderGroupSection(title, colorClass, icon, items) {
    if (items.length === 0) return '';
    return `
      <div class="space-y-3">
        <div class="flex items-center space-x-2">
          <span class="p-1 rounded-md ${colorClass}">
            <i data-lucide="${icon}" class="w-4 h-4"></i>
          </span>
          <h3 class="font-bold font-display text-sm text-slate-900 dark:text-white">${title} (${items.length})</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pl-6 border-l-2 border-slate-200 dark:border-slate-800">
          ${items.map(notice => createNoticeCardHtml(notice)).join('')}
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    ${renderGroupSection('🔥 Urgent: Needs Attention Today', 'bg-rose-100 dark:bg-rose-950 text-rose-600', 'flame', groups.today)}
    ${renderGroupSection('⚡ Tomorrow', 'bg-amber-100 dark:bg-amber-950 text-amber-600', 'clock', groups.tomorrow)}
    ${renderGroupSection('📅 Later This Week', 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600', 'calendar', groups.thisWeek)}
    ${renderGroupSection('📌 Upcoming Future Events', 'bg-blue-100 dark:bg-blue-950 text-blue-600', 'bookmark', groups.upcoming)}
    ${renderGroupSection('⏳ Past Notices', 'bg-slate-200 dark:bg-slate-800 text-slate-500', 'archive', groups.past)}
  `;
  lucide.createIcons();
}

// --- PRIORITY & URGENT ALERTS ---

function checkUrgentAlerts() {
  const alertBar = document.getElementById('urgentAlertBar');
  const alertText = document.getElementById('urgentAlertText');

  const todayNotices = state.notices.filter(n => !n.completed && (getDaysDifference(n.date) === 0 || n.priority === 'urgent'));

  if (todayNotices.length > 0) {
    alertBar.classList.remove('hidden');
    alertText.textContent = `${todayNotices.length} matter(s) require your immediate attention today: "${todayNotices[0].title}" ${todayNotices.length > 1 ? `and ${todayNotices.length - 1} more` : ''}`;
  } else {
    alertBar.classList.add('hidden');
  }
}

function dismissUrgentBar() {
  document.getElementById('urgentAlertBar').classList.add('hidden');
}

// --- AI SUMMARY: "WHAT DO I NEED TO KNOW THIS WEEK?" ---

let speechSynthUtterance = null;

function openDigestModal() {
  const modal = document.getElementById('digestModal');
  const loading = document.getElementById('digestLoading');
  const output = document.getElementById('digestOutput');

  modal.classList.remove('hidden');
  loading.classList.remove('hidden');
  output.innerHTML = '';

  setTimeout(() => {
    loading.classList.add('hidden');
    generateWeeklyDigest();
  }, 400);
}

function closeDigestModal() {
  document.getElementById('digestModal').classList.add('hidden');
  stopAudioDigest();
}

function generateWeeklyDigest() {
  const output = document.getElementById('digestOutput');
  const notices = state.notices;

  const urgentItems = notices.filter(n => !n.completed && (getDaysDifference(n.date) === 0 || getDaysDifference(n.date) === 1));
  const weekItems = notices.filter(n => {
    const diff = getDaysDifference(n.date);
    return diff >= 0 && diff <= 7;
  });
  const placementItems = weekItems.filter(n => n.category === 'Placement');
  const examItems = weekItems.filter(n => n.category === 'Academic' || n.category === 'Deadline');

  let digestHtml = `
    <div class="space-y-4">
      <!-- Section 1: Immediate Alerts -->
      <div class="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
        <h4 class="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5 text-xs uppercase tracking-wider mb-2">
          <span>🚨 Immediate Red Alerts (Next 24-48 Hours)</span>
        </h4>
        ${urgentItems.length > 0 ? `
          <ul class="space-y-2 text-xs text-rose-900 dark:text-rose-200">
            ${urgentItems.map(item => `
              <li class="flex items-start space-x-2">
                <span class="font-bold text-rose-600 dark:text-rose-400">•</span>
                <div>
                  <strong>${escapeHtml(item.title)}:</strong> Scheduled for ${formatDateNice(item.date)} at ${escapeHtml(item.time)} (${escapeHtml(item.venue)}).
                  ${item.actionItems?.[0] ? `<span class="italic block text-[11px] text-rose-700 dark:text-rose-300">Action: ${escapeHtml(item.actionItems[0])}</span>` : ''}
                </div>
              </li>
            `).join('')}
          </ul>
        ` : `
          <p class="text-xs text-slate-500 dark:text-slate-400">All clear! No pending urgent deadlines in the next 24 hours.</p>
        `}
      </div>

      <!-- Section 2: Academics & Placements -->
      <div class="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-2">
        <h4 class="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5 text-xs uppercase tracking-wider">
          <span>🎓 Academics, Placements & Deadlines This Week</span>
        </h4>
        <div class="text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
          ${examItems.length > 0 ? `<p><strong>Academic/Submissions:</strong> You have ${examItems.length} submission(s) or exams lined up, including <em>${escapeHtml(examItems[0].title)}</em>.</p>` : ''}
          ${placementItems.length > 0 ? `<p><strong>Career & Drives:</strong> On-campus opportunities active: <em>${escapeHtml(placementItems[0].title)}</em>.</p>` : ''}
          ${examItems.length === 0 && placementItems.length === 0 ? `<p>No critical exams or placements scheduled for this week.</p>` : ''}
        </div>
      </div>

      <!-- Section 3: Student Action Checklist -->
      <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
        <h4 class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs uppercase tracking-wider">
          <span>🎯 Your Weekly Action Checklist</span>
        </h4>
        <ul class="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
          <li class="flex items-center space-x-2">
            <i data-lucide="check-square" class="w-3.5 h-3.5 text-indigo-500"></i>
            <span>Check your College ID and print updated resume copies for upcoming drives</span>
          </li>
          <li class="flex items-center space-x-2">
            <i data-lucide="check-square" class="w-3.5 h-3.5 text-indigo-500"></i>
            <span>Complete assignment submissions before deadline cut-offs to avoid grade penalty</span>
          </li>
          <li class="flex items-center space-x-2">
            <i data-lucide="check-square" class="w-3.5 h-3.5 text-indigo-500"></i>
            <span>Sync important notices to your Google Calendar using the quick sync buttons</span>
          </li>
        </ul>
      </div>

      <!-- AI Bottom Line -->
      <div class="text-xs text-slate-500 italic bg-amber-50 dark:bg-amber-950/20 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300">
        💡 <strong>AI Pro-Tip:</strong> WhatsApp forwards cause 85% of missed college deadlines. Keep Campus Pulse open or export calendar events so you never miss a submission!
      </div>
    </div>
  `;

  output.innerHTML = digestHtml;
  lucide.createIcons();
}

function copyDigestText() {
  const output = document.getElementById('digestOutput');
  const plainText = output.innerText || output.textContent;
  navigator.clipboard.writeText(plainText).then(() => {
    showToast('Weekly Digest copied to clipboard!', 'success');
  });
}

function toggleAudioDigest() {
  if (!('speechSynthesis' in window)) {
    showToast('Text-to-speech is not supported in this browser.', 'warning');
    return;
  }

  if (window.speechSynthesis.speaking) {
    stopAudioDigest();
  } else {
    startAudioDigest();
  }
}

function startAudioDigest() {
  const output = document.getElementById('digestOutput');
  const plainText = output.innerText || output.textContent;

  speechSynthUtterance = new SpeechSynthesisUtterance(plainText);
  speechSynthUtterance.rate = 1.0;
  speechSynthUtterance.pitch = 1.0;

  speechSynthUtterance.onstart = () => {
    document.getElementById('ttsText').textContent = 'Stop Listening';
    document.getElementById('ttsIcon').setAttribute('data-lucide', 'square');
    lucide.createIcons();
  };

  speechSynthUtterance.onend = () => {
    stopAudioDigest();
  };

  speechSynthUtterance.onerror = () => {
    stopAudioDigest();
  };

  window.speechSynthesis.speak(speechSynthUtterance);
}

function stopAudioDigest() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  const ttsText = document.getElementById('ttsText');
  const ttsIcon = document.getElementById('ttsIcon');
  if (ttsText) ttsText.textContent = 'Read Aloud';
  if (ttsIcon) {
    ttsIcon.setAttribute('data-lucide', 'volume-2');
    lucide.createIcons();
  }
}

// --- CRUD & ACTIONS ON NOTICES ---

function toggleNoticeComplete(id) {
  const notice = state.notices.find(n => n.id === id);
  if (notice) {
    notice.completed = !notice.completed;
    saveToStorage();
    updateCategoryBadges();
    renderAllViews();
    checkUrgentAlerts();
    showToast(notice.completed ? 'Notice marked complete!' : 'Notice reopened', 'info');
  }
}

function deleteNotice(id) {
  if (confirm('Are you sure you want to delete this notice?')) {
    state.notices = state.notices.filter(n => n.id !== id);
    saveToStorage();
    updateCategoryBadges();
    renderAllViews();
    checkUrgentAlerts();
    showToast('Notice removed.', 'info');
  }
}

function copyNoticeText(id) {
  const notice = state.notices.find(n => n.id === id);
  if (!notice) return;
  const text = `📢 *${notice.title}*\n📅 Date: ${notice.date} | ⏰ Time: ${notice.time}\n📍 Venue: ${notice.venue}\nDetails: ${notice.description}\n\nVia Campus Pulse`;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Notice text copied to clipboard!', 'success');
  });
}

function resetToDemoData() {
  if (confirm('Reset all notices back to the rich demo dataset?')) {
    state.notices = [...DEFAULT_NOTICES];
    saveToStorage();
    updateCategoryBadges();
    renderAllViews();
    checkUrgentAlerts();
    showToast('Reset to demo dataset successfully!', 'success');
  }
}

function exportAllAsJson() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.notices, null, 2));
  const dlAnchorElem = document.createElement('a');
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", `campus_pulse_notices_${getRelativeDateString(0)}.json`);
  dlAnchorElem.click();
  showToast('Exported notices as JSON file!', 'success');
}

// --- CALENDAR EXPORT (GOOGLE CALENDAR & .ICS) ---

function getGoogleCalendarUrl(notice) {
  const title = encodeURIComponent(notice.title);
  const details = encodeURIComponent(`${notice.description}\n\nVenue: ${notice.venue}\nCategory: ${notice.category}\nOrganized via Campus Pulse`);
  const location = encodeURIComponent(notice.venue || 'Campus');

  // Format date to YYYYMMDD
  const rawDate = notice.date.replace(/-/g, '');
  const dates = `${rawDate}T090000/${rawDate}T110000`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

function downloadIcsFile(noticeId) {
  const notice = state.notices.find(n => n.id === noticeId);
  if (!notice) return;

  const rawDate = notice.date.replace(/-/g, '');
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CampusPulse//Student Hub//EN',
    'BEGIN:VEVENT',
    `UID:${notice.id}@campuspulse.app`,
    `DTSTAMP:${rawDate}T000000Z`,
    `DTSTART:${rawDate}T090000`,
    `DTEND:${rawDate}T110000`,
    `SUMMARY:${notice.title}`,
    `DESCRIPTION:${notice.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${notice.venue}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${notice.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Downloaded .ics calendar file!', 'success');
}

// --- EDIT MODAL ---

function openEditModalById(id) {
  const notice = state.notices.find(n => n.id === id);
  if (!notice) return;

  document.getElementById('editModalTitle').textContent = 'Edit Notice';
  document.getElementById('editNoticeId').value = notice.id;
  document.getElementById('editFieldTitle').value = notice.title;
  document.getElementById('editFieldCategory').value = notice.category;
  document.getElementById('editFieldPriority').value = notice.priority;
  document.getElementById('editFieldDate').value = notice.date;
  document.getElementById('editFieldTime').value = notice.time || '';
  document.getElementById('editFieldVenue').value = notice.venue || '';
  document.getElementById('editFieldDescription').value = notice.description || '';

  document.getElementById('editNoticeModal').classList.remove('hidden');
}

function openEditModalForExtracted(data) {
  document.getElementById('editModalTitle').textContent = 'Confirm Extracted Notice';
  document.getElementById('editNoticeId').value = 'NEW_EXTRACTED';
  document.getElementById('editFieldTitle').value = data.title;
  document.getElementById('editFieldCategory').value = data.category;
  document.getElementById('editFieldPriority').value = data.priority;
  document.getElementById('editFieldDate').value = data.date;
  document.getElementById('editFieldTime').value = data.time || '';
  document.getElementById('editFieldVenue').value = data.venue || '';
  document.getElementById('editFieldDescription').value = data.description || '';

  document.getElementById('editNoticeModal').classList.remove('hidden');
}

function closeEditModal() {
  document.getElementById('editNoticeModal').classList.add('hidden');
}

function saveNoticeEdit(e) {
  e.preventDefault();
  const id = document.getElementById('editNoticeId').value;
  const title = document.getElementById('editFieldTitle').value.trim();
  const category = document.getElementById('editFieldCategory').value;
  const priority = document.getElementById('editFieldPriority').value;
  const date = document.getElementById('editFieldDate').value;
  const time = document.getElementById('editFieldTime').value.trim();
  const venue = document.getElementById('editFieldVenue').value.trim();
  const description = document.getElementById('editFieldDescription').value.trim();

  if (id === 'NEW_EXTRACTED') {
    confirmAndAddNotice({
      title,
      category,
      priority,
      date,
      time,
      venue,
      description,
      actionItems: ["Attending / checking event schedule"],
      links: []
    });
  } else {
    const notice = state.notices.find(n => n.id === id);
    if (notice) {
      notice.title = title;
      notice.category = category;
      notice.priority = priority;
      notice.date = date;
      notice.time = time;
      notice.venue = venue;
      notice.description = description;

      saveToStorage();
      updateCategoryBadges();
      renderAllViews();
      checkUrgentAlerts();
      showToast('Notice updated successfully!', 'success');
    }
  }

  closeEditModal();
}

// --- SETTINGS (GEMINI API) ---

function openSettingsModal() {
  document.getElementById('settingsModal').classList.remove('hidden');
  document.getElementById('geminiApiKeyInput').value = state.geminiApiKey || '';
  if (state.aiMode === 'gemini') {
    document.getElementById('modeGemini').checked = true;
  } else {
    document.getElementById('modeLocal').checked = true;
  }
  updateEngineModeUI();
}

function closeSettingsModal() {
  document.getElementById('settingsModal').classList.add('hidden');
}

function updateEngineModeUI() {
  const isGemini = document.getElementById('modeGemini')?.checked;
  const area = document.getElementById('geminiKeyArea');
  if (area) {
    if (isGemini) {
      area.classList.remove('hidden');
    } else {
      area.classList.add('hidden');
    }
  }

  const label = document.getElementById('extractorModeLabel');
  if (label) {
    label.textContent = state.aiMode === 'gemini' ? 'Mode: Google Gemini 1.5 Flash API' : 'Mode: Instant Local AI Engine (Heuristic NLP)';
  }
}

function saveSettings() {
  const isGemini = document.getElementById('modeGemini').checked;
  const key = document.getElementById('geminiApiKeyInput').value.trim();

  state.aiMode = isGemini ? 'gemini' : 'local';
  state.geminiApiKey = key;

  localStorage.setItem('campus_pulse_ai_mode', state.aiMode);
  localStorage.setItem('campus_pulse_gemini_key', state.geminiApiKey);

  updateEngineModeUI();
  closeSettingsModal();
  showToast('AI Settings updated!', 'success');
}

// --- UTILITIES & TOASTS ---

function getDaysDifference(targetDateStr) {
  if (!targetDateStr) return 999;
  const parts = targetDateStr.split('-');
  if (parts.length !== 3) return 999;

  const target = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffTime = target - today;
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

function formatDateNice(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;

  const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttr(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '&quot;');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  const typeStyles = {
    success: 'bg-emerald-600 text-white',
    warning: 'bg-amber-500 text-white',
    info: 'bg-indigo-600 text-white',
    error: 'bg-rose-600 text-white'
  };

  toast.className = `pointer-events-auto px-4 py-2.5 rounded-xl shadow-lg flex items-center space-x-2 text-xs font-semibold transform transition-all duration-300 translate-y-2 opacity-0 ${typeStyles[type] || typeStyles.info}`;
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
