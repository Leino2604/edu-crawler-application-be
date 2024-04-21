exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.UserBoard = (req, res) => {
  // console.log(req);
  const role = req.params.role ? req.params.role : 'Free'; // Handle case where user might not be defined
  res.status(200).json({ message: `${role} Content` });
};

exports.AdminBoard = (req, res) => {
  res.status(200).json({ message: 'Admin Content' });
};

  
  // exports.ManagerBoard = (req, res) => {
  //   res.status(200).send("Manager Content.");
  // };