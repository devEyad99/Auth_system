//
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { readUsersFromFile, writeUsersToFile } from '../services/userReposity';
import { getAccessToken } from './../utiles/jwt';
import validator from 'validator';
import _ from 'lodash';

export const signup = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const users = readUsersFromFile();

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = { username, email, password: hashedPassword };

    users.push(newUser);

    writeUsersToFile(users);

    // remove password from the response
    const user = _.omit(newUser, 'password');

    const token = getAccessToken({ email });

    return res.status(201).json({
      message: 'User  created successfully',
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const users = readUsersFromFile();

    const loggedUser = users.find((user) => user.email === email);
    if (!loggedUser) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, loggedUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // remove the password from the response
    const user = _.omit(loggedUser, 'password');

    const token = getAccessToken({ email });
    return res.status(200).json({
      message: 'User logged in successfully',
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'An error occurred' });
  }
};

export const protectedRoute = (req: Request, res: Response) => {
  res.json({ message: 'current user', user: req.currentUser });
};
