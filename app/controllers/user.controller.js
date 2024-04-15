exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.UserBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.FreeUserBoard = (req, res) => {
  res.status(200).send("Free User Content");
}

exports.BasicUserBoard = (req, res) => {
  res.status(200).send("Basic User Content.");
};

exports.StandardUserBoard = (req, res) => {
  res.status(200).send("Standard User Content.")
};

exports.ProUserBoard = (req, res) => {
  res.status(200).send("Pro User Content");
};

exports.AdminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};
  
  // exports.ManagerBoard = (req, res) => {
  //   res.status(200).send("Manager Content.");
  // };