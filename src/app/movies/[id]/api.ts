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