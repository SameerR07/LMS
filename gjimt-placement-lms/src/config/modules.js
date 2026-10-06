import {
  ApartmentRounded,
  AssignmentRounded,
  GroupsRounded,
  HandshakeRounded,
  InsertChartRounded,
  LocalLibraryRounded,
  SchoolRounded,
  PersonAddAlt1Rounded,
  WorkRounded,
  TourRounded,
} from '@mui/icons-material'

export const moduleCards = [
  { key: 'internships', title: 'Internship Coordinator', description: 'Track internship partners, roles, seats and student activity.', icon: WorkRounded, color: 'orange', route: '/internships' },
  { key: 'placements', title: 'Placement Coordinator', description: 'Manage placement drives, companies, eligibility and outcomes.', icon: AssignmentRounded, color: 'blue', route: '/placements' },
  { key: 'visits', title: 'Industrial Visit', description: 'Plan company visits, faculty coordinators and student groups.', icon: ApartmentRounded, color: 'purple', route: '/visits' },
  { key: 'talks', title: 'Industry / Alumni Talk', description: 'Schedule expert sessions and keep alumni engagement records.', icon: HandshakeRounded, color: 'green', route: '/talks' },
  { key: 'students', title: 'Master Data', description: 'Search and manage student records from one clean workspace.', icon: LocalLibraryRounded, color: 'teal', route: '/students' },
  { key: 'add-student', title: 'Add Student Data', description: 'Create a complete student profile in under a minute.', icon: PersonAddAlt1Rounded, color: 'pink', route: '/students/add' },
]

export const sideNav = [
  { label: 'Overview', route: '/', icon: SchoolRounded },
  { label: 'Internships', route: '/internships', icon: WorkRounded },
  { label: 'Placements', route: '/placements', icon: AssignmentRounded },
  { label: 'Industrial Visits', route: '/visits', icon: TourRounded },
  { label: 'Industry & Alumni', route: '/talks', icon: GroupsRounded },
  { label: 'Master Data', route: '/students', icon: LocalLibraryRounded },
  { label: 'Add Student', route: '/students/add', icon: PersonAddAlt1Rounded },
  { label: 'Reports', route: '/reports', icon: InsertChartRounded },
]

