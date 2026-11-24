/**
 * ==============================================================================
 * Faculty of Technology Timetable - Frontend Controller (script.js)
 * University of Delhi • Official Academic Timetable Management Portal
 * ------------------------------------------------------------------------------
 * 100% Client-Side Architecture (Runs directly in browser / Vercel / Static Host)
 * Step 3: Feasibility & Conflict Diagnostics, Status Badge, Sub-Section Clarity,
 * Clean Print/PDF Formatting, and JSON Data Backup Export.
 * ==============================================================================
 */

// -----------------------------------------------------------------------------
// CONSTANTS & CONFIGURATION
// -----------------------------------------------------------------------------
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const DAYS_PER_WEEK = 5;
const SLOTS_PER_DAY = 9; // 9 continuous hourly periods (09:00 AM - 06:00 PM)
const TOTAL_TIMESLOTS = DAYS_PER_WEEK * SLOTS_PER_DAY; // 45 slots

const TIME_PERIODS = [
  { id: 0, label: "09:00 AM - 10:00 AM" },
  { id: 1, label: "10:00 AM - 11:00 AM" },
  { id: 2, label: "11:00 AM - 12:00 PM" },
  { id: 3, label: "12:00 PM - 01:00 PM" },
  { id: 4, label: "01:00 PM - 02:00 PM" },
  { id: 5, label: "02:00 PM - 03:00 PM" },
  { id: 6, label: "03:00 PM - 04:00 PM" },
  { id: 7, label: "04:00 PM - 05:00 PM" },
  { id: 8, label: "05:00 PM - 06:00 PM" }
];

// Precompute valid starting slots for each block duration (ensures blocks never cross day boundaries)
const VALID_SLOTS_BY_DURATION = {};
for (let d = 1; d <= 4; d++) {
  VALID_SLOTS_BY_DURATION[d] = [];
  for (let s = 0; s < TOTAL_TIMESLOTS; s++) {
    const periodInDay = s % SLOTS_PER_DAY;
    if (periodInDay + d <= SLOTS_PER_DAY) {
      VALID_SLOTS_BY_DURATION[d].push(s);
    }
  }
}

// Color palette for distinctive course badges
const SUBJECT_COLORS = [
  { bg: "#eef2ff", border: "#4f46e5", text: "#312e81" },
  { bg: "#ecfdf5", border: "#059669", text: "#064e3b" },
  { bg: "#fdf4ff", border: "#c026d3", text: "#701a75" },
  { bg: "#fffbeb", border: "#d97706", text: "#78350f" },
  { bg: "#f0fdfa", border: "#0d9488", text: "#134e4a" },
  { bg: "#eff6ff", border: "#2563eb", text: "#1e3a8a" },
  { bg: "#fef2f2", border: "#dc2626", text: "#7f1d1d" },
  { bg: "#f5f3ff", border: "#7c3aed", text: "#4c1d95" },
  { bg: "#fdf2f8", border: "#db2777", text: "#831843" },
  { bg: "#fafaf9", border: "#78716c", text: "#292524" },
  { bg: "#fff7ed", border: "#ea580c", text: "#7c2d12" },
  { bg: "#f0fdf4", border: "#16a34a", text: "#14532d" }
];

const STORAGE_KEY = "FOT_DU_TIMETABLE_V3_STORAGE";

