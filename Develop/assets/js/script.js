// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
// WHAT IS THIS FUNCTION DOING? This function should increment the nextId variable and update it in local storage. 
function generateTaskId() {
    console.log('inside generateTaskId() function')
    // console.log('nextId: ', nextId)
    // TODO: write an if/else statement where IF nextId does not exist in 
    // localStorage (hint: it's null), set nextId to 1.  ELSE, increment it 
    //by 1 (Docs for Increment: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Increment)
    if (nextId === null) {
        nextId = 1;
    } else {
        nextId++;
    }
    console.log('nextId: ', nextId)

    // TODO: save nextId to localStorage
    // Example: localStorage.setItem("variableName", JSON.stringify(variableName)); 
    localStorage.setItem("nextId", JSON.stringify(nextId)); 


    // TODO: return nextId; 
    return nextId;
}

// Todo: create a function to create a task card
// WHAT IS THIS FUNCTION DOING?  This function should create an HTML card element for a given task object
function createTaskCard(task) {
    console.log('inside createTaskCard() with data passed: ', task)
    
   
    const taskDueDate = dayjs(task.dueDate).format('MM/DD/YYYY');
    // console.log('formatted date: ', taskDueDate)
    // TODO: create card elements (HINT: Module 5, Mini Project SOLVED, script.js, lines 37-67)
        //Example: 
        const taskCard = $('<div>')
              .addClass('card project-card draggable my-3')
              .attr('id', task.id);
        const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
        const cardBody = $('<div>').addClass('card-body');
        const cardDescription = $('<p>').addClass('card-text').text(task.description);
        const cardDueDate = $('<p>').addClass('card-text').text(taskDueDate);
        const cardDeleteBtn = $('<button>')
            .addClass('btn btn-danger delete')
            .text('Delete')
            .attr('id', task.id);
        cardDeleteBtn.on('click', handleDeleteTask);

    // TODO: set card background color based on due date
        // Example: 
        if (task.dueDate && task.status !== 'done') {
            const now = dayjs();
            // console.log('now: ', now)
            const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');
            if (now.isSame(taskDueDate, 'day')) {
                // console.log('same day')
                taskCard.addClass('bg-warning text-white');
            } else if (now.isAfter(taskDueDate)) {
                // console.log('after due date')
                taskCard.addClass('bg-danger text-white');
                cardDeleteBtn.addClass('border-light');
            }
        }

    // TODO: append card elements
        // Example: 
        cardBody.append(cardDueDate, cardDescription, cardDeleteBtn);
        taskCard.append(cardHeader, cardBody);

        console.log(`appending ${task.title} with status ${task.status} to do column`)
        const todoCardsColumn = $('#todo-cards');
        todoCardsColumn.append(taskCard);
  
    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        // snap: true,
        // start: function() {
        //     console.log('start')
        // },
        // stop: function() {
        //     console.log('stop')
        // },
        // drag: function() {
        //     console.log('drag');
        // },
            //function to clone the card being dragged so that the original card remains in place
        helper: function (e) {
            
            // check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
            const original = $(e.target).hasClass('ui-draggable')
              ? $(e.target)
              : $(e.target).closest('.ui-draggable');
            //return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
            return original.clone().css({
              width: original.outerWidth(),
            });
          },
        });

    return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
