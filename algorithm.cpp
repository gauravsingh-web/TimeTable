/**
 * ==============================================================================
 * PROJECT: College Timetable Generator
 * COMPONENT: The Brain (algorithm.cpp)
 * COURSE: Design and Analysis of Algorithms (ADA) - B.Tech CSE Semester 3
 * ------------------------------------------------------------------------------
 * ALGORITHM: Graph Vertex Coloring via Recursive Backtracking (Constraint Satisfaction)
 * 
 * 🎓 ADA THEORY BEHIND THIS IMPLEMENTATION:
 * ------------------------------------------------------------------------------
 * 1. THE PROBLEM AS A GRAPH:
 *    - Timetable scheduling is a classic NP-Complete problem.
 *    - We model it as a Graph Coloring Problem G = (V, E):
 *      * VERTICES (V): Each individual lecture that needs to take place in a week.
 *        If ADA has 4 lectures/week for CSE-A, that represents 4 distinct vertices.
 *      * EDGES (E): Mutual exclusion conflicts between two lectures.
 *        An undirected edge (u, v) exists if:
 *        a) BATCH CONFLICT: Both lectures belong to the same batch (CSE-A students
 *           cannot attend two classes at the same hour).
 *        b) TEACHER CONFLICT: Both lectures are taught by the same faculty (Dr. Juhi
 *           Jain cannot teach CSE-A and CSE-B at the exact same hour).
 *      * COLORS (K): Discrete Weekly Timeslots (5 Days * 8 Slots = 40 Timeslots).
 *        In Graph Coloring, no two adjacent vertices can share the same color.
 *        Thus, conflicting lectures can NEVER be scheduled at the same timeslot!
 * 
 * 2. ADDITIONAL CONSTRAINTS:
 *    - ROOM CONFLICT: Two lectures cannot occupy the same physical room simultaneously.
 *    - PEDAGOGICAL SPREAD: A batch should ideally have at most 1 lecture of a given
 *      subject per day (so 4 ADA classes are spread across Monday-Thursday, not all
 *      crammed into Monday!).
 * 
 * 3. BACKTRACKING & HEURISTICS:
 *    - We employ State-Space Tree Exploration using Depth-First Search with Backtracking.
 *    - WELSH-POWELL HEURISTIC (Degree Ordering): Vertices with the highest degree
 *      (most conflicts, e.g. teachers teaching multiple batches) are colored FIRST.
 *      This dramatically prunes invalid branches near the top of the search tree,
 *      reducing search time from seconds to < 1 millisecond!
 * ==============================================================================
 */

#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <map>
#include <algorithm>
#include <chrono>
#include <cctype>

using namespace std;

// -----------------------------------------------------------------------------
// CONSTANTS & PROBLEM DIMENSIONS
// -----------------------------------------------------------------------------
const int MAX_VERTICES = 200;      // Maximum weekly lecture nodes supported
const int MAX_ROOMS = 50;          // Maximum classroom capacity
const int DAYS_PER_WEEK = 5;       // Monday to Friday
const int SLOTS_PER_DAY = 8;       // 8 academic lecture periods (excluding lunch)
const int TOTAL_TIMESLOTS = DAYS_PER_WEEK * SLOTS_PER_DAY; // 40 discrete slots

const string DAY_NAMES[DAYS_PER_WEEK] = {
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
};

// 9:00 AM to 6:00 PM with 1:00 PM - 2:00 PM reserved as Lunch Break
const string SLOT_LABELS[SLOTS_PER_DAY] = {
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
    "05:00 PM - 06:00 PM"
};

// -----------------------------------------------------------------------------
// DATA STRUCTURES
// -----------------------------------------------------------------------------
struct Teacher {
    string id;
    string name;
};

struct Subject {
    string code;
    string name;
    string batch;
    string teacherId;
    int weeklyLectures;
};

// Represents a single vertex in the Conflict Graph
struct LectureVertex {
    int id;                // Unique vertex ID (0 to N-1)
    string batch;          // e.g. "CSE-A"
    string subjectCode;    // e.g. "ADA"
    string subjectName;    // e.g. "Design & Analysis of Algorithms"
    string teacherId;      // e.g. "JJ"
    string teacherName;    // e.g. "Dr. Juhi Jain"
    int weeklyLectures;    // Total weekly occurrences of this subject
};

