/**
 * ==============================================================================
 * College Timetable Generator - Frontend Controller (script.js)
 * Coordinates API calls, DOM manipulation, Grid rendering, and state management
 * ==============================================================================
 */

// Global State
let appData = {
  batches: ["CSE-A", "CSE-B"],
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  timeslots: [],
  teachers: [],
  subjects: [],
  rooms: [],
  schedule: []
};

let currentBatch = "CSE-A";
let searchTerm = "";

// Distinctive Color Palette for DU FoT Subjects
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

// Fixed Timeslots (9 AM to 6 PM)
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

// -----------------------------------------------------------------------------
// DOM ELEMENTS
// -----------------------------------------------------------------------------
const timetableBody = document.getElementById("timetableBody");
const batchSelect = document.getElementById("batchSelect");
const searchInput = document.getElementById("searchInput");
const legendPills = document.getElementById("legendPills");

const btnLoadDemo = document.getElementById("btnLoadDemo");
const btnRunAlgorithm = document.getElementById("btnRunAlgorithm");
const btnOpenDrawer = document.getElementById("btnOpenDrawer");
const btnCloseDrawer = document.getElementById("btnCloseDrawer");
const drawerOverlay = document.getElementById("drawerOverlay");
const manageDrawer = document.getElementById("manageDrawer");

const btnOpenTheory = document.getElementById("btnOpenTheory");
const btnCloseTheory = document.getElementById("btnCloseTheory");
const btnOkTheory = document.getElementById("btnOkTheory");
const theoryModalOverlay = document.getElementById("theoryModalOverlay");
const btnPrint = document.getElementById("btnPrint");

const metricExecTime = document.getElementById("metricExecTime");
const metricSteps = document.getElementById("metricSteps");
const metricLectures = document.getElementById("metricLectures");
const loadingOverlay = document.getElementById("loadingOverlay");
const toastContainer = document.getElementById("toastContainer");

// Drawer Form Elements
const drawerTabs = document.querySelectorAll(".drawer-tab");
const tabContents = document.querySelectorAll(".tab-content");
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
// INITIALIZATION
// -----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  fetchInitialData();
});

function setupEventListeners() {
  // Batch selector change
  batchSelect.addEventListener("change", (e) => {
    currentBatch = e.target.value;
    renderTimetable();
  });

  // Search input filter
  searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value.toLowerCase().trim();
    renderTimetable();
  });

  // Load DU Demo Data
  btnLoadDemo.addEventListener("click", handleLoadDemoData);

  // Run C++ Algorithm
  btnRunAlgorithm.addEventListener("click", handleRunAlgorithm);

  // Drawer Toggles
  btnOpenDrawer.addEventListener("click", openDrawer);
  btnCloseDrawer.addEventListener("click", closeDrawer);
  drawerOverlay.addEventListener("click", closeDrawer);

  // Drawer Tabs
  drawerTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      drawerTabs.forEach(t => t.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));
      tab.classList.add("active");
      const targetId = tab.getAttribute("data-tab");
      document.getElementById(targetId).classList.add("active");
    });
  });

  // Add Forms
  formAddTeacher.addEventListener("submit", handleAddTeacher);
  formAddSubject.addEventListener("submit", handleAddSubject);
  formAddRoom.addEventListener("submit", handleAddRoom);

  // Theory Modal
  btnOpenTheory.addEventListener("click", () => theoryModalOverlay.classList.add("active"));
  btnCloseTheory.addEventListener("click", () => theoryModalOverlay.classList.remove("active"));
  btnOkTheory.addEventListener("click", () => theoryModalOverlay.classList.remove("active"));
  theoryModalOverlay.addEventListener("click", (e) => {
    if (e.target === theoryModalOverlay) theoryModalOverlay.classList.remove("active");
  });

  // Print
  btnPrint.addEventListener("click", () => window.print());
}

// -----------------------------------------------------------------------------
// API CALLS
// -----------------------------------------------------------------------------
async function fetchInitialData() {
  try {
    const res = await fetch("/api/data");
    const json = await res.json();
    if (json.status === "success") {
      appData = json.data;
      updateDrawerUI();
      renderLegend();
      
      // If timetable is empty, generate it automatically on first load!
      if (!appData.schedule || appData.schedule.length === 0) {
        handleRunAlgorithm(false); // silent run
      } else {
        renderTimetable();
        metricLectures.textContent = appData.schedule.length;
      }
    }
  } catch (err) {
    console.error("Failed to load initial data:", err);
    showToast("Could not connect to Flask server. Make sure app.py is running!", "error");
  }
}

