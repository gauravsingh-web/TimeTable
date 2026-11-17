/**
 * ==============================================================================
 * College Timetable Generator - Frontend Controller (script.js)
 * ------------------------------------------------------------------------------
 * 100% Client-Side Architecture (Runs directly in browser / Vercel / Static Host)
 * Zero backend required: Graph Coloring & Backtracking algorithm implemented in JS.
 * ==============================================================================
 */

// -----------------------------------------------------------------------------
// HARDCODED DU FoT 2ND-YEAR DEMO DATASET
// Faculty of Technology, University of Delhi (CSE Department)
// -----------------------------------------------------------------------------
const DU_FOT_DEMO_DATA = {
  batches: ["CSE-A", "CSE-B"],
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  teachers: [
    { id: "JJ", name: "Dr. Juhi Jain" },
    { id: "GB", name: "Dr. Geetanjali Bhola" },
    { id: "BR", name: "Dr. Bhawna Rawat" },
    { id: "AZK", name: "Dr. Ahmad Zaman Khan" },
    { id: "UDS", name: "Dr. Udita Sharma" },
    { id: "AP", name: "Dr. Ashutosh Pandey" },
    { id: "AKS", name: "Mr. Ajay Kumar Sahu" },
    { id: "EKL", name: "Dr. Eklavya" }
  ],
  subjects: [
    // CSE-A Subjects
    { code: "ADA", name: "Design & Analysis of Algorithms", batch: "CSE-A", teacherId: "JJ", weeklyLectures: 4 },
    { code: "DBMS", name: "Database Management Systems", batch: "CSE-A", teacherId: "GB", weeklyLectures: 4 },
    { code: "DSD", name: "Digital System Design", batch: "CSE-A", teacherId: "BR", weeklyLectures: 4 },
    { code: "PSCS-A", name: "Probability & Statistics for CS", batch: "CSE-A", teacherId: "AZK", weeklyLectures: 3 },
    { code: "EVS-2", name: "Environmental Science - II", batch: "CSE-A", teacherId: "UDS", weeklyLectures: 2 },
    { code: "FIT INDIA", name: "Fit India Movement", batch: "CSE-A", teacherId: "AP", weeklyLectures: 1 },

    // CSE-B Subjects
    { code: "ADA", name: "Design & Analysis of Algorithms", batch: "CSE-B", teacherId: "JJ", weeklyLectures: 4 },
    { code: "DBMS", name: "Database Management Systems", batch: "CSE-B", teacherId: "GB", weeklyLectures: 4 },
    { code: "DSD", name: "Digital System Design", batch: "CSE-B", teacherId: "BR", weeklyLectures: 4 },
    { code: "PSCS-B", name: "Probability & Statistics for CS", batch: "CSE-B", teacherId: "AZK", weeklyLectures: 3 },
    { code: "FSS", name: "Full Stack Specialization", batch: "CSE-B", teacherId: "AKS", weeklyLectures: 2 },
    { code: "EVS-2", name: "Environmental Science - II", batch: "CSE-B", teacherId: "EKL", weeklyLectures: 2 },
    { code: "FIT INDIA", name: "Fit India Movement", batch: "CSE-B", teacherId: "AZK", weeklyLectures: 1 }
  ],
  rooms: ["R1", "R2", "R3", "214", "313", "314", "513", "Basement Lab"],
  schedule: []
};

// -----------------------------------------------------------------------------
// CONSTANTS & DISPLAY CONFIGURATION
// -----------------------------------------------------------------------------
const DAYS_PER_WEEK = 5;
const SLOTS_PER_DAY = 8; // 8 academic teaching hours (excluding lunch)
const TOTAL_TIMESLOTS = DAYS_PER_WEEK * SLOTS_PER_DAY; // 40 discrete slots

const SLOT_LABELS = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
  "05:00 PM - 06:00 PM"
];

