'use client'

import { FaTicketAlt, FaChair, FaHamburger, FaCreditCard } from 'react-icons/fa';

interface BookingTimelineProps {
  currentStep: number;
}

const BookingTimeline: React.FC<BookingTimelineProps> = ({ currentStep }) => {
  const steps = [
    { id: 1, title: 'Chọn lịch chiếu', icon: <FaTicketAlt className="w-4 h-4" /> },
    { id: 2, title: 'Chọn ghế', icon: <FaChair className="w-4 h-4" /> },
    { id: 3, title: 'Chọn thức ăn', icon: <FaHamburger className="w-4 h-4" /> },
    { id: 4, title: 'Thanh toán', icon: <FaCreditCard className="w-4 h-4" /> }
  ];

  return (
    <div className="w-full py-8 mb-6">
      <div className="flex items-center justify-between relative">
        {/* Progress line - Background */}
        <div className="absolute top-1/2 left-0 h-1 bg-gray-700 w-full transform -translate-y-1/2 rounded-full"></div>
        
        {/* Progress line - Active */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500 ease-in-out rounded-full"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        {/* Steps */}
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative z-10 group">
            {/* Step circle with pulse effect for current step */}
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center shadow-lg
              ${currentStep > step.id 
                ? 'bg-green-500 text-white' 
                : currentStep === step.id
                  ? 'bg-green-500 text-white ring-4 ring-green-400/30'
                  : 'bg-gray-700 text-gray-400'
              }
              transition-all duration-300 transform
              ${currentStep >= step.id ? 'hover:scale-110' : 'hover:bg-gray-600'}
              ${currentStep === step.id ? 'animate-pulse-slow' : ''}
            `}>
              {step.icon}
            </div>
            
            {/* Step connector line */}
            {index < steps.length - 1 && (
              <div className="hidden absolute top-1/2 left-full transform -translate-y-1/2 h-0.5 bg-gray-700 w-full"></div>
            )}
            
            {/* Step title */}
            <div className={`
              mt-3 text-sm font-medium transition-all duration-300
              ${currentStep >= step.id 
                ? 'text-green-400' 
                : 'text-gray-400'
              }
              ${currentStep === step.id ? 'font-bold' : ''}
            `}>
              {step.title}
            </div>
            
            {/* Step number badge */}
            <div className={`
              absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs flex items-center justify-center
              ${currentStep >= step.id 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-700 text-gray-400'
              }
              border-2 ${currentStep >= step.id ? 'border-gray-900' : 'border-gray-800'}
            `}>
              {step.id}
            </div>
          </div>
        ))}
      </div>
      
      {/* Current step description */}
      <div className="mt-6 text-center">
        <div className="inline-block px-4 py-2 bg-gray-800/80 backdrop-blur-sm rounded-lg text-white">
          <span className="font-medium">Bước {currentStep}: </span>
          <span className="text-green-400">{steps[currentStep - 1].title}</span>
        </div>
      </div>
    </div>
  );
};

// Add this to your global CSS
const globalCSS = `
@keyframes pulse-slow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(74, 222, 128, 0);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 2s infinite;
}
`;

export default BookingTimeline;