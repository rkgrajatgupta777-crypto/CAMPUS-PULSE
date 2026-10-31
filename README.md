# ⚡ Campus Pulse — Intelligent Student Hub

> **Built for Google for Developers | PromptWars &times; CSSS (Build with AI)**

---

## 🎯 The Problem Statement
Students at every college face the same daily friction: **scattered notices on WhatsApp groups, missed deadlines, unclear event details, and no single place to see what's happening.**

**Campus Pulse** gives students one clear, intelligent place to stay on top of campus life.

---

## 🏆 Core Requirements Implemented

| Requirement | Implementation in Campus Pulse |
| :--- | :--- |
| **1. Smart Input** | • Users can paste messy unstructured text (forwarded WhatsApp forwards, emails, poster captions).<br>• The built-in AI parser automatically extracts: **Title, Date, Time, Venue, Category, Priority, Action Items, and Registration Links** into a clean card.<br>• Dual AI engine: Zero-latency offline NLP engine (works 100% without keys or network) + optional Google Gemini 1.5 Flash API mode.<br>• Pre-loaded sample notice chips for instant 1-click testing. |
| **2. Organised View** | • **Interactive Search**: Real-time full-text search across titles, venues, descriptions, and action items.<br>• **Filterable**: Category pills (Academic & Exams, Placements & Careers, Clubs & Hackathons, Deadlines & Submissions, General Notices) with live counters.<br>• **Multiple Views**: Grid Card View, Full Interactive Monthly Calendar View with day-event inspector, and Chronological Timeline View. |
| **3. Priority & Reminders** | • Real-time status flagging: **DUE TODAY** (pulsating red alert), **Due Tomorrow**, **Upcoming**, and **Expired**.<br>• Top persistent banner alerting students to today's critical actions.<br>• **Google Calendar Sync**: 1-click direct link to add events to Google Calendar with prefilled title, venue, and description.<br>• **.ICS File Export**: Download standard `.ics` calendar files for Apple Calendar, Outlook, and mobile devices. |
| **4. AI Summary** | • Prominent **"What do I need to know this week?"** button.<br>• Synthesizes an executive weekly digest: Immediate Red Alerts (24-48h), Academics & Placements, and a Student Action Checklist.<br>• **Text-to-Speech (Read Aloud)** using Web Speech API to listen to your morning campus briefing hands-free!<br>• 1-click Copy Digest for sharing to WhatsApp study groups. |
| **5. Usable Interface** | • Sleek modern design matching Google for Developers / Build with AI branding.<br>• Dark / Light mode toggle.<br>• Fully responsive across mobile phones, tablets, and desktop displays.<br>• LocalStorage persistence: all notices and settings remain saved across browser refreshes.<br>• Confetti animations, smooth micro-interactions, and visual feedback toasts. |

---

## 🚀 How to Run the Web App

### Option A: Double-Click Launcher (Windows)
Double-click `start.bat` in this folder. It will immediately open `index.html` in your default web browser (Chrome, Edge, Firefox, Brave, etc.).

### Option B: Open `index.html` Directly
Right-click `index.html` &rarr; **Open with** &rarr; **Google Chrome** (or any modern browser).

---

## 🧪 Quick Demo Walkthrough for Judges & Evaluators

1. **Test Smart Input with 1 Click**:
   - In the **Smart Input Engine** section, click any of the quick sample chips:
     - `📝 Exam Notice`
     - `💼 Google Drive`
     - `⚡ Hackathon`
     - `⏰ Deadline`
   - Click the indigo **"Extract & Categorize"** button.
   - Watch the AI instantly parse the title, date, time, venue, action items, and category into a clean preview card.
   - Click **"Add to Campus Hub"**!

2. **Test Filter & View Modes**:
   - Filter by categories: Click `🎓 Academic & Exams` or `💼 Placements & Careers`.
   - Toggle views using the top-right view switcher:
     - **Grid Cards View**: View cards with urgency badges and action items.
     - **Calendar View**: Click any date cell to view events scheduled for that day.
     - **Timeline View**: View chronological groups: Today, Tomorrow, Later this week.

3. **Test the "What do I need to know this week?" AI Digest**:
   - Click the glowing orange button **"What do I need to know this week?"** in the top navigation bar.
   - Read the synthesized briefing.
   - Click **"Read Aloud"** to hear the audio digest synthesis!

4. **Test Calendar Sync**:
   - On any card, click the calendar icon to instantly open a pre-filled Google Calendar event or download an `.ics` file.

---

## 📁 File Structure
```
CAMPUS PULSE/
├── index.html        # Main responsive UI, layout, modals & widgets
├── styles.css        # Custom animations, dark mode tokens, calendar & badges
├── app.js            # NLP parsing engine, Gemini API, state & calendar logic
├── start.bat         # 1-click Windows runner
└── README.md         # Documentation & solution breakdown
```

