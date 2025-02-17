// TASK: import helper functions from utils
// TASK: import initialData
import * as taskFunctions from "/utils/taskFunctions.js";
import { initialData } from "/initialData.js";
//import { getTasks } from "./utils/taskFunctions";

//console.log(initialData);
//console.log(taskFunctions.getTasks);
/*************************************************************************************************************************************************
 * FIX BUGS!!!
 * **********************************************************************************************************************************************/

// Function checks if local storage already has data, if not it loads initialData to localStorage
function initializeData(data) {
  if (!localStorage.getItem("tasks")) {
    localStorage.setItem("tasks", JSON.stringify(data));
    localStorage.setItem("showSideBar", "true");
  } else {
    console.log("Data already exists in localStorage");
  }
}
initializeData(initialData);
//console.log(localStorage.tasks);

// TASK: Get elements from the DOM
const elements = {
  headerBoardName: document.getElementById("header-board-name"),
  columnDivs: document.querySelectorAll(".column-div"),
  filterDiv: document.getElementById("filterDiv"),
  hideSideBarBtn: document.getElementById("hide-side-bar-btn"),
  themeSwitch: document.getElementById("switch"),
  createNewTaskBtn: document.getElementById("add-new-task-btn"),
  modalWindow: document.getElementById("new-task-modal-window"),
  sideBar: document.getElementById("side-bar-div"),
  showSideBarBtn: document.getElementById("show-side-bar-btn"),
  editTaskModal: document.getElementById("edit-task-form"),
};

let activeBoard = "";