// -----------------------------------------------------------------------------
// EMBEDDED OFFICIAL DU FACULTY OF TECHNOLOGY DATASET
// -----------------------------------------------------------------------------
const DU_FOT_DEMO_DATA = {
  "batches": [
    "2nd Year CSE-A",
    "2nd Year CSE-B",
    "2nd Year EE-A",
    "2nd Year EE-B",
    "2nd Year ECE-A",
    "2nd Year ECE-B",
    "1st Year CSE-A",
    "1st Year CSE-B",
    "1st Year EE-A",
    "1st Year EE-B",
    "1st Year ECE-A",
    "1st Year ECE-B",
    "3rd Year CSE-A",
    "3rd Year CSE-B",
    "3rd Year EE",
    "3rd Year ECE-A",
    "3rd Year ECE-B",
    "4th Year CSE-A",
    "4th Year CSE-B",
    "4th Year EE",
    "4th Year ECE-A",
    "4th Year ECE-B"
  ],
  "days": [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
  ],
  "timeslots": [
    {
      "slot": 0,
      "name": "09:00 AM - 10:00 AM",
      "isLunch": false
    },
    {
      "slot": 1,
      "name": "10:00 AM - 11:00 AM",
      "isLunch": false
    },
    {
      "slot": 2,
      "name": "11:00 AM - 12:00 PM",
      "isLunch": false
    },
    {
      "slot": 3,
      "name": "12:00 PM - 01:00 PM",
      "isLunch": false
    },
    {
      "slot": 4,
      "name": "01:00 PM - 02:00 PM",
      "isLunch": false
    },
    {
      "slot": 5,
      "name": "02:00 PM - 03:00 PM",
      "isLunch": false
    },
    {
      "slot": 6,
      "name": "03:00 PM - 04:00 PM",
      "isLunch": false
    },
    {
      "slot": 7,
      "name": "04:00 PM - 05:00 PM",
      "isLunch": false
    },
    {
      "slot": 8,
      "name": "05:00 PM - 06:00 PM",
      "isLunch": false
    }
  ],
  "teachers": [
    {
      "id": "AKT",
      "name": "Prof. A.K. Tandon"
    },
    {
      "id": "ART",
      "name": "Dr. Anuradha Tomar"
    },
    {
      "id": "AT",
      "name": "Dr. Arjun Tyagi"
    },
    {
      "id": "JP",
      "name": "Dr. Jeetendra Prasad"
    },
    {
      "id": "RR",
      "name": "Dr. Rekha R."
    },
    {
      "id": "AKS",
      "name": "Mr. Ajay Kumar Sahu"
    },
    {
      "id": "AP",
      "name": "Dr. Ashutosh Pandey"
    },
    {
      "id": "VKG",
      "name": "Dr. Vikram Kumar Gedi"
    },
    {
      "id": "PT",
      "name": "Dr. Pratima"
    },
    {
      "id": "MS",
      "name": "Ms. Manisha Singh"
    },
    {
      "id": "AK",
      "name": "Dr. Amit Kumar"
    },
    {
      "id": "RH",
      "name": "Ms. Reha"
    },
    {
      "id": "UJS",
      "name": "Dr. Ujjal Sur"
    },
    {
      "id": "DP",
      "name": "Dr. Deepika"
    },
    {
      "id": "GB",
      "name": "Ms. Geetanjali Bhola"
    },
    {
      "id": "KJ",
      "name": "Dr. Kajal Kumari"
    },
    {
      "id": "VA",
      "name": "Dr. Vijay Azad"
    },
    {
      "id": "VK",
      "name": "Dr. Vandana Kumari"
    },
    {
      "id": "TK",
      "name": "Ms. Tanya Khaneja"
    },
    {
      "id": "TNK",
      "name": "Ms. Tanishka"
    },
    {
      "id": "KJL",
      "name": "Dr. Kajol"
    },
    {
      "id": "VJ",
      "name": "Prof. Vanita Jain"
    },
    {
      "id": "SJY",
      "name": "Dr. Sanjeev Yadav"
    },
    {
      "id": "RHS",
      "name": "Dr. Rahul Solanki"
    },
    {
      "id": "ANJ",
      "name": "Dr. Anuj Kumar"
    },
    {
      "id": "ANK",
      "name": "Dr. Ankit"
    },
    {
      "id": "SY",
      "name": "Dr. Sangeeta Yadav"
    },
    {
      "id": "BR",
      "name": "Dr. Bhawna Rawat"
    },
    {
      "id": "AKG",
      "name": "Dr. Ajay Kumar Gupta"
    },
    {
      "id": "GS",
      "name": "Dr. Gurinder Singh"
    },
    {
      "id": "SW",
      "name": "Dr. Sweta Rani"
    },
    {
      "id": "JJ",
      "name": "Dr. Juhi Jain"
    },
    {
      "id": "JS",
      "name": "Dr. Jatin Sharma"
    },
    {
      "id": "US",
      "name": "Mr. Unmesh Shukla"
    },
    {
      "id": "UK",
      "name": "Dr. Utkarsh"
    },
    {
      "id": "RTS",
      "name": "Ms. Ritika Sharma"
    },
    {
      "id": "MV",
      "name": "Dr. Manu Vardhan"
    },
    {
      "id": "DRS",
      "name": "Dr. Diptiranjan Samantray"
    },
    {
      "id": "DRB",
      "name": "Prof. D.R. Bhaskar"
    },
    {
      "id": "EKL",
      "name": "Dr. Eklavya"
    },
    {
      "id": "PKS",
      "name": "Prof. P.K. Singh"
    },
    {
      "id": "BA",
      "name": "Prof. Bhawna Agrawal"
    },
    {
      "id": "RJS",
      "name": "Dr. Ranjeet Singh"
    },
    {
      "id": "SNK",
      "name": "Ms. Shivani Kumari"
    },
    {
      "id": "RS",
      "name": "Prof. Raj Senani"
    },
    {
      "id": "KS",
      "name": "Dr. Khushwant Sehra"
    },
    {
      "id": "VS",
      "name": "Dr. Varun Saxena"
    },
    {
      "id": "GSC",
      "name": "Prof. G.S. Chilana"
    },
    {
      "id": "SK",
      "name": "Dr. Sunil Kumar"
    },
    {
      "id": "AZK",
      "name": "Dr. Ahmad Zaman Khan"
    },
    {
      "id": "UDS",
      "name": "Dr. Udita Sharma"
    },
    {
      "id": "SG",
      "name": "Dr. Shubham Gupta"
    },
    {
      "id": "SMT",
      "name": "Dr. Sumit"
    }
  ],
  "rooms": [
    "203",
    "204",
    "211",
    "212",
    "213",
    "214",
    "216",
    "217",
    "219",
    "303",
    "304",
    "311",
    "312",
    "313",
    "314",
    "317",
    "503",
    "513",
    "Basement Lab",
    "G01",
    "R1",
    "R2",
    "R3"
  ],
  "subjects": [
    {
      "code": "ADA",
      "name": "Design & Analysis of Algorithms",
      "batch": "2nd Year CSE-A",
      "subSection": "All",
      "teacherId": "JJ",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "ADA (P)",
      "name": "Algorithms Lab (Group A1)",
      "batch": "2nd Year CSE-A",
      "subSection": "A1",
      "teacherId": "JJ",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "ADA (P)",
      "name": "Algorithms Lab (Group A2)",
      "batch": "2nd Year CSE-A",
      "subSection": "A2",
      "teacherId": "JJ",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "DBMS",
      "name": "Database Management Systems",
      "batch": "2nd Year CSE-A",
      "subSection": "All",
      "teacherId": "GB",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DBMS (P)",
      "name": "DBMS Lab (Group A1)",
      "batch": "2nd Year CSE-A",
      "subSection": "A1",
      "teacherId": "GB",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "DBMS (P)",
      "name": "DBMS Lab (Group A2)",
      "batch": "2nd Year CSE-A",
      "subSection": "A2",
      "teacherId": "GB",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "DSD",
      "name": "Digital System Design",
      "batch": "2nd Year CSE-A",
      "subSection": "All",
      "teacherId": "BR",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DSD (P)",
      "name": "DSD Lab (Group A1)",
      "batch": "2nd Year CSE-A",
      "subSection": "A1",
      "teacherId": "BR",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "DSD (P)",
      "name": "DSD Lab (Group A2)",
      "batch": "2nd Year CSE-A",
      "subSection": "A2",
      "teacherId": "BR",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "PSCS-A",
      "name": "Probability & Statistics for CS",
      "batch": "2nd Year CSE-A",
      "subSection": "All",
      "teacherId": "AZK",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "EVS-2",
      "name": "Environmental Science - II",
      "batch": "2nd Year CSE-A",
      "subSection": "All",
      "teacherId": "UDS",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 2
    },
    {
      "code": "FIT INDIA",
      "name": "Fit India Movement",
      "batch": "2nd Year CSE-A",
      "subSection": "All",
      "teacherId": "AP",
      "weeklyLectures": 1,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 1
    },
    {
      "code": "ADA",
      "name": "Design & Analysis of Algorithms",
      "batch": "2nd Year CSE-B",
      "subSection": "All",
      "teacherId": "JJ",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "ADA (P)",
      "name": "Algorithms Lab (Group B1)",
      "batch": "2nd Year CSE-B",
      "subSection": "B1",
      "teacherId": "JJ",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "ADA (P)",
      "name": "Algorithms Lab (Group B2)",
      "batch": "2nd Year CSE-B",
      "subSection": "B2",
      "teacherId": "JJ",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "DBMS",
      "name": "Database Management Systems",
      "batch": "2nd Year CSE-B",
      "subSection": "All",
      "teacherId": "GB",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DBMS (P)",
      "name": "DBMS Lab (Group B1)",
      "batch": "2nd Year CSE-B",
      "subSection": "B1",
      "teacherId": "GB",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "DBMS (P)",
      "name": "DBMS Lab (Group B2)",
      "batch": "2nd Year CSE-B",
      "subSection": "B2",
      "teacherId": "GB",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "DSD",
      "name": "Digital System Design",
      "batch": "2nd Year CSE-B",
      "subSection": "All",
      "teacherId": "BR",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DSD (P)",
      "name": "DSD Lab (Group B1)",
      "batch": "2nd Year CSE-B",
      "subSection": "B1",
      "teacherId": "BR",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "DSD (P)",
      "name": "DSD Lab (Group B2)",
      "batch": "2nd Year CSE-B",
      "subSection": "B2",
      "teacherId": "BR",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "PSCS-B",
      "name": "Probability & Statistics for CS",
      "batch": "2nd Year CSE-B",
      "subSection": "All",
      "teacherId": "AZK",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "FSS",
      "name": "Full Stack Specialization",
      "batch": "2nd Year CSE-B",
      "subSection": "All",
      "teacherId": "AKS",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 2
    },
    {
      "code": "EVS-2",
      "name": "Environmental Science - II",
      "batch": "2nd Year CSE-B",
      "subSection": "All",
      "teacherId": "EKL",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 2
    },
    {
      "code": "FIT INDIA",
      "name": "Fit India Movement",
      "batch": "2nd Year CSE-B",
      "subSection": "All",
      "teacherId": "AZK",
      "weeklyLectures": 1,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 1
    },
    {
      "code": "NBD",
      "name": "Network Analysis & Design",
      "batch": "2nd Year EE-A",
      "subSection": "All",
      "teacherId": "SG",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "EM-I",
      "name": "Electrical Machines - I",
      "batch": "2nd Year EE-A",
      "subSection": "All",
      "teacherId": "SG",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "EM-I (P)",
      "name": "Machines Lab (Group A1)",
      "batch": "2nd Year EE-A",
      "subSection": "A1",
      "teacherId": "SG",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "EM-I (P)",
      "name": "Machines Lab (Group A2)",
      "batch": "2nd Year EE-A",
      "subSection": "A2",
      "teacherId": "SG",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "EVS-2",
      "name": "Environmental Science - II",
      "batch": "2nd Year EE-A",
      "subSection": "All",
      "teacherId": "UDS",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 2
    },
    {
      "code": "VLSI",
      "name": "VLSI Design & Technology",
      "batch": "2nd Year EE-A",
      "subSection": "All",
      "teacherId": "SW",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "ADEC (P)",
      "name": "Analog & Digital Electronics Lab (A1)",
      "batch": "2nd Year EE-A",
      "subSection": "A1",
      "teacherId": "GS",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "ADEC (P)",
      "name": "Analog & Digital Electronics Lab (A2)",
      "batch": "2nd Year EE-A",
      "subSection": "A2",
      "teacherId": "GS",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "NBD",
      "name": "Network Analysis & Design",
      "batch": "2nd Year EE-B",
      "subSection": "All",
      "teacherId": "SG",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "EM-I",
      "name": "Electrical Machines - I",
      "batch": "2nd Year EE-B",
      "subSection": "All",
      "teacherId": "SG",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "EM-I (P)",
      "name": "Machines Lab (Group B1)",
      "batch": "2nd Year EE-B",
      "subSection": "B1",
      "teacherId": "SG",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "EM-I (P)",
      "name": "Machines Lab (Group B2)",
      "batch": "2nd Year EE-B",
      "subSection": "B2",
      "teacherId": "SG",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "EVS-2",
      "name": "Environmental Science - II",
      "batch": "2nd Year EE-B",
      "subSection": "All",
      "teacherId": "UDS",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 2
    },
    {
      "code": "VLSI",
      "name": "VLSI Design & Technology",
      "batch": "2nd Year EE-B",
      "subSection": "All",
      "teacherId": "SW",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "PSCS-A",
      "name": "Probability & Statistics for EE",
      "batch": "2nd Year EE-B",
      "subSection": "All",
      "teacherId": "AZK",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "EDC",
      "name": "Electronic Devices & Circuits",
      "batch": "2nd Year ECE-A",
      "subSection": "All",
      "teacherId": "DRS",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "EDC (P)",
      "name": "EDC Lab (Group A1)",
      "batch": "2nd Year ECE-A",
      "subSection": "A1",
      "teacherId": "DRS",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "EDC (P)",
      "name": "EDC Lab (Group A2)",
      "batch": "2nd Year ECE-A",
      "subSection": "A2",
      "teacherId": "DRS",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "NAS",
      "name": "Network Analysis & Synthesis",
      "batch": "2nd Year ECE-A",
      "subSection": "All",
      "teacherId": "DRB",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "VLSI",
      "name": "VLSI Design & Technology",
      "batch": "2nd Year ECE-A",
      "subSection": "All",
      "teacherId": "SW",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "IEHV",
      "name": "Industrial Electronics & High Voltage",
      "batch": "2nd Year ECE-A",
      "subSection": "All",
      "teacherId": "ART",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "EDC",
      "name": "Electronic Devices & Circuits",
      "batch": "2nd Year ECE-B",
      "subSection": "All",
      "teacherId": "BA",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "EDC (P)",
      "name": "EDC Lab (Group B1)",
      "batch": "2nd Year ECE-B",
      "subSection": "B1",
      "teacherId": "BA",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "EDC (P)",
      "name": "EDC Lab (Group B2)",
      "batch": "2nd Year ECE-B",
      "subSection": "B2",
      "teacherId": "BA",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "NAS",
      "name": "Network Analysis & Synthesis",
      "batch": "2nd Year ECE-B",
      "subSection": "All",
      "teacherId": "DRB",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DE-1",
      "name": "Digital Electronics - I",
      "batch": "2nd Year ECE-B",
      "subSection": "All",
      "teacherId": "PKS",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "PSCS-A",
      "name": "Probability & Statistics for ECE",
      "batch": "2nd Year ECE-B",
      "subSection": "All",
      "teacherId": "AZK",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "M-1",
      "name": "Mathematics - I",
      "batch": "1st Year CSE-A",
      "subSection": "All",
      "teacherId": "ANJ",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "M-1 (T)",
      "name": "Math Tutorial (Group A1)",
      "batch": "1st Year CSE-A",
      "subSection": "A1",
      "teacherId": "ANJ",
      "weeklyLectures": 1,
      "semester": "odd",
      "type": "T",
      "duration": 1,
      "weeklySessions": 1
    },
    {
      "code": "M-1 (T)",
      "name": "Math Tutorial (Group A2)",
      "batch": "1st Year CSE-A",
      "subSection": "A2",
      "teacherId": "ANJ",
      "weeklyLectures": 1,
      "semester": "odd",
      "type": "T",
      "duration": 1,
      "weeklySessions": 1
    },
    {
      "code": "CW",
      "name": "Computer Workshop (Group A1)",
      "batch": "1st Year CSE-A",
      "subSection": "A1",
      "teacherId": "UK",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 2
    },
    {
      "code": "CW",
      "name": "Computer Workshop (Group A2)",
      "batch": "1st Year CSE-A",
      "subSection": "A2",
      "teacherId": "JS",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 2
    },
    {
      "code": "FCP",
      "name": "Fundamentals of Computer Programming",
      "batch": "1st Year CSE-A",
      "subSection": "All",
      "teacherId": "US",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "FCP (P)",
      "name": "FCP Lab (Group A1)",
      "batch": "1st Year CSE-A",
      "subSection": "A1",
      "teacherId": "US",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "FCP (P)",
      "name": "FCP Lab (Group A2)",
      "batch": "1st Year CSE-A",
      "subSection": "A2",
      "teacherId": "US",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "IEEE",
      "name": "Intro to Electrical & Electronics",
      "batch": "1st Year CSE-A",
      "subSection": "All",
      "teacherId": "KJ",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DE",
      "name": "Digital Electronics",
      "batch": "1st Year CSE-A",
      "subSection": "All",
      "teacherId": "RTS",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "M-1",
      "name": "Mathematics - I",
      "batch": "1st Year CSE-B",
      "subSection": "All",
      "teacherId": "ANJ",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "CW",
      "name": "Computer Workshop (Group B1)",
      "batch": "1st Year CSE-B",
      "subSection": "B1",
      "teacherId": "MV",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 2
    },
    {
      "code": "CW",
      "name": "Computer Workshop (Group B2)",
      "batch": "1st Year CSE-B",
      "subSection": "B2",
      "teacherId": "MV",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 2
    },
    {
      "code": "FCP",
      "name": "Fundamentals of Computer Programming",
      "batch": "1st Year CSE-B",
      "subSection": "All",
      "teacherId": "UK",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "PHY",
      "name": "Physics for Engineers",
      "batch": "1st Year CSE-B",
      "subSection": "All",
      "teacherId": "VK",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "PHY (P)",
      "name": "Physics Lab (Group B1)",
      "batch": "1st Year CSE-B",
      "subSection": "B1",
      "teacherId": "VK",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "PHY (P)",
      "name": "Physics Lab (Group B2)",
      "batch": "1st Year CSE-B",
      "subSection": "B2",
      "teacherId": "VK",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "DE",
      "name": "Digital Electronics",
      "batch": "1st Year CSE-B",
      "subSection": "All",
      "teacherId": "RTS",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "M-1",
      "name": "Mathematics - I",
      "batch": "1st Year EE-A",
      "subSection": "All",
      "teacherId": "AP",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "EW",
      "name": "Engineering Workshop (Group A1)",
      "batch": "1st Year EE-A",
      "subSection": "A1",
      "teacherId": "JP",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 2
    },
    {
      "code": "EW",
      "name": "Engineering Workshop (Group A2)",
      "batch": "1st Year EE-A",
      "subSection": "A2",
      "teacherId": "AKS",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 2
    },
    {
      "code": "FCP",
      "name": "Fundamentals of Computer Programming",
      "batch": "1st Year EE-A",
      "subSection": "All",
      "teacherId": "RR",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "FCP (P)",
      "name": "FCP Lab (Group A1)",
      "batch": "1st Year EE-A",
      "subSection": "A1",
      "teacherId": "RR",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "FCP (P)",
      "name": "FCP Lab (Group A2)",
      "batch": "1st Year EE-A",
      "subSection": "A2",
      "teacherId": "RR",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "IEEE",
      "name": "Intro to Electrical & Electronics",
      "batch": "1st Year EE-A",
      "subSection": "All",
      "teacherId": "AT",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DE",
      "name": "Digital Electronics",
      "batch": "1st Year EE-A",
      "subSection": "All",
      "teacherId": "MS",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "M-1",
      "name": "Mathematics - I",
      "batch": "1st Year EE-B",
      "subSection": "All",
      "teacherId": "AP",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "FCP",
      "name": "Fundamentals of Computer Programming",
      "batch": "1st Year EE-B",
      "subSection": "All",
      "teacherId": "GB",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "EW",
      "name": "Engineering Workshop (Group B1)",
      "batch": "1st Year EE-B",
      "subSection": "B1",
      "teacherId": "JP",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 2
    },
    {
      "code": "EW",
      "name": "Engineering Workshop (Group B2)",
      "batch": "1st Year EE-B",
      "subSection": "B2",
      "teacherId": "DP",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 2
    },
    {
      "code": "PHY",
      "name": "Physics for Engineers",
      "batch": "1st Year EE-B",
      "subSection": "All",
      "teacherId": "KJ",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DE",
      "name": "Digital Electronics",
      "batch": "1st Year EE-B",
      "subSection": "All",
      "teacherId": "MS",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "M-1",
      "name": "Mathematics - I",
      "batch": "1st Year ECE-A",
      "subSection": "All",
      "teacherId": "ANJ",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "ECW",
      "name": "Electronics Workshop (Group A1)",
      "batch": "1st Year ECE-A",
      "subSection": "A1",
      "teacherId": "SJY",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 2
    },
    {
      "code": "ECW",
      "name": "Electronics Workshop (Group A2)",
      "batch": "1st Year ECE-A",
      "subSection": "A2",
      "teacherId": "VJ",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 2
    },
    {
      "code": "FCP",
      "name": "Fundamentals of Computer Programming",
      "batch": "1st Year ECE-A",
      "subSection": "All",
      "teacherId": "RR",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "IEEE",
      "name": "Intro to Electrical & Electronics",
      "batch": "1st Year ECE-A",
      "subSection": "All",
      "teacherId": "AT",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DE",
      "name": "Digital Electronics",
      "batch": "1st Year ECE-A",
      "subSection": "All",
      "teacherId": "KJL",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "M-1",
      "name": "Mathematics - I",
      "batch": "1st Year ECE-B",
      "subSection": "All",
      "teacherId": "RHS",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "ECW",
      "name": "Electronics Workshop (Group B1)",
      "batch": "1st Year ECE-B",
      "subSection": "B1",
      "teacherId": "AKG",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 2
    },
    {
      "code": "ECW",
      "name": "Electronics Workshop (Group B2)",
      "batch": "1st Year ECE-B",
      "subSection": "B2",
      "teacherId": "GS",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 2
    },
    {
      "code": "PHY",
      "name": "Physics for Engineers",
      "batch": "1st Year ECE-B",
      "subSection": "All",
      "teacherId": "KJ",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DE",
      "name": "Digital Electronics",
      "batch": "1st Year ECE-B",
      "subSection": "All",
      "teacherId": "KJL",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "AIML",
      "name": "Artificial Intelligence & ML",
      "batch": "3rd Year CSE-A",
      "subSection": "All",
      "teacherId": "SY",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "AIML (P)",
      "name": "AIML Lab (Group A1)",
      "batch": "3rd Year CSE-A",
      "subSection": "A1",
      "teacherId": "SY",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "AIML (P)",
      "name": "AIML Lab (Group A2)",
      "batch": "3rd Year CSE-A",
      "subSection": "A2",
      "teacherId": "SY",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "CN",
      "name": "Computer Networks",
      "batch": "3rd Year CSE-A",
      "subSection": "All",
      "teacherId": "JS",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "CN (P)",
      "name": "Computer Networks Lab (Group A1)",
      "batch": "3rd Year CSE-A",
      "subSection": "A1",
      "teacherId": "JS",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "CN (P)",
      "name": "Computer Networks Lab (Group A2)",
      "batch": "3rd Year CSE-A",
      "subSection": "A2",
      "teacherId": "JS",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "TOC",
      "name": "Theory of Computation",
      "batch": "3rd Year CSE-A",
      "subSection": "All",
      "teacherId": "SNK",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DMW",
      "name": "Data Mining & Warehousing",
      "batch": "3rd Year CSE-A",
      "subSection": "All",
      "teacherId": "JS",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "AIML",
      "name": "Artificial Intelligence & ML",
      "batch": "3rd Year CSE-B",
      "subSection": "All",
      "teacherId": "SY",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "AIML (P)",
      "name": "AIML Lab (Group B1)",
      "batch": "3rd Year CSE-B",
      "subSection": "B1",
      "teacherId": "SY",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "AIML (P)",
      "name": "AIML Lab (Group B2)",
      "batch": "3rd Year CSE-B",
      "subSection": "B2",
      "teacherId": "SY",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "CN",
      "name": "Computer Networks",
      "batch": "3rd Year CSE-B",
      "subSection": "All",
      "teacherId": "JS",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "TOC",
      "name": "Theory of Computation",
      "batch": "3rd Year CSE-B",
      "subSection": "All",
      "teacherId": "SNK",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DMW",
      "name": "Data Mining & Warehousing",
      "batch": "3rd Year CSE-B",
      "subSection": "All",
      "teacherId": "JS",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "CS",
      "name": "Control Systems",
      "batch": "3rd Year EE",
      "subSection": "All",
      "teacherId": "RJS",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "CS (P)",
      "name": "Control Systems Lab (Group B1)",
      "batch": "3rd Year EE",
      "subSection": "B1",
      "teacherId": "RJS",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "CS (P)",
      "name": "Control Systems Lab (Group B2)",
      "batch": "3rd Year EE",
      "subSection": "B2",
      "teacherId": "RJS",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "EMFT",
      "name": "Electromagnetic Field Theory",
      "batch": "3rd Year EE",
      "subSection": "All",
      "teacherId": "UJS",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DIP-B",
      "name": "Digital Image Processing",
      "batch": "3rd Year EE",
      "subSection": "All",
      "teacherId": "GS",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "AVLSI",
      "name": "Advanced VLSI Design",
      "batch": "3rd Year EE",
      "subSection": "All",
      "teacherId": "VK",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "ACS",
      "name": "Analog Communication Systems",
      "batch": "3rd Year ECE-A",
      "subSection": "All",
      "teacherId": "GSC",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "ACS (P)",
      "name": "ACS Lab (Group A1)",
      "batch": "3rd Year ECE-A",
      "subSection": "A1",
      "teacherId": "GSC",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "ACS (P)",
      "name": "ACS Lab (Group A2)",
      "batch": "3rd Year ECE-A",
      "subSection": "A2",
      "teacherId": "GSC",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "CTRLS",
      "name": "Control Systems Engineering",
      "batch": "3rd Year ECE-A",
      "subSection": "All",
      "teacherId": "DP",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "AVLSI",
      "name": "Advanced VLSI Design",
      "batch": "3rd Year ECE-A",
      "subSection": "All",
      "teacherId": "VK",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "EH",
      "name": "Energy Harvesting",
      "batch": "3rd Year ECE-A",
      "subSection": "All",
      "teacherId": "SK",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "ACS",
      "name": "Analog Communication Systems",
      "batch": "3rd Year ECE-B",
      "subSection": "All",
      "teacherId": "VS",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "ACS (P)",
      "name": "ACS Lab (Group B1)",
      "batch": "3rd Year ECE-B",
      "subSection": "B1",
      "teacherId": "VS",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "ACS (P)",
      "name": "ACS Lab (Group B2)",
      "batch": "3rd Year ECE-B",
      "subSection": "B2",
      "teacherId": "VS",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "CTRLS",
      "name": "Control Systems Engineering",
      "batch": "3rd Year ECE-B",
      "subSection": "All",
      "teacherId": "VJ",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "AVLSI",
      "name": "Advanced VLSI Design",
      "batch": "3rd Year ECE-B",
      "subSection": "All",
      "teacherId": "VK",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "EH",
      "name": "Energy Harvesting",
      "batch": "3rd Year ECE-B",
      "subSection": "All",
      "teacherId": "SK",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "CPS",
      "name": "Cyber Physical Systems",
      "batch": "4th Year CSE-A",
      "subSection": "All",
      "teacherId": "SK",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "CPS (P)",
      "name": "CPS Lab (Group A1)",
      "batch": "4th Year CSE-A",
      "subSection": "A1",
      "teacherId": "SK",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "CPS (P)",
      "name": "CPS Lab (Group A2)",
      "batch": "4th Year CSE-A",
      "subSection": "A2",
      "teacherId": "SK",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "EDGE-A",
      "name": "Edge Computing (Architecture)",
      "batch": "4th Year CSE-A",
      "subSection": "All",
      "teacherId": "MV",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "MLDL",
      "name": "Machine Learning & Deep Learning",
      "batch": "4th Year CSE-A",
      "subSection": "All",
      "teacherId": "SMT",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "MLDL (P)",
      "name": "MLDL Lab (Group A1)",
      "batch": "4th Year CSE-A",
      "subSection": "A1",
      "teacherId": "UK",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "MLDL (P)",
      "name": "MLDL Lab (Group A2)",
      "batch": "4th Year CSE-A",
      "subSection": "A2",
      "teacherId": "GB",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "ECFC",
      "name": "Ethics & Cyber Law",
      "batch": "4th Year CSE-A",
      "subSection": "All",
      "teacherId": "JP",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "RL-A",
      "name": "Reinforcement Learning",
      "batch": "4th Year CSE-A",
      "subSection": "All",
      "teacherId": "SNK",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "SQAM",
      "name": "Software Quality & Metrics",
      "batch": "4th Year CSE-A",
      "subSection": "All",
      "teacherId": "JJ",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 2
    },
    {
      "code": "CPS",
      "name": "Cyber Physical Systems",
      "batch": "4th Year CSE-B",
      "subSection": "All",
      "teacherId": "SK",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "CPS (P)",
      "name": "CPS Lab (Group B1)",
      "batch": "4th Year CSE-B",
      "subSection": "B1",
      "teacherId": "SK",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "CPS (P)",
      "name": "CPS Lab (Group B2)",
      "batch": "4th Year CSE-B",
      "subSection": "B2",
      "teacherId": "SK",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "EDGE-B",
      "name": "Edge Computing (Networks)",
      "batch": "4th Year CSE-B",
      "subSection": "All",
      "teacherId": "MV",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "MLDL",
      "name": "Machine Learning & Deep Learning",
      "batch": "4th Year CSE-B",
      "subSection": "All",
      "teacherId": "SMT",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "ECFC",
      "name": "Ethics & Cyber Law",
      "batch": "4th Year CSE-B",
      "subSection": "All",
      "teacherId": "JP",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "RL-B",
      "name": "Reinforcement Learning",
      "batch": "4th Year CSE-B",
      "subSection": "All",
      "teacherId": "SNK",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "SQAM",
      "name": "Software Quality & Metrics",
      "batch": "4th Year CSE-B",
      "subSection": "All",
      "teacherId": "JJ",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 2
    },
    {
      "code": "NBD EE",
      "name": "Network & System Analysis",
      "batch": "4th Year EE",
      "subSection": "All",
      "teacherId": "SG",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "ED EE",
      "name": "Electric Drives",
      "batch": "4th Year EE",
      "subSection": "All",
      "teacherId": "AKS",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "MEV EE",
      "name": "Modern Electric Vehicles",
      "batch": "4th Year EE",
      "subSection": "All",
      "teacherId": "ART",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "MEV EE (P)",
      "name": "EV Lab (Group A1)",
      "batch": "4th Year EE",
      "subSection": "A1",
      "teacherId": "ART",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "MEV EE (P)",
      "name": "EV Lab (Group A2)",
      "batch": "4th Year EE",
      "subSection": "A2",
      "teacherId": "ART",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "AVFD",
      "name": "Analog VLSI Filter Design",
      "batch": "4th Year EE",
      "subSection": "All",
      "teacherId": "RS",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DADV",
      "name": "Distributed Algorithms & Visualization",
      "batch": "4th Year EE",
      "subSection": "All",
      "teacherId": "SMT",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "ECFC",
      "name": "Ethics & Cyber Law",
      "batch": "4th Year EE",
      "subSection": "All",
      "teacherId": "JP",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "SQAM",
      "name": "Software Quality & Metrics",
      "batch": "4th Year EE",
      "subSection": "All",
      "teacherId": "JJ",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 2
    },
    {
      "code": "SCE",
      "name": "Satellite Communication Engineering",
      "batch": "4th Year ECE-A",
      "subSection": "All",
      "teacherId": "RHS",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DASIC",
      "name": "Digital ASIC Design",
      "batch": "4th Year ECE-A",
      "subSection": "All",
      "teacherId": "KS",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DASIC (P)",
      "name": "ASIC Lab (Group A1)",
      "batch": "4th Year ECE-A",
      "subSection": "A1",
      "teacherId": "KS",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "DASIC (P)",
      "name": "ASIC Lab (Group A2)",
      "batch": "4th Year ECE-A",
      "subSection": "A2",
      "teacherId": "KS",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "MIC",
      "name": "Microwave Integrated Circuits",
      "batch": "4th Year ECE-A",
      "subSection": "All",
      "teacherId": "SJY",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "FOA",
      "name": "Fiber Optics & Applications",
      "batch": "4th Year ECE-A",
      "subSection": "All",
      "teacherId": "UK",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "AVFD",
      "name": "Analog VLSI Filter Design",
      "batch": "4th Year ECE-A",
      "subSection": "All",
      "teacherId": "RS",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DADV",
      "name": "Distributed Algorithms & Visualization",
      "batch": "4th Year ECE-A",
      "subSection": "All",
      "teacherId": "SMT",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "SCE",
      "name": "Satellite Communication Engineering",
      "batch": "4th Year ECE-B",
      "subSection": "All",
      "teacherId": "RHS",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DASIC",
      "name": "Digital ASIC Design",
      "batch": "4th Year ECE-B",
      "subSection": "All",
      "teacherId": "KS",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DASIC (P)",
      "name": "ASIC Lab (Group B1)",
      "batch": "4th Year ECE-B",
      "subSection": "B1",
      "teacherId": "KS",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "DASIC (P)",
      "name": "ASIC Lab (Group B2)",
      "batch": "4th Year ECE-B",
      "subSection": "B2",
      "teacherId": "KS",
      "weeklyLectures": 2,
      "semester": "odd",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "MIC",
      "name": "Microwave Integrated Circuits",
      "batch": "4th Year ECE-B",
      "subSection": "All",
      "teacherId": "SJY",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "FOA",
      "name": "Fiber Optics & Applications",
      "batch": "4th Year ECE-B",
      "subSection": "All",
      "teacherId": "UK",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "AVFD",
      "name": "Analog VLSI Filter Design",
      "batch": "4th Year ECE-B",
      "subSection": "All",
      "teacherId": "RS",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DADV",
      "name": "Distributed Algorithms & Visualization",
      "batch": "4th Year ECE-B",
      "subSection": "All",
      "teacherId": "SMT",
      "weeklyLectures": 3,
      "semester": "odd",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "M-2",
      "name": "Mathematics - II",
      "batch": "1st Year CSE-A",
      "subSection": "All",
      "teacherId": "ANJ",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "M-2 (T)",
      "name": "Math Tutorial (Group A1)",
      "batch": "1st Year CSE-A",
      "subSection": "A1",
      "teacherId": "ANJ",
      "weeklyLectures": 1,
      "semester": "even",
      "type": "T",
      "duration": 1,
      "weeklySessions": 1
    },
    {
      "code": "M-2 (T)",
      "name": "Math Tutorial (Group A2)",
      "batch": "1st Year CSE-A",
      "subSection": "A2",
      "teacherId": "ANJ",
      "weeklyLectures": 1,
      "semester": "even",
      "type": "T",
      "duration": 1,
      "weeklySessions": 1
    },
    {
      "code": "DSA",
      "name": "Data Structures & Algorithms",
      "batch": "1st Year CSE-A",
      "subSection": "All",
      "teacherId": "JJ",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DSA (P)",
      "name": "DSA Lab (Group A1)",
      "batch": "1st Year CSE-A",
      "subSection": "A1",
      "teacherId": "JJ",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "DSA (P)",
      "name": "DSA Lab (Group A2)",
      "batch": "1st Year CSE-A",
      "subSection": "A2",
      "teacherId": "JJ",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "BEE",
      "name": "Basic Electrical Engineering",
      "batch": "1st Year CSE-A",
      "subSection": "All",
      "teacherId": "AT",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "BEE (P)",
      "name": "BEE Lab (Group A1)",
      "batch": "1st Year CSE-A",
      "subSection": "A1",
      "teacherId": "AT",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "BEE (P)",
      "name": "BEE Lab (Group A2)",
      "batch": "1st Year CSE-A",
      "subSection": "A2",
      "teacherId": "AT",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "CHEM",
      "name": "Engineering Chemistry",
      "batch": "1st Year CSE-A",
      "subSection": "All",
      "teacherId": "PT",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "CHEM (P)",
      "name": "Chemistry Lab (Group A1)",
      "batch": "1st Year CSE-A",
      "subSection": "A1",
      "teacherId": "PT",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "CHEM (P)",
      "name": "Chemistry Lab (Group A2)",
      "batch": "1st Year CSE-A",
      "subSection": "A2",
      "teacherId": "PT",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "EVS-1",
      "name": "Environmental Studies - I",
      "batch": "1st Year CSE-A",
      "subSection": "All",
      "teacherId": "UDS",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 2
    },
    {
      "code": "M-2",
      "name": "Mathematics - II",
      "batch": "1st Year CSE-B",
      "subSection": "All",
      "teacherId": "ANJ",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "M-2 (T)",
      "name": "Math Tutorial (Group B1)",
      "batch": "1st Year CSE-B",
      "subSection": "B1",
      "teacherId": "ANJ",
      "weeklyLectures": 1,
      "semester": "even",
      "type": "T",
      "duration": 1,
      "weeklySessions": 1
    },
    {
      "code": "M-2 (T)",
      "name": "Math Tutorial (Group B2)",
      "batch": "1st Year CSE-B",
      "subSection": "B2",
      "teacherId": "ANJ",
      "weeklyLectures": 1,
      "semester": "even",
      "type": "T",
      "duration": 1,
      "weeklySessions": 1
    },
    {
      "code": "DSA",
      "name": "Data Structures & Algorithms",
      "batch": "1st Year CSE-B",
      "subSection": "All",
      "teacherId": "UK",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DSA (P)",
      "name": "DSA Lab (Group B1)",
      "batch": "1st Year CSE-B",
      "subSection": "B1",
      "teacherId": "UK",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "DSA (P)",
      "name": "DSA Lab (Group B2)",
      "batch": "1st Year CSE-B",
      "subSection": "B2",
      "teacherId": "UK",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "BEE",
      "name": "Basic Electrical Engineering",
      "batch": "1st Year CSE-B",
      "subSection": "All",
      "teacherId": "JP",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "BEE (P)",
      "name": "BEE Lab (Group B1)",
      "batch": "1st Year CSE-B",
      "subSection": "B1",
      "teacherId": "JP",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "BEE (P)",
      "name": "BEE Lab (Group B2)",
      "batch": "1st Year CSE-B",
      "subSection": "B2",
      "teacherId": "JP",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "CHEM",
      "name": "Engineering Chemistry",
      "batch": "1st Year CSE-B",
      "subSection": "All",
      "teacherId": "PT",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "EVS-1",
      "name": "Environmental Studies - I",
      "batch": "1st Year CSE-B",
      "subSection": "All",
      "teacherId": "UDS",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 2
    },
    {
      "code": "M-2",
      "name": "Mathematics - II",
      "batch": "1st Year EE-A",
      "subSection": "All",
      "teacherId": "AP",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DSA",
      "name": "Data Structures & Algorithms",
      "batch": "1st Year EE-A",
      "subSection": "All",
      "teacherId": "US",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DSA (P)",
      "name": "DSA Lab (Group A1)",
      "batch": "1st Year EE-A",
      "subSection": "A1",
      "teacherId": "US",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "DSA (P)",
      "name": "DSA Lab (Group A2)",
      "batch": "1st Year EE-A",
      "subSection": "A2",
      "teacherId": "US",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "ED",
      "name": "Engineering Graphics & Drawing",
      "batch": "1st Year EE-A",
      "subSection": "All",
      "teacherId": "AKS",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 2
    },
    {
      "code": "ED (P)",
      "name": "CAD Lab (Group A1)",
      "batch": "1st Year EE-A",
      "subSection": "A1",
      "teacherId": "AKS",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "ED (P)",
      "name": "CAD Lab (Group A2)",
      "batch": "1st Year EE-A",
      "subSection": "A2",
      "teacherId": "AKS",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "CHEM",
      "name": "Engineering Chemistry",
      "batch": "1st Year EE-A",
      "subSection": "All",
      "teacherId": "PT",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "CHEM (P)",
      "name": "Chemistry Lab (Group A1)",
      "batch": "1st Year EE-A",
      "subSection": "A1",
      "teacherId": "PT",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "CHEM (P)",
      "name": "Chemistry Lab (Group A2)",
      "batch": "1st Year EE-A",
      "subSection": "A2",
      "teacherId": "PT",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "BEE",
      "name": "Basic Electrical Engineering",
      "batch": "1st Year EE-A",
      "subSection": "All",
      "teacherId": "JP",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "M-2",
      "name": "Mathematics - II",
      "batch": "1st Year EE-B",
      "subSection": "All",
      "teacherId": "AP",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DSA",
      "name": "Data Structures & Algorithms",
      "batch": "1st Year EE-B",
      "subSection": "All",
      "teacherId": "GB",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DSA (P)",
      "name": "DSA Lab (Group B1)",
      "batch": "1st Year EE-B",
      "subSection": "B1",
      "teacherId": "GB",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "DSA (P)",
      "name": "DSA Lab (Group B2)",
      "batch": "1st Year EE-B",
      "subSection": "B2",
      "teacherId": "GB",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "ED",
      "name": "Engineering Graphics & Drawing",
      "batch": "1st Year EE-B",
      "subSection": "All",
      "teacherId": "AKS",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 2
    },
    {
      "code": "ED (P)",
      "name": "CAD Lab (Group B1)",
      "batch": "1st Year EE-B",
      "subSection": "B1",
      "teacherId": "AKS",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "ED (P)",
      "name": "CAD Lab (Group B2)",
      "batch": "1st Year EE-B",
      "subSection": "B2",
      "teacherId": "AKS",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "CHEM",
      "name": "Engineering Chemistry",
      "batch": "1st Year EE-B",
      "subSection": "All",
      "teacherId": "PT",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "BEE",
      "name": "Basic Electrical Engineering",
      "batch": "1st Year EE-B",
      "subSection": "All",
      "teacherId": "DP",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "M-2",
      "name": "Mathematics - II",
      "batch": "1st Year ECE-A",
      "subSection": "All",
      "teacherId": "ANJ",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DSA",
      "name": "Data Structures & Algorithms",
      "batch": "1st Year ECE-A",
      "subSection": "All",
      "teacherId": "SJY",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DSA (P)",
      "name": "DSA Lab (Group A1)",
      "batch": "1st Year ECE-A",
      "subSection": "A1",
      "teacherId": "SJY",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "DSA (P)",
      "name": "DSA Lab (Group A2)",
      "batch": "1st Year ECE-A",
      "subSection": "A2",
      "teacherId": "SJY",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "BEE",
      "name": "Basic Electrical Engineering",
      "batch": "1st Year ECE-A",
      "subSection": "All",
      "teacherId": "AT",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "BEE (P)",
      "name": "BEE Lab (Group A1)",
      "batch": "1st Year ECE-A",
      "subSection": "A1",
      "teacherId": "AT",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "BEE (P)",
      "name": "BEE Lab (Group A2)",
      "batch": "1st Year ECE-A",
      "subSection": "A2",
      "teacherId": "AT",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "CHEM",
      "name": "Engineering Chemistry",
      "batch": "1st Year ECE-A",
      "subSection": "All",
      "teacherId": "PT",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "EVS-1",
      "name": "Environmental Studies - I",
      "batch": "1st Year ECE-A",
      "subSection": "All",
      "teacherId": "UDS",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 2
    },
    {
      "code": "M-2",
      "name": "Mathematics - II",
      "batch": "1st Year ECE-B",
      "subSection": "All",
      "teacherId": "RHS",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DSA",
      "name": "Data Structures & Algorithms",
      "batch": "1st Year ECE-B",
      "subSection": "All",
      "teacherId": "AKG",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DSA (P)",
      "name": "DSA Lab (Group B1)",
      "batch": "1st Year ECE-B",
      "subSection": "B1",
      "teacherId": "AKG",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "DSA (P)",
      "name": "DSA Lab (Group B2)",
      "batch": "1st Year ECE-B",
      "subSection": "B2",
      "teacherId": "AKG",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "BEE",
      "name": "Basic Electrical Engineering",
      "batch": "1st Year ECE-B",
      "subSection": "All",
      "teacherId": "GS",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "BEE (P)",
      "name": "BEE Lab (Group B1)",
      "batch": "1st Year ECE-B",
      "subSection": "B1",
      "teacherId": "GS",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "BEE (P)",
      "name": "BEE Lab (Group B2)",
      "batch": "1st Year ECE-B",
      "subSection": "B2",
      "teacherId": "GS",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "CHEM",
      "name": "Engineering Chemistry",
      "batch": "1st Year ECE-B",
      "subSection": "All",
      "teacherId": "PT",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "EVS-1",
      "name": "Environmental Studies - I",
      "batch": "1st Year ECE-B",
      "subSection": "All",
      "teacherId": "UDS",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 2
    },
    {
      "code": "OS",
      "name": "Operating Systems",
      "batch": "2nd Year CSE-A",
      "subSection": "All",
      "teacherId": "JJ",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "OS (P)",
      "name": "Operating Systems Lab (Group A1)",
      "batch": "2nd Year CSE-A",
      "subSection": "A1",
      "teacherId": "JJ",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "OS (P)",
      "name": "Operating Systems Lab (Group A2)",
      "batch": "2nd Year CSE-A",
      "subSection": "A2",
      "teacherId": "JJ",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "COA",
      "name": "Computer Organization & Architecture",
      "batch": "2nd Year CSE-A",
      "subSection": "All",
      "teacherId": "BR",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "OOP",
      "name": "Object Oriented Programming",
      "batch": "2nd Year CSE-A",
      "subSection": "All",
      "teacherId": "GB",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "OOP (P)",
      "name": "OOP Lab (Group A1)",
      "batch": "2nd Year CSE-A",
      "subSection": "A1",
      "teacherId": "GB",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "OOP (P)",
      "name": "OOP Lab (Group A2)",
      "batch": "2nd Year CSE-A",
      "subSection": "A2",
      "teacherId": "GB",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "DM",
      "name": "Discrete Mathematics",
      "batch": "2nd Year CSE-A",
      "subSection": "All",
      "teacherId": "AZK",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "IC",
      "name": "Constitution of India",
      "batch": "2nd Year CSE-A",
      "subSection": "All",
      "teacherId": "EKL",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 2
    },
    {
      "code": "UHV",
      "name": "Universal Human Values",
      "batch": "2nd Year CSE-A",
      "subSection": "All",
      "teacherId": "UDS",
      "weeklyLectures": 1,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 1
    },
    {
      "code": "OS",
      "name": "Operating Systems",
      "batch": "2nd Year CSE-B",
      "subSection": "All",
      "teacherId": "JJ",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "OS (P)",
      "name": "Operating Systems Lab (Group B1)",
      "batch": "2nd Year CSE-B",
      "subSection": "B1",
      "teacherId": "JJ",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "OS (P)",
      "name": "Operating Systems Lab (Group B2)",
      "batch": "2nd Year CSE-B",
      "subSection": "B2",
      "teacherId": "JJ",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "COA",
      "name": "Computer Organization & Architecture",
      "batch": "2nd Year CSE-B",
      "subSection": "All",
      "teacherId": "BR",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "OOP",
      "name": "Object Oriented Programming",
      "batch": "2nd Year CSE-B",
      "subSection": "All",
      "teacherId": "GB",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "OOP (P)",
      "name": "OOP Lab (Group B1)",
      "batch": "2nd Year CSE-B",
      "subSection": "B1",
      "teacherId": "GB",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "OOP (P)",
      "name": "OOP Lab (Group B2)",
      "batch": "2nd Year CSE-B",
      "subSection": "B2",
      "teacherId": "GB",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "DM",
      "name": "Discrete Mathematics",
      "batch": "2nd Year CSE-B",
      "subSection": "All",
      "teacherId": "AZK",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "WD",
      "name": "Web Development Specialization",
      "batch": "2nd Year CSE-B",
      "subSection": "All",
      "teacherId": "AKS",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 2
    },
    {
      "code": "IC",
      "name": "Constitution of India",
      "batch": "2nd Year CSE-B",
      "subSection": "All",
      "teacherId": "EKL",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 2
    },
    {
      "code": "EM-II",
      "name": "Electrical Machines - II",
      "batch": "2nd Year EE-A",
      "subSection": "All",
      "teacherId": "SG",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "EM-II (P)",
      "name": "Machines-II Lab (Group A1)",
      "batch": "2nd Year EE-A",
      "subSection": "A1",
      "teacherId": "SG",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "EM-II (P)",
      "name": "Machines-II Lab (Group A2)",
      "batch": "2nd Year EE-A",
      "subSection": "A2",
      "teacherId": "SG",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "PSE",
      "name": "Power System Engineering",
      "batch": "2nd Year EE-A",
      "subSection": "All",
      "teacherId": "ART",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "PSE (P)",
      "name": "Power Systems Lab (Group A1)",
      "batch": "2nd Year EE-A",
      "subSection": "A1",
      "teacherId": "ART",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "PSE (P)",
      "name": "Power Systems Lab (Group A2)",
      "batch": "2nd Year EE-A",
      "subSection": "A2",
      "teacherId": "ART",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "CS",
      "name": "Control Systems",
      "batch": "2nd Year EE-A",
      "subSection": "All",
      "teacherId": "RJS",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "PE",
      "name": "Power Electronics",
      "batch": "2nd Year EE-A",
      "subSection": "All",
      "teacherId": "SW",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "EM-II",
      "name": "Electrical Machines - II",
      "batch": "2nd Year EE-B",
      "subSection": "All",
      "teacherId": "SG",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "EM-II (P)",
      "name": "Machines-II Lab (Group B1)",
      "batch": "2nd Year EE-B",
      "subSection": "B1",
      "teacherId": "SG",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "EM-II (P)",
      "name": "Machines-II Lab (Group B2)",
      "batch": "2nd Year EE-B",
      "subSection": "B2",
      "teacherId": "SG",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "PSE",
      "name": "Power System Engineering",
      "batch": "2nd Year EE-B",
      "subSection": "All",
      "teacherId": "ART",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "CS",
      "name": "Control Systems",
      "batch": "2nd Year EE-B",
      "subSection": "All",
      "teacherId": "RJS",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "PE",
      "name": "Power Electronics",
      "batch": "2nd Year EE-B",
      "subSection": "All",
      "teacherId": "SW",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DM",
      "name": "Discrete Mathematics for EE",
      "batch": "2nd Year EE-B",
      "subSection": "All",
      "teacherId": "AZK",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "SS",
      "name": "Signals & Systems",
      "batch": "2nd Year ECE-A",
      "subSection": "All",
      "teacherId": "DRB",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "SS (P)",
      "name": "Signals & Systems Lab (Group A1)",
      "batch": "2nd Year ECE-A",
      "subSection": "A1",
      "teacherId": "DRB",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "SS (P)",
      "name": "Signals & Systems Lab (Group A2)",
      "batch": "2nd Year ECE-A",
      "subSection": "A2",
      "teacherId": "DRB",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "LIC",
      "name": "Linear Integrated Circuits",
      "batch": "2nd Year ECE-A",
      "subSection": "All",
      "teacherId": "DRS",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "LIC (P)",
      "name": "LIC Lab (Group A1)",
      "batch": "2nd Year ECE-A",
      "subSection": "A1",
      "teacherId": "DRS",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "LIC (P)",
      "name": "LIC Lab (Group A2)",
      "batch": "2nd Year ECE-A",
      "subSection": "A2",
      "teacherId": "DRS",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "EMFT",
      "name": "Electromagnetic Field Theory",
      "batch": "2nd Year ECE-A",
      "subSection": "All",
      "teacherId": "SW",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "AC",
      "name": "Analog Communication",
      "batch": "2nd Year ECE-A",
      "subSection": "All",
      "teacherId": "BA",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "SS",
      "name": "Signals & Systems",
      "batch": "2nd Year ECE-B",
      "subSection": "All",
      "teacherId": "DRB",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "SS (P)",
      "name": "Signals & Systems Lab (Group B1)",
      "batch": "2nd Year ECE-B",
      "subSection": "B1",
      "teacherId": "DRB",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "SS (P)",
      "name": "Signals & Systems Lab (Group B2)",
      "batch": "2nd Year ECE-B",
      "subSection": "B2",
      "teacherId": "DRB",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "LIC",
      "name": "Linear Integrated Circuits",
      "batch": "2nd Year ECE-B",
      "subSection": "All",
      "teacherId": "DRS",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "EMFT",
      "name": "Electromagnetic Field Theory",
      "batch": "2nd Year ECE-B",
      "subSection": "All",
      "teacherId": "SW",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "AC",
      "name": "Analog Communication",
      "batch": "2nd Year ECE-B",
      "subSection": "All",
      "teacherId": "BA",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DM",
      "name": "Discrete Mathematics for ECE",
      "batch": "2nd Year ECE-B",
      "subSection": "All",
      "teacherId": "AZK",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "CD",
      "name": "Compiler Design",
      "batch": "3rd Year CSE-A",
      "subSection": "All",
      "teacherId": "MV",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "CD (P)",
      "name": "Compiler Lab (Group A1)",
      "batch": "3rd Year CSE-A",
      "subSection": "A1",
      "teacherId": "MV",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "CD (P)",
      "name": "Compiler Lab (Group A2)",
      "batch": "3rd Year CSE-A",
      "subSection": "A2",
      "teacherId": "MV",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "WT",
      "name": "Web Technologies",
      "batch": "3rd Year CSE-A",
      "subSection": "All",
      "teacherId": "SNK",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "WT (P)",
      "name": "Web Tech Lab (Group A1)",
      "batch": "3rd Year CSE-A",
      "subSection": "A1",
      "teacherId": "SNK",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "WT (P)",
      "name": "Web Tech Lab (Group A2)",
      "batch": "3rd Year CSE-A",
      "subSection": "A2",
      "teacherId": "SNK",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "SE",
      "name": "Software Engineering",
      "batch": "3rd Year CSE-A",
      "subSection": "All",
      "teacherId": "JS",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "CNS",
      "name": "Cryptography & Network Security",
      "batch": "3rd Year CSE-A",
      "subSection": "All",
      "teacherId": "SY",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "BD",
      "name": "Big Data Analytics",
      "batch": "3rd Year CSE-A",
      "subSection": "All",
      "teacherId": "UK",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "CD",
      "name": "Compiler Design",
      "batch": "3rd Year CSE-B",
      "subSection": "All",
      "teacherId": "MV",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "CD (P)",
      "name": "Compiler Lab (Group B1)",
      "batch": "3rd Year CSE-B",
      "subSection": "B1",
      "teacherId": "MV",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "CD (P)",
      "name": "Compiler Lab (Group B2)",
      "batch": "3rd Year CSE-B",
      "subSection": "B2",
      "teacherId": "MV",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "WT",
      "name": "Web Technologies",
      "batch": "3rd Year CSE-B",
      "subSection": "All",
      "teacherId": "SNK",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "WT (P)",
      "name": "Web Tech Lab (Group B1)",
      "batch": "3rd Year CSE-B",
      "subSection": "B1",
      "teacherId": "SNK",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "WT (P)",
      "name": "Web Tech Lab (Group B2)",
      "batch": "3rd Year CSE-B",
      "subSection": "B2",
      "teacherId": "SNK",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "SE",
      "name": "Software Engineering",
      "batch": "3rd Year CSE-B",
      "subSection": "All",
      "teacherId": "JS",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "CNS",
      "name": "Cryptography & Network Security",
      "batch": "3rd Year CSE-B",
      "subSection": "All",
      "teacherId": "SY",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "BD",
      "name": "Big Data Analytics",
      "batch": "3rd Year CSE-B",
      "subSection": "All",
      "teacherId": "UK",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "PSA",
      "name": "Power System Analysis",
      "batch": "3rd Year EE",
      "subSection": "All",
      "teacherId": "SG",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "PSA (P)",
      "name": "PSA Lab (Group B1)",
      "batch": "3rd Year EE",
      "subSection": "B1",
      "teacherId": "SG",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "PSA (P)",
      "name": "PSA Lab (Group B2)",
      "batch": "3rd Year EE",
      "subSection": "B2",
      "teacherId": "SG",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "EDC-II",
      "name": "Advanced Electronic Devices",
      "batch": "3rd Year EE",
      "subSection": "All",
      "teacherId": "DP",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DSP",
      "name": "Digital Signal Processing",
      "batch": "3rd Year EE",
      "subSection": "All",
      "teacherId": "GS",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DSP (P)",
      "name": "DSP Lab (Group B1)",
      "batch": "3rd Year EE",
      "subSection": "B1",
      "teacherId": "GS",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "DSP (P)",
      "name": "DSP Lab (Group B2)",
      "batch": "3rd Year EE",
      "subSection": "B2",
      "teacherId": "GS",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "EAM",
      "name": "Electrical Apparatus & Measurement",
      "batch": "3rd Year EE",
      "subSection": "All",
      "teacherId": "US",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DSP",
      "name": "Digital Signal Processing",
      "batch": "3rd Year ECE-A",
      "subSection": "All",
      "teacherId": "GSC",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DSP (P)",
      "name": "DSP Lab (Group A1)",
      "batch": "3rd Year ECE-A",
      "subSection": "A1",
      "teacherId": "GSC",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "DSP (P)",
      "name": "DSP Lab (Group A2)",
      "batch": "3rd Year ECE-A",
      "subSection": "A2",
      "teacherId": "GSC",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "VLSI-II",
      "name": "Advanced VLSI Design",
      "batch": "3rd Year ECE-A",
      "subSection": "All",
      "teacherId": "VK",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "VLSI-II (P)",
      "name": "VLSI Lab (Group A1)",
      "batch": "3rd Year ECE-A",
      "subSection": "A1",
      "teacherId": "VK",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "VLSI-II (P)",
      "name": "VLSI Lab (Group A2)",
      "batch": "3rd Year ECE-A",
      "subSection": "A2",
      "teacherId": "VK",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "OFC",
      "name": "Optical Fiber Communication",
      "batch": "3rd Year ECE-A",
      "subSection": "All",
      "teacherId": "VS",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "MC",
      "name": "Microcontrollers & Embedded Systems",
      "batch": "3rd Year ECE-A",
      "subSection": "All",
      "teacherId": "SJY",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DSP",
      "name": "Digital Signal Processing",
      "batch": "3rd Year ECE-B",
      "subSection": "All",
      "teacherId": "GSC",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "DSP (P)",
      "name": "DSP Lab (Group B1)",
      "batch": "3rd Year ECE-B",
      "subSection": "B1",
      "teacherId": "GSC",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "DSP (P)",
      "name": "DSP Lab (Group B2)",
      "batch": "3rd Year ECE-B",
      "subSection": "B2",
      "teacherId": "GSC",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "VLSI-II",
      "name": "Advanced VLSI Design",
      "batch": "3rd Year ECE-B",
      "subSection": "All",
      "teacherId": "VK",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "VLSI-II (P)",
      "name": "VLSI Lab (Group B1)",
      "batch": "3rd Year ECE-B",
      "subSection": "B1",
      "teacherId": "VK",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "VLSI-II (P)",
      "name": "VLSI Lab (Group B2)",
      "batch": "3rd Year ECE-B",
      "subSection": "B2",
      "teacherId": "VK",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "OFC",
      "name": "Optical Fiber Communication",
      "batch": "3rd Year ECE-B",
      "subSection": "All",
      "teacherId": "VS",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "MC",
      "name": "Microcontrollers & Embedded Systems",
      "batch": "3rd Year ECE-B",
      "subSection": "All",
      "teacherId": "SJY",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "IOT",
      "name": "Internet of Things & Applications",
      "batch": "4th Year CSE-A",
      "subSection": "All",
      "teacherId": "SK",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "IOT (P)",
      "name": "IoT Systems Lab (Group A1)",
      "batch": "4th Year CSE-A",
      "subSection": "A1",
      "teacherId": "SK",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "IOT (P)",
      "name": "IoT Systems Lab (Group A2)",
      "batch": "4th Year CSE-A",
      "subSection": "A2",
      "teacherId": "SK",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "BC",
      "name": "Blockchain & Distributed Ledgers",
      "batch": "4th Year CSE-A",
      "subSection": "All",
      "teacherId": "SMT",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "CC",
      "name": "Cloud Computing Architecture",
      "batch": "4th Year CSE-A",
      "subSection": "All",
      "teacherId": "MV",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "PROJ",
      "name": "Major Capstone Project",
      "batch": "4th Year CSE-A",
      "subSection": "All",
      "teacherId": "JJ",
      "weeklyLectures": 4,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 4
    },
    {
      "code": "IOT",
      "name": "Internet of Things & Applications",
      "batch": "4th Year CSE-B",
      "subSection": "All",
      "teacherId": "SK",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "IOT (P)",
      "name": "IoT Systems Lab (Group B1)",
      "batch": "4th Year CSE-B",
      "subSection": "B1",
      "teacherId": "SK",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "IOT (P)",
      "name": "IoT Systems Lab (Group B2)",
      "batch": "4th Year CSE-B",
      "subSection": "B2",
      "teacherId": "SK",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "BC",
      "name": "Blockchain & Distributed Ledgers",
      "batch": "4th Year CSE-B",
      "subSection": "All",
      "teacherId": "SMT",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "CC",
      "name": "Cloud Computing Architecture",
      "batch": "4th Year CSE-B",
      "subSection": "All",
      "teacherId": "MV",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "PROJ",
      "name": "Major Capstone Project",
      "batch": "4th Year CSE-B",
      "subSection": "All",
      "teacherId": "JJ",
      "weeklyLectures": 4,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 4
    },
    {
      "code": "SG",
      "name": "Smart Grid Technologies",
      "batch": "4th Year EE",
      "subSection": "All",
      "teacherId": "ART",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "SG (P)",
      "name": "Smart Grid Lab (Group A1)",
      "batch": "4th Year EE",
      "subSection": "A1",
      "teacherId": "ART",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "SG (P)",
      "name": "Smart Grid Lab (Group A2)",
      "batch": "4th Year EE",
      "subSection": "A2",
      "teacherId": "ART",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "RES",
      "name": "Renewable Energy Systems",
      "batch": "4th Year EE",
      "subSection": "All",
      "teacherId": "SG",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "HVDC",
      "name": "HVDC Transmission",
      "batch": "4th Year EE",
      "subSection": "All",
      "teacherId": "RS",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "PROJ",
      "name": "Major Capstone Project",
      "batch": "4th Year EE",
      "subSection": "All",
      "teacherId": "JP",
      "weeklyLectures": 4,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 4
    },
    {
      "code": "WCN",
      "name": "Wireless & Cellular Networks",
      "batch": "4th Year ECE-A",
      "subSection": "All",
      "teacherId": "RHS",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "WCN (P)",
      "name": "Wireless Lab (Group A1)",
      "batch": "4th Year ECE-A",
      "subSection": "A1",
      "teacherId": "RHS",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "WCN (P)",
      "name": "Wireless Lab (Group A2)",
      "batch": "4th Year ECE-A",
      "subSection": "A2",
      "teacherId": "RHS",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "RTOS",
      "name": "Real-Time Operating Systems",
      "batch": "4th Year ECE-A",
      "subSection": "All",
      "teacherId": "KS",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "PROJ",
      "name": "Major Capstone Project",
      "batch": "4th Year ECE-A",
      "subSection": "All",
      "teacherId": "RS",
      "weeklyLectures": 4,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 4
    },
    {
      "code": "WCN",
      "name": "Wireless & Cellular Networks",
      "batch": "4th Year ECE-B",
      "subSection": "All",
      "teacherId": "RHS",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "WCN (P)",
      "name": "Wireless Lab (Group B1)",
      "batch": "4th Year ECE-B",
      "subSection": "B1",
      "teacherId": "RHS",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "WCN (P)",
      "name": "Wireless Lab (Group B2)",
      "batch": "4th Year ECE-B",
      "subSection": "B2",
      "teacherId": "RHS",
      "weeklyLectures": 2,
      "semester": "even",
      "type": "P",
      "duration": 2,
      "weeklySessions": 1
    },
    {
      "code": "RTOS",
      "name": "Real-Time Operating Systems",
      "batch": "4th Year ECE-B",
      "subSection": "All",
      "teacherId": "KS",
      "weeklyLectures": 3,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 3
    },
    {
      "code": "PROJ",
      "name": "Major Capstone Project",
      "batch": "4th Year ECE-B",
      "subSection": "All",
      "teacherId": "RS",
      "weeklyLectures": 4,
      "semester": "even",
      "type": "L",
      "duration": 1,
      "weeklySessions": 4
    }
  ],
  "schedule": []
};