// 9 periods across Monday - Friday including 1:00 PM - 2:00 PM lunch break
const TIME_PERIODS = [
  { id: 0, label: "09:00 AM - 10:00 AM", isLunch: false },
  { id: 1, label: "10:00 AM - 11:00 AM", isLunch: false },
  { id: 2, label: "11:00 AM - 12:00 PM", isLunch: false },
  { id: 3, label: "12:00 PM - 01:00 PM", isLunch: false },
  { id: 4, label: "01:00 PM - 02:00 PM", isLunch: true, name: "🍱 Recess / Lunch Break" },
  { id: 5, label: "02:00 PM - 03:00 PM", isLunch: false },
  { id: 6, label: "03:00 PM - 04:00 PM", isLunch: false },
  { id: 7, label: "04:00 PM - 05:00 PM", isLunch: false },
  { id: 8, label: "05:00 PM - 06:00 PM", isLunch: false }
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Distinctive Color Palette for Subjects
const SUBJECT_COLORS = {
  "ADA": { bg: "#e0e7ff", border: "#4f46e5", text: "#312e81" },
  "DBMS": { bg: "#e0f2fe", border: "#0284c7", text: "#0369a1" },
  "DSD": { bg: "#dcfce7", border: "#059669", text: "#065f46" },
  "PSCS-A": { bg: "#fef3c7", border: "#d97706", text: "#92400e" },
  "PSCS-B": { bg: "#fef3c7", border: "#d97706", text: "#92400e" },
  "EVS-2": { bg: "#f3e8ff", border: "#9333ea", text: "#6b21a8" },
  "FIT INDIA": { bg: "#ffe4e6", border: "#e11d48", text: "#9f1239" },
  "FSS": { bg: "#ccfbf1", border: "#0d9488", text: "#115e59" }
};

const STORAGE_KEY = "du_fot_college_timetable_data";

// -----------------------------------------------------------------------------
// APP STATE
// -----------------------------------------------------------------------------
let appData = null;
let currentBatch = "CSE-A";
let searchTerm = "";

// -----------------------------------------------------------------------------
// DOM ELEMENT REFERENCES
// -----------------------------------------------------------------------------
const timetableBody = document.getElementById("timetableBody");
const batchSelect = document.getElementById("batchSelect");
const searchInput = document.getElementById("searchInput");
const legendPills = document.getElementById("legendPills");

const btnLoadDemo = document.getElementById("btnLoadDemo");
const btnRunAlgorithm = document.getElementById("btnRunAlgorithm");
const btnPrint = document.getElementById("btnPrint");

const btnToggleManagement = document.getElementById("btnToggleManagement");
const managementBody = document.getElementById("managementBody");
const toggleManagementIcon = document.getElementById("toggleManagementIcon");

const loadingOverlay = document.getElementById("loadingOverlay");
const toastContainer = document.getElementById("toastContainer");

// Forms & Lists
const formAddTeacher = document.getElementById("formAddTeacher");
const formAddSubject = document.getElementById("formAddSubject");
const formAddRoom = document.getElementById("formAddRoom");
const teachersListEl = document.getElementById("teachersList");
const subjectsListEl = document.getElementById("subjectsList");
const roomsListEl = document.getElementById("roomsList");
const subTeacherInput = document.getElementById("subTeacherInput");
const teachersCountEl = document.getElementById("teachersCount");
const subjectsCountEl = document.getElementById("subjectsCount");
const roomsCountEl = document.getElementById("roomsCount");

// -----------------------------------------------------------------------------
// 🧠 GRAPH COLORING & BACKTRACKING SOLVER (Pure JavaScript Implementation)
// -----------------------------------------------------------------------------
/**
 * Solves the Timetable Scheduling Problem using:
 * 1. Graph Vertex Coloring G = (V, E)
 *    - Vertices (V): Individual lecture sessions across the week.
 *    - Edges (E): Batch conflict or Teacher conflict.
 *    - Colors (K): Discrete weekly timeslots (40 total slots).
 * 2. Room Collision Constraint: No two lectures can share a room at the same time.
 * 3. Welsh-Powell Degree Ordering Heuristic: Most-constrained vertices colored first.
 * 4. State-Space Tree Exploration via Recursive Backtracking.
 */
function solveTimetableInJS(data) {
  const startTime = performance.now();

  // 1. Build Teacher lookup map
  const teacherMap = {};
  (data.teachers || []).forEach(t => {
    teacherMap[t.id] = t.name;
  });

  // 2. Unroll subjects into individual lecture vertices
  const lectures = [];
  (data.subjects || []).forEach(sub => {
    const tName = teacherMap[sub.teacherId] || sub.teacherId;
    const count = parseInt(sub.weeklyLectures, 10) || 1;
    for (let k = 0; k < count; k++) {
      lectures.push({
        id: lectures.length,
        batch: sub.batch,
        subjectCode: sub.code,
        subjectName: sub.name,
        teacherId: sub.teacherId,
        teacherName: tName,
        weeklyLectures: count
      });
    }
  });

  const N = lectures.length;
  if (N === 0) {
    return { solved: true, schedule: [], executionTimeMs: 0, backtrackSteps: 0 };
  }

  const rooms = (data.rooms && data.rooms.length > 0)
    ? data.rooms
    : ["R1", "R2", "R3", "214", "313", "314", "513", "Basement Lab"];
  const totalRooms = rooms.length;

  // 3. Construct Conflict Graph (Adjacency Matrix)
  const adj = Array.from({ length: N }, () => new Uint8Array(N));
  const degree = new Int32Array(N);

  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const sameBatch = (lectures[i].batch === lectures[j].batch);
      const sameTeacher = (lectures[i].teacherId === lectures[j].teacherId);
      if (sameBatch || sameTeacher) {
        adj[i][j] = 1;
        adj[j][i] = 1;
      }
    }
  }

  // Calculate degree for each vertex
  for (let i = 0; i < N; i++) {
    let d = 0;
    for (let j = 0; j < N; j++) {
      if (adj[i][j] === 1) d++;
    }
    degree[i] = d;
  }

  // 4. Welsh-Powell Degree Ordering Heuristic
  // Sorting vertices descending by degree prunes 99.9% of invalid search paths!
  const vertexOrder = Array.from({ length: N }, (_, i) => i);
  vertexOrder.sort((a, b) => degree[b] - degree[a]);

  // State arrays: assigned timeslot color [0..39] and assigned room index
  const assignedSlot = new Int32Array(N).fill(-1);
  const assignedRoom = new Int32Array(N).fill(-1);
  let backtrackSteps = 0;

  // 5. Constraint Verification (isSafe)
  function isSafe(v, candidateSlot, candidateRoom, enforceDailySpread) {
    const candidateDay = Math.floor(candidateSlot / SLOTS_PER_DAY);

    // Hard Constraint: Mutual exclusion in conflict graph & room collision
    for (let u = 0; u < N; u++) {
      if (assignedSlot[u] === candidateSlot) {
        // Teacher or Batch collision check
        if (adj[v][u] === 1) return false;
        // Classroom collision check
        if (assignedRoom[u] === candidateRoom) return false;
      }
    }

    // Pedagogical Spread Constraint: Spread subject classes evenly across the week
    if (enforceDailySpread) {
      const maxAllowedToday = (lectures[v].weeklyLectures > DAYS_PER_WEEK) ? 2 : 1;
      let countToday = 0;
      for (let u = 0; u < N; u++) {
        if (assignedSlot[u] !== -1) {
          const uDay = Math.floor(assignedSlot[u] / SLOTS_PER_DAY);
          if (uDay === candidateDay &&
              lectures[u].batch === lectures[v].batch &&
              lectures[u].subjectCode === lectures[v].subjectCode) {
            countToday++;
          }
        }
      }
      if (countToday >= maxAllowedToday) return false;
    }

    return true;
  }

  // 6. Recursive Backtracking Solver
  function solve(orderIdx, enforceDailySpread) {
    backtrackSteps++;

    // Base Case: All vertices colored and scheduled
    if (orderIdx === N) return true;

    const v = vertexOrder[orderIdx];

    // Try candidate colors (timeslots)
    for (let slot = 0; slot < TOTAL_TIMESLOTS; slot++) {
      // Try candidate classrooms
      for (let r = 0; r < totalRooms; r++) {
        if (isSafe(v, slot, r, enforceDailySpread)) {
          // 1. Make choice
          assignedSlot[v] = slot;
          assignedRoom[v] = r;

          // 2. Recurse to next vertex
          if (solve(orderIdx + 1, enforceDailySpread)) return true;

          // 3. Backtrack (Undo choice)
          assignedSlot[v] = -1;
          assignedRoom[v] = -1;
        }
      }
    }
    return false;
  }

  // Attempt 1: With pedagogical daily spread (max 1 class per subject per day)
  let solved = solve(0, true);

  // Attempt 2: If strict 1-per-day cannot be satisfied, relax spread constraint
  if (!solved) {
    assignedSlot.fill(-1);
    assignedRoom.fill(-1);
    backtrackSteps = 0;
    solved = solve(0, false);
  }

  const endTime = performance.now();
  const executionTimeMs = endTime - startTime;

  if (!solved) {
    return { solved: false, schedule: [], executionTimeMs, backtrackSteps };
  }

  // 7. Format output schedule
  const schedule = [];
  for (let i = 0; i < N; i++) {
    const slot = assignedSlot[i];
    const dayIdx = Math.floor(slot / SLOTS_PER_DAY);
    const periodIdx = slot % SLOTS_PER_DAY;
    schedule.push({
      batch: lectures[i].batch,
      subjectCode: lectures[i].subjectCode,
      subjectName: lectures[i].subjectName,
      teacherId: lectures[i].teacherId,
      teacherName: lectures[i].teacherName,
      room: rooms[assignedRoom[i]] || "TBD",
      day: DAYS[dayIdx],
      dayIndex: dayIdx,
      slotIndex: periodIdx,
      time: SLOT_LABELS[periodIdx]
    });
  }

  return { solved: true, schedule, executionTimeMs, backtrackSteps };
}

