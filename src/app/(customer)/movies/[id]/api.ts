import axiosInstance from '@/axiosInstance';

export async function getMovieDetails(id: string) {
  try {
    const response = await axiosInstance.get(`/movies/${id}`);
    if (response.data && typeof response.data === 'object' && 'statusCode' in response.data && 'data' in response.data) {
      return response.data;
    }
    return { statusCode: response.status, message: 'Success', data: response.data };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
}

export async function getRandomMovies() {
  try {
    const response = await axiosInstance.get('/movies/random');
    if (response.data && typeof response.data === 'object' && 'statusCode' in response.data && 'data' in response.data) {
      const data = response.data.data;
      return Array.isArray(data)
        ? data.map((item) => ({
            ...item,
            genre: item.genre
              ? item.genre.split(/\n|,/).map((g: string) => g.trim()).filter(Boolean)
              : [],
          }))
        : [];
    }
    // fallback for old format
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

export async function getLatestMovies() {
  try {
    const response = await axiosInstance.get('/movies/latest');
    if (response.data && typeof response.data === 'object' && 'statusCode' in response.data && 'data' in response.data) {
      const data = response.data.data;
      return Array.isArray(data)
        ? data.map((item) => ({
            ...item,
            genre: item.genre
              ? item.genre.split(/\n|,/).map((g: string) => g.trim()).filter(Boolean)
              : [],
          }))
        : [];
    }
    // fallback for old format
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
    console.error('Error fetching latest movies:', error);
    throw error;
  }
}

export async function getTopRatedMovies() {
  try {
    const response = await axiosInstance.get('/movies/top-rated');
    if (response.data && typeof response.data === 'object' && 'statusCode' in response.data && 'data' in response.data) {
      const data = response.data.data;
      return Array.isArray(data)
        ? data.map((item) => ({
            ...item,
            genre: item.genre
              ? item.genre.split(/\n|,/).map((g: string) => g.trim()).filter(Boolean)
              : [],
          }))
        : [];
    }
    // fallback for old format
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
    console.error('Error fetching top rated movies:', error);
    throw error;
  }
}

export async function getShowtimesByMovieId(movieId: string) {
  try {
    const response = await axiosInstance.get(`/showtimes/movie/${movieId}`);
    if (response.data && typeof response.data === 'object' && 'statusCode' in response.data && 'data' in response.data) {
      return response.data.data;
    }
    return { statusCode: response.status, message: 'Success', data: response.data.data };
  } catch (error) {
    console.error('Error fetching showtimes:', error);
    throw error;
  }
}

export async function getShowtimesByMovieAndDate(movieId: string, date: string) {
  try {
    const response = await axiosInstance.get(`/showtimes/filter?movieId=${movieId}&date=${date}`);
    if (response.data && typeof response.data === 'object' && 'statusCode' in response.data && 'data' in response.data) {
      return response.data;
    }
    return { statusCode: response.status, message: 'Success', data: response.data };
  } catch (error) {
    console.error('Error fetching showtimes by movie and date:', error);
    throw error;
  }
}

