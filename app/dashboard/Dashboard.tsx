"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  CreditCard,
  Wallet,
  Calendar,
  TrendingUp,
  DollarSign,
  Moon,
  Sun,
  Download,
  Filter,
  Search,
} from "lucide-react";

// Типы для данных
interface PaymentData {
  id: string;
  amount: number;
  date: string;
  status: "to'langan" | "kutilmoqda" | "bekor qilingan";
  method: string;
}

interface StatisticsData {
  month: string;
  daromad: number;
  xarajat: number;
}

interface PieData {
  name: string;
  value: number;
  color: string;
}

const PaymentAndStatistics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"payment" | "statistics">(
    "payment"
  );
  const { theme, setTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // Демо-данные для оплат
  const payments: PaymentData[] = [
    {
      id: "1",
      amount: 1500000,
      date: "2025-05-10",
      status: "to'langan",
      method: "Uzcard",
    },
    {
      id: "2",
      amount: 750000,
      date: "2025-05-08",
      status: "to'langan",
      method: "Humo",
    },
    {
      id: "3",
      amount: 2000000,
      date: "2025-05-15",
      status: "kutilmoqda",
      method: "Naqd pul",
    },
    {
      id: "4",
      amount: 1200000,
      date: "2025-05-01",
      status: "bekor qilingan",
      method: "Payme",
    },
    {
      id: "5",
      amount: 3500000,
      date: "2025-04-28",
      status: "to'langan",
      method: "Click",
    },
  ];

  // Демо-данные для статистики
  const monthlyStats: StatisticsData[] = [
    { month: "Yanvar", daromad: 15000000, xarajat: 7500000 },
    { month: "Fevral", daromad: 18000000, xarajat: 8200000 },
    { month: "Mart", daromad: 14000000, xarajat: 7800000 },
    { month: "Aprel", daromad: 21000000, xarajat: 10500000 },
    { month: "May", daromad: 17500000, xarajat: 9200000 },
  ];

  // Данные для круговой диаграммы
  const pieData: PieData[] = [
    { name: "Uzcard", value: 45, color: "#0088FE" },
    { name: "Humo", value: 30, color: "#00C49F" },
    { name: "Naqd pul", value: 15, color: "#FFBB28" },
    { name: "Click/Payme", value: 10, color: "#FF8042" },
  ];

  // Фильтрация платежей
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.includes(searchTerm);
    const matchesFilter = filterStatus ? payment.status === filterStatus : true;
    return matchesSearch && matchesFilter;
  });

  // Форматирование суммы в узбекских сумах
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Форматирование даты
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Получение класса для статуса платежа
  const getStatusClass = (status: string): string => {
    switch (status) {
      case "to'langan":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "kutilmoqda":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "bekor qilingan":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Шапка */}
      <div className="bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">O'quv markazi</h1>
        </div>
      </div>

      {/* Основной контент */}
      <div className="container mx-auto py-6 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Вкладки */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === "payment"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("payment")}
            >
              <div className="flex items-center justify-center space-x-2">
                <CreditCard size={18} />
                <span>To'lovlar</span>
              </div>
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === "statistics"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("statistics")}
            >
              <div className="flex items-center justify-center space-x-2">
                <TrendingUp size={18} />
                <span>Statistika</span>
              </div>
            </button>
          </div>

          {/* Содержимое вкладки "Оплаты" */}
          {activeTab === "payment" && (
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
                <h2 className="text-xl font-semibold">To'lovlar ro'yxati</h2>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Qidirish..."
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={16}
                    />
                  </div>
                  <div className="relative">
                    <select
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                      value={filterStatus || ""}
                      onChange={(e) => setFilterStatus(e.target.value || null)}
                    >
                      <option value="">Barcha statuslar</option>
                      <option value="to'langan">To'langan</option>
                      <option value="kutilmoqda">Kutilmoqda</option>
                      <option value="bekor qilingan">Bekor qilingan</option>
                    </select>
                    <Filter
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={16}
                    />
                  </div>
                </div>
              </div>

              {/* Сводка по оплатам */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Jami to'lovlar
                    </p>
                    <p className="text-xl font-bold mt-1">
                      {formatCurrency(8950000)}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                    <DollarSign className="text-blue-600 dark:text-blue-300" />
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      To'langan
                    </p>
                    <p className="text-xl font-bold mt-1">
                      {formatCurrency(5750000)}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                    <Wallet className="text-green-600 dark:text-green-300" />
                  </div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Kutilmoqda
                    </p>
                    <p className="text-xl font-bold mt-1">
                      {formatCurrency(2000000)}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-800 rounded-full flex items-center justify-center">
                    <Calendar className="text-yellow-600 dark:text-yellow-300" />
                  </div>
                </div>
              </div>

              {/* Таблица оплат */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        To'lov ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Summa
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Sana
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        To'lov usuli
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredPayments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          #{payment.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {formatDate(payment.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {payment.method}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 text-xs rounded-full ${getStatusClass(
                              payment.status
                            )}`}
                          >
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredPayments.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    To'lovlar topilmadi
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <Download size={16} />
                  <span>Hisobotni yuklab olish</span>
                </button>
              </div>
            </div>
          )}

          {/* Содержимое вкладки "Статистика" */}
          {activeTab === "statistics" && (
            <div className="p-6">
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-6">
                  Moliyaviy ko'rsatkichlar
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* График доходов и расходов */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium mb-4">
                      Oylik daromad va xarajatlar
                    </h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={monthlyStats}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#374151"
                          />
                          <XAxis dataKey="month" />
                          <YAxis
                            tickFormatter={(value) =>
                              new Intl.NumberFormat("uz-UZ", {
                                notation: "compact",
                                compactDisplay: "short",
                              }).format(value)
                            }
                          />
                          <Tooltip
                            formatter={(value) => formatCurrency(Number(value))}
                            labelStyle={{ color: "#000" }}
                            contentStyle={{
                              backgroundColor:
                                theme === "dark" ? "#374151" : "#fff",
                              borderColor:
                                theme === "dark" ? "#4B5563" : "#E5E7EB",
                              color: theme === "dark" ? "#F9FAFB" : "#111827",
                            }}
                          />
                          <Legend />
                          <Bar
                            dataKey="daromad"
                            name="Daromad"
                            fill="#4ADE80"
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar
                            dataKey="xarajat"
                            name="Xarajat"
                            fill="#F87171"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Круговая диаграмма по методам оплаты */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium mb-4">
                      To'lov usullari
                    </h3>
                    <div className="h-80 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => `${value}%`}
                            contentStyle={{
                              backgroundColor:
                                theme === "dark" ? "#374151" : "#fff",
                              borderColor:
                                theme === "dark" ? "#4B5563" : "#E5E7EB",
                              color: theme === "dark" ? "#F9FAFB" : "#111827",
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Карточки сводной статистики */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Jami daromad (2025)
                  </p>
                  <p className="text-2xl font-bold mt-2">
                    {formatCurrency(85500000)}
                  </p>
                  <div className="flex items-center mt-2 text-green-600 dark:text-green-400">
                    <TrendingUp size={14} />
                    <span className="ml-1 text-sm">
                      +12.5% o'tgan yilga nisbatan
                    </span>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Jami xarajat (2025)
                  </p>
                  <p className="text-2xl font-bold mt-2">
                    {formatCurrency(43200000)}
                  </p>
                  <div className="flex items-center mt-2 text-red-600 dark:text-red-400">
                    <TrendingUp size={14} />
                    <span className="ml-1 text-sm">
                      +8.3% o'tgan yilga nisbatan
                    </span>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    O'rtacha to'lov summasi
                  </p>
                  <p className="text-2xl font-bold mt-2">
                    {formatCurrency(1790000)}
                  </p>
                  <div className="flex items-center mt-2 text-green-600 dark:text-green-400">
                    <TrendingUp size={14} />
                    <span className="ml-1 text-sm">
                      +5.2% o'tgan oyga nisbatan
                    </span>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    To'lovlar soni
                  </p>
                  <p className="text-2xl font-bold mt-2">248</p>
                  <div className="flex items-center mt-2 text-yellow-600 dark:text-yellow-400">
                    <TrendingUp size={14} />
                    <span className="ml-1 text-sm">
                      +2.1% o'tgan oyga nisbatan
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <Download size={16} />
                  <span>Statistikani yuklab olish</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentAndStatistics;
