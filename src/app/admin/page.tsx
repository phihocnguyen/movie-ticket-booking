import DashBoardAreaChart from "./components/DashBoardAreaChart";
import DashBoardPieChart from "./components/DashBoardPiechart";
import { Ticket, CircleDollarSign, Clapperboard, Theater } from "lucide-react";

export default function DashBoard() {
  return (
    <div className="space-y-6">
      {/* Record Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 shadow rounded-2xl p-4 flex items-center gap-4">
          <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 p-3 rounded-full">
            <CircleDollarSign />
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Tổng doanh thu
            </div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white">
              1.2 tỷ VND
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 shadow rounded-2xl p-4 flex items-center gap-4">
          <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 p-3 rounded-full">
            <Ticket />
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Tổng vé đã bán
            </div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white">
              12,500
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 shadow rounded-2xl p-4 flex items-center gap-4">
          <div className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 p-3 rounded-full">
            <Clapperboard />
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Tổng số phim
            </div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white">
              52
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 shadow rounded-2xl p-4 flex items-center gap-4">
          <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 p-3 rounded-full">
            <Theater />
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Tổng số rạp
            </div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white">
              18
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="flex flex-col lg:flex-row gap-5 w-full">
        <DashBoardAreaChart />
        <DashBoardPieChart />
      </div>
    </div>
  );
}