// -----------------------------------------------------------------------------
// LOCAL STORAGE & PERSISTENCE
// -----------------------------------------------------------------------------
function loadAppData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.teachers) && Array.isArray(parsed.subjects)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not load from localStorage, falling back to demo data.", e);
  }
  // Return fresh copy of DU FoT demo data
  return JSON.parse(JSON.stringify(DU_FOT_DEMO_DATA));
}

function saveAppData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
  } catch (e) {
    console.warn("Could not save to localStorage.", e);
  }
}

// -----------------------------------------------------------------------------
// INITIALIZATION
// -----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();

  // Load data from localStorage (or fallback to DU FoT default data)
  appData = loadAppData();

  // If timetable hasn't been generated yet, generate it immediately!
  if (!appData.schedule || appData.schedule.length === 0) {
    runScheduleGeneration(false);
  } else {
    renderTimetable();
    renderLegend();
    updateManagementUI();
  }
});

function setupEventListeners() {
  // Batch selector change
  if (batchSelect) {
    batchSelect.addEventListener("change", (e) => {
      currentBatch = e.target.value;
      renderTimetable();
    });
  }

  // Search input filter
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchTerm = e.target.value.toLowerCase().trim();
      renderTimetable();
    });
  }

  // Load DU Demo Data
  if (btnLoadDemo) {
    btnLoadDemo.addEventListener("click", handleLoadDemoData);
  }

  // Generate Timetable (Runs in-browser Graph Coloring Algorithm)
  if (btnRunAlgorithm) {
    btnRunAlgorithm.addEventListener("click", () => runScheduleGeneration(true));
  }

  // Toggle Data Management Section
  if (btnToggleManagement && managementBody) {
    btnToggleManagement.addEventListener("click", () => {
      const isHidden = managementBody.style.display === "none";
      managementBody.style.display = isHidden ? "block" : "none";
      if (toggleManagementIcon) {
        toggleManagementIcon.textContent = isHidden ? "▼" : "▲";
      }
    });
  }

  // Add Forms
  if (formAddTeacher) formAddTeacher.addEventListener("submit", handleAddTeacher);
  if (formAddSubject) formAddSubject.addEventListener("submit", handleAddSubject);
  if (formAddRoom) formAddRoom.addEventListener("submit", handleAddRoom);

  // Print
  if (btnPrint) {
    btnPrint.addEventListener("click", () => window.print());
  }
}