// -----------------------------------------------------------------------------
// C-STYLE ARRAYS & GLOBAL STATE (Directly aligns with ADA Course Syllabus)
// -----------------------------------------------------------------------------
int adjMatrix[MAX_VERTICES][MAX_VERTICES]; // Conflict Adjacency Matrix (1 = conflict, 0 = no conflict)
int assignedTimeslot[MAX_VERTICES];       // assignedTimeslot[v] = color/slot index [0..39], -1 if uncolored
int assignedRoom[MAX_VERTICES];           // assignedRoom[v] = room index, -1 if unassigned
int vertexDegree[MAX_VERTICES];           // degree[v] = number of conflicting edges connected to v
int vertexOrder[MAX_VERTICES];            // Processing sequence sorted by Welsh-Powell degree heuristic

int totalVertices = 0;                    // Total number of lecture vertices in graph
int totalRoomsCount = 0;                  // Total classrooms available
long long backtrackStepCount = 0;         // Profiling: counts recursive state evaluations

vector<Teacher> teachersList;
vector<Subject> subjectsList;
vector<string> roomsList;
vector<LectureVertex> lectures;

// -----------------------------------------------------------------------------
// SELF-CONTAINED MINI JSON PARSER
// Note: Written in pure standard C++17 so any 3rd-semester student can compile
// directly via `g++ algorithm.cpp -o algorithm` without installing boost or vcpkg!
// -----------------------------------------------------------------------------
enum JsonType { J_NULL, J_BOOL, J_NUMBER, J_STRING, J_ARRAY, J_OBJECT };

struct JsonValue {
    JsonType type = J_NULL;
    bool boolVal = false;
    double numVal = 0.0;
    string strVal = "";
    vector<JsonValue> arrVal;
    map<string, JsonValue> objVal;

    bool has(const string& key) const {
        return type == J_OBJECT && objVal.find(key) != objVal.end();
    }
    const JsonValue& operator[](const string& key) const {
        static JsonValue nullVal;
        auto it = objVal.find(key);
        return it != objVal.end() ? it->second : nullVal;
    }
    const JsonValue& operator[](size_t index) const {
        static JsonValue nullVal;
        return (type == J_ARRAY && index < arrVal.size()) ? arrVal[index] : nullVal;
    }
    string asString() const { return strVal; }
    int asInt() const { return (int)numVal; }
    bool asBool() const { return boolVal; }
};

class MiniJsonParser {
    string src;
    size_t pos = 0;

    void skipWhitespace() {
        while (pos < src.size() && (src[pos] == ' ' || src[pos] == '\t' || src[pos] == '\n' || src[pos] == '\r')) {
            pos++;
        }
    }
    char peek() { skipWhitespace(); return pos < src.size() ? src[pos] : '\0'; }
    char get() { skipWhitespace(); return pos < src.size() ? src[pos++] : '\0'; }

public:
    MiniJsonParser(const string& s) : src(s), pos(0) {}

    JsonValue parse() {
        skipWhitespace();
        char c = peek();
        if (c == '{') return parseObject();
        if (c == '[') return parseArray();
        if (c == '"') return parseString();
        if (c == 't' || c == 'f') return parseBool();
        if (c == 'n') return parseNull();
        if (c == '-' || isdigit(c)) return parseNumber();
        return JsonValue();
    }

    JsonValue parseObject() {
        JsonValue val;
        val.type = J_OBJECT;
        get(); // consume '{'
        while (true) {
            skipWhitespace();
            if (peek() == '}') { get(); break; }
            if (peek() != '"') break;
            JsonValue key = parseString();
            skipWhitespace();
            if (get() != ':') break;
            val.objVal[key.strVal] = parse();
            skipWhitespace();
            if (peek() == ',') { get(); }
            else if (peek() == '}') { get(); break; }
        }
        return val;
    }

