import TheaterDetailClient from './TheaterDetailClient';

export default function TheaterPage({ params }: { params: { theaterId: string } }) {
  return <TheaterDetailClient theaterId={params.theaterId} />;
} 