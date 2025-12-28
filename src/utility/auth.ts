import jwt from 'jsonwebtoken';

export const generateToken = (user_id: number) => {
    return jwt.sign({ id: user_id }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '30d',
    });
};