// -----------------------------------------------------------------------------
// GLOBAL STATE
// -----------------------------------------------------------------------------
let appData = null;
let currentSemester = "odd"; // "odd" (Sem 1, 3, 5, 7) or "even" (Sem 2, 4, 6, 8)
let currentBatch = "2nd Year CSE-A";
let currentSubSection = "ALL"; // "ALL", "A1", "A2", "WHOLE"
let searchTerm = "";

let currentViewMode = "batch"; // "batch" | "faculty" | "room"
let currentFaculty = "";       // selected faculty ID for Faculty View
let currentRoom = "";          // selected room for Room & Lab Occupancy View

let legendViewMode = "batch"; // "batch", "classes", "faculty"
let legendSearchTerm = "";

// -----------------------------------------------------------------------------
// DOM ELEMENT REFERENCES
// -----------------------------------------------------------------------------
const timetableBody = document.getElementById("timetableBody");
const viewModeSelect = document.getElementById("viewModeSelect");
const batchFilterGroup = document.getElementById("batchFilterGroup");
const batchSelect = document.getElementById("batchSelect");
const subSectionFilterGroup = document.getElementById("subSectionFilterGroup");
const subSectionSelect = document.getElementById("subSectionSelect");
const facultyFilterGroup = document.getElementById("facultyFilterGroup");
const facultySelect = document.getElementById("facultySelect");
const roomFilterGroup = document.getElementById("roomFilterGroup");
const roomSelect = document.getElementById("roomSelect");
const searchInput = document.getElementById("searchInput");

