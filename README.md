# 🎓 College Timetable Generator
> **Design and Analysis of Algorithms (ADA) Project • B.Tech CSE (3rd Semester)**  
> Built with **C++ (Graph Coloring & Backtracking)**, **Python Flask (The Bridge)**, and **Modern Vanilla Web Technologies**.

---

## 🏛️ Project Architecture

```
                  ┌────────────────────────────────────────┐
                  │          The Frontend (UI)             │
                  │   index.html • style.css • script.js   │
                  │   (Full-Week Grid, Modals, DU Demo)    │
                  └──────────────────┬─────────────────────┘
                                     │ HTTP REST Requests
                                     ▼
                  ┌────────────────────────────────────────┐
                  │          The Bridge (Flask)            │
                  │                 app.py                 │
                  │    - Serves Web Interface              │
                  │    - Executes Compiled C++ Binary      │
                  │    - Syncs Form Inputs                 │
                  └─────────────┬──────────────────────────┘
                                │ Subprocess Call
                                ▼
  ┌──────────────────────────────────────────────────────────────────┐
  │                        The Brain (C++)                           │
  │                         algorithm.cpp                            │
  │     - Graph Vertex Coloring Constraint Satisfaction              │
  │     - Recursive Backtracking with Welsh-Powell Degree Heuristic   │
  │     - Zero External Dependencies (Self-contained JSON parser)    │
  └───────────────▲──────────────────────────────────┬───────────────┘
                  │ Reads Config                     │ Writes Output
                  │                                  ▼
  ┌───────────────┴───────────────┐  ┌───────────────────────────────┐
  │     The Database (Local)      │  │        The Output JSON        │
  │          data.json            │  │        timetable.json         │
  │ Teachers, Subjects, Rooms,    │  │ Conflict-free weekly schedule │
  │ and Generated Schedule        │  │ with timeslot & room mappings │
  └───────────────────────────────┘  └───────────────────────────────┘
```

---

## 🚀 Step-by-Step Setup & Run Instructions

### 1. Open Terminal in the Project Directory
Open **PowerShell** or **Command Prompt** and navigate to:
```powershell
cd "C:\Users\gaurav\Downloads\ada project"
```

---

### 2. Compile the C++ Brain (`algorithm.cpp`)
Compile using GCC/MinGW `g++` with C++17 optimization:
```bash
g++ -std=c++17 -O2 algorithm.cpp -o algorithm.exe
```
*(On macOS / Linux, run: `g++ -std=c++17 -O2 algorithm.cpp -o algorithm`)*

> [!NOTE]
> `algorithm.cpp` is written in standard C++17 with a self-contained, zero-dependency JSON parser. You do **not** need to install any external libraries like Boost or vcpkg!

---

### 3. Ensure Flask is Installed
If you haven't installed Flask yet, run:
```bash
pip install flask
```

---

### 4. Run the Python Server (`app.py`)
Start the bridge server:
```bash
python app.py
```

You will see:
```text
============================================================
 🚀 College Timetable Generator - Server Started
 🌐 Access Dashboard at: http://127.0.0.1:5000
============================================================
```

---

### 5. Open Your Browser
Open your favorite browser (Chrome, Edge, Firefox) and navigate to:
```
http://127.0.0.1:5000
```

---

## 🖥️ How to Use the App

1. **'Load DU FoT Demo Data' Button**:
   - Located prominently in the top navbar.
   - Instantly populates the pre-configured Delhi University (Faculty of Technology) 2nd-year CSE dataset.
2. **'Run C++ Algorithm' Button**:
   - Executes `algorithm.exe`, building the conflict graph, coloring all 38 lecture vertices, and resolving all overlaps in **< 1 millisecond**!
3. **Batch Selector Dropdown**:
   - Toggle view between **CSE-A**, **CSE-B**, or **All Batches (Combined View)**.
4. **'Manage Database' Sidebar Drawer**:
   - Add or delete Teachers, Subjects, and Classrooms.
   - Saves immediately to `data.json`.
5. **Print / Export**:
   - Click the 🖨️ button to print or save a clean, professional PDF copy.

---

## 🏫 Hardcoded DU FoT 2nd-Year Demo Data

