interface User {
  id: number;
  email: string;
  password: string;
}

const users: User[] = [
  {
    id: 1,
    email: "alice@example.com",
    password: "motdepasse123",
  },
  {
    id: 2,
    email: "bob@example.com",
    password: "securite456",
  },
  {
    id: 3,
    email: "ely@gmail.com",
    password: "123456er",
  },
  {
    id: 4,
    email: "diana@example.com",
    password: "princesse000",
  },
];

function findUserByEmail(email: string): User | undefined {
  return users.find((user) => user.email === email);
}

export { findUserByEmail, users };
