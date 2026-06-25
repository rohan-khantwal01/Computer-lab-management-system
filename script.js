const STORAGE_KEY = "ims_lab_management_clean_v1";
const IMS_URL = "https://www.imsroorkee.org/";

const students = [
  { id: "IMS101", name: "Aman Rawat", batch: "BCA 1st Year", computer: "PC-01", color: "#2563c7", photo: "1.jpg" },
  { id: "IMS102", name: "Neha Sharma", batch: "BCA 1st Year", computer: "PC-02", color: "#0b817e", photo: "2.jpg" },
  { id: "IMS103", name: "Rohit Verma", batch: "DCA Morning", computer: "PC-03", color: "#7c4cc2", photo: "3.jpg" },
  { id: "IMS104", name: "Priya Singh", batch: "DCA Morning", computer: "PC-04", color: "#cf5a3e", photo: "4.jpg" },
  { id: "IMS105", name: "Sumit Tyagi", batch: "PGDCA Evening", computer: "PC-05", color: "#27834d", photo: "5.jpg" },
  { id: "IMS106", name: "Kavya Patel", batch: "PGDCA Evening", computer: "PC-06", color: "#b56a18", photo: "6.jpg" },
  { id: "IMS107", name: "Vikas Yadav", batch: "Tally Batch", computer: "PC-07", color: "#475569", photo: "7.jpg" },
  { id: "IMS108", name: "Anjali Gupta", batch: "Tally Batch", computer: "PC-08", color: "#c0265c", photo: "8.jpg" },
  { id: "IMS109", name: "Manish Rana", batch: "Web Design", computer: "PC-09", color: "#0b7296", photo: "9.jpg" },
  { id: "IMS110", name: "Riya Mehta", batch: "Web Design", computer: "PC-10", color: "#6952d8", photo: "10.jpg" }
];

const desktopApps = [
  { label: "Google Chrome", logo: "https://www.google.com/chrome/static/images/chrome-logo-m100.svg", url: "https://www.google.com/" },
  { label: "File Explorer", logo: "https://img.icons8.com/color/96/folder-invoices--v1.png", url: "file:///C:/Users/khant/Documents" },
  { label: "Command Prompt", logo: "https://img.icons8.com/color/96/console.png", url: "https://learn.microsoft.com/windows-server/administration/windows-commands/cmd" },
  { label: "Notepad", logo: "https://img.icons8.com/color/96/notepad.png", url: "https://www.rapidtables.com/tools/notepad.html" },
  { label: "MS Excel", logo: "https://img.icons8.com/color/96/ms-excel.png", url: "https://www.office.com/launch/excel" },
  { label: "MS Word", logo: "https://img.icons8.com/color/96/ms-word.png", url: "https://www.office.com/launch/word" },
  { label: "Paint", logo: "https://img.icons8.com/color/96/paint.png", url: "https://jspaint.app/" },
  { label: "Settings", logo: "https://img.icons8.com/color/96/settings--v1.png", url: "https://support.microsoft.com/windows" }
];

