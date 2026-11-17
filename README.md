# 🎓 College Timetable Generator
> **Design and Analysis of Algorithms (ADA) Project • B.Tech CSE (3rd Semester)**  
> Built with **Graph Coloring & Recursive Backtracking** running 100% client-side in vanilla JavaScript, HTML5, and CSS3.  
> ⚡ **Vercel & Static Host Ready**: Zero backend required. Simply open `index.html` or deploy directly to Vercel, Netlify, or GitHub Pages.

---

## 🏛️ Project Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Standalone Client-Side                          │
│               index.html • style.css • script.js                       │
├────────────────────────────────────────────────────────────────────────┤
│ 1. The Core UI:                                                        │
│    - Full-Week Grid (Monday–Friday, 9:00 AM – 6:00 PM)                 │
│    - Dedicated Lunch Break / Recess row (1:00 PM – 2:00 PM)            │
│    - Batch Selector (CSE-A / CSE-B / All Batches)                      │
│    - Live Search & Color-coded Subject Badges                          │
│                                                                        │
│ 2. The In-Browser Brain (Graph Coloring Solver):                       │
│    - Graph Vertex Coloring Constraint Satisfaction                     │
│    - Welsh-Powell Degree Ordering Heuristic (Most Constrained First)   │
│    - Recursive Backtracking with Adaptive Pruning                      │
│    - Solves 38 weekly lectures in < 15 milliseconds                    │
│                                                                        │
│ 3. Client Storage & Persistence:                                       │
│    - Hardcoded Delhi University (FoT) 2nd-Year Demo Data               │
│    - LocalStorage persistence for user edits (Teachers, Subjects, etc.)│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 How to Run Locally

### Option 1: Direct Browser Opening (No Server Needed!)
Simply double-click **`index.html`** or right-click and choose **Open with Google Chrome / Microsoft Edge**.  
The timetable generator will open and work immediately with zero configuration!

### Option 2: Run with a Local Static Server (VS Code / Python)
```bash
# Using Python's built-in static server (no Flask needed):
python -m http.server 3000
```
Then visit: `http://localhost:3000`

---

## ☁️ Deploying to Vercel (1-Click)

Because the project is now 100% static client-side:
1. Push this folder to a GitHub repository.
2. In [Vercel](https://vercel.com), click **Add New Project** and import your repository.
3. Keep the default settings (Framework Preset: **Other**, Root Directory: `./`).
4. Click **Deploy**. Your college timetable generator will be live worldwide in seconds!

> [!TIP]
> You can safely delete `app.py`, `algorithm.cpp`, `algorithm.exe`, and `data.json`. The application only requires `index.html`, `style.css`, and `script.js` to run completely!

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

### 1. Problem Formulation as Graph Vertex Coloring
University Timetabling is an NP-Complete problem. We model it as Graph Coloring $G = (V, E)$:
- **Vertices ($V = 38$):** Every individual lecture session in a week.
- **Edges ($E$ Conflicts):** An undirected edge exists if:
  1. *Batch Conflict:* Two lectures belong to the same batch (students cannot attend two classes at once).
  2. *Teacher Conflict:* Two lectures have the same faculty (Dr. Juhi Jain cannot teach CSE-A and CSE-B simultaneously).
- **Colors ($K = 40$):** Discrete time slots ($5 \text{ days} \times 8 \text{ periods}$).
- **Room Collision Constraint:** No two lectures in the same timeslot can share a physical classroom.

### 2. Welsh-Powell Degree Ordering Heuristic
Standard backtracking has worst-case time complexity $O(K^V)$.
By sorting vertices in **descending order of degree** (number of conflict edges):
- Highly constrained faculty (like Dr. Juhi Jain or Dr. Ahmad Zaman Khan who teach multiple batches) are scheduled first.
- Infeasible subtrees are pruned at the very top of the search tree.
- Result: **Execution finishes in < 15 ms in pure JavaScript!**
