let students = JSON.parse(localStorage.getItem('students')) || [];
let courses = JSON.parse(localStorage.getItem('courses')) || [];

function saveToStorage() {
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('courses', JSON.stringify(courses));
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}

function updateSelects() {
    const selects = [document.getElementById('studentSelectAttendance'), document.getElementById('studentSelectMarks')];
    selects.forEach(select => {
        select.innerHTML = '<option value="">Select Student</option>';
        students.forEach(student => {
            const option = document.createElement('option');
            option.value = student.roll;
            option.textContent = `${student.roll} - ${student.name}`;
            select.appendChild(option);
        });
    });
    
    const courseSelect = document.getElementById('courseSelectMarks');
    courseSelect.innerHTML = '<option value="">Select Course</option>';
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course;
        option.textContent = course;
        courseSelect.appendChild(option);
    });
    
    displayStudentList();
    displayCourseList();
}

function addCourse() {
    const course = document.getElementById('courseName').value.trim();
    if (!course || courses.includes(course)) {
        alert('Invalid or duplicate course!');
        return;
    }
    courses.push(course);
    saveToStorage();
    updateSelects();
    console.log(`Course added: ${course}`);
    alert('Course added!');
}

function displayCourseList() {
    document.getElementById('courseList').textContent = courses.join(', ') || 'None';
}

function addStudent() {
    const roll = parseInt(document.getElementById('rollNo').value);
    const name = document.getElementById('name').value.trim();
    const semester = parseInt(document.getElementById('semester').value);
    
    // AI-assisted validation
    if (!roll || !name || !semester || isNaN(roll) || students.some(s => s.roll === roll)) {
        alert('Invalid input! Roll No must be unique and numeric.');
        return;
    }
    
    students.push({ roll, name, semester, attendance: { total: 0, present: 0 }, marks: [] });
    saveToStorage();
    updateSelects();
    console.log(`Student added: ${name} (Roll: ${roll})`);
    alert('Student added successfully!');
}

function markAttendance() {
    const roll = parseInt(document.getElementById('studentSelectAttendance').value);
    const status = document.getElementById('attendanceStatus').value;
    const student = students.find(s => s.roll === roll);
    
    if (!student) return;
    
    student.attendance.total++;
    if (status === 'present') student.attendance.present++;
    saveToStorage();
    updateSelects();
    console.log(`Attendance marked for ${student.name}: ${status}`);
    // Enhanced pop message
    alert(`Attendance marked for ${student.name} as ${status.charAt(0).toUpperCase() + status.slice(1)}!`);
}

function enterMarks() {
    const roll = parseInt(document.getElementById('studentSelectMarks').value);
    const course = document.getElementById('courseSelectMarks').value;
    const marks = parseInt(document.getElementById('marks').value);
    const student = students.find(s => s.roll === roll);
    
    if (!student || !course || marks < 0 || marks > 100) {
        alert('Invalid marks, student, or course!');
        return;
    }
    
    // Check if marks for this course already exist; if so, update
    const existing = student.marks.find(m => m.course === course);
    if (existing) {
        existing.marks = marks;
    } else {
        student.marks.push({ course, marks });
    }
    
    saveToStorage();
    updateSelects();
    console.log(`Marks entered for ${student.name} in ${course}: ${marks}`);
    alert('Marks entered!');
}

function calculateAverage(marksArray) {
    if (!marksArray.length) return 0;
    const total = marksArray.reduce((sum, m) => sum + m.marks, 0);
    return (total / marksArray.length).toFixed(2);
}

function getRemarks(avg) {
    // AI-assisted remarks
    if (avg > 80) return 'Good';
    if (avg >= 50) return 'Average';
    return 'Needs Improvement';
}

function displayStudentList() {
    const listDiv = document.getElementById('studentList');
    listDiv.innerHTML = '';
    students.forEach(student => {
        const percentage = student.attendance.total ? ((student.attendance.present / student.attendance.total) * 100).toFixed(2) : 0;
        const avg = calculateAverage(student.marks);
        const remarks = getRemarks(avg);
        const warning = percentage < 75 ? '<span class="warning">Warning: Attendance below 75%!</span>' : '';
        const marksText = student.marks.map(m => `${m.course}: ${m.marks}`).join(', ') || 'None';
        
        listDiv.innerHTML += `
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${student.name}</h5>
                        <p class="card-text">Roll: ${student.roll}<br>Semester: ${student.semester}<br>Attendance: ${percentage}%<br>Average Marks: ${avg} (${remarks})<br>Marks: ${marksText}</p>
                        ${warning}
                    </div>
                </div>
            </div>
        `;
    });
}

function viewReport() {
    const reportDiv = document.getElementById('reportDisplay');
    reportDiv.innerHTML = '';
    
    if (students.length === 0) {
        reportDiv.innerHTML = 'No students added yet. Add students first!';
        return;
    }
    
    students.forEach(student => {
        const percentage = student.attendance.total ? ((student.attendance.present / student.attendance.total) * 100).toFixed(2) : 0;
        const avg = calculateAverage(student.marks);
        const remarks = getRemarks(avg);
        const warning = percentage < 75 ? 'Warning: Attendance below 75%!' : '';
        const marksText = student.marks.length ? student.marks.map(m => `${m.course}: ${m.marks}`).join(', ') : 'No marks entered yet';
        
        reportDiv.innerHTML += `
Student: ${student.name} (Roll: ${student.roll}, Semester: ${student.semester})
Attendance: ${student.attendance.present}/${student.attendance.total} (${percentage}%) ${warning}
Average Marks: ${avg} - Remarks: ${remarks}
Marks: ${marksText}
\n`;
    });
    
    console.log('Report generated:', students);
}

function generateSampleData() {
    // AI-assisted: Simulate AI-generated sample data with courses
    const sampleNames = ['Alice', 'Bob', 'Charlie'];
    const sampleCourses = ['BCA', 'MCA', 'BBA'];
    sampleNames.forEach((name, i) => {
        const roll = 100 + i;
        if (!students.some(s => s.roll === roll)) {
            const marks = sampleCourses.map(crs => ({ course: crs, marks: Math.floor(Math.random() * 101) }));
            students.push({
                roll,
                name,
                semester: Math.floor(Math.random() * 8) + 1,
                attendance: { total: Math.floor(Math.random() * 10) + 1, present: Math.floor(Math.random() * 10) + 1 },
                marks
            });
        }
    });
    // Add sample courses if not present
    sampleCourses.forEach(crs => {
        if (!courses.includes(crs)) courses.push(crs);
    });
    saveToStorage();
    updateSelects();
    console.log('Sample data generated by AI simulation');
    alert('Sample data generated!');
}

// Initialize
updateSelects();
showSection('addCourse');