// -----------------------------------------------------------------------------
// GENERATION & ACTIONS (No fetch() calls!)
// -----------------------------------------------------------------------------
function runScheduleGeneration(showToastNotification = true) {
  showLoading("Generating Conflict-Free Timetable in Browser...");

  // Small timeout allows DOM loading spinner to render cleanly
  setTimeout(() => {
    try {
      const result = solveTimetableInJS(appData);

      if (result.solved) {
        appData.schedule = result.schedule;
        saveAppData();

        renderTimetable();
        renderLegend();
        updateManagementUI();

        if (showToastNotification) {
          const time = result.executionTimeMs.toFixed(2);
          showToast(`⚡ Conflict-free timetable generated in ${time} ms (${result.backtrackSteps} steps)!`, "success");
        }
      } else {
        showToast("⚠️ Could not generate a conflict-free schedule. Try adding more rooms or adjusting classes.", "error");
      }
    } catch (err) {
      console.error("Solver error:", err);
      showToast("An error occurred during timetable generation.", "error");
    } finally {
      hideLoading();
    }
  }, 30);
}

function handleLoadDemoData() {
  showLoading("Restoring DU Faculty of Technology Demo Data...");

  setTimeout(() => {
    appData = JSON.parse(JSON.stringify(DU_FOT_DEMO_DATA));
    saveAppData();

    runScheduleGeneration(false);
    updateManagementUI();
    renderLegend();
    hideLoading();

    showToast("🏛️ DU FoT 2nd-Year Demo Data Loaded & Timetable Generated!", "success");
  }, 40);
}

