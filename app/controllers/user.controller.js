exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
  exports.UserBoard = (req, res) => {
    res.status(200).send("User Content.");
  };
  
  exports.AdminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };
  
  // exports.ManagerBoard = (req, res) => {
  //   res.status(200).send("Manager Content.");
  // };