async function handleLoadDemoData() {
  showLoading("Loading DU Faculty of Technology Demo Data...");
  try {
    const res = await fetch("/api/demo-data", { method: "POST" });
    const json = await res.json();
    if (json.status === "success") {
      appData = json.data;
      showToast("🏛️ DU FoT 2nd-Year Demo Data Loaded!", "success");
      updateDrawerUI();
      renderLegend();
      
      // Immediately run C++ algorithm to schedule the fresh demo data
      await handleRunAlgorithm(true);
    } else {
      showToast("Error loading demo data: " + json.message, "error");
    }
  } catch (err) {
    showToast("Network error while loading demo data.", "error");
  } finally {
    hideLoading();
  }
}

async function handleRunAlgorithm(showToastOnSuccess = true) {
  showLoading("Executing C++ Graph Coloring & Backtracking Solver...");
  try {
    const res = await fetch("/api/generate", { method: "POST" });
    const json = await res.json();
    
    if (json.status === "success") {
      appData.schedule = json.schedule;
      
      // Update metrics banner
      if (json.meta) {
        metricExecTime.textContent = (json.meta.executionTimeMs || 0).toFixed(2) + " ms";
        metricSteps.textContent = json.meta.backtrackSteps || 0;
        metricLectures.textContent = json.meta.totalLectures || json.schedule.length;
      }

      renderTimetable();
      renderLegend();

      if (showToastOnSuccess) {
        showToast(`⚡ C++ Algorithm finished in ${json.meta?.executionTimeMs?.toFixed(2) || 0} ms (${json.meta?.backtrackSteps || 0} steps)!`, "success");
      }
    } else {
      showToast(json.message || "Failed to generate timetable.", "error");
    }
  } catch (err) {
    console.error(err);
    showToast("Error executing C++ algorithm. Is algorithm.exe compiled?", "error");
  } finally {
    hideLoading();
  }
}

async function saveDatabaseChanges() {
  try {
    const res = await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appData)
    });
    const json = await res.json();
    if (json.status === "success") {
      updateDrawerUI();
      renderLegend();
      showToast("Database updated! Click 'Run C++ Algorithm' to apply changes.", "info");
    }
  } catch (err) {
    showToast("Failed to save changes to data.json", "error");
  }
}