let state = loadState();

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    parsed.customStudents = parsed.customStudents || [];
    parsed.showCreateId = !!parsed.showCreateId;
    parsed.filters = parsed.filters || { query: "", batch: "All" };
    return parsed;
  }

  const initial = {
    view: "login",
    currentUser: null,
    customStudents: [],
    showCreateId: false,
    filters: { query: "", batch: "All" },
    sessions: [
      {
        studentId: "IMS101",
        loginAt: minutesAgo(52),
        logoutAt: null,
        active: true,
        events: [
          event("Google Chrome", minutesAgo(50), minutesAgo(36), "Course portal opened"),
          event("Notepad", minutesAgo(35), minutesAgo(18), "HTML notes written"),
          event("Command Prompt", minutesAgo(17), null, "Directory practice")
        ]
      },
      {
        studentId: "IMS105",
        loginAt: minutesAgo(76),
        logoutAt: minutesAgo(12),
        active: false,
        events: [
          event("MS Excel", minutesAgo(74), minutesAgo(45), "Spreadsheet practice"),
          event("File Explorer", minutesAgo(44), minutesAgo(13), "Saved assignment")
        ]
      }
    ]
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function minutesAgo(value) {
  return new Date(Date.now() - value * 60 * 1000).toISOString();
}

function event(app, startedAt, endedAt, detail) {
  return { app, startedAt, endedAt, detail };
}

function firstName(student) {
  return student.name.split(" ")[0].toLowerCase();
}

function allStudents() {
  return [...students, ...(state.customStudents || [])];
}

function getStudent(id) {
  return allStudents().find((student) => student.id === id);
}

function getSession(studentId) {
  return state.sessions.find((session) => session.studentId === studentId);
}

function ensureSession(studentId) {
  let session = getSession(studentId);
  if (!session) {
    session = { studentId, loginAt: new Date().toISOString(), logoutAt: null, active: true, events: [] };
    state.sessions.push(session);
  }
  session.active = true;
  session.logoutAt = null;
  saveState();
  return session;
}

function formatTime(value) {
  if (!value) return "Running";
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function duration(start, end) {
  const finish = end ? new Date(end) : new Date();
  const diff = Math.max(1, Math.round((finish - new Date(start)) / 60000));
  return `${diff} min`;
}

function activeSessions() {
  return state.sessions.filter((session) => session.active);
}

function visibleStudents() {
  const query = state.filters.query.trim().toLowerCase();
  return allStudents().filter((student) => {
    const batchOk = state.filters.batch === "All" || student.batch === state.filters.batch;
    const queryOk = !query || [student.id, student.name, student.batch, student.computer].some((item) => item.toLowerCase().includes(query));
    return batchOk && queryOk;
  });
}

function initials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function studentVisual(student) {
  if (student.photo) {
    return `<img src="${student.photo}" alt="${student.name}">`;
  }
  return `<span class="student-fallback" style="--fallback-bg:${student.color || '#2563c7'}">${initials(student.name)}</span>`;
}

function createStudentEntry(data) {
  const name = String(data.name || "").trim();
  const course = String(data.course || "").trim();
  const email = String(data.email || "").trim().toLowerCase();
  const password = String(data.password || "").trim();

  if (!name || !course || !email || !password) {
    alert("Please fill name, course, email, and password.");
    return;
  }

  if (allStudents().some((student) => student.email?.toLowerCase() === email || student.name.toLowerCase() === name.toLowerCase())) {
    alert("Student name or email already exists.");
    return;
  }

  const nextNumber = String(111 + (state.customStudents || []).length).padStart(3, "0");
  const computerNo = `PC-${String(11 + (state.customStudents || []).length).padStart(2, "0")}`;
  const newStudent = {
    id: `IMS${nextNumber}`,
    name,
    batch: course,
    computer: computerNo,
    color: ["#2563c7", "#0b817e", "#7c4cc2", "#cf5a3e", "#27834d", "#b56a18", "#475569", "#c0265c"][state.customStudents.length % 8],
    email,
    password,
  };
  state.customStudents = [...(state.customStudents || []), newStudent];
  state.showCreateId = false;
  saveState();
  showToast(`ID created: ${newStudent.id}`);
  render();
}

function render() {
  const app = document.querySelector("#app");
  if (state.view === "login") app.innerHTML = loginView();
  if (state.view === "teacher") app.innerHTML = teacherView();
  if (state.view === "detail") app.innerHTML = detailView();
  if (state.view === "desktop") app.innerHTML = desktopView();
  bindEvents();
}

function loginView() {
  const createModal = state.showCreateId ? `
    <div class="create-overlay" data-action="closeCreate">
      <form class="create-card" data-action="createId" onclick="event.stopPropagation()">
        <h3>Create ID</h3>
        <p>Name, course, email, aur password bhar ke new student ID create karein.</p>
        <label>Name
          <input name="name" required>
        </label>
        <label>Course
          <input name="course" required>
        </label>
        <label>Email
          <input name="email" type="email" required>
        </label>
        <label>Password
          <input name="password" type="password" required>
        </label>
        <div class="create-actions">
          <button type="button" class="ghost-btn" data-action="closeCreate">Cancel</button>
          <button type="submit">Create ID</button>
        </div>
      </form>
    </div>
  ` : "";

  return `
    <section class="login-page">
      <div class="brand-section">
        <div class="brand-content">
          <a class="brand-logo" href="${IMS_URL}" target="_blank" rel="noreferrer"><img src="ims.jpg" alt="IMS logo"></a>
          <h1>IMS Computer Lab Management System</h1>
          <p>Teacher dashboard, live student sessions, app usage timeline, and student desktop activity tracking in one clean prototype.</p>
          <div class="login-stats">
            <span><b>30</b> Computers</span>
            <span><b>${activeSessions().length}</b> Active</span>
            <span><b>${allStudents().length}</b> Demo Students</span>
          </div>
        </div>
      </div>
      <div class="login-card-wrap">
        <form class="login-card" data-action="login">
          <a class="login-logo" href="${IMS_URL}" target="_blank" rel="noreferrer"><img src="ims.jpg" alt="IMS logo"></a>
          <label>Username
            <input name="username" required>
          </label>
          <label>Password
            <input name="password" type="password" required>
          </label>
          <button type="submit">Login</button>
          <button type="button" class="secondary-btn" data-action="openCreate">Create ID</button>
        </form>
      </div>
      ${createModal}
    </section>
  `;
}

function shell(content) {
  return `
    <aside class="side-panel">
      <a class="side-logo-img" href="${IMS_URL}" target="_blank" rel="noreferrer"><img src="ims.jpg" alt="IMS logo"></a>
      <h2>Computer Lab</h2>
      <button data-route="teacher" class="${state.view === "teacher" ? "active" : ""}">Dashboard</button>
      <button data-action="logout">Logout</button>
    </aside>
    <main class="main-panel">${content}</main>
  `;
}

function teacherView() {
  const active = activeSessions().length;
  const totalEvents = state.sessions.reduce((sum, session) => sum + session.events.length, 0);
  const batches = ["All", ...new Set(allStudents().map((student) => student.batch))];
  return shell(`
    <header class="topbar">
      <div>
        <p>Teacher Dashboard</p>
        <h1>30 Computer Lab Summary</h1>
      </div>
      <a href="${IMS_URL}" target="_blank" rel="noreferrer">Visit IMS Website</a>
    </header>
    <section class="summary-grid">
      ${summaryCard("Total Computers", "30", "Ready for lab sessions")}
      ${summaryCard("Active Students", active, "Currently logged in")}
      ${summaryCard("Offline Students", allStudents().length - active, "Demo records")}
      ${summaryCard("App Events", totalEvents, "Tracked clicks")}
    </section>
    <section class="toolbar">
      <input data-filter="query" placeholder="Search by name, ID, batch, computer" value="${escapeHtml(state.filters.query)}">
      <select data-filter="batch">${batches.map((batch) => `<option ${batch === state.filters.batch ? "selected" : ""}>${batch}</option>`).join("")}</select>
    </section>
    <section class="student-table">
      <div class="table-head"><span>Student</span><span>Batch</span><span>Computer</span><span>Status</span><span>Last App</span></div>
      ${visibleStudents().map(studentRow).join("")}
    </section>
  `);
}

function summaryCard(label, value, note) {
  return `<article class="summary-card"><span>${label}</span><strong>${value}</strong><p>${note}</p></article>`;
}

function studentRow(student) {
  const session = getSession(student.id);
  const lastEvent = session?.events.at(-1);
  return `
    <button class="student-row" data-student="${student.id}">
      <span class="student-cell">
        ${studentVisual(student)}
        <b>${student.name}</b>
        <small>${student.id}</small>
      </span>
      <span>${student.batch}</span>
      <span>${student.computer}</span>
      <span><i class="${session?.active ? "online" : "offline"}"></i>${session?.active ? "Active" : "Offline"}</span>
      <span>${lastEvent ? lastEvent.app : "No activity"}</span>
    </button>
  `;
}

function detailView() {
  const student = getStudent(state.currentUser?.studentId);
  const session = getSession(student.id);
  return shell(`
    <header class="topbar">
      <button class="back-btn" data-route="teacher">Back</button>
      <div>
        <p>${student.id} / ${student.computer}</p>
        <h1>${student.name}</h1>
      </div>
    </header>
    <section class="detail-grid">
      <article class="profile-card">
        ${studentVisual(student)}
        <h2>${student.name}</h2>
        <p>${student.batch}</p>
        <span class="${session?.active ? "badge online-bg" : "badge"}">${session?.active ? "Active" : "Offline"}</span>
      </article>
      <article class="session-card">
        <h2>Session Details</h2>
        <div class="mini-grid">
          <span>Login Time<b>${formatTime(session?.loginAt)}</b></span>
          <span>Logout Time<b>${formatTime(session?.logoutAt)}</b></span>
          <span>Duration<b>${session ? duration(session.loginAt, session.logoutAt) : "0 min"}</b></span>
          <span>Events<b>${session?.events.length || 0}</b></span>
        </div>
      </article>
    </section>
    <section class="timeline-panel">
      <h2>App Usage Timeline</h2>
      ${(session?.events || []).map((item) => `
        <div class="event-row">
          <b>${item.app}</b>
          <span>${formatTime(item.startedAt)} - ${formatTime(item.endedAt)}</span>
          <p>${item.detail}</p>
        </div>
      `).join("") || `<p class="empty">No activity recorded yet.</p>`}
    </section>
  `);
}

function desktopView() {
  const student = getStudent(state.currentUser?.studentId);
  return `
    <section class="desktop">
      <header class="desktop-top">
        <div class="desktop-user">${studentVisual(student)}<div><b>${student.name}</b><span>${student.id} / ${student.computer}</span></div></div>
        <button data-action="logoutStudent">Logout</button>
      </header>
      <div class="desktop-icons">
        ${desktopApps.map((app) => `
          <button data-app="${app.label}" data-url="${app.url}">
            <img src="${app.logo}" alt="${app.label}">
            <span>${app.label}</span>
          </button>
        `).join("")}
      </div>
      <footer class="taskbar">
        <a href="${IMS_URL}" target="_blank" rel="noreferrer">IMS Roorkee</a>
        <span>${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
      </footer>
    </section>
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function bindEvents() {
  document.querySelectorAll("form[data-action='login']").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const username = String(data.username || "").trim().toLowerCase();
      const password = String(data.password || "").trim().toLowerCase();

      if ((username === "teacher@gamil.com" || username === "teacher@gmail.com") && password === "sir") {
        state.currentUser = { role: "teacher", name: "Sir" };
        state.view = "teacher";
      } else {
        const student = allStudents().find((item) => {
          const first = firstName(item);
          return (
            (username === `${first}@gamil.com` || username === `${first}@gmail.com`) &&
            (password === first || password === item.name.toLowerCase().replaceAll(" ", ""))
          );
        });
        if (!student) return alert("Invalid username or password. Use teacher@gamil.com / sir or student first-name credentials.");
        ensureSession(student.id);
        state.currentUser = { role: "student", studentId: student.id, name: student.name };
        state.view = "desktop";
      }
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-action='openCreate']").forEach((button) => {
    button.addEventListener("click", () => {
      state.showCreateId = true;
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-action='closeCreate']").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      state.showCreateId = false;
      saveState();
      render();
    });
  });

  document.querySelectorAll("form[data-action='createId']").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      createStudentEntry(data);
    });
  });

  document.querySelectorAll("[data-filter]").forEach((field) => {
    field.addEventListener("input", () => {
      state.filters[field.dataset.filter] = field.value;
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-student]").forEach((row) => {
    row.addEventListener("click", () => {
      state.currentUser = { role: "teacher", studentId: row.dataset.student };
      state.view = "detail";
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.route;
      state.currentUser = { role: "teacher", name: "Sir" };
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-app]").forEach((button) => {
    button.addEventListener("click", () => {
      const session = ensureSession(state.currentUser.studentId);
      const previous = session.events.at(-1);
      if (previous && !previous.endedAt) previous.endedAt = new Date().toISOString();
      session.events.push(event(button.dataset.app, new Date().toISOString(), null, `${button.dataset.app} opened from student desktop`));
      saveState();
      window.open(button.dataset.url, "_blank", "noreferrer");
      render();
    });
  });

  document.querySelectorAll("[data-action='logout']").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = "login";
      state.currentUser = null;
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-action='logoutStudent']").forEach((button) => {
    button.addEventListener("click", () => {
      const session = getSession(state.currentUser.studentId);
      if (session) {
        session.active = false;
        session.logoutAt = new Date().toISOString();
        const last = session.events.at(-1);
        if (last && !last.endedAt) last.endedAt = new Date().toISOString();
      }
      state.view = "login";
      state.currentUser = null;
      saveState();
      render();
    });
  });
}

render();
