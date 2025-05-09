const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const tasksList = document.getElementById('tasks-list');
const messageBox = document.getElementById('message-box');
const messageText = document.getElementById('message-text');
const messageClose = document.getElementById('message-close');

let tasksData = [];
let tasksCounter = 0; // always increments to ensure the uniqueness of IDs

// get tasksData from local storage
if (localStorage.toDoListAppTasks) {
    tasksData = JSON.parse(localStorage.toDoListAppTasks);
    if (tasksData.length > 0) {
        tasksCounter = Math.max(...tasksData.map(task => task.id)) + 1;
        // render existing tasks ui
        tasksData.forEach(task => renderNewTask(task.content, task.id, task.done));
    }
}

function addTask() {
    let taskData = taskInput.value.trim();
    if (taskData) {
        // add task to tasksData array
        tasksData.push({
            id: tasksCounter,
            content: taskData,
            done: false,
        });
        // save new tasksData to local storage
        saveDataToLocalStorage();
        // render the new task ui
        renderNewTask(taskData, tasksCounter);
        // increment tasksCounter
        tasksCounter++;
        // clear task input
        taskInput.value = '';
        // show message
        showMessage('Task added successfully!', 'green', '#d4edda');
    }
    else {
        showMessage('Task Can Not Be Empty!', 'red');
    }
}

// add task on clicking the addTask button
addTaskBtn.addEventListener('click', addTask);

// add task on clicking the Enter key
taskInput.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
        addTaskBtn.click();
    }
});

function renderNewTask(taskData, taskId, done = false) {
    // append new task item to tasksList
    tasksList.innerHTML += `<li id='task-${taskId}' class='${done ? "checked" : ""}'>
                                <img src='${done ? "images/checked.png" : "images/unchecked.png"}' alt='checking' onclick='toggleChecked(${taskId})'>
                                <span onclick='toggleChecked(${taskId})'>${taskData}</span>
                                <button onclick='deleteTask(${taskId})'>delete task</button>
                            </li>`;
}

function deleteTask(taskId) {
    // delete task from tasksData
    tasksData = tasksData.filter(task => task.id !== taskId);
    // save new tasksData to local storage
    saveDataToLocalStorage();
    // delete task from ui
    document.getElementById(`task-${taskId}`).remove();
    // show message
    showMessage('Task deleted successfully!', 'red');
}

function toggleChecked(taskId) {
    const intendedTask = tasksData.find(task => task.id === taskId);
    // toggle done flag
    intendedTask.done = !intendedTask.done;
    // toggle checked class on the list item
    document.getElementById(`task-${taskId}`).classList.toggle('checked');
    // toggle checked image of the list item
    document.querySelector(`#task-${taskId}>img`).src = intendedTask.done ? "images/checked.png" : "images/unchecked.png";
    // save new tasksData to local storage
    saveDataToLocalStorage();
    // show message
    if (intendedTask.done) {
        showMessage('Task done successfully!', 'green', '#d4edda');
    }
    // show message if all tasks done
    if (tasksData.every(task => task.done)) {
        showMessage('All tasks completed — great job! 🥳', 'green', '#d4edda');
    }
}

// handle message box
messageClose.addEventListener('click', () => {
    messageBox.style.display = 'none';
});

function showMessage(text, color = 'red', bgColor = '#f8d7da') {
    messageText.innerHTML = text;
    messageText.style.color = color;
    messageBox.style.backgroundColor = bgColor;
    messageBox.style.display = 'flex'; // Make sure it's visible

    // Auto-hide after 3 seconds (optional)
    setTimeout(() => {
        if (messageBox) messageBox.style.display = 'none';
    }, 5000);
}

function saveDataToLocalStorage() {
    localStorage.toDoListAppTasks = JSON.stringify(tasksData);
}