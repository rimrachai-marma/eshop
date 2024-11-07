module.exports.isEmail = (email) => {
  const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (email.match(emailFormat)) {
    return true;
  } else {
    return false;
  }
};

module.exports.isStrongPassword = (email) => {
  const passwordFormat =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).*$/;
  if (email.match(passwordFormat)) {
    return true;
  } else {
    return false;
  }
};
