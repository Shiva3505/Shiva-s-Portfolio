import React, { createContext, useContext, useState } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  sendResetCode: (email: string) => Promise<boolean>;
  verifyResetCode: (code: string) => boolean;
  resetPassword: (newPassword: string) => boolean;
  isResetMode: boolean;
  setIsResetMode: (mode: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('isAdmin') === 'true';
  });
  
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetCode, setResetCode] = useState<string | null>(null);
  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('adminPassword') || 'shiva3505';
  });

  const login = (password: string) => {
    if (password === adminPassword) {
      setIsAdmin(true);
      sessionStorage.setItem('isAdmin', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('isAdmin');
  };

  const sendResetCode = async (email: string): Promise<boolean> => {
    // Verify if the email matches your admin email
    const adminEmail = 'shiva03505@gmail.com';
    
    if (email.toLowerCase() !== adminEmail.toLowerCase()) {
      return false;
    }

    // Generate a 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setResetCode(code);

    try {
      // In a real application, you would send this via a backend service
      // For demo purposes, we'll simulate sending an email
      console.log(`Verification code sent to ${email}: ${code}`);
      
      // You can integrate with EmailJS or similar service here
      // For now, we'll show an alert with the code (remove this in production)
      alert(`Demo: Your verification code is: ${code}\n\nIn production, this would be sent to your email.`);
      
      return true;
    } catch (error) {
      console.error('Failed to send reset code:', error);
      return false;
    }
  };

  const verifyResetCode = (code: string): boolean => {
    return code === resetCode;
  };

  const resetPassword = (newPassword: string): boolean => {
    if (resetCode && newPassword.length >= 6) {
      setAdminPassword(newPassword);
      localStorage.setItem('adminPassword', newPassword);
      setResetCode(null);
      setIsResetMode(false);
      return true;
    }
    return false;
  };

  return (
    <AdminContext.Provider value={{ 
      isAdmin, 
      login, 
      logout, 
      sendResetCode, 
      verifyResetCode, 
      resetPassword,
      isResetMode,
      setIsResetMode
    }}>
      {children}
    </AdminContext.Provider>
  );
};