




function filterAndDisplayTasksByBoard(boardName) {
    const tasks = filteredTasks.getTasks(); // Fetch tasks from a simulated local storage function
    const filteredTasks = tasks.filter(task => task.board === boardName);
  
    // Ensure the column titles are set outside of this function or correctly initialized before this function runs
  
    elements.columnDivs.forEach(column => {
      const status = column.getAttribute("data-status");
      // Reset column content while preserving the column title
      if (status){
      column.innerHTML = `<div class="column-head-div">
                            <span class="dot" id="${status}-dot"></span>
                            <h4 class="columnHeader">${status.toUpperCase()}</h4>
                          </div>`;
  
      const tasksContainer = document.createElement("div");
      column.appendChild(tasksContainer);
  
      filteredTasks.filter(task => task.status === status).forEach(task => { 
        const taskElement = document.createElement("div");
        taskElement.classList.add("task-div");
        taskElement.textContent = task.title;
        taskElement.setAttribute('data-task-id', task.id);
  
        // Listen for a click event on each task and open a modal
        taskElement.addEventListener("click", () => { 
          openEditTaskModal(task);
        });
  
        tasksContainer.appendChild(taskElement);
      });
    });
  } else {
    console.log("column without data stats")
  }
  
  
  function refreshTasksUI() {
    filterAndDisplayTasksByBoard(activeBoard);
  }
  
  // Styles the active board by adding an active class
  // TASK: Fix Bugs
  function styleActiveBoard(boardName) {
    document.querySelectorAll('.board-btn').foreach(btn => { 
      
      if(btn.textContent === boardName) {
        btn.classList.add('active') 
      }
      else {
        btn.classList.remove('active'); 
      }
    });
  }
  
  