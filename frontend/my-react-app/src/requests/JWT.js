import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Memo, checking username might be good if there are problems on the personal page but should work fine

// Checking JWT authentification and that user is logged in
export const useCheckTokenAndRedirect = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      console.log("Not logged in");
      navigate("/login");
    }
  }, [navigate, token]);
};