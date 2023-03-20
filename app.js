
class Task {
    constructor(text) {
        this.text = text;
        this.isDone = false;
    }
}

let counter = {
    tasksQuantity: 0,

    addTask() {
        this.tasksQuantity += 1;
        taskCount.textContent = this.tasksQuantity;
        this.save();
    },

    deleteTask() {
        if (this.tasksQuantity == 0) return;
        this.tasksQuantity -= 1;
        taskCount.textContent = this.tasksQuantity;
        this.save();
    },

    save() {
        localStorage.setItem("counter", this.tasksQuantity);
    },

    open() {
        this.tasksQuantity = +localStorage.getItem("counter");
        taskCount.textContent = this.tasksQuantity;
    },
}

let dataService = {
    tasks: [],

    get allTasks() {
        return this.tasks;
    },

    get notCompletedTasks() {
        return this.tasks.filter(task => task.isDone == false);
    },

    get CompletedTasks() {
        return this.tasks.filter(task => task.isDone == true);
    },

    add(task) {
        this.tasks.push(task);
        counter.addTask();
        this.save();
    },

    save() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    },

    open() {
        this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        if (this.tasks.length !== 0) startMessage.hidden = true;
    },

    delete(task) {
        this.tasks.splice(this.tasks.indexOf(task), 1)
        if (this.tasks.length === 0) startMessage.hidden = false;
        this.save();
    },
}

class TasksListView {
    element;
    dataService;

    constructor(element) {
        this.element = element;
        dataService = dataService;
    }

    #drawList(tasksElements) {
        this.element.innerHTML = "";

        tasksElements.forEach(taskElement => {
            taskElement.createIn(this.element);
        });
    }

    drawAll() {
        let taskElements = [];
        let tasks = dataService.allTasks;
        if (tasks.length == 0) return;

        tasks.forEach(task => {
            taskElements.push(new TaskView(task))
        });
        this.#drawList(taskElements);
    }

    drawNotCompleted() {
        let taskElements = [];
        let tasks = dataService.notCompletedTasks;
        if (tasks.length == 0) return;

        tasks.forEach(task => {
            taskElements.push(new TaskView(task))
        });
        this.#drawList(taskElements);
    }

    drawCompleted() {
        let taskElements = [];
        let tasks = dataService.CompletedTasks;
        if (tasks.length == 0) return;

        tasks.forEach(task => {
            taskElements.push(new TaskView(task))
        });
        this.#drawList(taskElements);
    }

    clearCompleted() {
        dataService.CompletedTasks.forEach(task => {
            dataService.delete(task)
            console.log(task);
        });
        this.drawAll()
    }
}


class TaskView {
    constructor(task) {
        this.task = task;
        this.div = null;
    }

    createIn(element) {

        this.div = document.createElement("div");
        this.div.classList.add("task-list__header");


        const inputCheckBox = document.createElement("input");
        inputCheckBox.classList.add("task-list__checkbox");
        inputCheckBox.type = "checkbox";

        const inputCustomCheckBox = document.createElement("label");
        inputCustomCheckBox.classList.add("task-list__custom-checkbox");
        inputCustomCheckBox.addEventListener("click", this.changeState.bind(this));

        const divText = document.createElement("p");
        divText.innerText = this.task.text;
        divText.classList.add("task-list__text")

        const divCross = document.createElement("span");
        divCross.classList.add("task-list__cross");
        divCross.addEventListener("click", this.deleteTask.bind(this));

        this.div.append(inputCheckBox);
        this.div.append(inputCustomCheckBox);
        this.div.append(divText);
        this.div.append(divCross);

        if (this.task.isDone) {
            this.div.classList.add("completed");
            this.div.children[1].classList.toggle("completed");
            this.div.children[2].classList.toggle("completed");
            inputCheckBox.checked = true;
        }
        element.append(this.div);
    }

    changeState() {
        this.task.isDone = !this.task.isDone;
        dataService.save();
        this.div.classList.toggle("completed");
        this.div.children[1].classList.toggle("completed");
        this.div.children[2].classList.toggle("completed");
        if (this.task.isDone) {
            counter.deleteTask();
        }
        if (!this.task.isDone) {
            counter.addTask();
        }
    }

    deleteTask() {
        dataService.delete(this.task);
        this.div.remove();
        if (this.task.isDone) return
        counter.deleteTask();
    }
}



//* Selector
const taskNameInput = document.querySelector(".name-task__input");
const taskListMain = document.querySelector(".task-list__main");
const taskCount = document.querySelector(".footer-list__item-counter");
const startMessage = document.querySelector(".task-list__start-message");

//* Button 
const showAllButton = document.querySelector("#all-button");
const showActiveButton = document.querySelector("#active-button");
const showCompletedButton = document.querySelector("#completed-button");
const clearButton = document.querySelector(".footer-list__clear");

//* Button for mobile
const showAllButtonMobile = document.querySelector("#all-button-mobile");
const showActiveButtonMobile = document.querySelector("#active-button-mobile");
const showCompletedButtonMobile = document.querySelector("#completed-button-mobile");



//* Loading from local storage
dataService.open();
counter.open();
let tasksListView = new TasksListView(taskListMain);


//* EventListeners
taskNameInput.addEventListener('keyup', function (e) {
    const keyName = e.key;

    if (keyName === 'Enter') {

        if (createTaskInput.value.length == 0 || createTaskInput.value.trim() == '') {

            alert("Please enter a task")

        } else {
            addTaskHandler()
        }
    }
});

showAllButton.addEventListener("click", showAllHandler);
showActiveButton.addEventListener("click", showNotCompletedHandler);
showCompletedButton.addEventListener("click", showCompletedHandler);
clearButton.addEventListener("click", clearCompletedTask);

//* EventListeners Mobile
showAllButtonMobile.addEventListener("click", showAllHandler);
showActiveButtonMobile.addEventListener("click", showNotCompletedHandler);
showCompletedButtonMobile.addEventListener("click", showCompletedHandler);


//* Function
window.addEventListener("load", function () {
    tasksListView.drawAll();
});

function addTaskHandler() {
    if (taskNameInput.value) {
        if (!startMessage.hidden) startMessage.hidden = true;

        let newTask = new Task(taskNameInput.value);
        dataService.add(newTask);
        tasksListView.drawAll();

        taskNameInput.value = "";
    }
}

function showAllHandler() {
    tasksListView.drawAll();
}

function showNotCompletedHandler() {
    tasksListView.drawNotCompleted();
}

function showCompletedHandler() {
    tasksListView.drawCompleted();
}

function clearCompletedTask() {
    tasksListView.clearCompleted();
}


//** Switch theme dark/light 
const background = document.querySelector("body")
const themeSwitch = document.querySelector(".header__switch__img")
const createTask = document.querySelector(".name-task")
const checkbox = document.querySelector(".name-task__custom-checkbox")
const createTaskInput = document.querySelector(".name-task__input")
const taskList = document.querySelector(".task-list")
const footerList = document.querySelector(".footer-list")
const footerListClear = document.querySelector(".footer-list__clear")
const footerMobile = document.querySelector(".footer-list__filter--mobile")


themeSwitch.addEventListener("click", function () {

    footerListClear.classList.toggle('dark');
    footerMobile.classList.toggle('dark');
    background.classList.toggle('dark');
    themeSwitch.classList.toggle('dark');
    createTask.classList.toggle('dark');
    createTaskInput.classList.toggle('dark');
    taskList.classList.toggle('dark');
    checkbox.classList.toggle('dark');
    footerList.classList.toggle('dark');
})

new Sortable(taskListMain, {
    animation: 350
})