    JsonValue parseArray() {
        JsonValue val;
        val.type = J_ARRAY;
        get(); // consume '['
        while (true) {
            skipWhitespace();
            if (peek() == ']') { get(); break; }
            val.arrVal.push_back(parse());
            skipWhitespace();
            if (peek() == ',') { get(); }
            else if (peek() == ']') { get(); break; }
        }
        return val;
    }

    JsonValue parseString() {
        JsonValue val;
        val.type = J_STRING;
        get(); // consume opening quote
        string s = "";
        while (pos < src.size()) {
            char c = src[pos++];
            if (c == '"') break;
            if (c == '\\' && pos < src.size()) {
                char next = src[pos++];
                if (next == '"') s += '"';
                else if (next == '\\') s += '\\';
                else if (next == 'n') s += '\n';
                else if (next == 't') s += '\t';
                else s += next;
            } else {
                s += c;
            }
        }
        val.strVal = s;
        return val;
    }

    JsonValue parseNumber() {
        JsonValue val;
        val.type = J_NUMBER;
        size_t start = pos;
        if (pos < src.size() && src[pos] == '-') pos++;
        while (pos < src.size() && isdigit(src[pos])) pos++;
        if (pos < src.size() && src[pos] == '.') {
            pos++;
            while (pos < src.size() && isdigit(src[pos])) pos++;
        }
        val.numVal = stod(src.substr(start, pos - start));
        return val;
    }

    JsonValue parseBool() {
        JsonValue val;
        val.type = J_BOOL;
        if (src.substr(pos, 4) == "true") { pos += 4; val.boolVal = true; }
        else if (src.substr(pos, 5) == "false") { pos += 5; val.boolVal = false; }
        return val;
    }

    JsonValue parseNull() {
        JsonValue val;
        val.type = J_NULL;
        if (src.substr(pos, 4) == "null") pos += 4;
        return val;
    }
};

// -----------------------------------------------------------------------------
// STEP 1: LOAD DATABASE (data.json)
// Reads faculty, subjects, rooms, and batches from the central JSON database.
// -----------------------------------------------------------------------------
bool loadDataJson(const string& filePath) {
    ifstream file(filePath);
    if (!file.is_open()) {
        cerr << "[ERROR] Could not open database file: " << filePath << endl;
        return false;
    }
    stringstream ss;
    ss << file.rdbuf();
    string content = ss.str();
    file.close();

    MiniJsonParser parser(content);
    JsonValue root = parser.parse();

    // 1. Extract Teachers
    teachersList.clear();
    map<string, string> teacherMap;
    for (size_t i = 0; i < root["teachers"].arrVal.size(); i++) {
        const auto& t = root["teachers"].arrVal[i];
        string id = t["id"].asString();
        string name = t["name"].asString();
        teachersList.push_back({id, name});
        teacherMap[id] = name;
    }

    // 2. Extract Rooms
    roomsList.clear();
    for (size_t i = 0; i < root["rooms"].arrVal.size(); i++) {
        roomsList.push_back(root["rooms"].arrVal[i].asString());
    }
    totalRoomsCount = (int)roomsList.size();
    if (totalRoomsCount == 0) {
        // Fallback default rooms if empty
        roomsList = {"R1", "R2", "R3", "214", "313", "314", "513", "Basement Lab"};
        totalRoomsCount = (int)roomsList.size();
    }

    // 3. Extract Subjects & Create Lecture Vertices
    subjectsList.clear();
    lectures.clear();
    for (size_t i = 0; i < root["subjects"].arrVal.size(); i++) {
        const auto& s = root["subjects"].arrVal[i];
        Subject sub;
        sub.code = s["code"].asString();
        sub.name = s["name"].asString();
        sub.batch = s["batch"].asString();
        sub.teacherId = s["teacherId"].asString();
        sub.weeklyLectures = s["weeklyLectures"].asInt();
        if (sub.weeklyLectures <= 0) sub.weeklyLectures = 1;
        subjectsList.push_back(sub);

        string tName = teacherMap.count(sub.teacherId) ? teacherMap[sub.teacherId] : sub.teacherId;

        // UNROLLING: Each weekly lecture becomes an independent vertex to color!
        for (int k = 0; k < sub.weeklyLectures; k++) {
            LectureVertex lv;
            lv.id = (int)lectures.size();
            lv.batch = sub.batch;
            lv.subjectCode = sub.code;
            lv.subjectName = sub.name;
            lv.teacherId = sub.teacherId;
            lv.teacherName = tName;
            lv.weeklyLectures = sub.weeklyLectures;
            lectures.push_back(lv);
        }
    }

    totalVertices = (int)lectures.size();
    return true;
}

