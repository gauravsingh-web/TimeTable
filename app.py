"""
==============================================================================
PROJECT: College Timetable Generator
COMPONENT: The Bridge (app.py)
------------------------------------------------------------------------------
A minimal Python Flask server.
Its ONLY job is to:
1. Serve the frontend (index.html, style.css, script.js).
2. Save form inputs to the JSON database (data.json).
3. Execute the compiled C++ algorithm when requested.
==============================================================================
"""

import os
import json
import subprocess
import platform
from flask import Flask, jsonify, request, send_from_directory

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'data.json')
TIMETABLE_FILE = os.path.join(BASE_DIR, 'timetable.json')
CPP_SOURCE = os.path.join(BASE_DIR, 'algorithm.cpp')

# Determine C++ executable name depending on Operating System
if platform.system() == "Windows":
    CPP_EXE = os.path.join(BASE_DIR, 'algorithm.exe')
else:
    CPP_EXE = os.path.join(BASE_DIR, 'algorithm')

app = Flask(__name__, static_folder=BASE_DIR, static_url_path='')

# -----------------------------------------------------------------------------
# HARDCODED DU FoT 2ND-YEAR DEMO DATASET (Strictly as specified)
# -----------------------------------------------------------------------------
DU_FOT_DEMO_DATA = {
    "batches": ["CSE-A", "CSE-B"],
    "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "timeslots": [
        {"slot": 0, "name": "09:00 AM - 10:00 AM", "isLunch": False},
        {"slot": 1, "name": "10:00 AM - 11:00 AM", "isLunch": False},
        {"slot": 2, "name": "11:00 AM - 12:00 PM", "isLunch": False},
        {"slot": 3, "name": "12:00 PM - 01:00 PM", "isLunch": False},
        {"slot": 4, "name": "01:00 PM - 02:00 PM", "isLunch": True},
        {"slot": 5, "name": "02:00 PM - 03:00 PM", "isLunch": False},
        {"slot": 6, "name": "03:00 PM - 04:00 PM", "isLunch": False},
        {"slot": 7, "name": "04:00 PM - 05:00 PM", "isLunch": False},
        {"slot": 8, "name": "05:00 PM - 06:00 PM", "isLunch": False}
    ],
    "teachers": [
        {"id": "JJ", "name": "Dr. Juhi Jain"},
        {"id": "GB", "name": "Dr. Geetanjali Bhola"},
        {"id": "BR", "name": "Dr. Bhawna Rawat"},
        {"id": "AZK", "name": "Dr. Ahmad Zaman Khan"},
        {"id": "UDS", "name": "Dr. Udita Sharma"},
        {"id": "AP", "name": "Dr. Ashutosh Pandey"},
        {"id": "AKS", "name": "Mr. Ajay Kumar Sahu"},
        {"id": "EKL", "name": "Dr. Eklavya"}
    ],
    "subjects": [
        # CSE-A Subjects
        {"code": "ADA", "name": "Design & Analysis of Algorithms", "batch": "CSE-A", "teacherId": "JJ", "weeklyLectures": 4},
        {"code": "DBMS", "name": "Database Management Systems", "batch": "CSE-A", "teacherId": "GB", "weeklyLectures": 4},
        {"code": "DSD", "name": "Digital System Design", "batch": "CSE-A", "teacherId": "BR", "weeklyLectures": 4},
        {"code": "PSCS-A", "name": "Probability & Statistics for CS", "batch": "CSE-A", "teacherId": "AZK", "weeklyLectures": 3},
        {"code": "EVS-2", "name": "Environmental Science - II", "batch": "CSE-A", "teacherId": "UDS", "weeklyLectures": 2},
        {"code": "FIT INDIA", "name": "Fit India Movement", "batch": "CSE-A", "teacherId": "AP", "weeklyLectures": 1},
        # CSE-B Subjects
        {"code": "ADA", "name": "Design & Analysis of Algorithms", "batch": "CSE-B", "teacherId": "JJ", "weeklyLectures": 4},
        {"code": "DBMS", "name": "Database Management Systems", "batch": "CSE-B", "teacherId": "GB", "weeklyLectures": 4},
        {"code": "DSD", "name": "Digital System Design", "batch": "CSE-B", "teacherId": "BR", "weeklyLectures": 4},
        {"code": "PSCS-B", "name": "Probability & Statistics for CS", "batch": "CSE-B", "teacherId": "AZK", "weeklyLectures": 3},
        {"code": "FSS", "name": "Full Stack Specialization", "batch": "CSE-B", "teacherId": "AKS", "weeklyLectures": 2},
        {"code": "EVS-2", "name": "Environmental Science - II", "batch": "CSE-B", "teacherId": "EKL", "weeklyLectures": 2},
        {"code": "FIT INDIA", "name": "Fit India Movement", "batch": "CSE-B", "teacherId": "AZK", "weeklyLectures": 1}
    ],
    "rooms": ["R1", "R2", "R3", "214", "313", "314", "513", "Basement Lab"],
    "schedule": []
}


