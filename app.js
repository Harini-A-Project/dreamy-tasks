
// =====================================
// DREAMY TASKS - TO DO APPLICATION
// =====================================

// Select HTML elements
let tasks = [];
let currentFilter = "all";

const form = document.getElementById("form");
const input = document.getElementById("text");
const list = document.getElementById("list");
const count = document.getElementById("count");
const filters = document.querySelector(".filters");
const clearButton = document.getElementById("clear-completed");


// =====================================
// LOAD TASKS FROM LOCAL STORAGE
// =====================================

function load() {
    try {
        const savedTasks = JSON.parse(localStorage.getItem("tasks"));
        return Array.isArray(savedTasks) ? savedTasks : [];
    } catch (error) {
        return [];
    }
}


// =====================================
// SAVE TASKS TO LOCAL STORAGE
// =====================================

function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// =====================================
// DISPLAY TASKS
// =====================================

function render() {

    list.innerHTML = "";

    let visibleTasks = tasks.filter(function(task) {

        if (currentFilter === "active") {
            return !task.done;
        }

        if (currentFilter === "done") {
            return task.done;
        }

        return true;

    });

    visibleTasks.forEach(function(task) {

        const li = document.createElement("li");

        li.dataset.id = task.id;

        if (task.done) {
            li.classList.add("done");
        }

        const label = document.createElement("span");
        label.textContent = task.text;

        const toggle = document.createElement("button");
        toggle.textContent = task.done ? "Undo" : "Done";
        toggle.dataset.action = "toggle";

        const del = document.createElement("button");
        del.textContent = "Delete";
        del.dataset.action = "delete";

        li.append(label, toggle, del);

        list.append(li);

    });

    // Update remaining task count
    const remaining = tasks.filter(function(task) {
        return !task.done;
    }).length;

    count.textContent = remaining + " tasks left";

}


// =====================================
// ADD NEW TASKS
// =====================================

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const taskText = input.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    };

    tasks.push(newTask);

    input.value = "";

    save();
    render();

});


// =====================================
// COMPLETE AND DELETE TASKS
// =====================================

list.addEventListener("click", function(event) {

    const action = event.target.dataset.action;

    if (!action) return;

    const taskElement = event.target.closest("li");

    if (!taskElement) return;

    const id = Number(taskElement.dataset.id);

    if (action === "delete") {

        tasks = tasks.filter(function(task) {
            return task.id !== id;
        });

    }

    if (action === "toggle") {

        tasks.forEach(function(task) {

            if (task.id === id) {
                task.done = !task.done;
            }

        });

    }

    save();
    render();

});


// =====================================
// FILTER TASKS
// =====================================

filters.addEventListener("click", function(event) {

    if (event.target.tagName !== "BUTTON") return;

    currentFilter = event.target.dataset.filter;

    document.querySelectorAll(".filters button").forEach(function(button) {
        button.classList.remove("active");
    });

    event.target.classList.add("active");

    render();

});


// =====================================
// CLEAR COMPLETED TASKS
// =====================================

clearButton.addEventListener("click", function() {

    tasks = tasks.filter(function(task) {
        return !task.done;
    });

    save();
    render();

});


// =====================================
// INITIALIZE APPLICATION
// =====================================

tasks = load();
render();
