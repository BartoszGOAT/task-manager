const STORAGE_KEY = "task-manager";

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const counter = document.getElementById("counter");
const clearDoneBtn = document.getElementById("clear-done");
const filterButtons = document.querySelectorAll(".filter");

let tasks = loadTasks();
let currentFilter = "all";

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function addTask(text) {
  tasks.push({ id: Date.now(), text, done: false });
  saveTasks();
  render();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) task.done = !task.done;
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  render();
}

function clearDone() {
  tasks = tasks.filter((t) => !t.done);
  saveTasks();
  render();
}

function visibleTasks() {
  if (currentFilter === "active") return tasks.filter((t) => !t.done);
  if (currentFilter === "done") return tasks.filter((t) => t.done);
  return tasks;
}

function render() {
  list.innerHTML = "";

  const items = visibleTasks();

  if (items.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "Nothing to show.";
    list.appendChild(empty);
  }

  for (const task of items) {
    const li = document.createElement("li");
    li.className = "task" + (task.done ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const label = document.createElement("span");
    label.textContent = task.text;

    const del = document.createElement("button");
    del.className = "delete";
    del.setAttribute("aria-label", "Delete task");
    del.textContent = "×";
    del.addEventListener("click", () => deleteTask(task.id));

    li.append(checkbox, label, del);
    list.appendChild(li);
  }

  const remaining = tasks.filter((t) => !t.done).length;
  counter.textContent = remaining + (remaining === 1 ? " task left" : " tasks left");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addTask(text);
  input.value = "";
  input.focus();
});

clearDoneBtn.addEventListener("click", clearDone);

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    filterButtons.forEach((b) => b.classList.toggle("active", b === btn));
    render();
  });
});

render();
