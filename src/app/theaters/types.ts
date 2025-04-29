export interface TheaterData {
  id: string;
  name: string;
  address: string;
  description: string;
  features: string[];
  logoUrl: string;
  bannerUrl?: string;
}

export interface Movie {
  id: string;
  title: string;
  poster: string;
  duration: string;
  rating: string;
  genre: string;
  showtimes: {
    date: string;
    times: {
      time: string;
      price: string;
    }[];
  }[];
} 