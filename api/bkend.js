const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const toggleMode = document.getElementById("toggle-mode");

// Load saved theme + tasks
window.addEventListener("load", () => {
  loadTasks();
  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "enabled") enableDarkMode();
});

addBtn.addEventListener("click", addTask);
toggleMode.addEventListener("click", toggleDarkMode);

function addTask() {
  const taskText = input.value.trim();
  if (taskText === "") return;

  const li = createTask(taskText);
  taskList.appendChild(li);
  saveTasks();
  input.value = "";
}

function createTask(text) {
  const li = document.createElement("li");
  li.textContent = text;

  li.addEventListener("click", () => {
    li.classList.toggle("done");
    saveTasks();
  });

  const delBtn = document.createElement("button");
  delBtn.textContent = "✖";
  delBtn.addEventListener("click", () => {
    li.remove();
    saveTasks();
  });

  li.appendChild(delBtn);
  return li;
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#task-list li").forEach(li => {
    tasks.push({
      text: li.childNodes[0].textContent,
      done: li.classList.contains("done")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  storedTasks.forEach(task => {
    const li = createTask(task.text);
    if (task.done) li.classList.add("done");
    taskList.appendChild(li);
  });
}

function toggleDarkMode() {
  if (document.body.classList.contains("dark")) {
    disableDarkMode();
  } else {
    enableDarkMode();
  }
}

function enableDarkMode() {
  document.body.classList.add("dark");
  toggleMode.textContent = "🌙";
  localStorage.setItem("darkMode", "enabled");
}

function disableDarkMode() {
  document.body.classList.remove("dark");
  toggleMode.textContent = "☀️";
  localStorage.setItem("darkMode", "disabled");
}