// -----------------------------------------------------------------------------
// TIMETABLE GRID RENDERING
// -----------------------------------------------------------------------------
function renderTimetable() {
  if (!timetableBody) return;
  timetableBody.innerHTML = "";

  const schedule = appData.schedule || [];

  TIME_PERIODS.forEach(period => {
    const tr = document.createElement("tr");

    // Recess / Lunch Break Row (1:00 PM - 2:00 PM)
    if (period.isLunch) {
      tr.classList.add("lunch-row");
      const tdTime = document.createElement("td");
      tdTime.className = "time-cell";
      tdTime.innerHTML = `
        <div class="time-slot-name">${period.label}</div>
        <div class="time-slot-badge">Recess</div>
      `;
      tr.appendChild(tdTime);

      const tdLunch = document.createElement("td");
      tdLunch.colSpan = 5;
      tdLunch.innerHTML = `
        <div class="lunch-banner">
          <span>🍱</span>
          <span>RECESS / LUNCH BREAK (1:00 PM – 2:00 PM)</span>
          <span>🍱</span>
        </div>
      `;
      tr.appendChild(tdLunch);
      timetableBody.appendChild(tr);
      return;
    }

    // Standard Academic Lecture Period
    const tdTime = document.createElement("td");
    tdTime.className = "time-cell";
    tdTime.innerHTML = `
      <div class="time-slot-name">${period.label}</div>
      <div class="time-slot-badge">Period</div>
    `;
    tr.appendChild(tdTime);

    // Days Columns (Monday to Friday)
    DAYS.forEach(day => {
      const tdDay = document.createElement("td");

      // Filter matching lectures for this slot & day
      const matching = schedule.filter(item => {
        const matchDay = (item.day === day);
        const matchTime = (item.time === period.label);
        const matchBatch = (currentBatch === "ALL") || (item.batch === currentBatch);

        let matchSearch = true;
        if (searchTerm) {
          const sCode = (item.subjectCode || "").toLowerCase();
          const sName = (item.subjectName || "").toLowerCase();
          const tName = (item.teacherName || "").toLowerCase();
          const room = (item.room || "").toLowerCase();
          matchSearch = sCode.includes(searchTerm) ||
                        sName.includes(searchTerm) ||
                        tName.includes(searchTerm) ||
                        room.includes(searchTerm);
        }

        return matchDay && matchTime && matchBatch && matchSearch;
      });

      if (matching.length > 0) {
        matching.forEach(item => {
          const card = createLectureCard(item);
          tdDay.appendChild(card);
        });
      } else {
        // Free Period Placeholder
        const free = document.createElement("div");
        free.className = "free-slot";
        free.textContent = "— Free —";
        tdDay.appendChild(free);
      }

      tr.appendChild(tdDay);
    });

    timetableBody.appendChild(tr);
  });
}