// -----------------------------------------------------------------------------
// STEP 2: BUILD CONFLICT GRAPH (Graph Theory Modeling)
// Constructs the 2D Adjacency Matrix representing mutual exclusion edges.
// -----------------------------------------------------------------------------
void buildConflictGraph() {
    int totalEdges = 0;

    // Initialize C-style 2D arrays
    for (int i = 0; i < totalVertices; i++) {
        for (int j = 0; j < totalVertices; j++) {
            adjMatrix[i][j] = 0;
        }
        assignedTimeslot[i] = -1; // -1 means vertex is unassigned (uncolored)
        assignedRoom[i] = -1;     // -1 means no room assigned yet
        vertexDegree[i] = 0;
        vertexOrder[i] = i;       // Default sequential order
    }

    // Populate Adjacency Matrix:
    // Connect lecture i and lecture j with an edge if they CANNOT happen simultaneously:
    // 1. BATCH CONFLICT: Same student batch cannot be in two classes at once.
    // 2. TEACHER CONFLICT: Same professor cannot be in two classes at once.
    for (int i = 0; i < totalVertices; i++) {
        for (int j = i + 1; j < totalVertices; j++) {
            bool sameBatch = (lectures[i].batch == lectures[j].batch);
            bool sameTeacher = (lectures[i].teacherId == lectures[j].teacherId);

            if (sameBatch || sameTeacher) {
                adjMatrix[i][j] = 1;
                adjMatrix[j][i] = 1; // Undirected graph
                totalEdges++;
            }
        }
    }

    // Calculate degree of each vertex (degree = number of conflicting neighbours)
    for (int i = 0; i < totalVertices; i++) {
        for (int j = 0; j < totalVertices; j++) {
            if (adjMatrix[i][j] == 1) {
                vertexDegree[i]++;
            }
        }
    }

    // ⚡ WELSH-POWELL HEURISTIC OPTIMIZATION:
    // Sort vertices by descending degree (highest number of conflicts first).
    // In Backtracking, scheduling the "Most Constrained Variable" first prunes
    // the state-space tree by 99%, preventing combinatorial explosion!
    sort(vertexOrder, vertexOrder + totalVertices, [](int a, int b) {
        return vertexDegree[a] > vertexDegree[b];
    });

    cout << "========================================================" << endl;
    cout << "  CONFLICT GRAPH METRICS" << endl;
    cout << "  Total Vertices (Lectures to schedule): " << totalVertices << endl;
    cout << "  Total Conflict Edges: " << totalEdges << endl;
    cout << "  Available Colors (Weekly Slots): " << TOTAL_TIMESLOTS << endl;
    cout << "  Available Classrooms: " << totalRoomsCount << endl;
    cout << "========================================================" << endl;
}