const btnSemOdd = document.getElementById("btnSemOdd");
const btnSemEven = document.getElementById("btnSemEven");
const btnLoadDemo = document.getElementById("btnLoadDemo");
const btnRunAlgorithm = document.getElementById("btnRunAlgorithm");
const btnExportJson = document.getElementById("btnExportJson");
const btnImportJson = document.getElementById("btnImportJson");
const fileImportJson = document.getElementById("fileImportJson");
const btnPrint = document.getElementById("btnPrint");

// Status Bar & Diagnostics
const scheduleStatusBar = document.getElementById("scheduleStatusBar");
const statusDot = document.getElementById("statusDot");
const statusMainText = document.getElementById("statusMainText");
const statusSubText = document.getElementById("statusSubText");
const btnClearPins = document.getElementById("btnClearPins");
const pinnedCountText = document.getElementById("pinnedCountText");
const btnResetBatch = document.getElementById("btnResetBatch");
const btnRestoreDemoInline = document.getElementById("btnRestoreDemoInline");

const diagnosticCard = document.getElementById("diagnosticCard");
const diagnosticBody = document.getElementById("diagnosticBody");
const btnCloseDiagnostic = document.getElementById("btnCloseDiagnostic");

// Print Elements
const printSemesterVal = document.getElementById("printSemesterVal");
const printBatchLabel = document.getElementById("printBatchLabel");
const printBatchVal = document.getElementById("printBatchVal");
const printSubSecLabel = document.getElementById("printSubSecLabel");
const printSubSecVal = document.getElementById("printSubSecVal");

const btnToggleManagement = document.getElementById("btnToggleManagement");
const managementBody = document.getElementById("managementBody");
const toggleManagementIcon = document.getElementById("toggleManagementIcon");

const loadingOverlay = document.getElementById("loadingOverlay");
const toastContainer = document.getElementById("toastContainer");

// Course Load Summary Elements
const summaryTitle = document.getElementById("summaryTitle");
const summarySubtitle = document.getElementById("summarySubtitle");
const totalCoursesBadge = document.getElementById("totalCoursesBadge");
const totalHoursBadge = document.getElementById("totalHoursBadge");
const summaryTableBody = document.getElementById("summaryTableBody");
const summaryTableFoot = document.getElementById("summaryTableFoot");

// Legend & Faculty Directory Elements
const legendBody = document.getElementById("legendBody") || document.getElementById("legendPills");
const tabActiveBatch = document.getElementById("tabActiveBatch");
const tabAllClasses = document.getElementById("tabAllClasses");
const tabFacultyDir = document.getElementById("tabFacultyDir");
const legendSearchInput = document.getElementById("legendSearchInput");

// Forms & Lists
const formAddTeacher = document.getElementById("formAddTeacher");
const formAddSubject = document.getElementById("formAddSubject");
const formAddRoom = document.getElementById("formAddRoom");
const teachersListEl = document.getElementById("teachersList");
const subjectsListEl = document.getElementById("subjectsList");
const roomsListEl = document.getElementById("roomsList");

const subBatchInput = document.getElementById("subBatchInput");
const subSectionInput = document.getElementById("subSectionInput");
const subSemesterInput = document.getElementById("subSemesterInput");
const subTypeInput = document.getElementById("subTypeInput");
const subDurationInput = document.getElementById("subDurationInput");
const subLecturesInput = document.getElementById("subLecturesInput");

const teachersCountEl = document.getElementById("teachersCount");
const subjectsCountEl = document.getElementById("subjectsCount");
const roomsCountEl = document.getElementById("roomsCount");