| Cohort | Subject Code | Subject Name | Faculty Name & Code | Weekly Lectures |
| :--- | :--- | :--- | :--- | :---: |
| **CSE-A** | `ADA` | Design & Analysis of Algorithms | Dr. Juhi Jain (`JJ`) | 4 |
| **CSE-A** | `DBMS` | Database Management Systems | Dr. Geetanjali Bhola (`GB`) | 4 |
| **CSE-A** | `DSD` | Digital System Design | Dr. Bhawna Rawat (`BR`) | 4 |
| **CSE-A** | `PSCS-A` | Probability & Statistics for CS | Dr. Ahmad Zaman Khan (`AZK`) | 3 |
| **CSE-A** | `EVS-2` | Environmental Science - II | Dr. Udita Sharma (`UDS`) | 2 |
| **CSE-A** | `FIT INDIA`| Fit India Movement | Dr. Ashutosh Pandey (`AP`) | 1 |
| **CSE-B** | `ADA` | Design & Analysis of Algorithms | Dr. Juhi Jain (`JJ`) | 4 |
| **CSE-B** | `DBMS` | Database Management Systems | Dr. Geetanjali Bhola (`GB`) | 4 |
| **CSE-B** | `DSD` | Digital System Design | Dr. Bhawna Rawat (`BR`) | 4 |
| **CSE-B** | `PSCS-B` | Probability & Statistics for CS | Dr. Ahmad Zaman Khan (`AZK`) | 3 |
| **CSE-B** | `FSS` | Full Stack Specialization | Mr. Ajay Kumar Sahu (`AKS`) | 2 |
| **CSE-B** | `EVS-2` | Environmental Science - II | Dr. Eklavya (`EKL`) | 2 |
| **CSE-B** | `FIT INDIA`| Fit India Movement | Dr. Ahmad Zaman Khan (`AZK`) | 1 |

**Rooms Available**: `R1`, `R2`, `R3`, `214`, `313`, `314`, `513`, `Basement Lab`.

---

## 🧠 ADA Algorithm & Theory Guide (For Viva & Exams)

### 1. NP-Complete Problem Formulation
College Timetabling is an NP-Complete combinatorial optimization problem. We map it to **Graph Vertex Coloring**:
- **Vertices ($V$):** Each individual lecture unit ($V = 38$ in our demo).
- **Edges ($E$):** Mutual conflicts between two lectures ($E = 403$). An edge exists if:
  1. **Batch Conflict:** Same student batch cannot attend two classes simultaneously.
  2. **Teacher Conflict:** Same professor cannot teach two classes simultaneously (e.g., Dr. Juhi Jain cannot be in CSE-A and CSE-B at the same hour).
- **Colors ($K$):** Discrete Weekly Timeslots ($5 \text{ Days} \times 8 \text{ Periods} = 40 \text{ Slots}$).
- **Room Constraint:** Two classes scheduled at the same timeslot cannot share the same physical classroom.

### 2. Recursive Backtracking Template
```cpp
bool solve(int vertexIndex) {
    // BASE CASE: All vertices assigned
    if (vertexIndex == totalVertices) return true;

    int v = vertexOrder[vertexIndex];

    // TRY CANDIDATE COLORS (Timeslots)
    for (int slot = 0; slot < TOTAL_TIMESLOTS; slot++) {
        for (int room = 0; room < TOTAL_ROOMS; room++) {
            if (isSafe(v, slot, room)) {
                // 1. MAKE CHOICE
                assignedTimeslot[v] = slot;
                assignedRoom[v] = room;

                // 2. RECURSE
                if (solve(vertexIndex + 1)) return true;

                // 3. BACKTRACK (UNDO CHOICE)
                assignedTimeslot[v] = -1;
                assignedRoom[v] = -1;
            }
        }
    }
    return false; // Trigger backtracking to previous level
}
```

### 3. Welsh-Powell Degree Ordering Heuristic
Standard backtracking has worst-case time complexity $O(K^V)$.
By sorting vertices in **descending order of degree** (number of conflict edges):
- Highly constrained nodes (e.g. Dr. Juhi Jain, Dr. Geetanjali Bhola who teach multiple batches) are colored first.
- Infeasible subtrees are pruned immediately at the top of the search tree.
- Result: **0.12 ms execution time** with only **39 recursive steps**!

---

## 📁 File Structure

```
C:\Users\gaurav\Downloads\ada project\
│
├── algorithm.cpp    # The Brain: C++ Graph Coloring & Backtracking Solver
├── algorithm.exe    # Compiled binary executable
├── app.py           # The Bridge: Minimal Flask server
├── data.json        # The Database: Stores teachers, subjects, rooms & schedule
├── timetable.json   # Output generated by C++ solver
├── index.html       # The Frontend: Interactive Full-Week Dashboard
├── style.css        # Modern, responsive styling with clean UI
├── script.js        # Frontend Controller: API integration & grid rendering
└── README.md        # Comprehensive documentation & ADA Viva Guide
```