export const entityConfigs = {
  internships: {
    title: 'Internship Coordinator', eyebrow: 'Career learning', description: 'Keep every internship opportunity organised, searchable and current.', singular: 'Internship', icon: WorkRounded, collection: 'internships',
    // Records with the same values here are treated as the same record when importing
    uniqueBy: ['company', 'role', 'startDate'],
    searchKeys: ['company', 'role', 'status'],
    fields: [
      { key: 'company', label: 'Company', required: true, placeholder: 'e.g. Alpha IT Pvt. Ltd.', aliases: ['Company name', 'Organisation', 'Organization', 'Employer'] },
      { key: 'role', label: 'Role', required: true, placeholder: 'e.g. MERN Stack Intern', aliases: ['Position', 'Profile', 'Designation', 'Internship role'] },
      { key: 'duration', label: 'Duration', required: true, placeholder: 'e.g. 6 months', aliases: ['Period', 'Tenure'] },
      { key: 'startDate', label: 'Start date', type: 'date', required: true, aliases: ['Start', 'From', 'Joining date', 'Date'] },
      { key: 'seats', label: 'Seats', type: 'number', required: true, placeholder: '10', integer: true, min: 0, aliases: ['Openings', 'Vacancies', 'Positions', 'No of seats'] },
      { key: 'stipend', label: 'Stipend', placeholder: 'e.g. ₹8,000 / month', aliases: ['Stipend per month', 'Monthly stipend', 'Pay'] },
      { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Upcoming', 'Closed'], required: true, aliases: ['Internship status'] },
    ],
    columns: [
      { key: 'company', label: 'Company' }, { key: 'role', label: 'Role' }, { key: 'duration', label: 'Duration' }, { key: 'startDate', label: 'Start date', format: 'date' }, { key: 'seats', label: 'Seats' }, { key: 'status', label: 'Status', format: 'status' },
    ],
  },
  placements: {
    title: 'Placement Coordinator', eyebrow: 'Placement drives', description: 'Manage employer drives, roles, packages and eligibility in one view.', singular: 'Placement Drive', icon: AssignmentRounded, collection: 'placements',
    // Records with the same values here are treated as the same record when importing
    uniqueBy: ['company', 'role', 'driveDate'],
    searchKeys: ['company', 'role', 'eligible', 'status'],
    fields: [
      { key: 'company', label: 'Company', required: true, placeholder: 'e.g. TechNova Solutions', aliases: ['Company name', 'Recruiter', 'Employer', 'Organisation', 'Organization'] },
      { key: 'driveDate', label: 'Drive date', type: 'date', required: true, aliases: ['Date', 'Date of drive', 'Placement date'] },
      { key: 'role', label: 'Role', required: true, placeholder: 'e.g. Graduate Engineer Trainee', aliases: ['Position', 'Profile', 'Designation', 'Job role'] },
      { key: 'ctc', label: 'CTC', required: true, placeholder: 'e.g. ₹6.2 LPA', aliases: ['Package', 'Salary', 'CTC (LPA)', 'Offer'] },
      { key: 'eligible', label: 'Eligible courses', required: true, placeholder: 'e.g. BCA, BBA', aliases: ['Eligible', 'Eligibility', 'Courses', 'Eligible branches'] },
      { key: 'status', label: 'Status', type: 'select', options: ['Open', 'Scheduled', 'Closed'], required: true, aliases: ['Drive status'] },
    ],
    columns: [
      { key: 'company', label: 'Company' }, { key: 'role', label: 'Role' }, { key: 'driveDate', label: 'Drive date', format: 'date' }, { key: 'ctc', label: 'CTC' }, { key: 'eligible', label: 'Eligible' }, { key: 'status', label: 'Status', format: 'status' },
    ],
  },
  visits: {
    title: 'Industrial Visits', eyebrow: 'Exposure & visits', description: 'Coordinate industry visits with a clear view of people, places and dates.', singular: 'Industrial Visit', icon: TourRounded, collection: 'visits',
    // Records with the same values here are treated as the same record when importing
    uniqueBy: ['organization', 'date'],
    searchKeys: ['organization', 'location', 'faculty', 'status'],
    fields: [
      { key: 'organization', label: 'Organization', required: true, placeholder: 'e.g. Infosys Chandigarh', aliases: ['Organisation', 'Company', 'Industry', 'Place visited'] },
      { key: 'date', label: 'Visit date', type: 'date', required: true, aliases: ['Date', 'Date of visit'] },
      { key: 'location', label: 'Location', required: true, placeholder: 'e.g. Chandigarh', aliases: ['City', 'Venue', 'Place'] },
      { key: 'faculty', label: 'Faculty coordinator', required: true, placeholder: 'e.g. Dr. Aneet Bedi', aliases: ['Faculty', 'Coordinator', 'Faculty incharge', 'Faculty in-charge'] },
      { key: 'students', label: 'Students', type: 'number', required: true, placeholder: '40', integer: true, min: 0, aliases: ['No of students', 'Number of students', 'Student count', 'Strength'] },
      { key: 'status', label: 'Status', type: 'select', options: ['Planned', 'Completed', 'Cancelled'], required: true, aliases: ['Visit status'] },
    ],
    columns: [
      { key: 'organization', label: 'Organization' }, { key: 'date', label: 'Visit date', format: 'date' }, { key: 'location', label: 'Location' }, { key: 'faculty', label: 'Faculty' }, { key: 'students', label: 'Students' }, { key: 'status', label: 'Status', format: 'status' },
    ],
  },
  talks: {
    title: 'Industry / Alumni Talk', eyebrow: 'Community & experts', description: 'Plan expert sessions and alumni touchpoints that students remember.', singular: 'Talk / Session', icon: HandshakeRounded, collection: 'talks',
    // Records with the same values here are treated as the same record when importing
    uniqueBy: ['speaker', 'date', 'topic'],
    searchKeys: ['speaker', 'organization', 'topic', 'mode', 'status'],
    fields: [
      { key: 'speaker', label: 'Speaker', required: true, placeholder: 'e.g. Rohit Malhotra', aliases: ['Speaker name', 'Guest', 'Resource person', 'Alumni name'] },
      { key: 'organization', label: 'Organization', required: true, placeholder: 'e.g. Microsoft Partner Network', aliases: ['Organisation', 'Company', 'Affiliation'] },
      { key: 'date', label: 'Session date', type: 'date', required: true, aliases: ['Date', 'Talk date', 'Date of session'] },
      { key: 'topic', label: 'Topic', required: true, placeholder: 'e.g. AI-ready careers for freshers', aliases: ['Title', 'Subject', 'Session title'] },
      { key: 'mode', label: 'Mode', type: 'select', options: ['Offline', 'Online', 'Hybrid'], required: true, aliases: ['Session mode', 'Format'] },
      { key: 'status', label: 'Status', type: 'select', options: ['Scheduled', 'Draft', 'Completed'], required: true, aliases: ['Session status'] },
    ],
    columns: [
      { key: 'speaker', label: 'Speaker' }, { key: 'organization', label: 'Organization' }, { key: 'date', label: 'Date', format: 'date' }, { key: 'topic', label: 'Topic' }, { key: 'mode', label: 'Mode' }, { key: 'status', label: 'Status', format: 'status' },
    ],
  },
  students: {
    title: 'Master Data', eyebrow: 'Student database', description: 'The single source of truth for student placement and career data.', singular: 'Student', icon: LocalLibraryRounded, collection: 'students',
    // Records with the same values here are treated as the same record when importing
    uniqueBy: ['rollNo'],
    searchKeys: ['name', 'rollNo', 'course', 'batch', 'email', 'phone', 'placementStatus', 'company', 'specialization', 'state', 'jobArea1', 'jobArea2', 'jobArea3', 'fatherName'],
    // Form sections (edit dialog and Add Student page)
    groups: [
      { key: 'basic', title: 'Basic details' },
      { key: 'contact', title: 'Contact & family' },
      { key: 'academic', title: 'Academics' },
      { key: 'career', title: 'Placement preferences' },
    ],
    // Labels follow the college registration sheet ("MCA III Batch 2025-2027"), so Master Data reads like the Excel file.
    fields: [
      { key: 'name', label: 'Name', group: 'basic', required: true, placeholder: 'e.g. Simran Kaur', aliases: ['Full name', 'Student name', 'Student'] },
      { key: 'rollNo', label: 'Uni. Roll No.', group: 'basic', required: true, placeholder: 'e.g. 2523110', aliases: ['Roll number', 'Roll no', 'Roll', 'Uni Roll No', 'University roll no', 'Enrollment no', 'Enrolment no', 'Registration no'] },
      { key: 'course', label: 'Course', group: 'basic', type: 'select', options: ['BCA', 'BBA', 'MBA', 'MCA'], required: true, aliases: ['Program', 'Programme', 'Class', 'Branch'] },
      { key: 'batch', label: 'Batch', group: 'basic', required: true, placeholder: 'e.g. 2025-27', aliases: ['Session', 'Academic session', 'Year'] },
      { key: 'placementStatus', label: 'Placement Status', group: 'basic', type: 'select', options: ['Eligible', 'In Process', 'Placed', 'Not Eligible', 'Opted Out'], required: true, aliases: ['Status'],
        // Import: a student who said "No" to placement interest is set to Opted Out automatically
        deriveWhenBlank: (record) => (record.placementInterest === 'No' ? 'Opted Out' : undefined),
        deriveNote: 'Students who answered “No” to Interested are set to Opted Out automatically.' },
      { key: 'company', label: 'Company', group: 'basic', placeholder: 'Placed company (optional)', aliases: ['Company (optional)', 'Placed company', 'Placed in', 'Employer'] },

      { key: 'email', label: 'Email ID', group: 'contact', type: 'email', required: true, placeholder: 'student@example.com', aliases: ['Email', 'Email address', 'E-mail', 'Mail'] },
      { key: 'phone', label: 'Phone Number 1', group: 'contact', required: true, placeholder: '10-digit mobile', format: 'phone', aliases: ['Phone', 'Mobile', 'Mobile no', 'Phone no', 'Phone number', 'Mobile 1', 'Contact', 'Contact no', 'Contact number'] },
      { key: 'altPhone', label: 'Phone Number 2', group: 'contact', placeholder: 'Parent / second number', format: 'phone', aliases: ['Alternate phone', 'Mobile 2', 'Alternate mobile', 'Alternate number', 'Parent phone'] },
      { key: 'fatherName', label: "Father's Name", group: 'contact', placeholder: 'e.g. Rakesh Pal', aliases: ['Father Name', 'Fathers name', 'Father', 'Guardian name'] },
      { key: 'address', label: 'Address', group: 'contact', placeholder: 'House no., area, city', wide: true, aliases: ['Permanent address', 'Correspondence address', 'Residential address'] },
      { key: 'state', label: 'State', group: 'contact', placeholder: 'e.g. Punjab', aliases: ['Home state', 'State / UT'] },

      { key: 'graduationDone', label: 'Graduation Done', group: 'academic', type: 'select', options: ['Yes', 'No'], aliases: ['Gradutation_done', 'Graduation_done', 'Graduated', 'Graduation completed'] },
      { key: 'graduationDegree', label: 'Degree Name', group: 'academic', placeholder: 'e.g. BCA', aliases: ['Graduation degree', 'Degree', 'UG degree', 'Graduation course'] },
      { key: 'specialization', label: 'Specialization', group: 'academic', placeholder: 'e.g. Full Stack (MERN)', aliases: ['Specialisation', 'Skills', 'Skill set'] },
      { key: 'tenthPercent', label: '10th Marks', group: 'academic', type: 'percent', placeholder: 'e.g. 78', aliases: ['10th %', '10th', 'Class 10', 'Matric', 'Matric marks', 'SSC'] },
      { key: 'twelfthPercent', label: '12th Marks', group: 'academic', type: 'percent', placeholder: 'e.g. 82', aliases: ['12th %', '12th', 'Class 12', 'Senior secondary', 'HSC'] },
      { key: 'graduationPercent', label: 'Graduation Marks', group: 'academic', type: 'percent', placeholder: 'e.g. 74', aliases: ['Graduation %', 'UG %', 'UG marks', 'Graduation percentage'] },
      { key: 'cgpa', label: 'CGPA', group: 'academic', type: 'number', step: '0.1', placeholder: '8.2', min: 0, max: 10, aliases: ['GPA', 'SGPA', 'CGPA (out of 10)'] },

      { key: 'placementInterest', label: 'Interested', group: 'career', type: 'select', options: ['Yes', 'No'], aliases: ['Intersested', 'Interested in placement', 'Placement interest', 'Want placement'] },
      { key: 'locationPref1', label: 'Location Preference - Choice 1', group: 'career', placeholder: 'e.g. Chandigarh', aliases: ['Location preference 1', 'Preferred location 1', 'Local preference choice 1'] },
      { key: 'locationPref2', label: 'Location Preference - Choice 2', group: 'career', placeholder: 'e.g. Mohali', aliases: ['Location preference 2', 'Preferred location 2', 'Local preference choice 2'] },
      { key: 'locationPref3', label: 'Location Preference - Choice 3', group: 'career', placeholder: 'e.g. Delhi', aliases: ['Location preference 3', 'Preferred location 3', 'Local preference choice 3'] },
      { key: 'jobArea1', label: 'Job Area 1', group: 'career', placeholder: 'e.g. Full Stack', aliases: ['Job area choice 1', 'Domain preference 1', 'Domain preference choice 1'] },
      { key: 'jobArea2', label: 'Job Area 2', group: 'career', placeholder: 'e.g. Data Analyst', aliases: ['Job area choice 2', 'Domain preference 2', 'Domain preference choice 2'] },
      { key: 'jobArea3', label: 'Job Area 3', group: 'career', placeholder: 'e.g. Python', aliases: ['Job area choice 3', 'Domain preference 3', 'Domain preference choice 3'] },
    ],
    // Table = the Excel sheet's columns in the same order (S.No. and Name stay pinned while scrolling sideways),
    // followed by the LMS-only columns.
    columns: [
      { key: 'sno', label: 'S.No.', format: 'index', sticky: 'index' },
      { key: 'name', label: 'Name', identity: true, sticky: 'identity' },
      { key: 'batch', label: 'Batch', nowrap: true },
      { key: 'rollNo', label: 'Uni. Roll No.', nowrap: true },
      { key: 'fatherName', label: "Father's Name" },
      { key: 'email', label: 'Email ID', nowrap: true },
      { key: 'phone', label: 'Phone Number 1', nowrap: true },
      { key: 'altPhone', label: 'Phone Number 2', nowrap: true },
      { key: 'address', label: 'Address', wrap: true },
      { key: 'state', label: 'State' },
      { key: 'course', label: 'Course' },
      { key: 'graduationDone', label: 'Graduation Done', format: 'yesno' },
      { key: 'graduationDegree', label: 'Degree Name' },
      { key: 'specialization', label: 'Specialization', wrap: true },
      { key: 'tenthPercent', label: '10th Marks', format: 'percent' },
      { key: 'twelfthPercent', label: '12th Marks', format: 'percent' },
      { key: 'graduationPercent', label: 'Graduation Marks', format: 'percent' },
      { key: 'placementInterest', label: 'Interested', format: 'yesno' },
      { key: 'locationPref1', label: 'Location Preference - Choice 1' },
      { key: 'locationPref2', label: 'Location Preference - Choice 2' },
      { key: 'locationPref3', label: 'Location Preference - Choice 3' },
      { key: 'jobArea1', label: 'Job Area 1' },
      { key: 'jobArea2', label: 'Job Area 2' },
      { key: 'jobArea3', label: 'Job Area 3' },
      { key: 'placementStatus', label: 'Placement Status', format: 'status' },
      { key: 'company', label: 'Company' },
      { key: 'cgpa', label: 'CGPA' },
    ],
    // Export / template column order = exactly the registration sheet, then LMS-only columns
    sheetOrder: ['batch', 'rollNo', 'name', 'fatherName', 'email', 'phone', 'altPhone', 'address', 'state', 'course', 'graduationDone', 'graduationDegree', 'specialization', 'tenthPercent', 'twelfthPercent', 'graduationPercent', 'placementInterest', 'locationPref1', 'locationPref2', 'locationPref3', 'jobArea1', 'jobArea2', 'jobArea3', 'placementStatus', 'company', 'cgpa'],
    // "Key columns" view and phone cards
    keyColumns: ['name', 'rollNo', 'course', 'batch', 'specialization', 'phone', 'placementStatus'],
    mobileColumns: ['rollNo', 'batch', 'phone', 'specialization'],
  },
}
