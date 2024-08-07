import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Handle the post request for chat
    res.status(200).json({ message: 'Chat endpoint' });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
