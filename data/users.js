const bcrypt = require("bcryptjs");

const users = [
  {
    name: "Super Admin",
    email: "superadmin@example.com",
    password: bcrypt.hashSync("12345678", 10),
    gender: "Male",
    role: "superadmin",
  },
  {
    name: "John Doe",
    email: "john@example.com",
    gender: "Male",
    password: bcrypt.hashSync("12345678", 10),
    role: "admin",
  },
  {
    name: "Natasha",
    email: "natasha@example.com",
    gender: "Female",
    password: bcrypt.hashSync("12345678", 10),
  },
];

module.exports = users;
