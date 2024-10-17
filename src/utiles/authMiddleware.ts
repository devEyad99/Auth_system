//
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from './jwt';
import { ICurrentUser } from './jwt';

declare global {
  namespace Express {
    interface Request {
      currentUser?: ICurrentUser; // Corrected type for currentUser
    }
  }
}

export default function authorized(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  // Check for the presence of the authorization header
  if (!authHeader) {
    res.status(401).json({
      message: 'You are not logged in! Please log in to get access.',
      error: 'Unauthorized',
    });
    return;
  }

  // Extract the token from the 'Bearer <token>' format
  const accessToken = authHeader.split(' ')[1];

  if (!accessToken) {
    console.log('Token not found');
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    // Verify the access token and assign it to currentUser
    const currentUser = verifyAccessToken(accessToken);
    req.currentUser = currentUser as ICurrentUser; // Type assertion for clarity
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized' });
  }
}