// Extracts unique board names from tasks
// TASK: FIX BUGS/////////////////////////////////////////////I think this is done
function fetchAndDisplayBoardsAndTasks() {
  const tasks = taskFunctions.getTasks();
  const boards = [...new Set(tasks.map((task) => task.board).filter(Boolean))];
  displayBoards(boards);
  if (boards.length > 0) {
    const localStorageBoard = JSON.parse(localStorage.getItem("activeBoard"));
    activeBoard = localStorageBoard ? localStorageBoard : boards[0];
    elements.headerBoardName.textContent = activeBoard;
    styleActiveBoard(activeBoard);
    refreshTasksUI();
  }
  //console.log(activeBoard);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Creates different boards in the DOM
// TASK: Fix Bugs
function displayBoards(boards) {
  const boardsContainer = document.getElementById("boards-nav-links-div");
  boardsContainer.innerHTML = ""; // Clears the container
  boards.forEach((board) => {
    const boardElement = document.createElement("button");
    boardElement.textContent = board;
    boardElement.classList.add("board-btn");
    boardElement.addEventListener("click", function () {
      elements.headerBoardName.textContent = board;
      filterAndDisplayTasksByBoard(board);
      activeBoard = board; //assigns active board
      localStorage.setItem("activeBoard", JSON.stringify(activeBoard));
      styleActiveBoard(activeBoard);
    });
    boardsContainer.appendChild(boardElement);
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Filters tasks corresponding to the board name and displays them on the DOM.
// TASK: Fix Bugs
function filterAndDisplayTasksByBoard(boards) {
  const tasks = taskFunctions.getTasks(); // Fetch tasks from a simulated local storage function
  const filteredTasks = tasks.filter((task) => task.board === boards);
  //console.log(tasks);
  //console.logs(filteredTasks);
  // Ensure the column titles are set outside of this function or correctly initialized before this function runs

  elements.columnDivs.forEach((column) => {
    const status = column.getAttribute("data-status");
    // Reset column content while preserving the column title
    if (status) {
      column.innerHTML = `<div class="column-head-div">
                          <span class="dot" id="${status}-dot"></span>
                          <h4 class="columnHeader">${status.toUpperCase()}</h4>
                        </div>`;

      const tasksContainer = document.createElement("div");
      tasksContainer.classList.add("tasks-container");
      column.appendChild(tasksContainer);

      //console.log(status);

      filteredTasks
        .filter((task) => task.status === status)
        .forEach((task) => {
          const taskElement = document.createElement("div");
          taskElement.classList.add("task-div");
          taskElement.textContent = task.title;
          taskElement.setAttribute("data-task-id", task.id);

          // Listen for a click event on each task and open a modal
          taskElement.addEventListener("click", () => {
            openEditTaskModal(task);
          });

          tasksContainer.appendChild(taskElement);
        });
    } else {
      console.log("no status");
    }
  });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function refreshTasksUI() {
  filterAndDisplayTasksByBoard(activeBoard);
}

// Styles the active board by adding an active class
// TASK: Fixed Bugs: forEach didnt have capital E and .classlist was missing from the if and else /////////////////////////////
function styleActiveBoard(boardName) {
  document.querySelectorAll(".board-btn").forEach((btn) => {
    if (btn.textContent === boardName) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addTaskToUI(task) {
  const column = document.querySelector(`.column-div[data-status="${task.status}"]`);
  if (!column) {
    console.error(`Column not found for status: ${task.status}`);
    return;
  }

  let tasksContainer = column.querySelector(".tasks-container");
  if (!tasksContainer) {
    console.warn(`Tasks container not found for status: ${task.status}, creating one.`);
    tasksContainer = document.createElement("div");
    tasksContainer.className = "tasks-container";
    column.appendChild(tasksContainer);
  }

  const taskElement = document.createElement("div");
  taskElement.className = "task-div";
  taskElement.textContent = `${task.title}`; // Modify as needed
  taskElement.setAttribute("data-task-id", task.id);

  tasksContainer.appendChild(taskElement);
}

function setupEventListeners() {
  // Cancel editing task event listener
  const cancelEditBtn = document.getElementById("cancel-edit-btn");
  cancelEditBtn.addEventListener("click", () => toggleModal(false, elements.editTaskModal));

  // Cancel adding new task event listener
  const cancelAddTaskBtn = document.getElementById("cancel-add-task-btn");
  cancelAddTaskBtn.addEventListener("click", () => {
    toggleModal(false);
    elements.filterDiv.style.display = "none"; // Also hide the filter overlay
  });

  // Clicking outside the modal to close it
  elements.filterDiv.addEventListener("click", () => {
    toggleModal(false);
    elements.filterDiv.style.display = "none"; // Also hide the filter overlay
  });

  // Show sidebar event listener
  elements.hideSideBarBtn.addEventListener("click", () => toggleSidebar(false));
  //changed second eventListener to the showSideBarBtn
  elements.showSideBarBtn.addEventListener("click", () => toggleSidebar(true));

  // Theme switch event listener
  elements.themeSwitch.addEventListener("change", toggleTheme);

  // Show Add New Task Modal event listener
  elements.createNewTaskBtn.addEventListener("click", () => {
    toggleModal(true);
    elements.filterDiv.style.display = "block"; // Also show the filter overlay
  });

  // Add new task form submission event listener
  elements.modalWindow.addEventListener("submit", (event) => {
    addTask(event);
  });
}

// Toggles tasks modal
// Task: Fix bugs
function toggleModal(show, modal = elements.modalWindow) {
  modal.style.display = show ? "block" : "none";
}

/*************************************************************************************************************************************************
 * COMPLETE FUNCTION CODE
 * **********************************************************************************************************************************************/

function addTask(event) {
  event.preventDefault();
  const titleInput = document.getElementById("title-input").value;
  const descInput = document.getElementById("desc-input").value;
  const statusSelect = document.getElementById("select-status").value;
  //Assign user input to the task object
  const task = {
    title: titleInput,
    description: descInput,
    status: statusSelect,
    board: activeBoard,
  };

  const newTask = taskFunctions.createNewTask(task);
  if (newTask) {
    addTaskToUI(newTask);
    toggleModal(false);
    elements.filterDiv.style.display = "none"; // Also hide the filter overlay
    event.target.reset();
    refreshTasksUI();
  }
}

function toggleSidebar(show) {
  if (show) {
    //if true, sidebar display style set to block "block", buttons are also either "none" or "block" depending on which must be shown"
    elements.sideBar.style.display = "block";
    localStorage.setItem("showSideBar", "true"); //updating state in local storage
    elements.showSideBarBtn.style.display = "none";
    elements.hideSideBarBtn.style.display = "block";
  } else {
    //if false, sidebar display style set to block "none"
    elements.sideBar.style.display = "none";
    localStorage.setItem("showSideBar", "false"); //updating state in local storage
    elements.showSideBarBtn.style.display = "block";
    elements.hideSideBarBtn.style.display = "none";
  }
}

function toggleTheme(theme) {
  const isChecked = theme.target.checked;
  if (isChecked) {
    //if the theme toggle is enabled it will add the light-theme to the class list.
    document.body.classList.add("light-theme");
    localStorage.setItem("light-theme", "enabled"); //update to local storage
  } else {
    //if the toggle is disabled it will take away the light theme class.
    document.body.classList.remove("light-theme");
    localStorage.setItem("light-theme", "disabled"); //update to local storage
  }
}

function openEditTaskModal(task) {
  // Set task details in modal inputs

  // Get button elements from the task modal

  // Call saveTaskChanges upon click of Save Changes button

  // Delete task using a helper function and close the task modal

  toggleModal(true, elements.editTaskModal); // Show the edit task modal
}

function saveTaskChanges(taskId) {
  // Get new user inputs

  // Create an object with the updated task details

  // Update task using a hlper functoin

  // Close the modal and refresh the UI to reflect the changes

  refreshTasksUI();
}

/*************************************************************************************************************************************************/

document.addEventListener("DOMContentLoaded", function () {
  init(); // init is called after the DOM is fully loaded
});

function init() {
  setupEventListeners();
  const showSidebar = localStorage.getItem("showSideBar") === "true";
  toggleSidebar(showSidebar);
  const isLightTheme = localStorage.getItem("light-theme") === "enabled";
  //if statement added so that if the page is refreshed on light mode then the toggle switch will remain on the light theme instead of going back to dark position.
  if (elements.themeSwitch) {
    elements.themeSwitch.checked = isLightTheme;
  }
  document.body.classList.toggle("light-theme", isLightTheme);
  fetchAndDisplayBoardsAndTasks(); // Initial display of boards and tasks
}
