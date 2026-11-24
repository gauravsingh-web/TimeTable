# 🏛️ Faculty of Technology Timetable (University of Delhi)
> **Design and Analysis of Algorithms (ADA) Project • B.Tech (University of Delhi, FoT)**  
> Built with **Graph Coloring & Backtracking Solver** running 100% client-side in vanilla JavaScript, HTML5, and CSS3.  
> ⚡ **Vercel & Static Host Ready**: Zero backend required. Simply open `index.html` or deploy directly to Vercel, Netlify, or GitHub Pages.

---

## 🏛️ Project Architecture & Features

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Standalone Client-Side                          │
│               index.html • style.css • script.js • data.json           │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Complete DU Faculty of Technology Dataset:                          │
│    - 22 Batches: 1st, 2nd, 3rd, and 4th Year across CSE, ECE, and EE   │
│    - 53 Faculty Members with official acronyms and full titles         │
│    - 23 Classrooms & Specialized Labs (Basement Lab, R1, 513, etc.)    │
│    - Support for Sub-Sections / Groups: A1 vs A2, B1 vs B2, & Whole    │
│                                                                        │
│ 2. The In-Browser Brain (Graph Coloring Solver):                       │
│    - Graph Vertex Coloring Constraint Satisfaction                     │
│    - Welsh-Powell Degree Ordering Heuristic (Most Constrained First)   │
│    - Sub-Section Mutual Exclusion & Parallel Lab Scheduling:           │
│      * A1 and A2 can run in parallel if rooms and teachers differ.    │
│      * Whole section ("All") blocks all sub-sections for that batch.   │
│      * Same teacher or same room prevents parallel scheduling.         │
│    - Randomized Timeslot Shuffling for balanced weekly distribution     │
│    - Solves hundreds of lecture vertices in < 60 milliseconds          │
│                                                                        │
│ 3. Client Storage & Interactive Management:                            │
│    - One-click "Load DU FoT Demo Data" button                          │
│    - Sub-Section Filter: Whole Section, Group A1/B1, Group A2/B2, All │
│    - Inline Data Management for Faculty, Subjects, and Rooms           │
│    - LocalStorage persistence for user additions & edits               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 How to Run Locally

### Option 1: Direct Browser Opening (No Server Needed!)
Simply double-click **`index.html`** or right-click and choose **Open with Google Chrome / Microsoft Edge**.  
The timetable generator will open and work immediately with zero configuration!

### Option 2: Run with a Local Static Server (VS Code / Python)
```bash
# Using Python's built-in static server:
python -m http.server 3000
```
Then visit: `http://localhost:3000`

---

## ☁️ Deploying to Vercel (1-Click)

