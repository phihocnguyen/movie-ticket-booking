"use client";

import { useEffect, useState } from "react";
import { Movie } from "../page";
import { SquarePen } from "lucide-react";
import { showErrorMessage, showSuccess } from "@/app/utils/alertHelper";
import {
  createMovie,
  editMovie,
  uploadFile,
} from "@/app/services/admin/movieSercive";
import dayjs from "dayjs";

interface MovieFormProps {
  movie?: Movie | null;
  reload: () => void;
  setShowModal: (data: boolean) => void;
}
export default function MovieForm({
  movie,
  reload,
  setShowModal,
}: MovieFormProps) {
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [backdropPreview, setBackdropPreview] = useState<string | null>(null);
  const [trailerPreview, setTrailerPreview] = useState<string | null>(null);
  const [movieState, setMovieState] = useState(movie);
  const [edit, setEdit] = useState<boolean>(false);
  const [form, setForm] = useState({
    title: movie?.title || "",
    titleVi: movie?.titleVi || "",
    description: movie?.description || "",
    duration: movie?.duration || "",
    language: movie?.language || "",
    genre: movie?.genre || "",
    releaseDate: movie?.releaseDate || "",
    posterUrl: movie?.posterUrl || "",
    backdropUrl: movie?.backdropUrl || "",
    trailerUrl: movie?.trailerUrl
      ? `https://www.youtube.com/watch?v=${movie.trailerUrl}`
      : "",
    director: movie?.director || "",
    actor: movie?.actor || "",
    rating: movie?.rating || "",
    country: movie?.country || "",
  });
  console.log("trailerUrl", form.trailerUrl);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);

      setForm((prev) => ({
        ...prev,
        [name]: file,
      }));

      if (name === "posterUrl") setPosterPreview(previewUrl);
      if (name === "backdropUrl") setBackdropPreview(previewUrl);
      if (name === "trailerUrl") setTrailerPreview(previewUrl);
    }
  };

  const extractYouTubeId = (url: string): string | null => {
    if (!url) return null;

    // Các pattern cho YouTube URL
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
      /youtu\.be\/([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  };

  const validateMovieData = (data: any) => {
    const errors: string[] = [];

    // Validate title
    if (!data.title || data.title.trim().length === 0) {
      errors.push("Tên phim không được để trống");
    } else if (data.title.trim().length < 2) {
      errors.push("Tên phim phải có ít nhất 2 ký tự");
    }

    // Validate titleVi
    if (!data.titleVi || data.titleVi.trim().length === 0) {
      errors.push("Tên phim tiếng Việt không được để trống");
    } else if (data.titleVi.trim().length < 2) {
      errors.push("Tên phim tiếng Việt phải có ít nhất 2 ký tự");
    }

    // Validate description
    if (!data.description || data.description.trim().length === 0) {
      errors.push("Mô tả không được để trống");
    } else if (data.description.trim().length < 10) {
      errors.push("Mô tả phải có ít nhất 10 ký tự");
    }

    // Validate duration
    if (!data.duration || data.duration <= 0) {
      errors.push("Thời lượng phải lớn hơn 0");
    } else if (data.duration > 300) {
      errors.push("Thời lượng không được vượt quá 300 phút");
    }

    // Validate language
    if (!data.language || data.language.trim().length === 0) {
      errors.push("Ngôn ngữ không được để trống");
    }

    // Validate genre
    if (!data.genre || data.genre.trim().length === 0) {
      errors.push("Thể loại không được để trống");
    }

    // Validate releaseDate
    if (!data.releaseDate) {
      errors.push("Ngày phát hành không được để trống");
    } else {
      const releaseDate = new Date(data.releaseDate);
      const today = new Date();
      if (releaseDate < today) {
        errors.push("Ngày phát hành không được là ngày trong quá khứ");
      }
    }

    // Validate posterUrl
    if (!data.posterUrl) {
      errors.push("Poster không được để trống");
    } else if (
      typeof data.posterUrl === "string" &&
      data.posterUrl.trim().length === 0
    ) {
      errors.push("Poster không được để trống");
    }

    // Validate backdropUrl
    if (!data.backdropUrl) {
      errors.push("Backdrop không được để trống");
    } else if (
      typeof data.backdropUrl === "string" &&
      data.backdropUrl.trim().length === 0
    ) {
      errors.push("Backdrop không được để trống");
    }

    // Validate trailerUrl
    if (!data.trailerUrl || data.trailerUrl.trim().length === 0) {
      errors.push("Trailer URL không được để trống");
    } else {
      const youtubeId = extractYouTubeId(data.trailerUrl);
      if (!youtubeId) {
        errors.push("Trailer URL phải là một URL YouTube hợp lệ");
      }
    }

    // Validate director
    if (!data.director || data.director.trim().length === 0) {
      errors.push("Đạo diễn không được để trống");
    }

    // Validate actor
    if (!data.actor || data.actor.trim().length === 0) {
      errors.push("Diễn viên không được để trống");
    }

    // Validate rating
    const ratingValue = Number(data.rating);
    if (
      data.rating === null ||
      data.rating === undefined ||
      data.rating === "" ||
      isNaN(ratingValue)
    ) {
      errors.push("Điểm đánh giá không được để trống");
    } else if (ratingValue < 0) {
      errors.push("Điểm đánh giá phải lớn hơn hoặc bằng 0");
    } else if (ratingValue > 10) {
      errors.push("Điểm đánh giá không được vượt quá 10");
    }

    // Validate country
    if (!data.country || data.country.trim().length === 0) {
      errors.push("Quốc gia không được để trống");
    }

    return errors;
  };

  const handleCreateMovie = async () => {
    try {
      // Validate dữ liệu trước khi xử lý
      const validationErrors = validateMovieData(form);
      if (validationErrors.length > 0) {
        showErrorMessage(validationErrors.join("\n"));
        return;
      }

      // Tạo FormData để upload files
      let posterUrl = form.posterUrl;
      let backdropUrl = form.backdropUrl;

      // Upload poster nếu có file mới
      if (
        form.posterUrl &&
        typeof form.posterUrl === "object" &&
        "name" in form.posterUrl
      ) {
        const formData = new FormData();
        formData.append("file", form.posterUrl as File);
        const posterResponse = await uploadFile(formData);
        posterUrl = posterResponse.data; // API trả về URL string
        console.log("Poster uploaded:", posterUrl);
      } else if (typeof form.posterUrl === "string" && form.posterUrl) {
        // Sử dụng URL string nếu có
        posterUrl = form.posterUrl;
        console.log("Use poster URL:", posterUrl);
      }

      // Upload backdrop nếu có file mới
      if (
        form.backdropUrl &&
        typeof form.backdropUrl === "object" &&
        "name" in form.backdropUrl
      ) {
        const formData = new FormData();
        formData.append("file", form.backdropUrl as File);
        const backdropResponse = await uploadFile(formData);
        backdropUrl = backdropResponse.data; // API trả về URL string
        console.log("Backdrop uploaded:", backdropUrl);
      } else if (typeof form.backdropUrl === "string" && form.backdropUrl) {
        // Sử dụng URL string nếu có
        backdropUrl = form.backdropUrl;
        console.log("Use backdrop URL:", backdropUrl);
      }

      // Chuẩn bị dữ liệu để tạo movie
      const movieData = {
        title: form.title?.trim() || "",
        titleVi: form.titleVi?.trim() || "",
        description: form.description?.trim() || "",
        duration: Number(form.duration) || 0,
        language: form.language?.trim() || "",
        genre: form.genre?.trim() || "",
        releaseDate: form.releaseDate
          ? dayjs(form.releaseDate).format("YYYY-MM-DD")
          : "",
        posterUrl: posterUrl || "",
        backdropUrl: backdropUrl || "",
        trailerUrl: form.trailerUrl
          ? extractYouTubeId(form.trailerUrl.trim()) || form.trailerUrl.trim()
          : "",
        director: form.director?.trim() || "",
        actor: form.actor?.trim() || "",
        rating: Number(form.rating) || 0,
        country: form.country?.trim() || "",
        isActive: true,
      };

      console.log("Final movieData:", movieData);

      // Gọi API tạo movie
      const response = await createMovie(movieData);

      if (response) {
        showSuccess("Tạo phim thành công!");
        setShowModal(false);
        reload();
      } else {
        showErrorMessage("Có lỗi xảy ra khi tạo phim!");
      }
    } catch (error) {
      console.error("Error creating movie:", error);
      showErrorMessage("Có lỗi xảy ra khi tạo phim: " + error);
    }
  };

  const handleUpdateMovie = async () => {
    try {
      // Validate dữ liệu trước khi xử lý
      const validationErrors = validateMovieData(form);
      if (validationErrors.length > 0) {
        showErrorMessage(validationErrors.join("\n"));
        return;
      }

      // Tạo FormData để upload files
      let posterUrl = form.posterUrl;
      let backdropUrl = form.backdropUrl;

      // Upload poster nếu có file mới
      if (
        form.posterUrl &&
        typeof form.posterUrl === "object" &&
        "name" in form.posterUrl
      ) {
        const formData = new FormData();
        formData.append("file", form.posterUrl as File);
        const posterResponse = await uploadFile(formData);
        posterUrl = posterResponse.data;
        console.log("Poster uploaded:", posterUrl);
      } else if (typeof form.posterUrl === "string" && form.posterUrl) {
        // Giữ nguyên URL gốc nếu không có file mới
        posterUrl = form.posterUrl;
        console.log("Keep original poster URL:", posterUrl);
      }

      // Upload backdrop nếu có file mới
      if (
        form.backdropUrl &&
        typeof form.backdropUrl === "object" &&
        "name" in form.backdropUrl
      ) {
        const formData = new FormData();
        formData.append("file", form.backdropUrl as File);
        const backdropResponse = await uploadFile(formData);
        backdropUrl = backdropResponse.data;
        console.log("Backdrop uploaded:", backdropUrl);
      } else if (typeof form.backdropUrl === "string" && form.backdropUrl) {
        // Giữ nguyên URL gốc nếu không có file mới
        backdropUrl = form.backdropUrl;
        console.log("Keep original backdrop URL:", backdropUrl);
      }

      // Chuẩn bị dữ liệu để cập nhật movie
      const movieData = {
        title: form.title?.trim() || "",
        titleVi: form.titleVi?.trim() || "",
        description: form.description?.trim() || "",
        duration: Number(form.duration) || 0,
        language: form.language?.trim() || "",
        genre: form.genre?.trim() || "",
        releaseDate: form.releaseDate
          ? dayjs(form.releaseDate).format("YYYY-MM-DD")
          : "",
        posterUrl: posterUrl || "",
        backdropUrl: backdropUrl || "",
        trailerUrl: form.trailerUrl
          ? extractYouTubeId(form.trailerUrl.trim()) || form.trailerUrl.trim()
          : "",
        director: form.director?.trim() || "",
        actor: form.actor?.trim() || "",
        rating: Number(form.rating) || 0,
        country: form.country?.trim() || "",
      };

      console.log("Final update movieData:", movieData);

      // Gọi API cập nhật movie
      const response = await editMovie(movieData, movie!.id);

      if (response) {
        showSuccess("Cập nhật phim thành công!");
        setEdit(false);
        reload();

        setMovieState((prev) => ({
          ...prev!,
          ...movieData,
        }));
      } else {
        showErrorMessage("Có lỗi xảy ra khi cập nhật phim!");
      }
    } catch (error) {
      console.error("Error updating movie:", error);
      showErrorMessage("Có lỗi xảy ra khi cập nhật phim: " + error);
    }
  };

  const resetForm = () => {
    setForm({
      title: movieState?.title || "",
      titleVi: movieState?.titleVi || "",
      description: movieState?.description || "",
      duration: movieState?.duration || "",
      language: movieState?.language || "",
      genre: movieState?.genre || "",
      releaseDate: movieState?.releaseDate || "",
      posterUrl: movieState?.posterUrl || "",
      backdropUrl: movieState?.backdropUrl || "",
      trailerUrl: movieState?.trailerUrl
        ? `https://www.youtube.com/watch?v=${movieState.trailerUrl}`
        : "",
      director: movieState?.director || "",
      actor: movieState?.actor || "",
      rating: movieState?.rating || "",
      country: movieState?.country || "",
    });

    if (movieState) {
      if (movieState.posterUrl) {
        setPosterPreview(movieState.posterUrl);
      }
      if (movieState.backdropUrl) {
        setBackdropPreview(movieState.backdropUrl);
      }
      if (movieState.trailerUrl) {
        const embedUrl = `https://www.youtube.com/embed/${movieState.trailerUrl}`;
        setTrailerPreview(embedUrl);
      }
    }
  };

  useEffect(() => {
    setEdit(false);
    // Cập nhật form khi movie prop thay đổi
    setForm({
      title: movie?.title || "",
      titleVi: movie?.titleVi || "",
      description: movie?.description || "",
      duration: movie?.duration || "",
      language: movie?.language || "",
      genre: movie?.genre || "",
      releaseDate: movie?.releaseDate || "",
      posterUrl: movie?.posterUrl || "",
      backdropUrl: movie?.backdropUrl || "",
      trailerUrl: movie?.trailerUrl
        ? `https://www.youtube.com/watch?v=${movie.trailerUrl}`
        : "",
      director: movie?.director || "",
      actor: movie?.actor || "",
      rating: movie?.rating || "",
      country: movie?.country || "",
    });

    // Set preview cho poster và backdrop nếu có movie
    if (movie) {
      if (movie.posterUrl) {
        setPosterPreview(movie.posterUrl);
      }
      if (movie.backdropUrl) {
        setBackdropPreview(movie.backdropUrl);
      }
      if (movie.trailerUrl) {
        // Tạo embed URL cho trailer
        const embedUrl = `https://www.youtube.com/embed/${movie.trailerUrl}`;
        setTrailerPreview(embedUrl);
      }
    } else {
      // Reset preview khi không có movie (tạo mới)
      setPosterPreview(null);
      setBackdropPreview(null);
      setTrailerPreview(null);
    }
  }, [movie]);
  return (
    <div className="max-h-[600px] overflow-y-auto pr-2">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* title */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="title">
            Tên phim
          </label>
          <input
            id="title"
            name="title"
            placeholder="Tên phim"
            value={form.title}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={movie !== null && !edit}
          />
        </div>

        {/* title_vi */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="titleVi">
            Tên phim (TV)
          </label>
          <input
            id="titleVi"
            name="titleVi"
            placeholder="Tên phim tiếng Việt"
            value={form.titleVi}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={movie !== null && !edit}
          />
        </div>

        {/* description */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="description">
            Mô tả
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Mô tả phim"
            value={form.description}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] resize-none focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={movie !== null && !edit}
          />
        </div>

        {/* duration */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="duration">
            Thời lượng (phút)
          </label>
          <input
            id="duration"
            name="duration"
            type="number"
            placeholder="Thời lượng"
            value={form.duration}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={movie !== null && !edit}
          />
        </div>

        {/* language */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="language">
            Ngôn ngữ
          </label>
          <input
            id="language"
            name="language"
            placeholder="Ngôn ngữ"
            value={form.language}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={movie !== null && !edit}
          />
        </div>

        {/* genre */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="genre">
            Thể loại
          </label>
          <input
            id="genre"
            name="genre"
            placeholder="Thể loại"
            value={form.genre}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={movie !== null && !edit}
          />
        </div>

        {/* releaseDate */}
        <div className="flex  items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="releaseDate">
            Ngày phát hành
          </label>
          <input
            id="releaseDate"
            name="releaseDate"
            type="date"
            value={form.releaseDate}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={movie !== null && !edit}
          />
        </div>

        {/* posterUrl */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-5 w-full">
            <label className="w-[20%] text-[15px]" htmlFor="posterUrl">
              Poster URL
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="posterUrl"
              name="posterUrl"
              placeholder="URL poster"
              className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
              disabled={movie !== null && !edit}
            />
          </div>
          <div className="flex items-center justify-end w-full">
            <div className="w-[calc(80%-20px)] flex justify-start">
              {posterPreview && (
                <img
                  src={posterPreview}
                  alt="Poster Preview"
                  className="h-[200px] w-[150px] rounded-lg object-cover border"
                />
              )}
            </div>
          </div>
        </div>

        {/* backdropUrl */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-5 w-full">
            <label className="w-[20%] text-[15px]" htmlFor="backdropUrl">
              Backdrop URL
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="backdropUrl"
              name="backdropUrl"
              placeholder="URL backdrop"
              className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
              disabled={movie !== null && !edit}
            />
          </div>
          <div className="flex items-center justify-end w-full">
            <div className="w-[calc(80%-20px)] flex justify-start">
              {backdropPreview && (
                <img
                  src={backdropPreview}
                  alt="Backdrop Preview"
                  className="h-[150px] w-[300px] rounded-lg object-cover border"
                />
              )}
            </div>
          </div>
        </div>

        {/* trailerUrl */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-5 w-full">
            <label className="w-[20%] text-[15px]" htmlFor="trailerUrl">
              Trailer URL (Youtube)
            </label>
            <input
              type="text"
              onChange={handleChange}
              id="trailerUrl"
              name="trailerUrl"
              placeholder="URL trailer"
              value={form.trailerUrl}
              className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
              disabled={movie !== null && !edit}
            />
          </div>
          <div className="flex items-center justify-end w-full">
            <div className="w-[calc(80%-20px)] flex justify-start">
              {trailerPreview && (
                <iframe
                  src={trailerPreview}
                  title="Trailer Preview"
                  className="h-[150px] w-[300px] rounded-lg border"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>

        {/* director */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="director">
            Đạo diễn
          </label>
          <input
            id="director"
            name="director"
            placeholder="Đạo diễn"
            value={form.director}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={movie !== null && !edit}
          />
        </div>

        {/* actor */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="actor">
            Diễn viên
          </label>
          <input
            id="actor"
            name="actor"
            placeholder="Diễn viên chính"
            value={form.actor}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={movie !== null && !edit}
          />
        </div>

        {/* rating */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="rating">
            Điểm đánh giá
          </label>
          <input
            id="rating"
            name="rating"
            type="number"
            min={0}
            max={10}
            step={0.1}
            placeholder="Điểm đánh giá (0-10)"
            value={form.rating || ""}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={movie !== null && !edit}
          />
        </div>

        {/* country */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="country">
            Quốc gia
          </label>
          <input
            id="country"
            name="country"
            placeholder="Quốc gia"
            value={form.country}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={movie !== null && !edit}
          />
        </div>
        {movie && !edit && (
          <div className="flex gap-5 text-[15px] my-2">
            <div
              className="flex gap-5 border p-[4px] rounded-lg items-center  bg-[#CCC6F4] cursor-pointer"
              onClick={() => {
                setEdit(true);
              }}
            >
              Chỉnh sửa thông tin
              <SquarePen size={20} className="" />
            </div>
          </div>
        )}

        {/* submit button */}
        {edit && (
          <div className="flex justify-end gap-5">
            <button
              className="w-[20%] bg-[#D51F2A] text-white py-2 rounded"
              onClick={() => {
                setEdit(false);
                resetForm();
              }}
            >
              Hủy
            </button>
            <button
              className="w-[20%] bg-[#432DD7] text-white py-2 rounded"
              onClick={handleUpdateMovie}
            >
              Xác nhận
            </button>
          </div>
        )}
        {movie === null && (
          <div className="flex justify-end">
            <button
              className="w-[20%] bg-[#432DD7] text-white py-2 rounded"
              onClick={handleCreateMovie}
            >
              Xác nhận
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
