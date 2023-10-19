// userApi.js

export async function fetchUser() {
    try {
      const token = localStorage.getItem('token');
      const name = localStorage.getItem('username');
  
      if (!token) {
        console.error('Token not found in local storage');
        return null;
      }

      if (!name) {
        console.error('Not logged in');
        return null;
      }
  
      const response = await fetch('http://localhost:4040/api/user', {
        method: 'GET',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error('Failed to fetch user  data23');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user  data:', error);
      return null;
    }
  }
  