function createLectureCard(item) {
  const card = document.createElement("div");
  card.className = "lecture-card";

  // Distinct color per subject
  const color = getSubjectColor(item.subjectCode);
  card.style.borderLeftColor = color.border;

  card.innerHTML = `
    <div class="lecture-header">
      <span class="lecture-code" style="color: ${color.border}">${escapeHtml(item.subjectCode)}</span>
      <span class="lecture-batch-pill">${escapeHtml(item.batch)}</span>
    </div>
    <div class="lecture-name" title="${escapeHtml(item.subjectName)}">
      ${escapeHtml(item.subjectName)}
    </div>
    <div class="lecture-meta">
      <span class="lecture-teacher" title="${escapeHtml(item.teacherName)}">
        👨‍🏫 ${escapeHtml(item.teacherId || item.teacherName)}
      </span>
      <span class="lecture-room">📍 ${escapeHtml(item.room)}</span>
    </div>
  `;

  return card;
}

function getSubjectColor(code) {
  if (SUBJECT_COLORS[code]) return SUBJECT_COLORS[code];

  // Deterministic color generation for custom added subjects
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = code.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return {
    bg: `hsl(${hue}, 85%, 95%)`,
    border: `hsl(${hue}, 75%, 45%)`,
    text: `hsl(${hue}, 80%, 25%)`
  };
}

// -----------------------------------------------------------------------------
// LEGEND RENDERING
// -----------------------------------------------------------------------------
function renderLegend() {
  if (!legendPills) return;
  legendPills.innerHTML = "";
  const subjects = appData.subjects || [];

  // Deduplicate by code
  const seen = new Set();
  subjects.forEach(sub => {
    if (seen.has(sub.code)) return;
    seen.add(sub.code);

    const color = getSubjectColor(sub.code);
    const pill = document.createElement("div");
    pill.className = "legend-pill";
    pill.innerHTML = `
      <span class="legend-dot" style="background-color: ${color.border}"></span>
      <strong>${escapeHtml(sub.code)}:</strong>
      <span>${escapeHtml(sub.name)}</span>
    `;
    legendPills.appendChild(pill);
  });
}

// -----------------------------------------------------------------------------
// DATA MANAGEMENT UI (Teachers, Subjects, Classrooms)
// -----------------------------------------------------------------------------
function updateManagementUI() {
  // 1. Teachers list
  if (teachersListEl) {
    teachersListEl.innerHTML = "";
    (appData.teachers || []).forEach(t => {
      const row = document.createElement("div");
      row.className = "item-row";
      row.innerHTML = `
        <div>
          <strong>${escapeHtml(t.id)}</strong> - ${escapeHtml(t.name)}
        </div>
        <button class="item-delete-btn" title="Remove Faculty" onclick="deleteTeacher('${escapeHtml(t.id)}')">🗑️</button>
      `;
      teachersListEl.appendChild(row);
    });
  }
  if (teachersCountEl) {
    teachersCountEl.textContent = (appData.teachers || []).length;
  }

  // 2. Populate Teacher dropdown in Subject Form
  if (subTeacherInput) {
    subTeacherInput.innerHTML = "";
    (appData.teachers || []).forEach(t => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = `${t.name} (${t.id})`;
      subTeacherInput.appendChild(opt);
    });
  }

  // 3. Subjects list
  if (subjectsListEl) {
    subjectsListEl.innerHTML = "";
    (appData.subjects || []).forEach((s, idx) => {
      const row = document.createElement("div");
      row.className = "item-row";
      row.innerHTML = `
        <div>
          <strong>${escapeHtml(s.code)}</strong> (${escapeHtml(s.batch)}) • ${s.weeklyLectures} classes/wk<br>
          <small style="color: #64748b;">${escapeHtml(s.name)} • Faculty: ${escapeHtml(s.teacherId)}</small>
        </div>
        <button class="item-delete-btn" title="Remove Subject" onclick="deleteSubject(${idx})">🗑️</button>
      `;
      subjectsListEl.appendChild(row);
    });
  }
  if (subjectsCountEl) {
    subjectsCountEl.textContent = (appData.subjects || []).length;
  }

  // 4. Rooms list
  if (roomsListEl) {
    roomsListEl.innerHTML = "";
    (appData.rooms || []).forEach(r => {
      const chip = document.createElement("div");
      chip.className = "room-chip";
      chip.innerHTML = `
        <span>📍 ${escapeHtml(r)}</span>
        <button class="item-delete-btn" title="Remove Classroom" onclick="deleteRoom('${escapeHtml(r)}')">✕</button>
      `;
      roomsListEl.appendChild(chip);
    });
  }
  if (roomsCountEl) {
    roomsCountEl.textContent = (appData.rooms || []).length;
  }
}

