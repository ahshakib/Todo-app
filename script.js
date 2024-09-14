const taskInput = document.getElementById("taskInp");
const addBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list")
const completedTaskList = document.getElementById("completed-task-list")

document.addEventListener("DOMContentLoaded", loadTasks)

addBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    if(taskText) {
        addTask(taskText, false)
        taskInput.value = ""
        saveTask()
    }
})

function addTask(taskText, isCompleted) {
    const li = document.createElement("li")
    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.checked = isCompleted

    checkbox.addEventListener("change", () => {
        if(checkbox.checked) {
            moveToCompleted(li)
        } else {
            moveToPending(li)
        }
        saveTask()
    })

    li.appendChild(checkbox)

    const span = document.createElement("span")
    span.classList.add("task-text")
    span.textContent = taskText
    li.appendChild(span)

    const editBtn = document.createElement("button")
    editBtn.textContent = "Edit"
    editBtn.addEventListener("click", () => {
        if(editBtn.textContent === "Edit") {
            span.innerHTML = `<input type="text" class="edit-mode" value="${span.textContent}">`
            editBtn.textContent = "Save"
        } else {
            const input = span.querySelector("input")
            span.textContent = input.value
            editBtn.textContent = "Edit"
            saveTask()
        }
    })
    li.appendChild(editBtn)

    const deleteBtn = document.createElement("button")
    deleteBtn.textContent = "Delete"
    deleteBtn.addEventListener("click", () => {
        li.remove()
        saveTask()
    })
    li.appendChild(deleteBtn)

    if(isCompleted) {
        completedTaskList.appendChild(li)
        li.classList.add("completed")
    } else {
        taskList.appendChild(li)
    }
}

function moveToCompleted(li) {
    li.classList.add("completed")
    li.querySelector("button").remove()
    completedTaskList.appendChild(li)
}

function moveToPending(li) {
    li.classList.remove("completed")
    const editBtn = document.createElement("button")
    editBtn.textContent = "Edit"
    li.insertBefore(editBtn, li.querySelector("button"))
    taskList.appendChild(li)
}

function saveTask() {
    const tasks = []
    taskList.querySelectorAll("li").forEach(element => {
        const taskText = element.querySelector(".task-text").textContent
        tasks.push({text: taskText, completed: false})
    });

    completedTaskList.querySelectorAll("li").forEach(element => {
        const taskText = element.querySelector(".task-text").textContent
        tasks.push({text: taskText, completed: true})
    })
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || []
    tasks.forEach(task => addTask(task.text, task.completed))
}