// WHAT IS THIS FUNCTION DOING? This function should render all the task cards in their respective lanes &&  make them draggable using jQuery UI
function renderTaskList() {
    console.log("renderTaskList()")
    // TODO: write an if/else statement where IF taskList is null, set it to an empty array
    if (taskList === null) {
        taskList = [];
    }
    // TODO: empty existing task cards   
        // Example: 
        const todoList = $('#todo-cards');
        todoList.empty(); 

        const inProgressList = $('#in-progress-cards');
        inProgressList.empty(); 

        const doneList = $('#done-cards');
        doneList.empty(); 

    // TODO: loop through tasks and create task cards for each status 
        // Example: 
          for (let task of taskList) {
        if (task.status === 'todo') {
            console.log(`${task.title} ${task.status} will be appended to Todo`);
            todoList.append(createTaskCard(task));
            console.log(`${task.title} ${task.status} IS NOW IN Todo`);
          } else if (task.status === 'in-progress') {
            console.log(`${task.title} ${task.status} will be appended to InProgress`);
            inProgressList.append(createTaskCard(task));
            console.log(`${task.title} ${task.status} IS NOW IN InProgress`);
          } else if (task.status === 'done') {
            console.log(`${task.title} ${task.status} will be appended to Done`);
            console.log(`${task.title} ${task.status} IS NOW IN Done`);
            doneList.append(createTaskCard(task));
          }
        }

    // TODO: use JQuery UI to make task cards draggable
        // Example: 
        // $('.draggable').draggable({
        // opacity: 0.7,
        // zIndex: 100,
        //     //function to clone the card being dragged so that the original card remains in place
        // helper: function (e) {
            
        //     // check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
        //     const original = $(e.target).hasClass('ui-draggable')
        //       ? $(e.target)
        //       : $(e.target).closest('.ui-draggable');
        //     //return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
        //     return original.clone().css({
        //       width: original.outerWidth(),
        //     });
        //   },
        // });
}

// Todo: create a function to handle adding a new task
// WHAT IS THIS FUNCTION DOING? This function should handle the form submission for adding a new task
function handleAddTask(event){
    console.log('got here inside the handleAddTask() function')
        // TODO: method to prevent default behavior of browser event
            // Example: 
        event.preventDefault(); 
        
        // TODO: create a new task object
            // Example: 
        const taskTitle = $('#tasks-title').val();
        console.log('tasksTitle: ', taskTitle);

        const taskDueDate = $('#tasks-due-date').val();
        console.log('taskDueDate: ', taskDueDate); 

        const taskDescription = $('#description').val(); // the value of the textarea
        console.log('taskDescription: ', taskDescription);

        const taskId = generateTaskId();
        console.log('taskId: ', taskId);

        const task = {
            id: taskId,
            title: taskTitle,
            description: taskDescription,
            dueDate: taskDueDate,
            status: 'todo'
        }; 
        console.log('task data put together is: ', task);

        createTaskCard(task);
        // TODO: add the new task to the task list
            // Example: 
            // projects.push(newProject)
        // const projects = [];
        
        // TODO: save to local storage 
        if (taskList === null) {
            taskList = [];
        }
        taskList.push(task);
        console.log('taskList array with the new card data: ', taskList);
        localStorage.setItem("tasks", JSON.stringify(taskList));

        // TODO: call renderTaskList() 
        // renderTaskList();
        // TODO: clear the form inputs 
            // Example: 
            // $('#idForTaskTitle').val('');
            // $('#idForTaskDescription').val('');
            // $('#idForTaskDueDate').val('');
}

// Todo: create a function to handle deleting a task
// WHAT IS THIS FUNCTION DOING? This function should handle deleting a task when the delete button is clicked
function handleDeleteTask(event){
    console.log('inside handleDeleteTask()');
    // TODO: method to prevent default behavior of browser event

    // TODO: get the task id from the button clicked 
        // Example: 
        const cardId = $(this).attr('id'); //1, 2, 100
        console.log('cardId: ' + cardId); // 'projectId: 1' in the console log
       
        const cardIdHash ='#' + cardId;
        console.log('cardIdHash: ' + cardIdHash); // '# 1'
        // console.log(`projectID with hashtag: `)
        $(cardIdHash).remove(); // removing id="1" or "#1"



    // TODO: remove the task from the taskList using the filter (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) method
        // Example: 
        taskList = taskList.filter((task) => task.id !== parseInt(cardId));  
        console.log('taskList: ', taskList);

    // TODO: save to local storage 
        // Example: 
         localStorage.setItem('tasks', JSON.stringify(taskList));
    
    // TODO: call renderTaskLIst() 
}

