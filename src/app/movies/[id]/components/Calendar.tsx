'use client'
import { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

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

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect }) => {
  const [calendar, setCalendar] = useState<CalendarDay[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  useEffect(() => {
    const generateCalendar = () => {
      const today = new Date();
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      const days: CalendarDay[] = [];
      
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
          day: date.getDay(),
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
          day: date.getDay(),
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
          day: date.getDay(),
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
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className="bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button onClick={handlePrevMonth} className="text-gray-600 hover:text-gray-900">
            <FaArrowLeft />
          </button>
          <h3 className="text-center font-medium">
            {getMonthName(currentMonth)} {currentMonth.getFullYear()}
          </h3>
          <button onClick={handleNextMonth} className="text-gray-600 hover:text-gray-900">
            <FaArrowRight />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center">
          <div className="font-medium">T2</div>
          <div className="font-medium">T3</div>
          <div className="font-medium">T4</div>
          <div className="font-medium">T5</div>
          <div className="font-medium">T6</div>
          <div className="font-medium">T7</div>
          <div className="font-medium text-red-600">CN</div>
          
          {calendar.map((day, index) => (
            <div
              key={index}
              onClick={() => onDateSelect(new Date(day.year, day.month, day.date))}
              className={`
                py-2 cursor-pointer transition
                ${day.isSelected ? 'bg-blue-600 text-white' : day.isToday ? 'border border-blue-600 text-blue-600' : 'text-gray-600 hover:bg-gray-200'}
                ${day.month !== currentMonth.getMonth() ? 'text-gray-300' : ''}
                ${day.day === 0 ? 'text-red-500' : ''}
              `}
            >
              {day.date}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;