Because the project is 100% static client-side:
1. Push this folder to a GitHub repository.
2. In [Vercel](https://vercel.com), click **Add New Project** and import your repository.
3. Keep default settings (Framework Preset: **Other**, Root Directory: `./`).
4. Click **Deploy**. Your timetable generator will be live worldwide in seconds!

---

## 👥 Faculty Directory (53 Faculty Members)

| Acronym | Faculty Member | Acronym | Faculty Member |
| :--- | :--- | :--- | :--- |
| `ART` | Dr. Anuradha Tomar | `AT` | Dr. Arjun Tyagi |
| `JP` | Dr. Jeetendra Prasad | `RR` | Dr. Rekha R. |
| `AKS` | Mr. Ajay Kumar Sahu | `AP` | Dr. Ashutosh Pandey |
| `VKG` | Dr. Vikram Kumar Gedi | `PT` | Dr. Pratima |
| `MS` | Ms. Manisha Singh | `AK` | Dr. Amit Kumar |
| `RH` | Ms. Reha | `UJS` | Dr. Ujjal Sur |
| `DP` | Dr. Deepika | `GB` | Ms. Geetanjali Bhola |
| `KJ` | Dr. Kajal Kumari | `VA` | Dr. Vijay Azad |
| `VK` | Dr. Vandana Kumari | `TK` | Ms. Tanya Khaneja |
| `TNK` | Ms. Tanishka | `KJL` | Dr. Kajol |
| `VJ` | Prof. Vanita Jain | `SJY` | Dr. Sanjeev Yadav |
| `RHS` | Dr. Rahul Solanki | `ANJ` | Dr. Anuj Kumar |
| `ANK` | Dr. Ankit | `SY` | Dr. Sangeeta Yadav |
| `BR` | Dr. Bhawna Rawat | `AKG` | Dr. Ajay Kumar Gupta |
| `GS` | Dr. Gurinder Singh | `SW` | Dr. Sweta Rani |
| `JJ` | Dr. Juhi Jain | `JS` | Dr. Jatin Sharma |
| `US` | Mr. Unmesh Shukla | `UK` | Dr. Utkarsh |
| `RTS` | Ms. Ritika Sharma | `MV` | Dr. Manu Vardhan |
| `DRS` | Dr. Diptiranjan Samantray | `DRB` | Prof. D.R. Bhaskar |
| `EKL` | Dr. Eklavya | `PKS` | Prof. P.K. Singh |
| `BA` | Prof. Bhawna Agrawal | `RJS` | Dr. Ranjeet Singh |
| `SNK` | Ms. Shivani Kumari | `RS` | Prof. Raj Senani |
| `KS` | Dr. Khushwant Sehra | `VS` | Dr. Varun Saxena |
| `GSC` | Prof. G.S. Chilana | `SK` | Dr. Sunil Kumar |
| `AZK` | Dr. Ahmad Zaman Khan | `UDS` | Dr. Udita Sharma |
| `SG` | Dr. Shubham Gupta | `AKT` | Prof. A.K. Tandon |
| `SMT` | Dr. Sumit | | |

---

## 🏢 Classrooms & Specialized Labs (23 Rooms)
`Basement Lab`, `R1`, `R2`, `R3`, `G01`, `203`, `204`, `211`, `212`, `213`, `214`, `216`, `217`, `219`, `303`, `304`, `311`, `312`, `313`, `314`, `317`, `503`, `513`.

---

## 🧠 Sub-Section Graph Coloring & Backtracking Logic (For Viva & Exams)

### 1. Graph Model $G = (V, E)$
- **Vertices ($V$):** Each weekly lecture or practical lab session.
- **Edges ($E$ - Conflict Matrix `adj[i][j]`):**
  1. **Teacher Conflict:** `lectures[i].teacherId === lectures[j].teacherId` (a professor cannot teach two batches at once).
  2. **Cohort Conflict:**
     - If both belong to the same parent batch (e.g. `2nd Year CSE-A`):
       - If either is `subSection: "All"`, all students must attend, so an edge is formed with every class of that batch.
       - If both share the same sub-section (`A1` vs `A1`, or `B1` vs `B1`), students cannot be in two places at once $\rightarrow$ edge formed.
       - If they are disjoint sub-sections (`A1` vs `A2`): **NO edge is formed**.
  3. **Room Conflict:** Enforced inside `isSafe()` — two classes cannot occupy the same classroom/lab at the same time slot.

### 2. Parallel Practical Scheduling
Because `adj[A1][A2] = 0`, the solver allows group `A1` (e.g. `DSD (P)` in `Basement Lab` with Dr. Bhawna Rawat) and group `A2` (e.g. `DBMS (P)` in `R1` with Ms. Geetanjali Bhola) to be scheduled in the **same timeslot** whenever different teachers and rooms are available.

### 3. Welsh-Powell Degree Ordering & Timeslot Shuffling
- Vertices are sorted in descending order of degree (most constrained faculty and whole-class lectures first).
- Available timeslots and rooms are randomized (shuffled) before each assignment branch to prevent morning clustering and ensure natural distribution across Monday to Friday.
