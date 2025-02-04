let taskinput = document.querySelector("#taskinput");
let button = document.getElementById("newtask");
let tasklist = document.querySelector(".tasklist");
const progressbar = document.querySelector("#progress")
const TaskNo = document.querySelector("#numbers")

let tasks = [];
let editingIndex = null; // To keep track of the task being edited

// Load tasks from localStorage when the page loads
window.onload = () => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks && Array.isArray(storedTasks)) {
        tasks = storedTasks; // Set tasks from localStorage
        updateTaskList();
        updateStates();
        updateTaskNo();
    }
};

const updateTaskList = () => {
    tasklist.innerHTML = "";

    tasks.forEach((task, index) => {
        const listitem = document.createElement("li");

        listitem.innerHTML = `
        <div class="taskitem">
            <div class="task ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} data-index="${index}">
                <p>${task.taskname}</p>
            </div>
            <div class="icons">
                <img class="invert" src="img/edit.png" onClick="editTask(${index})">
                <img class="invert" src="img/delete.png" onClick="deleteTask(${index})">
            </div>
        </div>`;

        listitem.querySelector(".checkbox").addEventListener("change", () => toggleTaskComplete(index));
        tasklist.append(listitem);
    });
}

const addTask = () => {
    const text = taskinput.value.trim();
    if (text) {
        if (editingIndex !== null) {
            // Update the task at editingIndex with the new task name
            tasks[editingIndex].taskname = text;
            editingIndex = null; // Reset the editing index after saving
        } else {
            tasks.push({ taskname: text, completed: false }); // Add new task
        }
        updateTaskList();
        taskinput.value = ''; // Clear input field after adding or editing task
    }
    updateStates();
    updateTaskNo();
    saveTasksToLocalStorage();
}

const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTaskList();
    updateStates();
    updateTaskNo();
    saveTasksToLocalStorage();
}

const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTaskList();
    updateStates();
    updateTaskNo();
    saveTasksToLocalStorage();
}

const editTask = (index) => {
    taskinput.value = tasks[index].taskname; // Pre-fill the input with the current task name
    editingIndex = index; // Set the index of the task being edited
    taskinput.focus(); // Optionally, set focus to the input field

    updateStates();
    updateTaskNo();
}

const updateStates = () => {
    let completeTask = tasks.filter(task => task.completed).length
    let totalTasks = tasks.length;

    const progress = (completeTask / totalTasks) * 100
    progressbar.style.width = `${progress}%`
}

const updateTaskNo = () => {
    let completeTask = tasks.filter(task => task.completed).length
    let totalTasks = tasks.length;
    TaskNo.innerHTML = `${completeTask} / ${totalTasks}`
}

// Save tasks to localStorage
const saveTasksToLocalStorage = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add Event listener for button 
button.addEventListener("click", (e) => {
    e.preventDefault();
    addTask();
});
