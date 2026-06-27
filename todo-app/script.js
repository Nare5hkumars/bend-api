const form = document.getElementById("todoForm");
const input = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const errorMsg = document.getElementById("errorMsg");

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => renderTask(task.text, task.completed, task.id));
}

function saveTasks() {
  const items = [];
  document.querySelectorAll(".task-item").forEach(el => {
    items.push({
      id: el.dataset.id,
      text: el.querySelector(".task-text").textContent,
      completed: el.classList.contains("completed")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(items));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function renderTask(text, completed = false, id = generateId()) {
  const li = document.createElement("li");
  li.className = "task-item" + (completed ? " completed" : "");
  li.dataset.id = id;

  const cb = document.createElement("input");
  cb.type = "checkbox";
  cb.checked = completed;
  cb.addEventListener("change", () => {
    li.classList.toggle("completed");
    saveTasks();
  });

  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = text;

  const del = document.createElement("button");
  del.className = "delete-btn";
  del.textContent = "✕";
  del.addEventListener("click", () => {
    li.remove();
    saveTasks();
  });

  li.append(cb, span, del);
  taskList.appendChild(li);
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const text = input.value.trim();

  if (!text) {
    errorMsg.textContent = "Please enter a task.";
    return;
  }

  if (text.length > 100) {
    errorMsg.textContent = "Task must be under 100 characters.";
    return;
  }

  errorMsg.textContent = "";
  renderTask(text);
  saveTasks();
  input.value = "";
});

loadTasks();