// -----------------------------------------------------------------------------
// TIMETABLE RENDERING
// -----------------------------------------------------------------------------
function renderTimetable() {
  timetableBody.innerHTML = "";

  const schedule = appData.schedule || [];

  TIME_PERIODS.forEach(period => {
    const tr = document.createElement("tr");

    // Check if this is the Lunch Break slot
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

    // Standard Academic Lecture Slot
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

      // Find matching lectures for this slot & day
      const matching = schedule.filter(item => {
        const matchDay = item.day === day;
        const matchTime = item.time === period.label;
        const matchBatch = (currentBatch === "ALL") || (item.batch === currentBatch);

        let matchSearch = true;
        if (searchTerm) {
          const sCode = (item.subjectCode || "").toLowerCase();
          const sName = (item.subjectName || "").toLowerCase();
          const tName = (item.teacherName || "").toLowerCase();
          const room = (item.room || "").toLowerCase();
          matchSearch = sCode.includes(searchTerm) || sName.includes(searchTerm) || tName.includes(searchTerm) || room.includes(searchTerm);
        }

        return matchDay && matchTime && matchBatch && matchSearch;
      });

      if (matching.length > 0) {
        matching.forEach(item => {
          const card = createLectureCard(item);
          tdDay.appendChild(card);
        });
      } else {
        // Free Slot Placeholder
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

  // Assign distinct subject color accent
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
// DRAWER & DATABASE MANAGEMENT
// -----------------------------------------------------------------------------
function openDrawer() {
  manageDrawer.classList.add("active");
  drawerOverlay.classList.add("active");
}

function closeDrawer() {
  manageDrawer.classList.remove("active");
  drawerOverlay.classList.remove("active");
}

function updateDrawerUI() {
  // 1. Teachers list
  teachersListEl.innerHTML = "";
  (appData.teachers || []).forEach(t => {
    const row = document.createElement("div");
    row.className = "item-row";
    row.innerHTML = `
      <div>
        <strong>${escapeHtml(t.id)}</strong> - ${escapeHtml(t.name)}
      </div>
      <button class="item-delete-btn" onclick="deleteTeacher('${escapeHtml(t.id)}')">🗑️</button>
    `;
    teachersListEl.appendChild(row);
  });
  teachersCountEl.textContent = (appData.teachers || []).length;

  // 2. Populate Teacher dropdown in Subject Form
  subTeacherInput.innerHTML = "";
  (appData.teachers || []).forEach(t => {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = `${t.name} (${t.id})`;
    subTeacherInput.appendChild(opt);
  });

  // 3. Subjects list
  subjectsListEl.innerHTML = "";
  (appData.subjects || []).forEach((s, idx) => {
    const row = document.createElement("div");
    row.className = "item-row";
    row.innerHTML = `
      <div>
        <strong>${escapeHtml(s.code)}</strong> (${escapeHtml(s.batch)}) • ${s.weeklyLectures} classes/wk<br>
        <small style="color: #64748b;">${escapeHtml(s.name)} • Faculty: ${escapeHtml(s.teacherId)}</small>
      </div>
      <button class="item-delete-btn" onclick="deleteSubject(${idx})">🗑️</button>
    `;
    subjectsListEl.appendChild(row);
  });
  subjectsCountEl.textContent = (appData.subjects || []).length;

  // 4. Rooms list
  roomsListEl.innerHTML = "";
  (appData.rooms || []).forEach(r => {
    const chip = document.createElement("div");
    chip.className = "room-chip";
    chip.innerHTML = `
      <span>📍 ${escapeHtml(r)}</span>
      <button class="item-delete-btn" onclick="deleteRoom('${escapeHtml(r)}')">✕</button>
    `;
    roomsListEl.appendChild(chip);
  });
  roomsCountEl.textContent = (appData.rooms || []).length;
}

// Add/Delete Handlers
function handleAddTeacher(e) {
  e.preventDefault();
  const id = document.getElementById("teacherIdInput").value.trim().toUpperCase();
  const name = document.getElementById("teacherNameInput").value.trim();

  if (!id || !name) return;
  if (appData.teachers.some(t => t.id === id)) {
    showToast(`Teacher with code '${id}' already exists!`, "error");
    return;
  }

  appData.teachers.push({ id, name });
  document.getElementById("teacherIdInput").value = "";
  document.getElementById("teacherNameInput").value = "";
  saveDatabaseChanges();
}

window.deleteTeacher = function(id) {
  if (confirm(`Remove faculty member ${id}?`)) {
    appData.teachers = appData.teachers.filter(t => t.id !== id);
    saveDatabaseChanges();
  }
};

function handleAddSubject(e) {
  e.preventDefault();
  const code = document.getElementById("subCodeInput").value.trim().toUpperCase();
  const name = document.getElementById("subNameInput").value.trim();
  const batch = document.getElementById("subBatchInput").value;
  const teacherId = document.getElementById("subTeacherInput").value;
  const weeklyLectures = parseInt(document.getElementById("subLecturesInput").value, 10) || 4;

  if (!code || !name) return;

  appData.subjects.push({ code, name, batch, teacherId, weeklyLectures });
  document.getElementById("subCodeInput").value = "";
  document.getElementById("subNameInput").value = "";
  saveDatabaseChanges();
}

window.deleteSubject = function(idx) {
  if (confirm("Remove this subject assignment?")) {
    appData.subjects.splice(idx, 1);
    saveDatabaseChanges();
  }
};

function handleAddRoom(e) {
  e.preventDefault();
  const room = document.getElementById("roomNameInput").value.trim();
  if (!room) return;
  if (appData.rooms.includes(room)) {
    showToast(`Room '${room}' already exists!`, "error");
    return;
  }

  appData.rooms.push(room);
  document.getElementById("roomNameInput").value = "";
  saveDatabaseChanges();
}

window.deleteRoom = function(room) {
  if (confirm(`Remove room ${room}?`)) {
    appData.rooms = appData.rooms.filter(r => r !== room);
    saveDatabaseChanges();
  }
};

// -----------------------------------------------------------------------------
// UI UTILITIES & TOASTS
// -----------------------------------------------------------------------------
function showToast(message, type = "info") {
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

function showLoading(text = "Running C++ Backtracking Solver...") {
  document.getElementById("loadingText").textContent = text;
  loadingOverlay.classList.add("active");
}

function hideLoading() {
  loadingOverlay.classList.remove("active");
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
