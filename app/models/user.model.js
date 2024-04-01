module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
      Username: {
        type: Sequelize.STRING
      },
      Mail: {
        type: Sequelize.STRING
      },
      Password: {
        type: Sequelize.STRING
      },
      FullName: {
        type: Sequelize.STRING
      },
      Phone: {
        type: Sequelize.STRING
      },
      Role: {
        type: Sequelize.STRING
      }
    });
  
    return User;
  };