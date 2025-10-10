export const authenticator = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/imagekit-auth");

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }
      return response.json();
    } catch (error) {
      throw error;
    }
  }; 