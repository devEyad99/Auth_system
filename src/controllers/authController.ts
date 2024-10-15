//
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { readUsersFromFile, writeUsersToFile } from '../services/userReposity';
import { generateToken } from '../utiles/signToken';

export const signup = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { username, email, password } = req.body;

    // Validate request body
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Read users from file
    const users = readUsersFromFile();

    // Check if email already exists
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = { username, email, password: hashedPassword };

    // Add new user to users array
    users.push(newUser);

    // Write users back to file
    writeUsersToFile(users);

    // Generate token
    const token = generateToken(email);

    // Return success response
    return res.status(201).json({
      message: 'User  created successfully',
      token,
      data: {
        newUser,
      },
    });
  } catch (error) {
    // Log error for debugging purposes
    console.error(error);

    // Return error response
    return res.status(500).json({ message: 'An error occurred' });
  }
};
export const login = async (req: Request, res: Response) => {};

export const protectedRoute = (req: Request, res: Response) => {};