def read_data():
    """Reads data.json from disk, initializing with demo data if missing."""
    if not os.path.exists(DATA_FILE):
        write_data(DU_FOT_DEMO_DATA)
        return DU_FOT_DEMO_DATA
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading {DATA_FILE}: {e}")
        return DU_FOT_DEMO_DATA


def write_data(data):
    """Writes the full database dictionary to data.json."""
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)


# -----------------------------------------------------------------------------
# FRONTEND ROUTE
# -----------------------------------------------------------------------------
@app.route('/')
def index():
    """Serves the main interactive dashboard."""
    return send_from_directory(BASE_DIR, 'index.html')


# -----------------------------------------------------------------------------
# API ROUTES (Database Operations & Execution Bridge)
# -----------------------------------------------------------------------------
@app.route('/api/data', methods=['GET'])
def get_data():
    """Fetches teachers, subjects, rooms, batches, and current schedule."""
    data = read_data()
    return jsonify({"status": "success", "data": data})


@app.route('/api/data', methods=['POST'])
def save_data():
    """Saves form inputs directly to data.json."""
    payload = request.get_json()
    if not payload:
        return jsonify({"status": "error", "message": "Invalid JSON body"}), 400
    
    current_data = read_data()
    # Update provided keys while preserving others
    for key in ['teachers', 'subjects', 'rooms', 'batches', 'schedule']:
        if key in payload:
            current_data[key] = payload[key]

    write_data(current_data)
    return jsonify({"status": "success", "message": "Database updated successfully", "data": current_data})


@app.route('/api/demo-data', methods=['POST'])
def load_demo_data():
    """Resets data.json with the pre-configured DU FoT 2nd-Year Demo Data."""
    # Preserve any existing schedule if desired, or reset cleanly
    demo = dict(DU_FOT_DEMO_DATA)
    write_data(demo)
    return jsonify({
        "status": "success",
        "message": "Loaded Faculty of Technology (DU) Demo Data successfully!",
        "data": demo
    })


@app.route('/api/generate', methods=['POST'])
def generate_timetable():
    """
    Executes the compiled C++ program (The Brain).
    1. Checks if algorithm.exe exists; if not, compiles algorithm.cpp.
    2. Runs the compiled executable.
    3. Reads output from timetable.json.
    4. Saves the generated schedule back into data.json.
    5. Returns timetable to the frontend.
    """
    # Auto-compile C++ source if binary does not exist
    if not os.path.exists(CPP_EXE):
        print(f"Executable {CPP_EXE} not found. Attempting automatic g++ compilation...")
        try:
            compile_cmd = ["g++", "-std=c++17", "-O2", CPP_SOURCE, "-o", CPP_EXE]
            comp_res = subprocess.run(compile_cmd, cwd=BASE_DIR, capture_output=True, text=True)
            if comp_res.returncode != 0:
                return jsonify({
                    "status": "error",
                    "message": "C++ compilation failed! Please compile algorithm.cpp manually using g++.",
                    "details": comp_res.stderr
                }), 500
        except Exception as e:
            return jsonify({
                "status": "error",
                "message": f"Compilation error: {str(e)}"
            }), 500

    # Execute compiled C++ solver
    try:
        proc = subprocess.run(
            [CPP_EXE, DATA_FILE, TIMETABLE_FILE],
            cwd=BASE_DIR,
            capture_output=True,
            text=True,
            timeout=10
        )
        
        stdout_text = proc.stdout
        stderr_text = proc.stderr
        
        if proc.returncode != 0:
            return jsonify({
                "status": "error",
                "message": "The C++ backtracking algorithm could not resolve a conflict-free schedule.",
                "stdout": stdout_text,
                "stderr": stderr_text
            }), 400

        # Read the timetable.json generated by C++
        if not os.path.exists(TIMETABLE_FILE):
            return jsonify({
                "status": "error",
                "message": "timetable.json was not generated by algorithm.exe."
            }), 500

        with open(TIMETABLE_FILE, 'r', encoding='utf-8') as f:
            timetable_output = json.load(f)

        # Sync schedule back into data.json (single database requirement)
        current_data = read_data()
        current_data['schedule'] = timetable_output.get('schedule', [])
        write_data(current_data)

        return jsonify({
            "status": "success",
            "message": "Conflict-free timetable generated successfully using Graph Coloring!",
            "meta": timetable_output.get('meta', {}),
            "schedule": timetable_output.get('schedule', []),
            "stdout": stdout_text
        })

    except subprocess.TimeoutExpired:
        return jsonify({
            "status": "error",
            "message": "Algorithm execution timed out (exceeded 10s limit)."
        }), 500
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Execution error: {str(e)}"
        }), 500


# -----------------------------------------------------------------------------
# SERVER RUNNER
# -----------------------------------------------------------------------------
if __name__ == '__main__':
    # Initialize data.json if not present
    if not os.path.exists(DATA_FILE):
        write_data(DU_FOT_DEMO_DATA)
        
    print("=" * 60)
    print(" 🚀 College Timetable Generator - Server Started")
    print(" 🌐 Access Dashboard at: http://127.0.0.1:5000")
    print(" 📁 Working Directory: ", BASE_DIR)
    print("=" * 60)
    
    app.run(host='127.0.0.1', port=5000, debug=True)
