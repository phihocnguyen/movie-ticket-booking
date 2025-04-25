import { Suspense } from 'react';
import MovieDetail from './MovieDetail';

export default async function MovieDetailWrapper({ params }: { params: Promise<{ id: string }> }) {
  const {id} = await params;
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-t-indigo-500 border-gray-200 animate-spin"></div>
      </div>
    }>
      <MovieDetail id={id} />
    </Suspense>
  );
}