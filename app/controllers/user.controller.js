exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.UserBoard = (req, res) => {
  const role = req.user ? req.user.role : 'Free'; // Handle case where user might not be defined
  res.status(200).json({ message: `${role} Content` });
};

exports.AdminBoard = (req, res) => {
  res.status(200).json({ message: 'Admin Content' });
};

  
  // exports.ManagerBoard = (req, res) => {
  //   res.status(200).send("Manager Content.");
  // };