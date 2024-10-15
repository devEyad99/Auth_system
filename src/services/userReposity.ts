import fs from 'fs';
import path from 'path';

interface User {
  username: string;
  email: string;
  password: string;
}

const filePath = path.resolve(__dirname, '../../user.json');

export const readUsersFromFile = (): User[] => {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

export const writeUsersToFile = (users: User[]) => {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
};