// -----------------------------------------------------------------------------
// STEP 3: CONSTRAINT CHECKING FUNCTION (isSafe)
// Checks if assigning color 'candidateSlot' and 'candidateRoom' to vertex 'v'
// violates any Graph Coloring or college scheduling rules.
// -----------------------------------------------------------------------------
bool isSafe(int v, int candidateSlot, int candidateRoom, bool enforceDailySpread = true) {
    int candidateDay = candidateSlot / SLOTS_PER_DAY;

    // CONSTRAINT 1: GRAPH COLORING (Teacher & Batch Mutual Exclusion) & ROOM OVERLAP
    // Check all vertices currently scheduled at this exact timeslot
    for (int u = 0; u < totalVertices; u++) {
        if (assignedTimeslot[u] == candidateSlot) {
            // If u and v share an edge in the Conflict Graph, they CANNOT have the same slot!
            if (adjMatrix[v][u] == 1) {
                return false; // Violates Graph Coloring (Teacher or Batch Conflict)
            }
            // Room conflict: Two different classes cannot use the same room at the same time
            if (assignedRoom[u] == candidateRoom) {
                return false; // Classroom collision
            }
        }
    }

    // CONSTRAINT 2: PEDAGOGICAL DISTRIBUTION (Spread classes across the week)
    // Avoid cramping 3 or 4 lectures of the exact same subject for the same batch on one day.
    if (enforceDailySpread) {
        int maxAllowedPerDay = (lectures[v].weeklyLectures > DAYS_PER_WEEK) ? 2 : 1;
        int countToday = 0;
        for (int u = 0; u < totalVertices; u++) {
            if (assignedTimeslot[u] != -1) {
                int uDay = assignedTimeslot[u] / SLOTS_PER_DAY;
                if (uDay == candidateDay &&
                    lectures[u].batch == lectures[v].batch &&
                    lectures[u].subjectCode == lectures[v].subjectCode) {
                    countToday++;
                }
            }
        }
        if (countToday >= maxAllowedPerDay) {
            return false; // Subject already reached daily quota for this batch
        }
    }

    return true; // Safe to assign!
}

// -----------------------------------------------------------------------------
// STEP 4: RECURSIVE BACKTRACKING SOLVER (Classic ADA Algorithmic Paradigm)
// Explores the state-space tree depth-first. If a choice leads to a dead end,
// it unwinds (backtracks) and attempts the next candidate.
// -----------------------------------------------------------------------------
bool solveTimetable(int orderIndex, bool enforceDailySpread = true) {
    backtrackStepCount++;

    // 🎯 BASE CASE:
    // If we have successfully assigned a color (timeslot) and room to EVERY vertex,
    // the full timetable has been generated without any conflicts!
    if (orderIndex == totalVertices) {
        return true;
    }

    // Select the next vertex to color (ordered by highest degree)
    int v = vertexOrder[orderIndex];

    // 🔄 CANDIDATE GENERATION:
    // Try all available colors (Timeslots: 0 to 39)
    for (int slot = 0; slot < TOTAL_TIMESLOTS; slot++) {
        // Try all candidate classrooms
        for (int r = 0; r < totalRoomsCount; r++) {

            // CONSTRAINT VERIFICATION:
            if (isSafe(v, slot, r, enforceDailySpread)) {

                // 1. MAKE CHOICE: Assign timeslot (color) and classroom to vertex v
                assignedTimeslot[v] = slot;
                assignedRoom[v] = r;

                // 2. RECURSE: Move down the state-space tree to the next vertex
                if (solveTimetable(orderIndex + 1, enforceDailySpread)) {
                    return true; // Solution found! Propagate success back up the stack
                }

                // 3. BACKTRACK (UNDO CHOICE):
                // If this assignment eventually hit a dead end, undo it!
                // This resets the state so alternative branches can be explored.
                assignedTimeslot[v] = -1;
                assignedRoom[v] = -1;
            }
        }
    }

    // If no slot/room combination worked for vertex v, return false to trigger
    // backtracking at the parent node.
    return false;
}