// -----------------------------------------------------------------------------
// GRAPH COLORING & BACKTRACKING SCHEDULING ENGINE (Consecutive Lab Blocks)
// -----------------------------------------------------------------------------
function solveTimetableInJS(data, targetSemester = "odd") {
  const startTime = performance.now();

  // 1. Build Teacher lookup map
  const teacherMap = {};
  (data.teachers || []).forEach(t => {
    teacherMap[t.id] = t.name;
  });

  // 2. Filter subjects by active semester and unroll into Session Blocks
  const semSubjects = (data.subjects || []).filter(s => (s.semester || "odd") === targetSemester);
  const blocks = [];

  semSubjects.forEach(sub => {
    const tName = teacherMap[sub.teacherId] || sub.teacherId;
    const subSec = sub.subSection || "All";
    const rawCode = sub.code.trim();
    const isLab = (sub.type === "P") || /\(P\)|Lab/i.test(rawCode) || /Lab/i.test(sub.name);
    const isTut = (sub.type === "T") || /\(T\)|Tutorial/i.test(rawCode) || /Tutorial/i.test(sub.name);

    let cType = sub.type || (isLab ? "P" : (isTut ? "T" : "L"));
    let dur = parseInt(sub.duration, 10);
    if (isNaN(dur) || dur < 1) {
      dur = (cType === "P") ? 2 : 1;
    }

    let sessions = parseInt(sub.weeklySessions, 10);
    if (isNaN(sessions) || sessions < 1) {
      const wl = parseInt(sub.weeklyLectures, 10) || 1;
      if (cType === "P") {
        sessions = Math.max(1, Math.floor(wl / dur));
      } else {
        sessions = wl;
      }
    }

    for (let k = 0; k < sessions; k++) {
      blocks.push({
        id: blocks.length,
        batch: sub.batch,
        subSection: subSec,
        subjectCode: sub.code,
        subjectName: sub.name,
        teacherId: sub.teacherId,
        teacherName: tName,
        type: cType,
        duration: dur,
        sessions: sessions,
        sessionIndex: k,
        weeklyLectures: (sessions * dur),
        semester: targetSemester
      });
    }
  });

  const N = blocks.length;
  if (N === 0) {
    return { solved: true, schedule: [], executionTimeMs: 0, backtrackSteps: 0, diagnostics: [] };
  }

  const rooms = (data.rooms && data.rooms.length > 0)
    ? data.rooms.slice()
    : [
        "203", "204", "211", "212", "213", "214", "216", "217", "219",
        "303", "304", "311", "312", "313", "314", "317", "503", "513",
        "Basement Lab", "G01", "R1", "R2", "R3", "R4"
      ];

  // 3. Construct Conflict Graph (Adjacency Matrix)
  const adj = Array.from({ length: N }, () => new Uint8Array(N));
  const degree = new Int32Array(N);

  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const sameTeacher = (blocks[i].teacherId === blocks[j].teacherId);

      let sameCohort = false;
      if (blocks[i].batch === blocks[j].batch) {
        if (blocks[i].subSection === "All" || blocks[j].subSection === "All") {
          sameCohort = true;
        } else if (blocks[i].subSection === blocks[j].subSection) {
          sameCohort = true;
        }
        // Sub-sections A1 and A2 of same section DO NOT clash: can run in parallel!
      }

      if (sameTeacher || sameCohort) {
        adj[i][j] = 1;
        adj[j][i] = 1;
        degree[i]++;
        degree[j]++;
      }
    }
  }

  // 4. Two-Tier Variable Ordering Heuristic:
  // Labs & multi-hour blocks (duration descending) FIRST, then degree descending (Welsh-Powell)
  const vertexOrder = Array.from({ length: N }, (_, i) => i);
  vertexOrder.sort((a, b) => {
    if (blocks[b].duration !== blocks[a].duration) {
      return blocks[b].duration - blocks[a].duration;
    }
    return degree[b] - degree[a];
  });

  const assignedSlot = new Int32Array(N).fill(-1);
  const assignedRoom = new Int32Array(N).fill(-1);
  const isBlockPinned = new Uint8Array(N);
  let totalSteps = 0;

  // 4b. Pre-Assign and Lock Pinned Sessions from data.schedule
  const pinnedItems = (data.schedule || []).filter(item => (item.semester || "odd") === targetSemester && item.pinned);
  const pinnedSessionsMap = new Map();

  pinnedItems.forEach(item => {
    const dIdx = (item.dayIndex !== undefined) ? item.dayIndex : DAYS.indexOf(item.day);
    const sPeriod = (item.startPeriod !== undefined) ? item.startPeriod : item.slotIndex;
    const key = `${item.subjectCode}|${item.batch}|${item.subSection}|${dIdx}|${sPeriod}|${item.room}`;
    if (!pinnedSessionsMap.has(key)) {
      pinnedSessionsMap.set(key, {
        subjectCode: item.subjectCode,
        batch: item.batch,
        subSection: item.subSection,
        dayIndex: dIdx,
        startPeriod: sPeriod,
        room: item.room,
        duration: item.duration || 1
      });
    }
  });

  pinnedSessionsMap.forEach(ps => {
    if (ps.dayIndex < 0 || ps.startPeriod < 0) return;
    let rIdx = rooms.indexOf(ps.room);
    if (rIdx === -1) {
      rooms.push(ps.room);
      rIdx = rooms.length - 1;
    }
    const targetStartSlot = ps.dayIndex * SLOTS_PER_DAY + ps.startPeriod;

    for (let b = 0; b < N; b++) {
      if (!isBlockPinned[b] &&
          blocks[b].subjectCode === ps.subjectCode &&
          blocks[b].batch === ps.batch &&
          blocks[b].subSection === ps.subSection &&
          blocks[b].duration === ps.duration) {
        isBlockPinned[b] = 1;
        assignedSlot[b] = targetStartSlot;
        assignedRoom[b] = rIdx;
        break;
      }
    }
  });

  // Filter vertices so that Welsh-Powell backtracking only allocates UNPINNED sessions
  const unpinnedVertices = vertexOrder.filter(v => isBlockPinned[v] === 0);
  const numUnpinned = unpinnedVertices.length;
  const totalRooms = rooms.length;

  // 5. Multi-Period Constraint Verification (isSafe across full block)
  function isSafe(v, candidateStartSlot, candidateRoom, enforceDailySpread) {
    const dur_v = blocks[v].duration;
    const day_v = Math.floor(candidateStartSlot / SLOTS_PER_DAY);
    const p_v = candidateStartSlot % SLOTS_PER_DAY;

    // Hard boundary check: Block must never exceed the 9 periods of that day
    if (p_v + dur_v > SLOTS_PER_DAY) return false;

    // Check time interval overlap against all assigned blocks (both pinned and dynamically allocated)
    for (let u = 0; u < N; u++) {
      if (assignedSlot[u] !== -1) {
        const slot_u = assignedSlot[u];
        const day_u = Math.floor(slot_u / SLOTS_PER_DAY);

        if (day_u === day_v) {
          const dur_u = blocks[u].duration;
          const p_u = slot_u % SLOTS_PER_DAY;

          // Check if time intervals [p_v, p_v + dur_v) and [p_u, p_u + dur_u) overlap
          if (Math.max(p_v, p_u) < Math.min(p_v + dur_v, p_u + dur_u)) {
            if (adj[v][u] === 1) return false;
            if (assignedRoom[u] === candidateRoom) return false;
          }
        }
      }
    }

    // Pedagogical Daily Spread Constraint
    if (enforceDailySpread) {
      let countToday = 0;
      for (let u = 0; u < N; u++) {
        if (assignedSlot[u] !== -1) {
          if (Math.floor(assignedSlot[u] / SLOTS_PER_DAY) === day_v) {
            if (blocks[u].batch === blocks[v].batch &&
                blocks[u].subjectCode === blocks[v].subjectCode &&
                blocks[u].subSection === blocks[v].subSection) {
              countToday++;
            }
          }
        }
      }
      const maxAllowed = (blocks[v].type === "P" || blocks[v].type === "T")
        ? 1
        : ((blocks[v].sessions > 5) ? 2 : 1);

      if (countToday >= maxAllowed) return false;
    }

    return true;
  }

  // 6. Randomized Backtracking Engine for Unpinned Blocks
  let stepCounter = 0;
  function solve(orderIdx, enforceDailySpread, maxAllowedSteps) {
    stepCounter++;
    totalSteps++;

    if (stepCounter > maxAllowedSteps) return false;
    if (orderIdx === numUnpinned) return true;

    const v = unpinnedVertices[orderIdx];
    const dur = blocks[v].duration;

    const validCandidateSlots = (VALID_SLOTS_BY_DURATION[dur] || VALID_SLOTS_BY_DURATION[1]).slice();
    shuffleArray(validCandidateSlots);

    const candidateRooms = Array.from({ length: totalRooms }, (_, i) => i);
    shuffleArray(candidateRooms);

    for (const slot of validCandidateSlots) {
      for (const r of candidateRooms) {
        if (isSafe(v, slot, r, enforceDailySpread)) {
          assignedSlot[v] = slot;
          assignedRoom[v] = r;

          if (solve(orderIdx + 1, enforceDailySpread, maxAllowedSteps)) return true;

          assignedSlot[v] = -1;
          assignedRoom[v] = -1;
        }
      }
    }
    return false;
  }

  function resetUnpinned() {
    for (let i = 0; i < N; i++) {
      if (isBlockPinned[i] === 0) {
        assignedSlot[i] = -1;
        assignedRoom[i] = -1;
      }
    }
  }

  // 7. Execution Strategy
  let solved = false;
  for (let restart = 0; restart < 2; restart++) {
    resetUnpinned();
    stepCounter = 0;
    if (solve(0, true, 30000)) {
      solved = true;
      break;
    }
  }

  // Fallback: relax daily spread constraint
  if (!solved) {
    resetUnpinned();
    stepCounter = 0;
    solved = solve(0, false, 60000);
  }

  const endTime = performance.now();
  const executionTimeMs = endTime - startTime;

  if (!solved) {
    const diagnostics = analyzeConflictDiagnostics(data, targetSemester, blocks);
    return { solved: false, schedule: [], executionTimeMs, backtrackSteps: totalSteps, diagnostics };
  }

  // 8. Format Output Schedule (Preserving Pinned Flag)
  const schedule = [];
  for (let i = 0; i < N; i++) {
    const startSlot = assignedSlot[i];
    const dur = blocks[i].duration;
    const dayIdx = Math.floor(startSlot / SLOTS_PER_DAY);
    const startPeriod = startSlot % SLOTS_PER_DAY;
    const endPeriod = startPeriod + dur - 1;

    const startLabel = TIME_PERIODS[startPeriod].label.split(" - ")[0];
    const endLabel = TIME_PERIODS[endPeriod].label.split(" - ")[1];
    const timeRangeStr = `${startLabel} - ${endLabel}`;

    for (let k = 0; k < dur; k++) {
      const currentPeriod = startPeriod + k;
      schedule.push({
        id: `${i}_part${k + 1}`,
        blockId: i,
        batch: blocks[i].batch,
        subSection: blocks[i].subSection,
        subjectCode: blocks[i].subjectCode,
        subjectName: blocks[i].subjectName,
        teacherId: blocks[i].teacherId,
        teacherName: blocks[i].teacherName,
        room: rooms[assignedRoom[i]],
        day: DAYS[dayIdx],
        dayIndex: dayIdx,
        slotIndex: currentPeriod,
        time: TIME_PERIODS[currentPeriod].label,
        type: blocks[i].type,
        duration: dur,
        blockPart: k + 1,
        startPeriod: startPeriod,
        endPeriod: endPeriod,
        timeRange: timeRangeStr,
        isLab: (blocks[i].type === "P"),
        semester: targetSemester,
        pinned: (isBlockPinned[i] === 1)
      });
    }
  }

  return {
    solved: true,
    schedule: schedule,
    executionTimeMs: executionTimeMs,
    backtrackSteps: totalSteps,
    diagnostics: []
  };
}

// Fisher-Yates Array Shuffle
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// -----------------------------------------------------------------------------
// FEASIBILITY & CONFLICT DIAGNOSTICS ANALYZER
// -----------------------------------------------------------------------------
function analyzeConflictDiagnostics(data, targetSemester, blocks) {
  const bottlenecks = [];
  const semSubjects = (data.subjects || []).filter(s => (s.semester || "odd") === targetSemester);

  // 1. Check Batch Overload (> 45 weekly hours is physically impossible)
  const batchHours = {};
  const batchLabs = {};
  semSubjects.forEach(s => {
    const dur = parseInt(s.duration, 10) || ((s.type === "P" || s.code.includes("(P)") || s.name.includes("Lab")) ? 2 : 1);
    const sessions = parseInt(s.weeklySessions, 10) || 1;
    const hrs = parseInt(s.weeklyLectures, 10) || (dur * sessions);

    if (!batchHours[s.batch]) batchHours[s.batch] = 0;
    batchHours[s.batch] += hrs;

    if (dur >= 2) {
      if (!batchLabs[s.batch]) batchLabs[s.batch] = 0;
      batchLabs[s.batch]++;
    }
  });

  for (const [batch, hrs] of Object.entries(batchHours)) {
    if (hrs > 40) {
      bottlenecks.push({
        icon: "⚠️",
        title: `Heavy Cohort Load: ${batch} (${hrs} contact hrs/wk)`,
        reason: `Cohort requested ${hrs} hours out of 45 maximum available periods (9 periods × 5 days). This leaves little flexibility for consecutive lab pairs.`,
        recommendation: "Reduce weekly lecture counts or rebalance elective courses for this batch."
      });
    }
    if ((batchLabs[batch] || 0) > 8) {
      bottlenecks.push({
        icon: "🔬",
        title: `Multi-Period Lab Congestion: ${batch} (${batchLabs[batch]} 2-hour lab sessions)`,
        reason: `A large number of 2-hour lab sessions restricts availability of consecutive slots across Monday to Friday.`,
        recommendation: "Ensure lab sessions are divided between sub-sections A1 and A2 to enable parallel lab scheduling."
      });
    }
  }

  // 2. Check Faculty Overload (> 30 hours in one semester)
  const teacherHours = {};
  semSubjects.forEach(s => {
    const dur = parseInt(s.duration, 10) || 1;
    const sessions = parseInt(s.weeklySessions, 10) || 1;
    const hrs = parseInt(s.weeklyLectures, 10) || (dur * sessions);
    if (!teacherHours[s.teacherId]) teacherHours[s.teacherId] = 0;
    teacherHours[s.teacherId] += hrs;
  });

  for (const [tId, hrs] of Object.entries(teacherHours)) {
    if (hrs > 30) {
      const tName = (data.teachers || []).find(t => t.id === tId)?.name || tId;
      bottlenecks.push({
        icon: "👨‍🏫",
        title: `Faculty Bottleneck: ${tName} [${tId}] (${hrs} hrs/wk)`,
        reason: `Assigned ${hrs} contact hours across multiple sections. Single-teacher simultaneous assignment constraints are heavily restricting time slots.`,
        recommendation: "Assign a co-faculty or distribute some sections to another faculty member."
      });
    }
  }

  // 3. Check Room / Lab Capacity
  const roomsCount = (data.rooms || []).length;
  if (roomsCount < 16) {
    bottlenecks.push({
      icon: "🏢",
      title: `Room / Lab Shortage (${roomsCount} configured rooms)`,
      reason: `Peak concurrent teaching across 22 cohorts requires at least 18-24 classrooms and specialized laboratories.`,
      recommendation: "Add more rooms or lab identifiers (e.g. R1, R2, R3, R4, Basement Lab) in the Data Management section below."
    });
  }

  if (bottlenecks.length === 0) {
    bottlenecks.push({
      icon: "⚡",
      title: "Dense Schedule Graph Constraints",
      reason: "High concurrency between simultaneous classes exceeded search step limits.",
      recommendation: "Click 'Generate Timetable' again to restart randomized search, or use 'Restore FoT Demo' to revert to verified baseline."
    });
  }

  return bottlenecks;
}

function renderDiagnostics(diagnostics) {
  if (!diagnosticCard || !diagnosticBody) return;

  if (!diagnostics || diagnostics.length === 0) {
    diagnosticCard.style.display = "none";
    return;
  }

  diagnosticBody.innerHTML = "";
  diagnostics.forEach(item => {
    const div = document.createElement("div");
    div.className = "diagnostic-item";
    div.innerHTML = `
      <span style="font-size: 1.1rem; flex-shrink: 0;">${item.icon}</span>
      <div>
        <strong>${escapeHtml(item.title)}:</strong> ${escapeHtml(item.reason)}
        <div style="margin-top: 0.2rem; color: #92400e;">💡 <em>Recommendation: ${escapeHtml(item.recommendation)}</em></div>
      </div>
    `;
    diagnosticBody.appendChild(div);
  });

  diagnosticCard.style.display = "flex";
}

// -----------------------------------------------------------------------------
// STATUS BADGE & QUICK ACTIONS UPDATER
// -----------------------------------------------------------------------------
function updateStatusBar(isError = false, errorMessage = "") {
  if (!statusMainText || !statusSubText || !appData) return;

  const isOdd = (currentSemester === "odd");
  const semName = isOdd ? "Odd Sem" : "Even Sem";

  const semSubjects = (appData.subjects || []).filter(s => (s.semester || "odd") === currentSemester);
  const semSchedule = (appData.schedule || []).filter(s => (s.semester || "odd") === currentSemester);

  // Total requested vs scheduled
  let totalRequestedHours = 0;
  semSubjects.forEach(s => {
    totalRequestedHours += parseInt(s.weeklyLectures, 10) || 0;
  });
  const totalScheduledHours = semSchedule.length;

  // Count distinct pinned classes
  const pinnedItems = semSchedule.filter(i => i.pinned);
  const distinctPinned = new Set(pinnedItems.map(i => `${i.subjectCode}_${i.batch}_${i.day}_${i.timeRange || i.time}`));
  const pinnedCount = distinctPinned.size;

  if (btnClearPins && pinnedCountText) {
    if (pinnedCount > 0) {
      btnClearPins.style.display = "inline-flex";
      pinnedCountText.textContent = pinnedCount;
    } else {
      btnClearPins.style.display = "none";
    }
  }

  if (isError) {
    if (statusDot) statusDot.className = "status-indicator-dot error";
    statusMainText.textContent = `⚠️ Timetable Unfeasible: ${errorMessage || "Bottlenecks detected"}`;
    statusSubText.textContent = `Scheduled ${totalScheduledHours} / ${totalRequestedHours} hours for ${semName} • Review diagnostics below`;
  } else {
    const pct = totalRequestedHours > 0 ? Math.round((totalScheduledHours / totalRequestedHours) * 100) : 100;
    if (statusDot) {
      statusDot.className = (pct >= 100) ? "status-indicator-dot" : "status-indicator-dot warning";
    }

    const pinTag = pinnedCount > 0 ? ` • 🔒 ${pinnedCount} Pinned` : "";
    statusMainText.textContent = `⚡ ${totalScheduledHours} / ${totalRequestedHours} Sessions Scheduled (${pct}% Conflict-Free • ${semName}${pinTag})`;

    if (currentViewMode === "faculty") {
      const facObj = (appData.teachers || []).find(t => t.id === currentFaculty) || { id: currentFaculty, name: currentFaculty };
      const facItems = semSchedule.filter(i => i.teacherId === currentFaculty);
      statusSubText.textContent = `Faculty View: ${facObj.name} [${facObj.id}] • ${facItems.length} Weekly Teaching Hours Allocated across all cohorts`;
    } else if (currentViewMode === "room") {
      const roomLabel = currentRoom.includes("Lab") ? currentRoom : `Room ${currentRoom}`;
      const roomItems = semSchedule.filter(i => i.room === currentRoom);
      const roomUtil = Math.round((roomItems.length / TOTAL_TIMESLOTS) * 100);
      statusSubText.textContent = `Facility View: ${roomLabel} • ${roomItems.length} / ${TOTAL_TIMESLOTS} Periods Occupied (${roomUtil}% Utilization)`;
    } else {
      // Batch mode
      let batchRequested = 0;
      let batchScheduled = 0;
      if (currentBatch === "ALL") {
        batchRequested = totalRequestedHours;
        batchScheduled = totalScheduledHours;
      } else {
        semSubjects.filter(s => s.batch === currentBatch).forEach(s => {
          batchRequested += parseInt(s.weeklyLectures, 10) || 0;
        });
        batchScheduled = semSchedule.filter(s => s.batch === currentBatch).length;
      }
      statusSubText.textContent = (currentBatch === "ALL")
        ? `Campus View: All 22 Cohorts Active • Sub-Section Filter: ${currentSubSection}`
        : `Active Batch: ${currentBatch} • ${batchScheduled} / ${batchRequested} Contact Hours Allocated (Grp: ${currentSubSection})`;
    }
  }

  // Update print sheet metadata
  if (printSemesterVal) printSemesterVal.textContent = isOdd ? "Odd Semester (Autumn)" : "Even Semester (Spring)";
  if (printBatchVal && printBatchLabel) {
    if (currentViewMode === "faculty") {
      const facObj = (appData.teachers || []).find(t => t.id === currentFaculty) || { id: currentFaculty, name: currentFaculty };
      printBatchLabel.textContent = "Faculty Member:";
      printBatchVal.textContent = `${facObj.name} [${facObj.id}]`;
    } else if (currentViewMode === "room") {
      printBatchLabel.textContent = "Facility / Room:";
      printBatchVal.textContent = currentRoom.includes("Lab") ? currentRoom : `Room ${currentRoom}`;
    } else {
      printBatchLabel.textContent = "Cohort / Class:";
      printBatchVal.textContent = (currentBatch === "ALL") ? "All Batches (Combined Campus)" : currentBatch;
    }
  }
  if (printSubSecVal && printSubSecLabel) {
    if (currentViewMode === "faculty") {
      printSubSecLabel.textContent = "Cohort Scope:";
      printSubSecVal.textContent = "All Assigned Classes & Years";
    } else if (currentViewMode === "room") {
      printSubSecLabel.textContent = "Schedule Scope:";
      printSubSecVal.textContent = "Weekly Room Occupancy (Mon – Fri)";
    } else {
      printSubSecLabel.textContent = "Sub-Section Group:";
      printSubSecVal.textContent = (currentSubSection === "ALL") ? "All Groups (Whole + A1/A2)" : `Group ${currentSubSection}`;
    }
  }
}

