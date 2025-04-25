'use client'

interface BookingTimelineProps {
  currentStep: number;
}

const BookingTimeline: React.FC<BookingTimelineProps> = ({ currentStep }) => {
  const steps = [
    { id: 1, title: 'Chọn lịch chiếu' },
    { id: 2, title: 'Chọn ghế' },
    { id: 3, title: 'Chọn thức ăn' },
    { id: 4, title: 'Thanh toán' }
  ];

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full"></div>
        <div 
          className="absolute top-0 left-0 h-1 bg-green-500 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        {/* Steps */}
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative z-10">
            {/* Step circle */}
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center
              ${currentStep >= step.id 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-600'
              }
              transition-all duration-300
            `}>
              {step.id}
            </div>
            
            {/* Step title */}
            <div className={`
              mt-2 text-sm font-medium
              ${currentStep >= step.id 
                ? 'text-green-500' 
                : 'text-gray-600'
              }
            `}>
              {step.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingTimeline; 