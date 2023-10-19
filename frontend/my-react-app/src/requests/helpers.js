// gt = greater than
// honestly not sure why it wasnt working sending it through body but this work around works atleast
// body worked on postman but on localhost no shot, it wasnt workin
export const returnTopRated = async (gt, limit) => {
    try {
      const response = await fetch(`http://localhost:4040/api/decks-with-rating?gt=${gt}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
  