// -----------------------------------------------------------------------------
// EXPORT CUSTOM TIMETABLE JSON
// -----------------------------------------------------------------------------
function exportTimetableJSON() {
  if (!appData) return;

  try {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData, null, 2));
    const downloadAnchor = document.createElement("a");
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "_");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `FoT_Timetable_Export_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast("💾 Official FoT Timetable configuration exported successfully!", "success");
  } catch (err) {
    console.error("Export error:", err);
    showToast("Failed to export timetable JSON.", "error");
  }
}

// -----------------------------------------------------------------------------
// STEP 4: VIEW PERSPECTIVES, PINNING & JSON IMPORT CONTROLLERS
// -----------------------------------------------------------------------------
function populateFacultySelect() {
  if (!facultySelect || !appData) return;
  facultySelect.innerHTML = "";

  const teachers = (appData.teachers || []).slice();
  teachers.sort((a, b) => a.name.localeCompare(b.name));

  teachers.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = `${t.name} [${t.id}]`;
    if (t.id === currentFaculty) opt.selected = true;
    facultySelect.appendChild(opt);
  });

  if (!currentFaculty && teachers.length > 0) {
    currentFaculty = teachers[0].id;
    facultySelect.value = currentFaculty;
  }
}

function populateRoomSelect() {
  if (!roomSelect || !appData) return;
  roomSelect.innerHTML = "";

  const roomSet = new Set(appData.rooms || []);
  (appData.schedule || []).forEach(i => {
    if (i.room) roomSet.add(i.room);
  });
  const rooms = Array.from(roomSet);
  rooms.sort((a, b) => {
    const isLabA = a.includes("Lab");
    const isLabB = b.includes("Lab");
    if (isLabA && !isLabB) return 1;
    if (!isLabA && isLabB) return -1;
    return a.localeCompare(b, undefined, { numeric: true });
  });

  rooms.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r;
    opt.textContent = r.includes("Lab") ? `🔬 ${r}` : `🏢 Room ${r}`;
    if (r === currentRoom) opt.selected = true;
    roomSelect.appendChild(opt);
  });

  if (!currentRoom && rooms.length > 0) {
    currentRoom = rooms[0];
    roomSelect.value = currentRoom;
  }
}

function togglePinSlot(itemId) {
  if (!appData || !appData.schedule) return;
  const targetItem = appData.schedule.find(i => i.id === itemId);
  if (!targetItem) return;

  const newPinned = !targetItem.pinned;

  // Toggle all parts belonging to the same session / block
  const relatedItems = appData.schedule.filter(i =>
    (i.semester || "odd") === (targetItem.semester || currentSemester) &&
    ((targetItem.blockId !== undefined && i.blockId === targetItem.blockId) ||
     (i.subjectCode === targetItem.subjectCode && i.batch === targetItem.batch &&
      i.subSection === targetItem.subSection && i.day === targetItem.day &&
      i.room === targetItem.room && i.timeRange === targetItem.timeRange))
  );

  relatedItems.forEach(i => i.pinned = newPinned);
  saveAppData();
  renderTimetable();
  updateStatusBar();

  const label = `${targetItem.subjectCode} (${targetItem.batch})`;
  const loc = `${targetItem.day} ${targetItem.timeRange || targetItem.time} in ${targetItem.room}`;
  if (newPinned) {
    showToast(`🔒 Pinned ${label} at ${loc}. Slot is fixed for subsequent generation.`, "success");
  } else {
    showToast(`🔓 Unpinned ${label}. Slot can now be dynamically reallocated.`, "info");
  }
}

function clearAllPins() {
  let count = 0;
  (appData.schedule || []).forEach(item => {
    if ((item.semester || "odd") === currentSemester && item.pinned) {
      item.pinned = false;
      count++;
    }
  });
  saveAppData();
  renderTimetable();
  updateStatusBar();
  showToast(`🔓 Cleared all ${count} pinned slots for active semester.`, "info");
}

function handleImportJSON(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const content = e.target.result;
      const parsed = JSON.parse(content);

      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        showToast("Invalid JSON file: Timetable data must be an object.", "error");
        return;
      }

      if (!Array.isArray(parsed.teachers) || !Array.isArray(parsed.rooms) || !Array.isArray(parsed.subjects)) {
        showToast("Invalid Timetable JSON schema: 'teachers', 'rooms', and 'subjects' arrays are required.", "error");
        return;
      }

      if (parsed.teachers.length === 0 || parsed.rooms.length === 0 || parsed.subjects.length === 0) {
        showToast("Timetable data is empty: File must include at least one teacher, room, and subject.", "error");
        return;
      }

      showLoading("Importing Timetable Configuration...");

      setTimeout(() => {
        appData = parsed;

        // If no schedule present in imported JSON, generate conflict-free schedule immediately
        if (!Array.isArray(appData.schedule) || appData.schedule.length === 0) {
          const res = solveTimetableInJS(appData, currentSemester);
          if (res.solved) {
            appData.schedule = res.schedule;
          }
        }

        saveAppData();

        populateFacultySelect();
        populateRoomSelect();
        updateSemesterUI();
        updateManagementUI();
        renderTimetable();
        renderLoadSummary();
        renderLegend();
        updateStatusBar(false);
        hideLoading();

        showToast(`📥 Successfully imported timetable: ${appData.teachers.length} faculty, ${appData.subjects.length} subjects, ${appData.rooms.length} rooms!`, "success");
      }, 40);

    } catch (err) {
      console.error("JSON Import Error:", err);
      showToast("Failed to parse JSON file. Please ensure it is a valid JSON document.", "error");
    } finally {
      if (fileImportJson) fileImportJson.value = "";
    }
  };

  reader.onerror = function() {
    showToast("Error reading file from disk.", "error");
    if (fileImportJson) fileImportJson.value = "";
  };

  reader.readAsText(file);
}

// -----------------------------------------------------------------------------
// INITIALIZATION & EVENT LISTENERS
// -----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  loadAppData();
  populateFacultySelect();
  populateRoomSelect();
  setupEventListeners();

  if (!appData.schedule || appData.schedule.length === 0) {
    runScheduleGeneration(false);
  } else {
    updateSemesterUI();
    renderTimetable();
    renderLegend();
    renderLoadSummary();
    updateStatusBar();
  }
});

function setupEventListeners() {
  // Semester Toggle (Odd / Even)
  if (btnSemOdd) {
    btnSemOdd.addEventListener("click", () => switchSemester("odd"));
  }
  if (btnSemEven) {
    btnSemEven.addEventListener("click", () => switchSemester("even"));
  }

  // View Mode Switcher (Batch / Faculty / Room & Lab Occupancy)
  if (viewModeSelect) {
    viewModeSelect.addEventListener("change", (e) => {
      currentViewMode = e.target.value;

      if (batchFilterGroup) batchFilterGroup.style.display = (currentViewMode === "batch") ? "flex" : "none";
      if (subSectionFilterGroup) subSectionFilterGroup.style.display = (currentViewMode === "batch") ? "flex" : "none";
      if (facultyFilterGroup) facultyFilterGroup.style.display = (currentViewMode === "faculty") ? "flex" : "none";
      if (roomFilterGroup) roomFilterGroup.style.display = (currentViewMode === "room") ? "flex" : "none";

      if (currentViewMode === "faculty" && !currentFaculty && facultySelect && facultySelect.options.length > 0) {
        currentFaculty = facultySelect.value;
      }
      if (currentViewMode === "room" && !currentRoom && roomSelect && roomSelect.options.length > 0) {
        currentRoom = roomSelect.value;
      }

      renderTimetable();
      renderLoadSummary();
      updateStatusBar();
    });
  }

  // Faculty selector change
  if (facultySelect) {
    facultySelect.addEventListener("change", (e) => {
      currentFaculty = e.target.value;
      renderTimetable();
      renderLoadSummary();
      updateStatusBar();
    });
  }

  // Room / Facility selector change
  if (roomSelect) {
    roomSelect.addEventListener("change", (e) => {
      currentRoom = e.target.value;
      renderTimetable();
      renderLoadSummary();
      updateStatusBar();
    });
  }

  // Batch selector change
  if (batchSelect) {
    batchSelect.addEventListener("change", (e) => {
      currentBatch = e.target.value;
      renderTimetable();
      renderLoadSummary();
      renderLegend();
      updateStatusBar();
    });
  }

  // Sub-Section filter change (propagates consistently across Grid, Summary, Legend)
  if (subSectionSelect) {
    subSectionSelect.addEventListener("change", (e) => {
      currentSubSection = e.target.value;
      renderTimetable();
      renderLoadSummary();
      renderLegend();
      updateStatusBar();
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

  // Generate Timetable
  if (btnRunAlgorithm) {
    btnRunAlgorithm.addEventListener("click", () => runScheduleGeneration(true));
  }

  // Export JSON
  if (btnExportJson) {
    btnExportJson.addEventListener("click", exportTimetableJSON);
  }

  // Import JSON
  if (btnImportJson && fileImportJson) {
    btnImportJson.addEventListener("click", () => {
      fileImportJson.click();
    });
    fileImportJson.addEventListener("change", handleImportJSON);
  }

  // Clear Pinned Slots Action
  if (btnClearPins) {
    btnClearPins.addEventListener("click", clearAllPins);
  }

  // Click Delegation on Timetable Grid for Pinning / Locking Slots
  if (timetableBody) {
    timetableBody.addEventListener("click", (e) => {
      const pinBtn = e.target.closest(".btn-pin-slot");
      if (pinBtn) {
        e.stopPropagation();
        const itemId = pinBtn.dataset.itemId;
        togglePinSlot(itemId);
      }
    });
  }

  // Quick Reset Current Batch Action
  if (btnResetBatch) {
    btnResetBatch.addEventListener("click", () => {
      if (currentBatch === "ALL") {
        runScheduleGeneration(true);
      } else {
        // Remove active batch schedule and regenerate
        showLoading(`Regenerating schedule for ${currentBatch}...`);
        setTimeout(() => {
          appData.schedule = (appData.schedule || []).filter(item => 
            !((item.semester || "odd") === currentSemester && item.batch === currentBatch)
          );
          runScheduleGeneration(false);
          showToast(`🔄 Refreshed timetable for ${currentBatch}`, "info");
        }, 40);
      }
    });
  }

  // Restore FoT Demo Quick Action
  if (btnRestoreDemoInline) {
    btnRestoreDemoInline.addEventListener("click", () => {
      if (confirm("Restore official Faculty of Technology baseline timetable data? Custom edits will be reset.")) {
        handleLoadDemoData();
      }
    });
  }

  // Close Diagnostics Card
  if (btnCloseDiagnostic && diagnosticCard) {
    btnCloseDiagnostic.addEventListener("click", () => {
      diagnosticCard.style.display = "none";
    });
  }

  // Legend view tabs & search
  if (tabActiveBatch) {
    tabActiveBatch.addEventListener("click", () => {
      legendViewMode = "batch";
      updateLegendTabs();
      renderLegend();
    });
  }
  if (tabAllClasses) {
    tabAllClasses.addEventListener("click", () => {
      legendViewMode = "classes";
      updateLegendTabs();
      renderLegend();
    });
  }
  if (tabFacultyDir) {
    tabFacultyDir.addEventListener("click", () => {
      legendViewMode = "faculty";
      updateLegendTabs();
      renderLegend();
    });
  }
  if (legendSearchInput) {
    legendSearchInput.addEventListener("input", (e) => {
      legendSearchTerm = e.target.value.toLowerCase().trim();
      renderLegend();
    });
  }

  // Form Type selector change (automatically adjusts default duration and sessions)
  if (subTypeInput) {
    subTypeInput.addEventListener("change", (e) => {
      const t = e.target.value;
      if (subDurationInput && subLecturesInput) {
        if (t === "P") {
          subDurationInput.value = "2";
          subLecturesInput.value = "1";
        } else if (t === "T") {
          subDurationInput.value = "1";
          subLecturesInput.value = "1";
        } else {
          subDurationInput.value = "1";
          subLecturesInput.value = "3";
        }
      }
    });
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

  // Print (prepares print sheet metadata before opening system print dialog)
  if (btnPrint) {
    btnPrint.addEventListener("click", () => {
      updateStatusBar();
      window.print();
    });
  }
}

// -----------------------------------------------------------------------------
// SEMESTER SWITCHING LOGIC
// -----------------------------------------------------------------------------
function switchSemester(newSem) {
  if (currentSemester === newSem) return;
  currentSemester = newSem;

  if (btnSemOdd) btnSemOdd.classList.toggle("active", currentSemester === "odd");
  if (btnSemEven) btnSemEven.classList.toggle("active", currentSemester === "even");

  updateSemesterUI();

  const hasSchedule = (appData.schedule || []).some(item => (item.semester || "odd") === currentSemester);
  if (!hasSchedule) {
    runScheduleGeneration(false);
  } else {
    renderTimetable();
    renderLegend();
    renderLoadSummary();
    updateStatusBar();
  }

  updateManagementUI();
  showToast(`Switched to ${currentSemester === "odd" ? "Odd Semester (Autumn)" : "Even Semester (Spring)"}`, "info");
}

function updateSemesterUI() {
  if (!batchSelect) return;

  const isOdd = (currentSemester === "odd");
  const s2 = isOdd ? "3rd Sem" : "4th Sem";
  const s1 = isOdd ? "1st Sem" : "2nd Sem";
  const s3 = isOdd ? "5th Sem" : "6th Sem";
  const s4 = isOdd ? "7th Sem" : "8th Sem";

  batchSelect.innerHTML = `
    <option value="ALL">All Batches (Combined Campus View)</option>
    <optgroup label="2nd Year Batches (${s2})">
      <option value="2nd Year CSE-A" ${currentBatch === "2nd Year CSE-A" ? "selected" : ""}>2nd Year CSE-A</option>
      <option value="2nd Year CSE-B" ${currentBatch === "2nd Year CSE-B" ? "selected" : ""}>2nd Year CSE-B</option>
      <option value="2nd Year EE-A" ${currentBatch === "2nd Year EE-A" ? "selected" : ""}>2nd Year EE-A</option>
      <option value="2nd Year EE-B" ${currentBatch === "2nd Year EE-B" ? "selected" : ""}>2nd Year EE-B</option>
      <option value="2nd Year ECE-A" ${currentBatch === "2nd Year ECE-A" ? "selected" : ""}>2nd Year ECE-A</option>
      <option value="2nd Year ECE-B" ${currentBatch === "2nd Year ECE-B" ? "selected" : ""}>2nd Year ECE-B</option>
    </optgroup>
    <optgroup label="1st Year Batches (${s1})">
      <option value="1st Year CSE-A" ${currentBatch === "1st Year CSE-A" ? "selected" : ""}>1st Year CSE-A</option>
      <option value="1st Year CSE-B" ${currentBatch === "1st Year CSE-B" ? "selected" : ""}>1st Year CSE-B</option>
      <option value="1st Year EE-A" ${currentBatch === "1st Year EE-A" ? "selected" : ""}>1st Year EE-A</option>
      <option value="1st Year EE-B" ${currentBatch === "1st Year EE-B" ? "selected" : ""}>1st Year EE-B</option>
      <option value="1st Year ECE-A" ${currentBatch === "1st Year ECE-A" ? "selected" : ""}>1st Year ECE-A</option>
      <option value="1st Year ECE-B" ${currentBatch === "1st Year ECE-B" ? "selected" : ""}>1st Year ECE-B</option>
    </optgroup>
    <optgroup label="3rd Year Batches (${s3})">
      <option value="3rd Year CSE-A" ${currentBatch === "3rd Year CSE-A" ? "selected" : ""}>3rd Year CSE-A</option>
      <option value="3rd Year CSE-B" ${currentBatch === "3rd Year CSE-B" ? "selected" : ""}>3rd Year CSE-B</option>
      <option value="3rd Year EE" ${currentBatch === "3rd Year EE" ? "selected" : ""}>3rd Year EE</option>
      <option value="3rd Year ECE-A" ${currentBatch === "3rd Year ECE-A" ? "selected" : ""}>3rd Year ECE-A</option>
      <option value="3rd Year ECE-B" ${currentBatch === "3rd Year ECE-B" ? "selected" : ""}>3rd Year ECE-B</option>
    </optgroup>
    <optgroup label="4th Year Batches (${s4})">
      <option value="4th Year CSE-A" ${currentBatch === "4th Year CSE-A" ? "selected" : ""}>4th Year CSE-A</option>
      <option value="4th Year CSE-B" ${currentBatch === "4th Year CSE-B" ? "selected" : ""}>4th Year CSE-B</option>
      <option value="4th Year EE" ${currentBatch === "4th Year EE" ? "selected" : ""}>4th Year EE</option>
      <option value="4th Year ECE-A" ${currentBatch === "4th Year ECE-A" ? "selected" : ""}>4th Year ECE-A</option>
      <option value="4th Year ECE-B" ${currentBatch === "4th Year ECE-B" ? "selected" : ""}>4th Year ECE-B</option>
    </optgroup>
  `;

  if (subSemesterInput) {
    subSemesterInput.value = currentSemester;
  }
}

// -----------------------------------------------------------------------------
// GENERATION & ACTIONS
// -----------------------------------------------------------------------------
function runScheduleGeneration(showToastNotification = true) {
  showLoading(`Generating Conflict-Free Academic Schedule (${currentSemester === "odd" ? "Odd Sem" : "Even Sem"})...`);

  setTimeout(() => {
    try {
      const result = solveTimetableInJS(appData, currentSemester);

      if (result.solved) {
        const otherSemSchedule = (appData.schedule || []).filter(item => (item.semester || "odd") !== currentSemester);
        appData.schedule = otherSemSchedule.concat(result.schedule);
        saveAppData();

        renderTimetable();
        renderLegend();
        renderLoadSummary();
        updateManagementUI();
        updateStatusBar(false);
        renderDiagnostics([]);

        if (showToastNotification) {
          const time = result.executionTimeMs.toFixed(2);
          showToast(`⚡ Conflict-free timetable generated in ${time} ms!`, "success");
        }
      } else {
        updateStatusBar(true, "Constraints unfeasible");
        renderDiagnostics(result.diagnostics);
        showToast("⚠️ Could not satisfy all constraints. Actionable diagnostics displayed above.", "error");
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
  showLoading("Restoring Official Faculty of Technology Timetable Data...");

  setTimeout(() => {
    appData = JSON.parse(JSON.stringify(DU_FOT_DEMO_DATA));
    saveAppData();

    runScheduleGeneration(false);
    populateFacultySelect();
    populateRoomSelect();
    updateSemesterUI();
    updateManagementUI();
    renderLegend();
    renderLoadSummary();
    updateStatusBar(false);
    renderDiagnostics([]);
    hideLoading();

    showToast("🏛️ Official DU FoT Timetable Data Restored & Generated!", "success");
  }, 40);
}

// -----------------------------------------------------------------------------
// TIMETABLE GRID RENDERING (Consecutive Lab Blocks Supported)
// -----------------------------------------------------------------------------
function renderTimetable() {
  if (!timetableBody || !appData) return;
  timetableBody.innerHTML = "";

  const schedule = (appData.schedule || []).filter(item => (item.semester || "odd") === currentSemester);

  TIME_PERIODS.forEach(period => {
    const tr = document.createElement("tr");

    const tdTime = document.createElement("td");
    tdTime.className = "time-cell";
    tdTime.innerHTML = `
      <div class="time-slot-name">${period.label}</div>
      <div class="time-slot-badge">Period</div>
    `;
    tr.appendChild(tdTime);

    DAYS.forEach(day => {
      const tdDay = document.createElement("td");

      const matching = schedule.filter(item => {
        const matchDay = (item.day === day);
        const matchTime = (item.time === period.label);

        let matchPerspective = false;
        if (currentViewMode === "batch") {
          const matchBatch = (currentBatch === "ALL") || (item.batch === currentBatch);

          let matchSubSection = true;
          if (currentSubSection === "A1") {
            matchSubSection = (item.subSection === "All" || item.subSection === "A1" || item.subSection === "B1");
          } else if (currentSubSection === "A2") {
            matchSubSection = (item.subSection === "All" || item.subSection === "A2" || item.subSection === "B2");
          } else if (currentSubSection === "WHOLE") {
            matchSubSection = (item.subSection === "All");
          }
          matchPerspective = matchBatch && matchSubSection;
        } else if (currentViewMode === "faculty") {
          matchPerspective = (item.teacherId === currentFaculty);
        } else if (currentViewMode === "room") {
          matchPerspective = (item.room === currentRoom);
        }

        let matchSearch = true;
        if (searchTerm) {
          const text = `${item.subjectCode} ${item.subjectName} ${item.teacherName} ${item.teacherId} ${item.room} ${item.batch} ${item.subSection}`.toLowerCase();
          matchSearch = text.includes(searchTerm);
        }

        return matchDay && matchTime && matchPerspective && matchSearch;
      });

      if (matching.length === 0) {
        if (currentViewMode === "room") {
          tdDay.innerHTML = `
            <div class="room-free-cell">
              <span class="room-free-badge">
                <span class="room-free-dot"></span> Available
              </span>
            </div>
          `;
        } else {
          tdDay.innerHTML = `<span class="empty-slot-label">—</span>`;
        }
      } else {
        matching.forEach(item => {
          const card = document.createElement("div");
          const typeClass = (item.type === "P" || item.isLab) 
            ? "type-p" 
            : ((item.type === "T") ? "type-t" : "type-l");

          const isPinned = !!item.pinned;
          card.className = `lecture-card ${typeClass}${isPinned ? " is-pinned" : ""}`;

          const color = getSubjectColor(item.subjectCode);
          card.style.borderLeftColor = isPinned ? "#f59e0b" : color.border;

          let badgePills = "";
          if (currentViewMode === "faculty") {
            const secStr = (item.subSection && item.subSection !== "All") ? ` (${item.subSection})` : "";
            badgePills = `<span class="card-persp-pill">${escapeHtml(item.batch)}${secStr}</span>`;
          } else if (currentViewMode === "room") {
            const secStr = (item.subSection && item.subSection !== "All") ? ` (${item.subSection})` : "";
            badgePills = `<span class="card-persp-pill">${escapeHtml(item.batch)}${secStr}</span>`;
          } else {
            let batchBadge = "";
            if (currentBatch === "ALL") {
              batchBadge = `<span class="lecture-batch-pill">${escapeHtml(item.batch)}</span>`;
            }

            let secBadge = "";
            if (item.subSection && item.subSection !== "All") {
              secBadge = `<span class="lecture-sec-pill">Grp ${escapeHtml(item.subSection)}</span>`;
            } else {
              secBadge = `<span class="lecture-sec-pill" style="background:#f1f5f9; color:#475569;">Whole</span>`;
            }
            badgePills = `${batchBadge}${secBadge}`;
          }

          const pinStatusPill = isPinned ? `<span class="pin-status-pill">🔒 Pinned</span>` : "";

          let blockBadge = "";
          if (item.isLab && item.duration > 1) {
            blockBadge = `<div class="lecture-block-badge">⏱️ ${item.timeRange} (${item.duration}h Lab • Part ${item.blockPart}/${item.duration})</div>`;
          } else if (item.type === "T") {
            blockBadge = `<div class="lecture-block-badge" style="color:#6b21a8; background:#f3e8ff; border-color:#d8b4fe;">📝 1h Tutorial</div>`;
          }

          let detailsHtml = "";
          if (currentViewMode === "faculty") {
            detailsHtml = `
              <span class="lecture-room">🏢 ${escapeHtml(item.room)}</span>
              <span class="lecture-teacher" style="color:#4f46e5;">👥 ${escapeHtml(item.batch)}</span>
            `;
          } else if (currentViewMode === "room") {
            detailsHtml = `
              <span class="lecture-teacher" title="${escapeHtml(item.teacherName)}">👨‍🏫 ${escapeHtml(item.teacherName)} [${escapeHtml(item.teacherId)}]</span>
              <span class="lecture-room" style="color:#059669;">👥 ${escapeHtml(item.batch)}</span>
            `;
          } else {
            detailsHtml = `
              <span class="lecture-teacher" title="${escapeHtml(item.teacherName)}">👨‍🏫 ${escapeHtml(item.teacherName)} [${escapeHtml(item.teacherId)}]</span>
              <span class="lecture-room">🏢 ${escapeHtml(item.room)}</span>
            `;
          }

          card.innerHTML = `
            <div class="lecture-header">
              <div class="lecture-header-left">
                <span class="lecture-code">${escapeHtml(item.subjectCode)}</span>
                <div class="lecture-tags">
                  ${badgePills}
                  ${pinStatusPill}
                </div>
              </div>
              <button type="button" class="btn-pin-slot${isPinned ? " pinned" : ""}" data-item-id="${escapeHtml(item.id)}" title="${isPinned ? "Unlock / Unpin this slot (will move dynamically during regeneration)" : "Lock / Pin this slot (fixes day, time, & room during regeneration)"}">
                <span class="pin-icon">${isPinned ? "🔒" : "🔓"}</span>
              </button>
            </div>
            <div class="lecture-name">${escapeHtml(item.subjectName)}</div>
            ${blockBadge}
            <div class="lecture-details">
              ${detailsHtml}
            </div>
          `;

          tdDay.appendChild(card);
        });
      }

      tr.appendChild(tdDay);
    });

    timetableBody.appendChild(tr);
  });
}

// -----------------------------------------------------------------------------
// COURSE & WEEKLY LOAD SUMMARY PANEL (Fixed L-T-P Breakdown + Sub-Section Sync)
// -----------------------------------------------------------------------------
function renderLoadSummary() {
  if (!summaryTableBody || !appData) return;
  summaryTableBody.innerHTML = "";
  if (summaryTableFoot) summaryTableFoot.innerHTML = "";

  const isOdd = (currentSemester === "odd");
  const semName = isOdd ? "Odd Semester (Autumn)" : "Even Semester (Spring)";

  if (currentViewMode === "faculty") {
    const tObj = (appData.teachers || []).find(t => t.id === currentFaculty) || { id: currentFaculty, name: currentFaculty };
    const facultyLabel = `${tObj.name} [${tObj.id}]`;

    if (summaryTitle) summaryTitle.textContent = `Faculty Teaching Load Summary (${facultyLabel})`;
    if (summarySubtitle) summarySubtitle.textContent = `Weekly curriculum assignments, L-T-P distribution, and total contact hours for ${facultyLabel} • ${semName}`;

    const facSchedule = (appData.schedule || []).filter(item => (item.semester || "odd") === currentSemester && item.teacherId === currentFaculty);
    
    const courseMap = {};
    facSchedule.forEach(item => {
      const key = `${item.subjectCode}|${item.batch}|${item.subSection}`;
      if (!courseMap[key]) {
        courseMap[key] = {
          code: item.subjectCode,
          name: item.subjectName,
          batch: item.batch,
          subSection: item.subSection,
          type: item.type || (item.isLab ? "P" : "L"),
          lHours: 0,
          tHours: 0,
          pHours: 0,
          totalHours: 0
        };
      }
      if (item.type === "P" || item.isLab) {
        courseMap[key].pHours += 1;
      } else if (item.type === "T") {
        courseMap[key].tHours += 1;
      } else {
        courseMap[key].lHours += 1;
      }
      courseMap[key].totalHours += 1;
    });

    const courses = Object.values(courseMap);
    courses.sort((a, b) => a.code.localeCompare(b.code));

    let sumL = 0, sumT = 0, sumP = 0, sumTotal = 0;

    courses.forEach(c => {
      sumL += c.lHours;
      sumT += c.tHours;
      sumP += c.pHours;
      sumTotal += c.totalHours;

      const secChip = (c.subSection && c.subSection !== "All")
        ? `<span class="summary-sec-chip chip-${c.subSection.toLowerCase()}">Grp ${escapeHtml(c.subSection)}</span>`
        : `<span class="summary-sec-chip chip-all">Whole</span>`;

      const typeChip = (c.type === "P")
        ? `<span class="summary-type-chip chip-p">Lab (P)</span>`
        : ((c.type === "T") ? `<span class="summary-type-chip chip-t">Tutorial (T)</span>` : `<span class="summary-type-chip chip-l">Lecture (L)</span>`);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div style="display:flex; align-items:center; gap:6px;">
            <span class="course-code-pill">${escapeHtml(c.code)}</span>
            ${typeChip}
          </div>
        </td>
        <td class="course-title-cell">${escapeHtml(c.name)}</td>
        <td>
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-weight:600; font-size:0.8rem; color:#1e293b;">${escapeHtml(c.batch)}</span>
            ${secChip}
          </div>
        </td>
        <td class="text-center font-mono">${c.lHours > 0 ? `<span class="load-pill pill-l">${c.lHours}</span>` : '<span class="load-zero">0</span>'}</td>
        <td class="text-center font-mono">${c.tHours > 0 ? `<span class="load-pill pill-t">${c.tHours}</span>` : '<span class="load-zero">0</span>'}</td>
        <td class="text-center font-mono">${c.pHours > 0 ? `<span class="load-pill pill-p">${c.pHours}</span>` : '<span class="load-zero">0</span>'}</td>
        <td class="text-center font-mono font-bold"><span class="load-pill pill-total">${c.totalHours} hrs</span></td>
      `;
      summaryTableBody.appendChild(tr);
    });

    if (totalCoursesBadge) totalCoursesBadge.textContent = `${courses.length} Assigned Courses`;
    if (totalHoursBadge) totalHoursBadge.textContent = `${sumTotal} Contact Hrs / Week`;

    if (summaryTableFoot) {
      summaryTableFoot.innerHTML = `
        <tr>
          <td colspan="3" class="total-label-cell">
            <strong>Total Faculty Teaching Load (${escapeHtml(facultyLabel)})</strong>
            <span class="total-subtext">Weekly contact hours across all assigned cohorts</span>
          </td>
          <td class="text-center font-mono font-bold"><span class="load-pill pill-l">${sumL}</span></td>
          <td class="text-center font-mono font-bold"><span class="load-pill pill-t">${sumT}</span></td>
          <td class="text-center font-mono font-bold"><span class="load-pill pill-p">${sumP}</span></td>
          <td class="text-center font-mono font-bold"><span class="load-pill pill-total">${sumTotal} hrs/wk</span></td>
        </tr>
      `;
    }
    return;
  }

  if (currentViewMode === "room") {
    const roomLabel = currentRoom.includes("Lab") ? currentRoom : `Room ${currentRoom}`;
    if (summaryTitle) summaryTitle.textContent = `Facility Occupancy Summary (${roomLabel})`;
    if (summarySubtitle) summarySubtitle.textContent = `Weekly scheduled periods, subject allocations, and faculty occupancy in ${roomLabel} • ${semName}`;

    const roomSchedule = (appData.schedule || []).filter(item => (item.semester || "odd") === currentSemester && item.room === currentRoom);
    const occupiedSlots = roomSchedule.length;
    const utilPct = Math.round((occupiedSlots / TOTAL_TIMESLOTS) * 100);

    const courseMap = {};
    roomSchedule.forEach(item => {
      const key = `${item.subjectCode}|${item.batch}|${item.teacherId}`;
      if (!courseMap[key]) {
        courseMap[key] = {
          code: item.subjectCode,
          name: item.subjectName,
          batch: item.batch,
          subSection: item.subSection,
          teacherName: item.teacherName,
          teacherId: item.teacherId,
          type: item.type || (item.isLab ? "P" : "L"),
          periods: 0
        };
      }
      courseMap[key].periods += 1;
    });

    const courses = Object.values(courseMap);
    courses.sort((a, b) => b.periods - a.periods);

    courses.forEach(c => {
      const secChip = (c.subSection && c.subSection !== "All")
        ? `<span class="summary-sec-chip chip-${c.subSection.toLowerCase()}">Grp ${escapeHtml(c.subSection)}</span>`
        : `<span class="summary-sec-chip chip-all">Whole</span>`;

      const typeChip = (c.type === "P")
        ? `<span class="summary-type-chip chip-p">Lab</span>`
        : ((c.type === "T") ? `<span class="summary-type-chip chip-t">Tut</span>` : `<span class="summary-type-chip chip-l">Lec</span>`);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div style="display:flex; align-items:center; gap:6px;">
            <span class="course-code-pill">${escapeHtml(c.code)}</span>
            ${typeChip}
          </div>
        </td>
        <td class="course-title-cell">${escapeHtml(c.name)}</td>
        <td>
          <div style="display:flex; align-items:center; gap:6px;">
            <span>👨‍🏫 ${escapeHtml(c.teacherName)} [${escapeHtml(c.teacherId)}]</span>
            <span style="color:#64748b;">•</span>
            <span style="font-weight:600;">${escapeHtml(c.batch)}</span>
            ${secChip}
          </div>
        </td>
        <td colspan="3" class="text-center font-mono">
          <span style="color:#475569; font-size:0.75rem;">Scheduled across week</span>
        </td>
        <td class="text-center font-mono font-bold"><span class="load-pill pill-total">${c.periods} hrs</span></td>
      `;
      summaryTableBody.appendChild(tr);
    });

    if (totalCoursesBadge) totalCoursesBadge.textContent = `${occupiedSlots} / ${TOTAL_TIMESLOTS} Periods Occupied`;
    if (totalHoursBadge) totalHoursBadge.textContent = `${utilPct}% Facility Utilization`;

    if (summaryTableFoot) {
      summaryTableFoot.innerHTML = `
        <tr>
          <td colspan="3" class="total-label-cell">
            <strong>Total Weekly Room Utilization (${escapeHtml(roomLabel)})</strong>
            <span class="total-subtext">Active periods vs available weekly periods</span>
          </td>
          <td colspan="3" class="text-center font-mono font-bold" style="color:#059669;">
            ${TOTAL_TIMESLOTS - occupiedSlots} Periods Free / Available
          </td>
          <td class="text-center font-mono font-bold"><span class="load-pill pill-total">${occupiedSlots} hrs/wk</span></td>
        </tr>
      `;
    }
    return;
  }

  // Batch Mode View: Existing L-T-P breakdown
  let relevantSubjects = (appData.subjects || []).filter(s => (s.semester || "odd") === currentSemester);

  if (currentBatch !== "ALL") {
    relevantSubjects = relevantSubjects.filter(s => s.batch === currentBatch);
  }

  if (currentSubSection === "A1") {
    relevantSubjects = relevantSubjects.filter(s => {
      const sec = s.subSection || "All";
      return sec === "All" || sec === "A1" || sec === "B1";
    });
  } else if (currentSubSection === "A2") {
    relevantSubjects = relevantSubjects.filter(s => {
      const sec = s.subSection || "All";
      return sec === "All" || sec === "A2" || sec === "B2";
    });
  } else if (currentSubSection === "WHOLE") {
    relevantSubjects = relevantSubjects.filter(s => (s.subSection || "All") === "All");
  }

  const subSecLabel = (currentSubSection === "ALL") ? "All Groups" : `Group ${currentSubSection}`;
  if (summaryTitle) {
    summaryTitle.textContent = (currentBatch === "ALL")
      ? `Campus Course Catalog (${semName} • ${subSecLabel})`
      : `Course & Weekly Load Summary (${currentBatch} • ${subSecLabel})`;
  }
  if (summarySubtitle) {
    summarySubtitle.textContent = (currentBatch === "ALL")
      ? `Complete Faculty of Technology curriculum across all batches for ${semName}`
      : `Weekly academic hour distribution (L-T-P breakdown) for ${currentBatch} • ${semName}`;
  }

  const teacherMap = {};
  (appData.teachers || []).forEach(t => {
    teacherMap[t.id] = t.name;
  });

  const courseMap = {};
  relevantSubjects.forEach(s => {
    const rawCode = s.code.trim();
    const isLab = (s.type === "P") || /\(P\)|Lab/i.test(rawCode) || /Lab/i.test(s.name);
    const isTut = (s.type === "T") || /\(T\)|Tutorial/i.test(rawCode) || /Tutorial/i.test(s.name);
    const cType = s.type || (isLab ? "P" : (isTut ? "T" : "L"));

    let dur = parseInt(s.duration, 10);
    if (isNaN(dur) || dur < 1) dur = (cType === "P") ? 2 : 1;

    let sess = parseInt(s.weeklySessions, 10);
    if (isNaN(sess) || sess < 1) {
      const wl = parseInt(s.weeklyLectures, 10) || 1;
      sess = (cType === "P") ? Math.max(1, Math.floor(wl / dur)) : wl;
    }

    const tName = teacherMap[s.teacherId] || s.teacherId;
    const key = `${s.code}|${s.batch}|${s.subSection || "All"}`;

    if (!courseMap[key]) {
      courseMap[key] = {
        code: s.code,
        name: s.name,
        batch: s.batch,
        subSection: s.subSection || "All",
        type: cType,
        duration: dur,
        sessions: sess,
        teachers: new Set(),
        l: 0,
        t: 0,
        p: 0,
        total: 0
      };
    }

    courseMap[key].teachers.add(`${tName} [${s.teacherId}]`);

    if (cType === "P") {
      courseMap[key].p += sess;
      courseMap[key].total += (sess * dur);
    } else if (cType === "T") {
      courseMap[key].t += sess;
      courseMap[key].total += (sess * dur);
    } else {
      courseMap[key].l += sess;
      courseMap[key].total += (sess * dur);
    }
  });

  const courses = Object.values(courseMap);
  courses.sort((a, b) => a.code.localeCompare(b.code));

  let totalL = 0;
  let totalT = 0;
  let totalP = 0;
  let totalHours = 0;

  courses.forEach(course => {
    totalL += course.l;
    totalT += course.t;
    totalP += course.p;
    totalHours += course.total;

    const teacherList = Array.from(course.teachers).join(", ");

    const secChip = (course.subSection && course.subSection !== "All")
      ? `<span class="summary-sec-chip chip-${course.subSection.toLowerCase()}">Grp ${escapeHtml(course.subSection)}</span>`
      : `<span class="summary-sec-chip chip-all">Whole</span>`;

    const typeChip = (course.type === "P")
      ? `<span class="summary-type-chip chip-p">Lab (P)</span>`
      : ((course.type === "T") ? `<span class="summary-type-chip chip-t">Tutorial (T)</span>` : `<span class="summary-type-chip chip-l">Lecture (L)</span>`);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div style="display: flex; align-items: center; gap: 6px;">
          <span class="course-code-pill">${escapeHtml(course.code)}</span>
          ${typeChip}
        </div>
      </td>
      <td class="course-title-cell">${escapeHtml(course.name)}</td>
      <td>
        <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
          <span>👨‍🏫 ${escapeHtml(teacherList)}</span>
          ${secChip}
        </div>
      </td>
      <td class="text-center font-mono">${course.l > 0 ? `<span class="load-pill pill-l">${course.l}</span>` : '<span class="load-zero">0</span>'}</td>
      <td class="text-center font-mono">${course.t > 0 ? `<span class="load-pill pill-t">${course.t}</span>` : '<span class="load-zero">0</span>'}</td>
      <td class="text-center font-mono">${course.p > 0 ? `<span class="load-pill pill-p">${course.p}</span>` : '<span class="load-zero">0</span>'}</td>
      <td class="text-center font-mono font-bold"><span class="load-pill pill-total">${course.total} hrs</span></td>
    `;
    summaryTableBody.appendChild(tr);
  });

  if (summaryTableFoot) {
    const batchLabel = (currentBatch === "ALL") ? "Campus Academic Load" : `Total Academic Load (${currentBatch})`;
    summaryTableFoot.innerHTML = `
      <tr>
        <td colspan="3" class="total-label-cell">
          <strong>${escapeHtml(batchLabel)} (${courses.length} Courses • ${subSecLabel})</strong>
          <span class="total-subtext">Weekly student attendance contact hours (L + T + P sessions × duration)</span>
        </td>
        <td class="text-center font-mono font-bold"><span class="load-pill pill-l">${totalL}</span></td>
        <td class="text-center font-mono font-bold"><span class="load-pill pill-t">${totalT}</span></td>
        <td class="text-center font-mono font-bold"><span class="load-pill pill-p">${totalP}</span></td>
        <td class="text-center font-mono font-bold"><span class="load-pill pill-total">${totalHours} hrs/wk</span></td>
      </tr>
    `;
  }

  if (totalCoursesBadge) {
    totalCoursesBadge.textContent = `${courses.length} Courses`;
  }
  if (totalHoursBadge) {
    totalHoursBadge.textContent = `${totalHours} Contact Hrs / Week`;
  }
}

