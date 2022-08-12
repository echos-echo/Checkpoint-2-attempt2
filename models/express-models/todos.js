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

    // if the name is not an existing key, initialize a new key and have its value be an empty array
    if (this.list(name) === undefined) tasks[name] = [];

    // if a completion status is provided, push the task as is,
    // if a status is not provided, default it to false and push the task
    if (task.complete !== undefined) {
      this.list(name).push(task);
    } else {
      this.list(name).push({content: task.content, complete: false});
    }
  },

  list: function (name) {
    // returns tasks for specified person
    return tasks[name];
  },

  complete: function (name, idx) {
    // marks a task complete
    this.list(name)[idx].complete = true;
  },

  remove: function (name, idx) {
    // removes a tasks
    this.list(name).splice(idx, 1);
  },
};
