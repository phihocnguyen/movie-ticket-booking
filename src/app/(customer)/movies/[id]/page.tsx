import { Suspense } from "react";
import { getMovieDetails } from "./api";
import MovieDetail from "./components/MovieDetail";

export default async function MovieDetailWrapper({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const response = await getMovieDetails(id);
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-t-indigo-500 border-gray-200 animate-spin"></div>
        </div>
      }
    >
      <MovieDetail movie={response.data} />
    </Suspense>
  );
}
