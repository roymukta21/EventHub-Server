import { VercelRequest, VercelResponse } from '@vercel/node';
import connectDB from '../config/db';
import User from '../models/user.model';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectDB();

  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Your auth logic
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // check password etc...
    return res.status(200).json({ message: 'Login success' });
  }

  res.status(405).json({ message: 'Method not allowed' });
}