// -----------------------------------------------------------------------------
// LEGEND RENDERING (Grouped by Semester & Class / Faculty Directory)
// -----------------------------------------------------------------------------
function renderLegend() {
  const container = document.getElementById("legendBody") || document.getElementById("legendPills");
  if (!container || !appData) return;
  container.innerHTML = "";

  const isOdd = (currentSemester === "odd");
  const semName = isOdd ? "Odd Semester (Autumn)" : "Even Semester (Spring)";

  let semSubjects = (appData.subjects || []).filter(s => (s.semester || "odd") === currentSemester);

  if (legendSearchTerm) {
    semSubjects = semSubjects.filter(s => {
      const teacherName = (appData.teachers || []).find(t => t.id === s.teacherId)?.name || "";
      return s.code.toLowerCase().includes(legendSearchTerm) ||
             s.name.toLowerCase().includes(legendSearchTerm) ||
             s.batch.toLowerCase().includes(legendSearchTerm) ||
             (s.subSection && s.subSection.toLowerCase().includes(legendSearchTerm)) ||
             (s.teacherId && s.teacherId.toLowerCase().includes(legendSearchTerm)) ||
             teacherName.toLowerCase().includes(legendSearchTerm);
    });
  }

  const teacherMap = {};
  (appData.teachers || []).forEach(t => {
    teacherMap[t.id] = t.name;
  });

  // MODE 1: ACTIVE BATCH VIEW
  if (legendViewMode === "batch") {
    let targetBatches = [];
    if (currentBatch === "ALL") {
      const batchSet = new Set(semSubjects.map(s => s.batch));
      targetBatches = Array.from(batchSet);
    } else {
      targetBatches = [currentBatch];
    }

    if (targetBatches.length === 0 || semSubjects.length === 0) {
      container.innerHTML = `
        <div class="legend-empty-state">
          <p>No matching courses or faculty found for the current selection in ${semName}.</p>
        </div>
      `;
      return;
    }

    const grid = document.createElement("div");
    grid.className = "legend-classes-grid";

    targetBatches.forEach(batchName => {
      const batchSubs = semSubjects.filter(s => s.batch === batchName);
      if (batchSubs.length === 0) return;

      const card = createClassCard(batchName, batchSubs, teacherMap, isOdd);
      grid.appendChild(card);
    });

    container.appendChild(grid);
  }

  // MODE 2: ALL CLASSES / SECTIONS VIEW
  else if (legendViewMode === "classes") {
    const batchesMap = {};
    semSubjects.forEach(s => {
      if (!batchesMap[s.batch]) batchesMap[s.batch] = [];
      batchesMap[s.batch].push(s);
    });

    const batchKeys = Object.keys(batchesMap);
    if (batchKeys.length === 0) {
      container.innerHTML = `
        <div class="legend-empty-state">
          <p>No matching courses found for ${semName}.</p>
        </div>
      `;
      return;
    }

    const grid = document.createElement("div");
    grid.className = "legend-classes-grid";

    batchKeys.forEach(batchName => {
      const card = createClassCard(batchName, batchesMap[batchName], teacherMap, isOdd);
      grid.appendChild(card);
    });

    container.appendChild(grid);
  }

  // MODE 3: FACULTY DIRECTORY VIEW
  else if (legendViewMode === "faculty") {
    const facultyMap = {};
    (appData.teachers || []).forEach(t => {
      facultyMap[t.id] = {
        id: t.id,
        name: t.name,
        courses: [],
        totalHours: 0
      };
    });

    semSubjects.forEach(s => {
      if (s.teacherId && facultyMap[s.teacherId]) {
        const hrs = parseInt(s.weeklyLectures, 10) || 0;
        facultyMap[s.teacherId].courses.push({
          code: s.code,
          name: s.name,
          batch: s.batch,
          subSection: s.subSection,
          type: s.type || ((s.code.includes("(P)") || s.name.includes("Lab")) ? "P" : "L"),
          weeklyLectures: hrs
        });
        facultyMap[s.teacherId].totalHours += hrs;
      }
    });

    let facultyList = Object.values(facultyMap);

    if (legendSearchTerm) {
      facultyList = facultyList.filter(f => 
        f.id.toLowerCase().includes(legendSearchTerm) ||
        f.name.toLowerCase().includes(legendSearchTerm) ||
        f.courses.some(c => c.code.toLowerCase().includes(legendSearchTerm) || c.name.toLowerCase().includes(legendSearchTerm))
      );
    }

    facultyList.sort((a, b) => a.name.localeCompare(b.name));

    if (facultyList.length === 0) {
      container.innerHTML = `
        <div class="legend-empty-state">
          <p>No matching faculty members found.</p>
        </div>
      `;
      return;
    }

    const grid = document.createElement("div");
    grid.className = "legend-faculty-grid";

    facultyList.forEach(f => {
      const card = document.createElement("div");
      card.className = "faculty-dir-card";

      let coursesHtml = "";
      if (f.courses.length === 0) {
        coursesHtml = `<span class="faculty-no-course">No courses assigned in this semester</span>`;
      } else {
        coursesHtml = f.courses.map(c => `
          <span class="faculty-course-chip" title="${escapeHtml(c.name)}">
            <strong>${escapeHtml(c.code)}</strong> 
            <span class="chip-batch">${escapeHtml(c.batch)}</span>
            ${c.subSection && c.subSection !== 'All' ? `<span class="chip-sec">(${escapeHtml(c.subSection)})</span>` : ''}
            <span class="chip-hrs">${c.weeklyLectures}h</span>
          </span>
        `).join("");
      }

      card.innerHTML = `
        <div class="faculty-card-header">
          <div class="faculty-avatar-box">
            <span class="faculty-acronym-badge">${escapeHtml(f.id)}</span>
          </div>
          <div class="faculty-meta">
            <h4 class="faculty-name">${escapeHtml(f.name)}</h4>
            <span class="faculty-title-tag">Faculty of Technology, DU</span>
          </div>
          <div class="faculty-load-badge" title="Total Weekly Contact Hours">
            <strong>${f.totalHours}</strong> hrs/wk
          </div>
        </div>
        <div class="faculty-assignments">
          <span class="assignments-label">Teaching Assignments (${f.courses.length}):</span>
          <div class="faculty-courses-list">
            ${coursesHtml}
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

    container.appendChild(grid);
  }
}

function createClassCard(batchName, subjects, teacherMap, isOdd) {
  const card = document.createElement("div");
  card.className = "legend-class-card";

  const totalHrs = subjects.reduce((sum, s) => sum + (parseInt(s.weeklyLectures, 10) || 0), 0);

  let subjectsRows = subjects.map(s => {
    const color = getSubjectColor(s.code);
    const teacherName = teacherMap[s.teacherId] || s.teacherId;
    const isLab = (s.type === "P") || /\(P\)|Lab/i.test(s.code) || /Lab/i.test(s.name);
    const isTut = (s.type === "T") || /\(T\)|Tutorial/i.test(s.code) || /Tutorial/i.test(s.name);
    const typeLabel = isLab ? `🔬 Practical Lab (${s.duration || 2}h Block)` : (isTut ? "📝 Tutorial (1h)" : "📚 Theory (1h)");
    const typeClass = isLab ? "badge-type-p" : (isTut ? "badge-type-t" : "badge-type-l");

    const secLabel = (s.subSection === "All" || !s.subSection) 
      ? "Whole Class" 
      : `Group ${s.subSection}`;

    return `
      <tr class="legend-subject-row">
        <td class="col-code">
          <span class="subject-code-badge" style="border-left: 3px solid ${color.border};">
            <span class="sub-dot" style="background-color: ${color.border};"></span>
            <strong>${escapeHtml(s.code)}</strong>
          </span>
        </td>
        <td class="col-name">
          <div class="sub-name-cell">
            <span class="sub-full-name">${escapeHtml(s.name)}</span>
            <span class="sub-type-badge ${typeClass}">${typeLabel}</span>
          </div>
        </td>
        <td class="col-section">
          <span class="sub-sec-pill">${escapeHtml(secLabel)}</span>
        </td>
        <td class="col-faculty">
          <div class="faculty-tag" title="Faculty In-Charge">
            <span class="fac-icon">👨‍🏫</span>
            <span class="fac-name"><strong>${escapeHtml(teacherName)}</strong></span>
            <span class="fac-acronym">[${escapeHtml(s.teacherId)}]</span>
          </div>
        </td>
        <td class="col-hrs text-center">
          <span class="sub-hrs-pill">${s.weeklyLectures} hrs/wk</span>
        </td>
      </tr>
    `;
  }).join("");

  card.innerHTML = `
    <div class="legend-class-header">
      <div class="legend-class-title-group">
        <span class="legend-class-icon">🎓</span>
        <div>
          <h4 class="legend-class-title">${escapeHtml(batchName)}</h4>
          <span class="legend-class-sub">${isOdd ? 'Odd Semester (Autumn)' : 'Even Semester (Spring)'}</span>
        </div>
      </div>
      <div class="legend-class-badges">
        <span class="legend-stat-pill">${subjects.length} Subjects</span>
        <span class="legend-stat-pill pill-hrs">${totalHrs} Contact Hrs/Wk</span>
      </div>
    </div>
    <div class="legend-table-responsive">
      <table class="legend-subjects-table">
        <thead>
          <tr>
            <th style="width: 16%;">Course Code</th>
            <th style="width: 34%;">Subject Title</th>
            <th style="width: 16%;">Sub-Section</th>
            <th style="width: 22%;">Faculty In-Charge</th>
            <th style="width: 12%;" class="text-center">Hours</th>
          </tr>
        </thead>
        <tbody>
          ${subjectsRows}
        </tbody>
      </table>
    </div>
  `;

  return card;
}

function updateLegendTabs() {
  const tabs = [
    { id: "tabActiveBatch", view: "batch" },
    { id: "tabAllClasses", view: "classes" },
    { id: "tabFacultyDir", view: "faculty" }
  ];
  tabs.forEach(t => {
    const el = document.getElementById(t.id);
    if (el) el.classList.toggle("active", legendViewMode === t.view);
  });
}

// -----------------------------------------------------------------------------
// DATA MANAGEMENT UI (Faculty, Subjects, Classrooms & Labs)
// -----------------------------------------------------------------------------
function updateManagementUI() {
  if (!appData) return;

  // 1. Teachers list
  if (teachersListEl) {
    teachersListEl.innerHTML = "";
    (appData.teachers || []).forEach(t => {
      const row = document.createElement("div");
      row.className = "item-row";
      row.innerHTML = `
        <div class="item-info">
          <span class="item-badge">${escapeHtml(t.id)}</span>
          <span class="item-title">${escapeHtml(t.name)}</span>
        </div>
        <button type="button" class="btn-delete-item" onclick="deleteTeacher('${t.id}')" title="Remove Teacher">✕</button>
      `;
      teachersListEl.appendChild(row);
    });
  }
  if (teachersCountEl) teachersCountEl.textContent = (appData.teachers || []).length;

  if (subTeacherInput) {
    const currentVal = subTeacherInput.value;
    subTeacherInput.innerHTML = "";
    (appData.teachers || []).forEach(t => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = `${t.name} (${t.id})`;
      subTeacherInput.appendChild(opt);
    });
    if (currentVal) subTeacherInput.value = currentVal;
  }

  // 2. Subjects list (Filtered by active semester)
  if (subjectsListEl) {
    subjectsListEl.innerHTML = "";
    (appData.subjects || []).forEach((s, idx) => {
      const isCurrentSem = (s.semester || "odd") === currentSemester;
      if (!isCurrentSem) return;

      const row = document.createElement("div");
      row.className = "item-row";
      const semTag = (s.semester === "even") ? `<span class="sem-badge sem-even">Even</span>` : `<span class="sem-badge sem-odd">Odd</span>`;
      const typeTag = (s.type === "P") 
        ? `<span class="sem-badge" style="background:#ecfdf5; color:#047857;">Lab (${s.duration || 2}h)</span>`
        : ((s.type === "T") ? `<span class="sem-badge" style="background:#fdf4ff; color:#a21caf;">Tut</span>` : `<span class="sem-badge" style="background:#eff6ff; color:#1d4ed8;">Lec</span>`);

      row.innerHTML = `
        <div class="item-info">
          <div class="item-title-group">
            <span class="item-badge">${escapeHtml(s.code)}</span>
            <span class="item-title">${escapeHtml(s.name)}</span>
            ${typeTag}
            ${semTag}
          </div>
          <span class="item-sub">${escapeHtml(s.batch)} (${escapeHtml(s.subSection || "All")}) • ${escapeHtml(s.teacherId)} • ${s.weeklyLectures} hrs/wk</span>
        </div>
        <button type="button" class="btn-delete-item" onclick="deleteSubject(${idx})" title="Remove Subject">✕</button>
      `;
      subjectsListEl.appendChild(row);
    });
  }
  if (subjectsCountEl) {
    const semSubCount = (appData.subjects || []).filter(s => (s.semester || "odd") === currentSemester).length;
    subjectsCountEl.textContent = `${semSubCount} (${currentSemester === "odd" ? "Odd" : "Even"})`;
  }

  // 3. Classrooms & Labs list
  if (roomsListEl) {
    roomsListEl.innerHTML = "";
    (appData.rooms || []).forEach(r => {
      const chip = document.createElement("span");
      chip.className = "room-chip";
      chip.innerHTML = `
        <span>${escapeHtml(r)}</span>
        <button type="button" class="btn-delete-chip" onclick="deleteRoom('${r}')" title="Remove Room">✕</button>
      `;
      roomsListEl.appendChild(chip);
    });
  }
  if (roomsCountEl) roomsCountEl.textContent = (appData.rooms || []).length;
}

// -----------------------------------------------------------------------------
// FORM SUBMISSION HANDLERS
// -----------------------------------------------------------------------------
function handleAddTeacher(e) {
  e.preventDefault();
  const idInput = document.getElementById("teacherIdInput");
  const nameInput = document.getElementById("teacherNameInput");

  const id = idInput.value.trim().toUpperCase();
  const name = nameInput.value.trim();

  if (!id || !name) return;
  if (appData.teachers.some(t => t.id === id)) {
    showToast(`Faculty code '${id}' already exists!`, "error");
    return;
  }

  appData.teachers.push({ id, name });
  idInput.value = "";
  nameInput.value = "";

  saveAppData();
  updateManagementUI();
  showToast(`Added faculty: ${name} [${id}]`, "info");
}

window.deleteTeacher = function(teacherId) {
  if (confirm(`Remove faculty ${teacherId} and associated classes?`)) {
    appData.teachers = appData.teachers.filter(t => t.id !== teacherId);
    appData.subjects = appData.subjects.filter(s => s.teacherId !== teacherId);
    saveAppData();
    updateManagementUI();
    renderLegend();
    renderLoadSummary();
    updateStatusBar();
    showToast(`Removed faculty ${teacherId}`, "info");
  }
};

function handleAddSubject(e) {
  e.preventDefault();
  const code = document.getElementById("subCodeInput").value.trim();
  const name = document.getElementById("subNameInput").value.trim();
  const batch = document.getElementById("subBatchInput").value;
  const subSection = document.getElementById("subSectionInput").value;
  const semester = (document.getElementById("subSemesterInput")?.value) || currentSemester;
  const type = (document.getElementById("subTypeInput")?.value) || "L";
  const duration = parseInt(document.getElementById("subDurationInput")?.value, 10) || ((type === "P") ? 2 : 1);
  const weeklySessions = parseInt(document.getElementById("subLecturesInput")?.value, 10) || 1;
  const teacherId = document.getElementById("subTeacherInput").value;

  if (!code || !name || !batch || !teacherId) return;

  appData.subjects.push({
    code,
    name,
    batch,
    subSection,
    teacherId,
    type,
    duration,
    weeklySessions,
    weeklyLectures: (duration * weeklySessions),
    semester
  });

  document.getElementById("subCodeInput").value = "";
  document.getElementById("subNameInput").value = "";

  saveAppData();
  updateManagementUI();
  renderLegend();
  renderLoadSummary();
  updateStatusBar();
  showToast(`Added ${code} (${subSection}) [${type}: ${duration}h x ${weeklySessions}] for ${batch}`, "info");
}

window.deleteSubject = function(idx) {
  if (confirm("Remove this subject assignment?")) {
    appData.subjects.splice(idx, 1);
    saveAppData();
    updateManagementUI();
    renderLegend();
    renderLoadSummary();
    updateStatusBar();
    showToast("Subject removed", "info");
  }
};

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
  showToast(`Added classroom/lab ${room}`, "info");
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
// LOCAL STORAGE & DATA UTILITIES
// -----------------------------------------------------------------------------
function loadAppData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      appData = JSON.parse(raw);
    } else {
      appData = JSON.parse(JSON.stringify(DU_FOT_DEMO_DATA));
      saveAppData();
    }
  } catch (e) {
    console.error("Failed to load stored timetable data:", e);
    appData = JSON.parse(JSON.stringify(DU_FOT_DEMO_DATA));
  }
}

function saveAppData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
  } catch (e) {
    console.error("Failed to save data to localStorage:", e);
  }
}

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

function showLoading(text = "Generating Conflict-Free Academic Schedule...") {
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

function getSubjectColor(code) {
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = code.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % SUBJECT_COLORS.length;
  return SUBJECT_COLORS[idx];
}