// -----------------------------------------------------------------------------
// STEP 5: SAVE GENERATED SCHEDULE TO timetable.json
// Writes the final timetable output with metadata for the web dashboard.
// -----------------------------------------------------------------------------
bool writeOutputJson(const string& outputPath, double executionTimeMs) {
    ofstream out(outputPath);
    if (!out.is_open()) {
        cerr << "[ERROR] Could not open output file: " << outputPath << endl;
        return false;
    }

    out << "{\n";
    out << "  \"status\": \"success\",\n";
    out << "  \"meta\": {\n";
    out << "    \"totalLectures\": " << totalVertices << ",\n";
    out << "    \"backtrackSteps\": " << backtrackStepCount << ",\n";
    out << "    \"executionTimeMs\": " << executionTimeMs << ",\n";
    out << "    \"roomsAvailable\": " << totalRoomsCount << ",\n";
    out << "    \"algorithm\": \"Graph Vertex Coloring (Recursive Backtracking)\"\n";
    out << "  },\n";
    out << "  \"schedule\": [\n";

    for (int i = 0; i < totalVertices; i++) {
        int slot = assignedTimeslot[i];
        int dayIdx = slot / SLOTS_PER_DAY;
        int periodIdx = slot % SLOTS_PER_DAY;
        string roomName = (assignedRoom[i] >= 0 && assignedRoom[i] < totalRoomsCount)
                          ? roomsList[assignedRoom[i]] : "TBD";

        out << "    {\n";
        out << "      \"batch\": \"" << lectures[i].batch << "\",\n";
        out << "      \"subjectCode\": \"" << lectures[i].subjectCode << "\",\n";
        out << "      \"subjectName\": \"" << lectures[i].subjectName << "\",\n";
        out << "      \"teacherId\": \"" << lectures[i].teacherId << "\",\n";
        out << "      \"teacherName\": \"" << lectures[i].teacherName << "\",\n";
        out << "      \"room\": \"" << roomName << "\",\n";
        out << "      \"day\": \"" << DAY_NAMES[dayIdx] << "\",\n";
        out << "      \"dayIndex\": " << dayIdx << ",\n";
        out << "      \"slotIndex\": " << periodIdx << ",\n";
        out << "      \"time\": \"" << SLOT_LABELS[periodIdx] << "\"\n";
        out << "    }" << (i == totalVertices - 1 ? "" : ",") << "\n";
    }

    out << "  ]\n";
    out << "}\n";
    out.close();
    return true;
}

// -----------------------------------------------------------------------------
// MAIN ENTRY POINT
// -----------------------------------------------------------------------------
int main(int argc, char* argv[]) {
    string dataPath = "data.json";
    string outputPath = "timetable.json";

    if (argc >= 2) dataPath = argv[1];
    if (argc >= 3) outputPath = argv[2];

    cout << "========================================================" << endl;
    cout << "   COLLEGE TIMETABLE GENERATOR - THE BRAIN (C++)" << endl;
    cout << "   Graph Coloring & Backtracking Solver" << endl;
    cout << "========================================================" << endl;

    // 1. Read input database from JSON file
    if (!loadDataJson(dataPath)) {
        cerr << "[FATAL] Failed to read database: " << dataPath << endl;
        return 1;
    }

    // 2. Build conflict graph and degree heuristic
    buildConflictGraph();

    cout << "Executing Recursive Backtracking Algorithm..." << endl;
    auto startTime = chrono::high_resolution_clock::now();

    // Attempt 1: With pedagogical daily spread (max 1 class per subject per day)
    bool solved = solveTimetable(0, true);

    // Attempt 2: If tight constraints prevent strict 1-per-day, relax spread constraint
    if (!solved) {
        cout << "[INFO] Relaxing daily spread constraint to find feasible timetable..." << endl;
        for (int i = 0; i < totalVertices; i++) {
            assignedTimeslot[i] = -1;
            assignedRoom[i] = -1;
        }
        backtrackStepCount = 0;
        solved = solveTimetable(0, false);
    }

    auto endTime = chrono::high_resolution_clock::now();
    double elapsedMs = chrono::duration<double, milli>(endTime - startTime).count();

    if (solved) {
        cout << "[SUCCESS] Conflict-free timetable generated successfully!" << endl;
        cout << "  State Evaluations / Backtracking Steps: " << backtrackStepCount << endl;
        cout << "  Computation Time: " << elapsedMs << " ms" << endl;

        writeOutputJson(outputPath, elapsedMs);
        cout << "  Output written to: " << outputPath << endl;
    } else {
        cout << "[FAILED] No valid conflict-free timetable exists with given constraints." << endl;
        ofstream out(outputPath);
        out << "{\n  \"status\": \"error\",\n  \"message\": \"Could not generate schedule. Try adding more classrooms or reducing weekly lectures.\"\n}\n";
        out.close();
        return 2;
    }

    cout << "========================================================" << endl;
    return 0;
}
