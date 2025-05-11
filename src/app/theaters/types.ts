export interface TheaterData {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phoneNumber: string;
  email: string;
  isActive: boolean;
  openingTime: [number, number];
  closingTime: [number, number];
  totalScreens: number;
  createdAt: string;
  updatedAt: string;
  features?: string[];
  logoUrl?: string;
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