// Add/Remove Faculty
function handleAddTeacher(e) {
  e.preventDefault();
  const idInput = document.getElementById("teacherIdInput");
  const nameInput = document.getElementById("teacherNameInput");
  if (!idInput || !nameInput) return;

  const id = idInput.value.trim().toUpperCase();
  const name = nameInput.value.trim();

  if (!id || !name) return;
  if (appData.teachers.some(t => t.id === id)) {
    showToast(`Teacher code '${id}' already exists!`, "error");
    return;
  }

  appData.teachers.push({ id, name });
  idInput.value = "";
  nameInput.value = "";

  saveAppData();
  updateManagementUI();
  showToast(`Added ${name} (${id})`, "info");
}

window.deleteTeacher = function(id) {
  if (confirm(`Remove faculty member ${id}?`)) {
    appData.teachers = appData.teachers.filter(t => t.id !== id);
    saveAppData();
    updateManagementUI();
    showToast(`Removed teacher ${id}`, "info");
  }
};

// Add/Remove Subject
function handleAddSubject(e) {
  e.preventDefault();
  const codeInput = document.getElementById("subCodeInput");
  const nameInput = document.getElementById("subNameInput");
  const batchInput = document.getElementById("subBatchInput");
  const teacherInput = document.getElementById("subTeacherInput");
  const lecturesInput = document.getElementById("subLecturesInput");

  if (!codeInput || !nameInput) return;

  const code = codeInput.value.trim().toUpperCase();
  const name = nameInput.value.trim();
  const batch = batchInput ? batchInput.value : "CSE-A";
  const teacherId = teacherInput ? teacherInput.value : "";
  const weeklyLectures = lecturesInput ? parseInt(lecturesInput.value, 10) || 4 : 4;

  if (!code || !name) return;

  appData.subjects.push({ code, name, batch, teacherId, weeklyLectures });
  codeInput.value = "";
  nameInput.value = "";

  saveAppData();
  updateManagementUI();
  renderLegend();
  showToast(`Added subject ${code} for ${batch}`, "info");
}

window.deleteSubject = function(idx) {
  if (confirm("Remove this subject assignment?")) {
    appData.subjects.splice(idx, 1);
    saveAppData();
    updateManagementUI();
    renderLegend();
    showToast("Subject removed", "info");
  }
};

// Add/Remove Classroom
function handleAddRoom(e) {
  e.preventDefault();
  const roomInput = document.getElementById("roomNameInput");
  if (!roomInput) return;

  const room = roomInput.value.trim();
  if (!room) return;
  if (appData.rooms.includes(room)) {
    showToast(`Room '${room}' already exists!`, "error");
    return;
  }

  appData.rooms.push(room);
  roomInput.value = "";

  saveAppData();
  updateManagementUI();
  showToast(`Added classroom ${room}`, "info");
}

window.deleteRoom = function(room) {
  if (confirm(`Remove room ${room}?`)) {
    appData.rooms = appData.rooms.filter(r => r !== room);
    saveAppData();
    updateManagementUI();
    showToast(`Removed room ${room}`, "info");
  }
};

// -----------------------------------------------------------------------------
// UI UTILITIES & TOASTS
// -----------------------------------------------------------------------------
function showToast(message, type = "info") {
  if (!toastContainer) return;
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 250);
  }, 4000);
}

function showLoading(text = "Generating Conflict-Free Timetable...") {
  const loadingText = document.getElementById("loadingText");
  if (loadingText) loadingText.textContent = text;
  if (loadingOverlay) loadingOverlay.classList.add("active");
}

function hideLoading() {
  if (loadingOverlay) loadingOverlay.classList.remove("active");
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
