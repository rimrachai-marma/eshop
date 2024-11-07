export const isEmail = (email) => {
  const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (email.match(emailFormat)) {
    return true;
  } else {
    return false;
  }
};

export const isStrongPassword = (email) => {
  const passwordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

  if (email.match(passwordFormat)) {
    return true;
  } else {
    return false;
  }
};
