let tasks = {}; //

/*
  tasks (defined above) will be a place to store tasks by person;
  example:
  {
    person1: [{task object 1}, {task object 2}, etc.],
    person2: [{task object 1}, {task object 2}, etc.],
    etc.
  }
*/

module.exports = {
  reset: function () {
    tasks = {}; // (this function is completed for you.)
  },

  // ==== COMPLETE THE FOLLOWING (SEE `model.js` TEST SPEC) =====
  listPeople: function () {
    // returns an array of all people for whom tasks exist
    return Object.keys(tasks);

  },

  add: function (name, task) {
    // saves a task for a given person
    if (tasks[name] !== undefined) {
      // if name is already an existing key, pushes the task to their value
      // (their value is the tasks array)
      if (task.complete !== undefined) {
        // if the given task does have a completion status
        tasks[name].push(task);
      } else {
        tasks[name].push({content: task.content, complete: false});
      }
    } else {
      // if the name is not an existing key, initialize a new key-value
      // set it equal to an array, and then push the task to the new property
      tasks[name] = [];
      if (task.complete !== undefined) {
        tasks[name].push(task);
      } else {
        tasks[name].push({content: task.content, complete: false});
      }
    }
  },

  list: function (name) {
    // returns tasks for specified person
    return tasks[name];
  },

  complete: function (name, idx) {
    // marks a task complete
    tasks[name][idx].complete = true;
  },

  remove: function (name, idx) {
    // removes a tasks
    tasks[name].splice(idx, 1);
  },
};
