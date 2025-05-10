import axiosInstance from '@/axiosInstance';

export async function getMovieDetails(id: string) {
  try {
    const response = await axiosInstance.get(`/movies/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
}

export async function getRandomMovies() {
  try {
    const response = await axiosInstance.get('/movies/random');
    const data = response.data;
    return Array.isArray(data)
      ? data.map((item) => ({
          ...item,
          genre: item.genre
            ? item.genre.split(/\n|,/).map((g: string) => g.trim()).filter(Boolean)
            : [],
        }))
      : [];
  } catch (error) {
    console.error('Error fetching random movies:', error);
    throw error;
  }
} 