// Todo: create a function to handle dropping a task into a new status lane
// WHAT IS THIS FUNCTION DOING? This function should handle changing the status of a task when it is dropped into a new lane.
function handleDrop(event, ui) {
    console.log('A card was dropped in a column');
    // TODO: get the task id and new status from the event
        // Example: 
        // const taskId = ui.draggable[0].dataset.projectId;
        // const newStatus = event.target.id;

    //TODO: write a for...of loop to update the task status of the dragged card 
        // Example: 
        // for (let task of taskList) {
        //     if (task.id === taskId) {
        //         task.status = newStatus;
        //     }
        // }
        console.log('taskList: ', taskList);
        // Get the card that was dragged and dropped
        // const taskId = ui.draggable[0].dataset.projectId; // <-- Teacher suggestion but I decided not to use data-set-projectid when the card was made in createTaskCard()
        const draggableTaskCardId = ui.draggable.attr("id");
        console.log('draggableTaskCardId: ', draggableTaskCardId);
        
        // Get the column id that the card was dropped to.
        const droppaleColumnId = event.target.id;
        console.log('droppaleColumnId: ', droppaleColumnId);
        // It just so happens that the droppableColumnId can be
        // used as the status text needed to be saved in 
        // localStorage
        console.log('newStatus: ', droppaleColumnId);
        
        // Using jQuery to get the specific card element by it's id
        const droppedElement = $(`#${draggableTaskCardId}`); 
        // Appending the dropped card element to the column element
        // will remove it from the previous column to the
        // dropped column
        droppedElement.appendTo(`#${droppaleColumnId}-cards`);
        // Update the column that the card is now in
        droppedElement.attr('data-column', droppaleColumnId); // Do we still need this?

    //TODO: write a for...of loop to update the task status of the dragged card 
        // Example: 
        for (let task of taskList) {
        //     console.log('typeof taskId: ', typeof task.id);
        //     console.log('typeof draggableTaskCardId: ', typeof draggableTaskCardId);
            if (task.id === parseInt(draggableTaskCardId)) {
                console.log("got here")
                task.status = droppaleColumnId;
            }
        }
        console.log('new tasksList: ', taskList)
    // TODO: save to local storage 
        // Example: 
         localStorage.setItem('tasks', JSON.stringify(taskList));
 
    // TODO: call renderTaskList()
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    console.log('document should be ready');
    // HINT: Module 5, Mini Project SOLVED, script.js, lines 201-215
    // TODO: render the task list 
    renderTaskList();

    // TODO: add event listener 
    $("#create-task-form").submit(function(event) {
        console.log('The Enter button was clicked');
        console.log('About to call handleAddTask() function')
        handleAddTask(event);
    });
    // TODO: make lanes droppable 

    console.log('taskList: ', taskList)

    
    // TODO: make lanes droppable 
    $("#todo").droppable({
        classes: {
          "ui-droppable-active": "ui-state-active",
          "ui-droppable-hover": "ui-state-hover"
        },
        drop: function( event, ui ) {
            console.log('the card data that was just dropped: ', ui);
            handleDrop(event, ui);
        }
      });

      $( "#in-progress" ).droppable({
        drop: function(event, ui) {
        //   console.log('event.target: ', event.target);
          console.log('the card data that was just dropped: ', ui);
          handleDrop(event, ui);
        //   const draggableId = ui.draggable.attr("id");
        //   console.log('draggableId: ', draggableId); // Get the card that was dragged and dropped
        //   const droppableId = $(this).attr("id");
        //   console.log('droppableId: ', droppableId);
        //   const droppedElement = $(`#${draggableId}`); // Get the column id that the card was dropped to.
        //   droppedElement.appendTo("#in-progress-cards");
        //   droppedElement.attr('data-column', 'in-progress'); // Update the column that the card is now in
        }
      });

      $("#done").droppable({
        classes: {
          "ui-droppable-active": "ui-state-active",
          "ui-droppable-hover": "ui-state-hover"
        },
        drop: function( event, ui ) {
            console.log('the card data that was just dropped: ', ui);
          handleDrop(event, ui);
        }
      });
});
