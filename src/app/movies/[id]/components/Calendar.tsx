'use client'
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarDay {
  date: number;
  day: number;
  month: number;
  year: number;
  isToday: boolean;
  isSelected: boolean;
}

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const Calendar = ({ selectedDate, onDateSelect }: CalendarProps) => {
  const [calendar, setCalendar] = useState<CalendarDay[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [animationDirection, setAnimationDirection] = useState("");

  useEffect(() => {
    const generateCalendar = () => {
      const today = new Date();
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      const days = [];
      
      // Get the first day of the week (0 = Sunday, 1 = Monday, etc.)
      const firstDayOfWeek = firstDay.getDay();
      // Adjust to start from Monday (1) instead of Sunday (0)
      const adjustedFirstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
      
      // Add days from previous month
      const daysInPreviousMonth = new Date(year, month, 0).getDate();
      for (let i = adjustedFirstDayOfWeek - 1; i >= 0; i--) {
        const date = new Date(year, month - 1, daysInPreviousMonth - i);
        days.push({
          date: date.getDate(),
          day: date.getDay() === 0 ? 6 : date.getDay() - 1, // Convert to 0-6 where 0 is Monday
          month: date.getMonth(),
          year: date.getFullYear(),
          isToday: isSameDay(date, today),
          isSelected: isSameDay(date, selectedDate)
        });
      }
      
      // Add days from current month
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(year, month, i);
        days.push({
          date: i,
          day: date.getDay() === 0 ? 6 : date.getDay() - 1, // Convert to 0-6 where 0 is Monday
          month: date.getMonth(),
          year: date.getFullYear(),
          isToday: isSameDay(date, today),
          isSelected: isSameDay(date, selectedDate)
        });
      }
      
      // Add days from next month
      const remainingDays = 42 - days.length;
      for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(year, month + 1, i);
        days.push({
          date: i,
          day: date.getDay() === 0 ? 6 : date.getDay() - 1, // Convert to 0-6 where 0 is Monday
          month: date.getMonth(),
          year: date.getFullYear(),
          isToday: isSameDay(date, today),
          isSelected: isSameDay(date, selectedDate)
        });
      }
      
      setCalendar(days);
    };
    
    generateCalendar();
  }, [currentMonth, selectedDate]);

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const getMonthName = (date: Date): string => {
    const months = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    return months[date.getMonth()];
  };

  const handlePrevMonth = () => {
    setAnimationDirection("right");
    setTimeout(() => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
      setAnimationDirection("");
    }, 200);
  };

  const handleNextMonth = () => {
    setAnimationDirection("left");
    setTimeout(() => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
      setAnimationDirection("");
    }, 200);
  };

  const handleDateSelect = (day: CalendarDay) => {
    onDateSelect(new Date(day.year, day.month, day.date));
  };

  const isCurrentMonth = (day: CalendarDay): boolean => day.month === currentMonth.getMonth();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <CalendarIcon className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">
            {getMonthName(currentMonth)} {currentMonth.getFullYear()}
          </h2>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handlePrevMonth} 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button 
            onClick={handleNextMonth} 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className={`transition-all duration-200 ${animationDirection === "left" ? "opacity-0 translate-x-8" : animationDirection === "right" ? "opacity-0 -translate-x-8" : "opacity-100 translate-x-0"}`}>
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, index) => (
            <div key={day} className={`text-center text-sm font-medium py-2 ${index === 6 ? 'text-red-500' : 'text-gray-600'}`}>
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendar.map((day, index) => (
            <button
              key={index}
              onClick={() => handleDateSelect(day)}
              className={`
                relative h-10 flex items-center justify-center text-sm rounded-md transition-all duration-200
                ${day.isSelected ? 'bg-indigo-600 text-white font-medium' : ''}
                ${day.isToday && !day.isSelected ? 'font-bold text-indigo-600' : ''}
                ${!isCurrentMonth(day) ? 'text-gray-300' : day.day === 6 ? 'text-red-500' : 'text-gray-700'}
                ${!day.isSelected && 'hover:bg-gray-100'}
              `}
            >
              <span>
                {day.date}
              </span>
              {day.isToday && !day.isSelected && (
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 h-1 w-1 bg-indigo-600 rounded-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Today button */}
      <div className="mt-4 flex justify-center">
        <button 
          onClick={() => onDateSelect(new Date())}
          className="px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors duration-200"
        >
          Hôm nay
        </button>
      </div>
    </div>
  );
};

export default Calendar;