"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/axiosInstance";

interface SeatSelectionProps {
  movieTitle: string;
  theaterName: string;
  showtime: string;
  date: Date;
  screenName?: string;
  price: string;
  theaterId: string;
  onBack: () => void;
}

interface SelectedSeat {
  id: number;
  row: string;
  number: number;
  type: "standard" | "vip" | "couple";
  price: number;
}

interface SeatData {
  id: number;
  seatNumber: string;
  isActive: boolean;
  isAvailable: boolean;
  seatType: {
    id: number;
    name: string;
    description: string;
    priceMultiplier: number;
    isActive: boolean;
  };
}

const SeatSelection = ({
  movieTitle,
  theaterName,
  showtime,
  date,
  screenName,
  price,
  theaterId,
  onBack,
}: SeatSelectionProps) => {
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [timeLeft, setTimeLeft] = useState({ minutes: 10, seconds: 0 });
  const [activeSummary, setActiveSummary] = useState(false);
  const [seats, setSeats] = useState<SeatData[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const screenId = searchParams.get("screenId");
  const showtimeId = searchParams.get("showTimeId");
  const theaterIdFromParams = searchParams.get("theaterId");
  // console.log("theaterIdFromParams", theaterIdFromParams);
  useEffect(() => {
    const fetchSeats = async () => {
      if (!screenId) {
        console.error("Screen ID is missing");
        return;
      }
      try {
        const response = await axiosInstance.get(`/seats/screen/${screenId}`);
        console.log("Fetched seats:", response.data);
        setSeats(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    };

    fetchSeats();
  }, [screenId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds === 0) {
          if (prev.minutes === 0) {
            clearInterval(timer);
            return { minutes: 0, seconds: 0 };
          }
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return { ...prev, seconds: prev.seconds - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date
      .toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "/");
  };

  const handleSeatClick = (
    row: string,
    number: number,
    type: "standard" | "vip" | "couple",
    seatId: number
  ) => {
    if (type === "couple") {
      const seat1 = seats.find((s) => s.id === seatId);
      const seat2 = seats.find((s) => {
        const { row: r, number: n } = parseSeatNumber(s.seatNumber);
        return (
          r === row &&
          n === number + 1 &&
          s.seatType.name.toLowerCase() === "couple"
        );
      });
      const price1 = Math.round(
        (Number(price) || 0) * (seat1?.seatType?.priceMultiplier || 1)
      );
      const price2 = seat2
        ? Math.round(
            (Number(price) || 0) * (seat2.seatType?.priceMultiplier || 1)
          )
        : price1;
      const isSelected1 = selectedSeats.some((seat) => seat.id === seat1?.id);
      const isSelected2 = seat2
        ? selectedSeats.some((seat) => seat.id === seat2.id)
        : false;
      if (!isSelected1 && !isSelected2) {
        const newSeats: SelectedSeat[] = [];
        if (seat1)
          newSeats.push({ id: seat1.id, row, number, type, price: price1 });
        if (seat2)
          newSeats.push({
            id: seat2.id,
            row,
            number: number + 1,
            type,
            price: price2,
          });
        setSelectedSeats([...selectedSeats, ...newSeats]);
      } else {
        setSelectedSeats(
          selectedSeats.filter(
            (seat) => seat.id !== seat1?.id && (!seat2 || seat.id !== seat2.id)
          )
        );
      }
    } else {
      const seatIndex = selectedSeats.findIndex((seat) => seat.id === seatId);
      const seat = seats.find((s) => s.id === seatId);
      let basePrice = Number(price) || 0;
      let priceMultiplier = seat?.seatType?.priceMultiplier || 1;
      const seatPrice = Math.round(basePrice * priceMultiplier);
      if (seatIndex === -1) {
        setSelectedSeats([
          ...selectedSeats,
          { id: seatId, row, number, type, price: seatPrice },
        ]);
      } else {
        setSelectedSeats(
          selectedSeats.filter((_, index) => index !== seatIndex)
        );
      }
    }
  };

  const isSeatSelected = (seatId: number) => {
    return selectedSeats.some((seat) => seat.id === seatId);
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };

  const toggleSummary = () => {
    setActiveSummary(!activeSummary);
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) return;

    const seatsParam = selectedSeats.map((seat) => {
      const seatName =
        seat.type === "couple"
          ? `${seat.row}${seat.number}-${seat.number + 1}`
          : `${seat.row}${seat.number}`;

      return {
        seatId: seat.id,
        seatName,
        price: seat.price,
      };
    });

    router.push(
      `/food-selection?movieTitle=${encodeURIComponent(
        movieTitle
      )}&theaterName=${encodeURIComponent(
        theaterName
      )}&showtimeId=${encodeURIComponent(
        showtimeId || ""
      )}&showtime=${encodeURIComponent(showtime)}&date=${encodeURIComponent(
        date.toISOString()
      )}&seats=${encodeURIComponent(
        JSON.stringify(seatsParam)
      )}&theaterId=${encodeURIComponent(theaterIdFromParams || "")}`
    );
  };

  const getSeatType = (seatTypeId: number): "standard" | "vip" | "couple" => {
    switch (seatTypeId) {
      case 1:
        return "standard";
      case 2:
        return "vip";
      case 3:
        return "couple";
      default:
        return "standard";
    }
  };

  const parseSeatNumber = (seatNumber: string) => {
    const match = seatNumber.match(/^([A-Z]+)(\d+)$/i);
    if (!match) return { row: "", number: 0 };
    return { row: match[1].toUpperCase(), number: parseInt(match[2], 10) };
  };

  const renderSeatGrid = () => {
    const rows: { [row: string]: SeatData[] } = {};
    seats.forEach((seat) => {
      const { row } = parseSeatNumber(seat.seatNumber);
      if (!rows[row]) rows[row] = [];
      rows[row].push(seat);
    });

    const sortedRows = Object.keys(rows).sort((a, b) => a.localeCompare(b));

    return (
      <div
        className="overflow-x-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          overflowX: "auto",
        }}
      >
        <div className="min-w-[600px] px-4">
          <div className="flex flex-col gap-1 text-center">
            {sortedRows.map((row) => {
              const seatsInRow = rows[row].sort((a, b) => {
                const na = parseSeatNumber(a.seatNumber).number;
                const nb = parseSeatNumber(b.seatNumber).number;
                return na - nb;
              });

              const seatElements = [];
              for (let i = 0; i < seatsInRow.length; ) {
                const seat = seatsInRow[i];
                const { row: rowLabel, number } = parseSeatNumber(
                  seat.seatNumber
                );
                const type = seat.seatType.name.toLowerCase();

                // Ghép cặp couple
                if (
                  type === "couple" &&
                  i + 1 < seatsInRow.length &&
                  seatsInRow[i + 1].seatType.name.toLowerCase() === "couple"
                ) {
                  seatElements.push(
                    <div
                      key={seat.id}
                      className="h-8 flex items-center justify-center"
                      style={{ minWidth: 112, maxWidth: 112, margin: "0 8px" }}
                    >
                      {renderSeat(
                        rowLabel,
                        number,
                        type,
                        !seat.isAvailable,
                        seat.id,
                        true
                      )}
                    </div>
                  );
                  i += 2;
                } else {
                  seatElements.push(
                    <div
                      key={seat.id}
                      className="h-8 flex items-center justify-center"
                      style={{ minWidth: 56, maxWidth: 56, margin: "0 4px" }}
                    >
                      {renderSeat(
                        rowLabel,
                        number,
                        type,
                        !seat.isAvailable,
                        seat.id
                      )}
                    </div>
                  );
                  i += 1;
                }
              }
              return (
                <div
                  key={row}
                  className="flex items-center gap-1 mb-1 justify-center"
                >
                  <div className="w-8 flex-shrink-0 flex items-center justify-center text-gray-500 font-medium">
                    {row}
                  </div>
                  <div className="flex flex-1 justify-center gap-1">
                    {seatElements}
                  </div>
                  <div className="w-8 flex-shrink-0 flex items-center justify-center text-gray-500 font-medium">
                    {row}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderSeat = (
    row: string,
    number: number,
    type: string,
    disabled = false,
    seatId: number,
    isCoupleGroup = false
  ) => {
    const isSelected = isSeatSelected(seatId);
    let bgColor = "";
    let textColor = isSelected ? "text-white" : "text-gray-700";
    let seatType = "";

    switch (type.toLowerCase()) {
      case "standard":
        bgColor = isSelected
          ? "bg-indigo-600"
          : "bg-blue-100 hover:bg-blue-200";
        seatType = "STD";
        break;
      case "vip":
        bgColor = isSelected
          ? "bg-indigo-600"
          : "bg-purple-100 hover:bg-purple-200";
        seatType = "VIP";
        break;
      case "couple":
        bgColor = isSelected
          ? "bg-indigo-600"
          : "bg-pink-100 hover:bg-pink-200";
        seatType = "CPL";
        break;
      default:
        bgColor = isSelected ? "bg-indigo-600" : "bg-gray-100";
        seatType = type;
    }
    if (disabled) {
      bgColor = "bg-gray-200";
      textColor = "text-gray-400";
      seatType = "Đã bán";
    }

    // Custom label cho ghế couple group
    const label = isCoupleGroup
      ? `${row}${number}-${row}${number + 1}`
      : `${row}${number}`;

    return (
      <div
        className={`w-full h-full flex items-center justify-center ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        } ${bgColor} ${textColor} rounded-md transition-all duration-200 shadow-sm ${
          isSelected ? "ring-2 ring-indigo-300" : ""
        }`}
        onClick={() =>
          !disabled &&
          handleSeatClick(
            row,
            number,
            type as "standard" | "vip" | "couple",
            seatId
          )
        }
      >
        <span className="text-xs font-semibold">{label}</span>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl p-6 max-w-6xl mx-auto relative">
      <div
        className={`lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          activeSummary ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 transition-transform duration-300 ${
            activeSummary ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-800">
              Ghế đã chọn ({selectedSeats.length})
            </h3>
            <button
              onClick={toggleSummary}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {selectedSeats.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                Chưa có ghế nào được chọn
              </p>
            ) : (
              <div className="space-y-2">
                {selectedSeats.map((seat, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-50/50 p-2 rounded-xl backdrop-blur-sm"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium shadow-sm ${
                          seat.type === "standard"
                            ? "bg-gradient-to-br from-blue-500 to-blue-600"
                            : seat.type === "vip"
                            ? "bg-gradient-to-br from-purple-500 to-purple-600"
                            : "bg-gradient-to-br from-pink-500 to-pink-600"
                        }`}
                      >
                        {seat.row}
                        {seat.number}
                      </div>
                      <span className="ml-2 font-medium text-gray-700">
                        {seat.type === "standard"
                          ? "Standard"
                          : seat.type === "vip"
                          ? "VIP"
                          : "Couple"}
                      </span>
                    </div>
                    <span className="font-medium text-gray-700">
                      {seat.price.toLocaleString()} VND
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 border-t border-gray-100 pt-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-800">Tổng cộng:</span>
              <span className="font-bold text-lg text-indigo-600">
                {getTotalPrice().toLocaleString()} VND
              </span>
            </div>

            <button
              className={`mt-4 w-full py-3 font-medium rounded-xl transition ${
                selectedSeats.length > 0
                  ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 shadow-lg shadow-indigo-200"
                  : "bg-gray-200 text-gray-400"
              }`}
              disabled={selectedSeats.length === 0}
              onClick={handleContinue}
            >
              {selectedSeats.length > 0
                ? "Tiếp tục thanh toán"
                : "Vui lòng chọn ghế"}
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Chọn ghế</h2>
          <div className="flex items-center text-sm text-indigo-600 font-medium bg-indigo-50 px-3 py-1.5 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {timeLeft.minutes}:
            {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center text-sm text-gray-600 bg-white/50 backdrop-blur-sm p-3 rounded-xl shadow-sm">
          <div className="mr-4 mb-2">
            <span className="font-medium text-indigo-600">{movieTitle}</span>
          </div>
          <div className="mr-4 mb-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 text-indigo-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span>Rạp: {theaterName}</span>
          </div>
          <div className="mr-4 mb-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 text-indigo-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Ngày chiếu: {formatDate(date)}</span>
          </div>
          <div className="mr-4 mb-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 text-indigo-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2"
              />
            </svg>
            <span>Phòng chiếu: {screenName}</span>
          </div>
          <div className="mb-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 text-indigo-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Giờ chiếu:{" "}
              {showtime
                ? new Date(showtime).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 order-2 lg:order-1">
          <div className="relative mb-12">
            <div className="bg-gradient-to-b from-indigo-200/50 to-white h-8 rounded-t-full mx-auto w-4/5 mb-1 shadow-sm"></div>
            <div className="bg-indigo-300/50 h-2 w-4/5 mx-auto rounded-t-full shadow-sm"></div>
            <p className="text-center text-sm text-gray-500 mt-2">Màn hình</p>
          </div>

          <div className="flex flex-wrap justify-center space-x-4 mb-8">
            {["standard", "vip", "couple"].map((type) => {
              const seat = seats.find(
                (s) => s.seatType.name.toLowerCase() === type
              );
              const multiplier = seat?.seatType.priceMultiplier || 1;
              const seatPrice = Math.round((Number(price) || 0) * multiplier);
              let color = "";
              switch (type) {
                case "standard":
                  color = "bg-blue-400";
                  break;
                case "vip":
                  color = "bg-purple-400";
                  break;
                case "couple":
                  color = "bg-pink-400";
                  break;
              }
              return (
                <div key={type} className="flex items-center mb-2">
                  <div
                    className={`w-4 h-4 rounded mr-2 shadow-sm ${color}`}
                  ></div>
                  <span className="text-sm text-gray-600">
                    Ghế {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                </div>
              );
            })}
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 bg-indigo-500 rounded mr-2 shadow-sm"></div>
              <span className="text-sm text-gray-600">Đã chọn</span>
            </div>
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 bg-gray-300 rounded mr-2 shadow-sm"></div>
              <span className="text-sm text-gray-600">Đã bán</span>
            </div>
          </div>

          {renderSeatGrid()}

          <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm shadow-lg border-t z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {selectedSeats.length} ghế đã chọn
                </p>
                <p className="font-bold text-indigo-600">
                  {getTotalPrice().toLocaleString()} VND
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={toggleSummary}
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
                >
                  Chi tiết
                </button>

                <button
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedSeats.length > 0
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 shadow-lg shadow-indigo-200"
                      : "bg-gray-200 text-gray-400"
                  }`}
                  disabled={selectedSeats.length === 0}
                  onClick={handleContinue}
                >
                  Tiếp tục
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/3 order-1 lg:order-2">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm sticky top-4">
            <h3 className="font-bold text-lg text-gray-800 mb-4">
              Thông tin đặt vé
            </h3>

            <div className="space-y-6">
              <div className="space-y-3"></div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-bold mb-3 flex items-center text-gray-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Ghế đã chọn
                </h4>

                <div className="h-[300px] overflow-y-auto">
                  {selectedSeats.length === 0 ? (
                    <div className="text-center py-8">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 mx-auto text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      <p className="text-gray-500 mt-2">
                        Chưa có ghế nào được chọn
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedSeats.map((seat, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-white/50 backdrop-blur-sm p-3 rounded-lg shadow-sm"
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium shadow-sm ${
                                seat.type === "standard"
                                  ? "bg-gradient-to-br from-blue-400 to-blue-500"
                                  : seat.type === "vip"
                                  ? "bg-gradient-to-br from-purple-400 to-purple-500"
                                  : "bg-gradient-to-br from-pink-400 to-pink-500"
                              }`}
                            >
                              {seat.row}
                              {seat.number}
                            </div>
                            <span className="ml-2 font-medium text-gray-700">
                              {seat.type === "standard"
                                ? "Standard"
                                : seat.type === "vip"
                                ? "VIP"
                                : "Couple"}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium text-gray-700">
                              {seat.price.toLocaleString()} VNĐ
                            </span>
                            <button
                              onClick={() =>
                                handleSeatClick(
                                  seat.row,
                                  seat.number,
                                  seat.type,
                                  seat.id
                                )
                              }
                              className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Số lượng ghế:</span>
                  <span className="font-medium text-gray-700">
                    {selectedSeats.length}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Phí dịch vụ:</span>
                  <span className="font-medium text-gray-700">0 VND</span>
                </div>

                <div className="flex justify-between items-center mt-4 pb-4 border-b border-gray-200">
                  <span className="font-bold text-lg text-gray-800">
                    Tổng cộng:
                  </span>
                  <span className="font-bold text-xl text-indigo-600">
                    {getTotalPrice().toLocaleString()} VND
                  </span>
                </div>

                <div className="mt-6 hidden lg:block">
                  <button
                    className={`w-full py-3 font-medium rounded-xl transition text-center ${
                      selectedSeats.length > 0
                        ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 shadow-lg shadow-indigo-200"
                        : "bg-gray-200 text-gray-400"
                    }`}
                    disabled={selectedSeats.length === 0}
                    onClick={handleContinue}
                  >
                    {selectedSeats.length > 0
                      ? "Tiếp tục thanh toán"
                      : "Vui lòng chọn ghế"}
                  </button>

                  <div className="flex justify-center mt-4">
                    <button
                      onClick={onBack}
                      className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                      </svg>
                      Trở lại
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
