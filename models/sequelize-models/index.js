const db = require('./database');
const Sequelize = require('sequelize');

// Make sure you have `postgres` running!

//---------VVVV---------  your code below  ---------VVV----------

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

Task.clearCompleted = async () => {
  await Task.destroy({
    where: {
      complete: true
    }
  })
}

Task.completeAll = async () => {
  await Task.update(
    { complete: true },
    { where: {} }
    )
}

Task.prototype.getTimeRemaining = function() {
  if (this.due === undefined) {
    return Infinity;
  } else {
    return this.due - Date.now();
  }
}

Task.prototype.isOverdue = function() {
  const dueStatus = this.due - Date.now();
  if (dueStatus > 0) {
    return false;
  } else if (dueStatus < 0 && this.complete === true) {
    return false;
  } else if (dueStatus < 0) {
    return true;
  }
}

Task.prototype.assignOwner =  async function(owner) {
  const task = this;
  task.OwnerId = owner.id;
  return new Promise(function (resolve){
    resolve(task);
  });
}

const Owner = db.define('Owner', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

Owner.getOwnersAndTasks = () => {
  return Owner.findAll({
    include: Task
  })
}

Task.belongsTo(Owner);
Owner.hasMany(Task, {
  foreignKey: 'OwnerId'
});



//---------^^^---------  your code above  ---------^^^----------

module.exports = {
  Task,
  Owner,
};
