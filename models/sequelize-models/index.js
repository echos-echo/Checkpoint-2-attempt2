const db = require('./database');
const Sequelize = require('sequelize');

// Make sure you have `postgres` running!

//---------VVVV---------  your code below  ---------VVV----------

// instantiating the model Task which connects to table, Task
const Task = db.define('Task', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  complete: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  due: Sequelize.DATE,
});

// Class method: will delete all rows where completion status (complete) is true
Task.clearCompleted = async () => {
  await Task.destroy({
    where: {
      complete: true
    }
  })
}

// Class method: changes complete status for all rows to true
Task.completeAll = async () => {
  await Task.update(
    { complete: true },
    { where: {} }
    )
}

// Instance method: returns time remainind until the task is due
Task.prototype.getTimeRemaining = function() {
  // if there is no due time on the task, return Infinity; otherwise returns the time remaining
  return this.due === undefined ? Infinity : this.due - Date.now();
}

// Instance method: returns true if the task is overdue, and false if there is time left/complete on time
Task.prototype.isOverdue = function() {
  // difference between the (hopefully) future due date and current time
  // if dueStatus is negative, that means the due date already passed...
  const dueStatus = this.due - Date.now();
  if (dueStatus > 0 || (dueStatus < 0 && this.complete)) {
    return false;
  } else if (dueStatus < 0) {
    return true;
  }
}

// Instance method: assigns an owner (id) to a task (foreignKey: OwnerId)
Task.prototype.assignOwner =  async function(owner) {
  const task = this;
  task.OwnerId = owner.id;
  return new Promise(function (resolve){
    resolve(task);
  });
}

// instantiating the model Owner which connects to table, Owner
const Owner = db.define('Owner', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

// Class method: returns all owners and their corresponding tasks
Owner.getOwnersAndTasks = () => {
  return Owner.findAll({
    include: Task
  })
}

// Instance method: returns all of the owner's (this) tasks which are incomplete
Owner.prototype.getIncompleteTasks = async function() {
  const incomplete = await Owner.findOne(
    { include:
      { model: Task, where: { complete: false }},
      where: {
        name: this.name
      }
    }
  );
  return incomplete.Tasks;
}

// Hook on Owner: before trying to destroy any owner, checks through this first...
Owner.beforeDestroy(owner => {
  if (owner.name === 'Grace Hopper') {
    throw new Error('You cannot destroy Grace Hopper!')
  }
})

Task.belongsTo(Owner);
Owner.hasMany(Task, {
  foreignKey: 'OwnerId'
  // associates Task and Owner such that Task creates the foreignKey 'OwnerId' to refer to an owner
});



//---------^^^---------  your code above  ---------^^^----------

module.exports = {
  Task,
  Owner,
};
