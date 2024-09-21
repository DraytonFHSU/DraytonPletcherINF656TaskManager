// Import Fs module
const { readFile, writeFile } = require("fs");

// Helper functions to read and write from a json file
function readTasks(callback) {
  readFile('data/tasks.json', 'utf-8', (err, content) => {
    //Error handling
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
    try {
      const tasks = JSON.parse(content);
      callback(tasks);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
    }
  });
}

function writeTasks(tasks, callback) {
  writeFile('data/tasks.json', JSON.stringify(tasks, null, 2), 'utf-8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    if (callback) callback();
  });
}

// Read the entire content of the file
function getAllTasks() {
  readFile('data/tasks.json', "utf-8", (err, content) => {
    if (err) throw err;
    console.log("ALL tasks:\n", content);
    getUserChoice(); // Prompt again after displaying tasks
  });
}

//condensed view
function listTasks() {
  readTasks(tasks => {
    console.log('ALL tasks:\n', tasks);
    getUserChoice(); // Prompt again after listing tasks
  });
}

// Add a new task
function addTask(task) {
  readTasks(tasks => {
    //this id generator only works if there's no gaps, but should be sufficient here
    const id = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
    const newTask = { id, ...task, completed: false };
    tasks.push(newTask);
    writeTasks(tasks, () => {
      console.log('Task added:', newTask);
      getUserChoice(); // Prompt again after adding the task
    });
  });
}


// Mark a task as complete
function completeTask(taskID) {
  readTasks(tasks => {
    const task = tasks.find(t => t.id === taskID);
    if (task) {
      task.completed = true;
      writeTasks(tasks, () => console.log('Task completed:', task));
    } else {
      console.log('Task not found');
    }
    getUserChoice(); // Prompt again after completing the task
  });
}

// Initial instructions
console.log("Get Array: (1)\nList Tasks: (2)\nAdd a Task: (3)\nMark task as Complete: (4)\nExit: (5)\n");

//include and set up readline for user input
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const rl = readline.createInterface({ input, output });

//Handles options and input loop
function getUserChoice() {
  rl.question('Please select an option\n', (answer) => {
    switch (answer) {
      case '1':
        getAllTasks();
        return;
      case '2':
        listTasks();
        return;
      case '3':
        rl.question('Write the name of the task:\n', (taskName) => {
          rl.question('Write the description of the task:\n', (taskDescription) => {
            addTask({ name: taskName, description: taskDescription });
          });
        });
        return; // Exit the switch to avoid calling getUserChoice immediately
      case '4':
        rl.question('Which task do you want to mark as complete? (enter task ID)\n', (taskComplete) => {
          completeTask(parseInt(taskComplete));
        });
        return; // Exit the switch
      case '5':
        rl.close(); // Exit the application
        return;
      default:
        console.log('Invalid option. Please try again.');
        getUserChoice(); // Prompt again for a valid option
    }
  });
}

//Start the program
getUserChoice();
