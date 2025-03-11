import crypto from 'crypto'; 
import User from '../models/user.model.js';
import { sendPasswordResetEmail } from '../services/mail.service.js';

// Controller for Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour expiration
    await user.save();

    try {
      await sendPasswordResetEmail(email, resetToken);
      res.json({ message: 'Password reset email sent' });
    } catch (emailError) {
      return res.status(500).json({ message: 'Error sending the email', error: emailError.message });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error processing the request', error: error.message });
  }
};

// Controller for Reset Password
const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = password; 
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting the password', error: error.message });
  }
};


const authController = {
  forgotPassword,
  resetPassword,
};

export default authController;  
