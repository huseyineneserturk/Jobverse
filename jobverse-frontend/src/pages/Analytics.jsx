import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);

  // API'den veri çek
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/analytics/charts`);
        const result = await response.json();

        if (result.success) {
          setChartData(result.data);
        } else {
          setError('Analiz verileri yüklenemedi');
        }
      } catch (err) {
        console.error('Analytics fetch error:', err);
        setError('Sunucuya bağlanılamadı');
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  // Yardımcı fonksiyonlar
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMaxCount = (data) => {
    if (!data || !Array.isArray(data)) return 1;
    return Math.max(...data.map(item => item.count || 0)) || 1;
  };

  // Bar Chart Component
  const BarChart = ({ data, labelKey, valueKey, maxValue, color = 'bg-blue-500' }) => {
    if (!data || !Array.isArray(data)) return null;
    return (
      <div className="space-y-2">
        {data.slice(0, 10).map((item, index) => {
          const percentage = (item[valueKey] / maxValue) * 100;
          return (
            <div key={index} className="flex items-center gap-3">
              <div className="w-40 text-sm text-slate-700 dark:text-slate-300 truncate">
                {item[labelKey]}
              </div>
              <div className="flex-1 bg-slate-200 dark:bg-slate-600 rounded-full h-6 overflow-hidden">
                <div
                  className={`${color} h-full rounded-full flex items-center justify-end pr-2`}
                  style={{ width: `${Math.max(percentage, 5)}%` }}
                >
                  <span className="text-xs text-white font-medium">{item[valueKey]}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Pie Chart Component
  const PieChart = ({ data, size = 180, valueKey = 'count', labelKey = 'label' }) => {
    if (!data || !Array.isArray(data) || data.length === 0) return null;

    const total = data.reduce((sum, item) => sum + (item[valueKey] || 0), 0);
    if (total === 0) return null;

    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
    const radius = size / 2 - 10;
    const centerX = size / 2;
    const centerY = size / 2;
    let currentAngle = -90;

    const paths = data.map((item, index) => {
      const percentage = ((item[valueKey] || 0) / total) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
      const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
      const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
      const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

      const largeArcFlag = angle > 180 ? 1 : 0;

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');

      currentAngle = endAngle;

      return { pathData, color: colors[index % colors.length], item, percentage };
    });

    return (
      <div className="flex flex-col items-center">
        <svg width={size} height={size} className="transform -rotate-90">
          {paths.map((path, index) => (
            <path
              key={index}
              d={path.pathData}
              fill={path.color}
              className="hover:opacity-80 transition-opacity"
            />
          ))}
        </svg>
        <div className="mt-4 space-y-2 w-full">
          {paths.map((path, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: path.color }} />
                <span className="text-slate-700 dark:text-slate-300">
                  {path.item[labelKey] || `Değer ${index + 1}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  {path.item[valueKey]}
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  ({path.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Analizler yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !chartData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Veri bulunamadı'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  // Remote data for pie chart
  const remoteData = chartData.remoteStats ? [
    { label: 'Remote', count: chartData.remoteStats.remote_count || 0 },
    { label: 'Ofis', count: chartData.remoteStats.office_count || 0 }
  ] : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">İş Analizleri</h1>
          <p className="text-slate-600 dark:text-slate-400">
            {chartData.totalJobsAnalyzed?.toLocaleString() || 0} iş ilanı analiz edildi
            {chartData.reportDate && ` - ${new Date(chartData.reportDate).toLocaleDateString('tr-TR')}`}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 dark:border-slate-700">
          {[
            { id: 'overview', label: 'Genel Bakış' },
            { id: 'skills', label: 'Yetenekler' },
            { id: 'location', label: 'Lokasyon' },
            { id: 'salary', label: 'Maaş' },
            { id: 'experience', label: 'Deneyim & Eğitim' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${activeTab === tab.id
                ? 'bg-[#0f172a] dark:bg-sky-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* İstatistik Kartları */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
                <p className="text-blue-100 text-sm">Toplam İlan</p>
                <p className="text-3xl font-bold">{chartData.totalJobsAnalyzed?.toLocaleString() || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white shadow-lg">
                <p className="text-emerald-100 text-sm">Remote İlan</p>
                <p className="text-3xl font-bold">{chartData.remoteStats?.remote_count?.toLocaleString() || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
                <p className="text-purple-100 text-sm">Medyan Maaş</p>
                <p className="text-3xl font-bold">{formatCurrency(chartData.salaryStats?.avg_salary || 0)}</p>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white shadow-lg">
                <p className="text-amber-100 text-sm">Farklı Yetenek</p>
                <p className="text-3xl font-bold">{chartData.topSkills?.length || 0}</p>
              </div>
            </div>

            {/* Grafikler */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Remote Oranı */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  Remote Çalışma Oranı
                </h3>
                <PieChart data={remoteData} size={180} valueKey="count" labelKey="label" />
              </div>

              {/* En Popüler Unvanlar */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                  En Popüler Unvanlar
                </h3>
                <BarChart
                  data={chartData.topTitles}
                  labelKey="title"
                  valueKey="count"
                  maxValue={getMaxCount(chartData.topTitles)}
                  color="bg-purple-500"
                />
              </div>

              {/* Yayın Günleri */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                  Yayın Günleri
                </h3>
                <BarChart
                  data={chartData.postingDays}
                  labelKey="day"
                  valueKey="count"
                  maxValue={getMaxCount(chartData.postingDays)}
                  color="bg-orange-500"
                />
              </div>
            </div>

            {/* Alt Grafikler */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Yetenekler */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
                  En Çok Aranan Yetenekler
                </h3>
                <BarChart
                  data={chartData.topSkills}
                  labelKey="skill"
                  valueKey="count"
                  maxValue={getMaxCount(chartData.topSkills)}
                  color="bg-indigo-500"
                />
              </div>

              {/* Top Şehirler */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                  En Çok İlan Olan Şehirler
                </h3>
                <BarChart
                  data={chartData.topCities}
                  labelKey="city"
                  valueKey="count"
                  maxValue={getMaxCount(chartData.topCities)}
                  color="bg-teal-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Popüler Teknik Yetenekler</h3>
              <BarChart
                data={chartData.topSkills}
                labelKey="skill"
                valueKey="count"
                maxValue={getMaxCount(chartData.topSkills)}
                color="bg-indigo-500"
              />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Soft Skills</h3>
              <BarChart
                data={chartData.softSkills}
                labelKey="skill"
                valueKey="count"
                maxValue={getMaxCount(chartData.softSkills)}
                color="bg-pink-500"
              />
            </div>
          </div>
        )}

        {/* Location Tab */}
        {activeTab === 'location' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Popüler Eyaletler</h3>
              <BarChart
                data={chartData.topStates}
                labelKey="state"
                valueKey="count"
                maxValue={getMaxCount(chartData.topStates)}
                color="bg-teal-500"
              />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Popüler Şehirler</h3>
              <BarChart
                data={chartData.topCities}
                labelKey="city"
                valueKey="count"
                maxValue={getMaxCount(chartData.topCities)}
                color="bg-cyan-500"
              />
            </div>
          </div>
        )}

        {/* Salary Tab */}
        {activeTab === 'salary' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Maaş İstatistikleri</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Medyan Maaş</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">
                    {formatCurrency(chartData.salaryStats?.avg_salary || 0)}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Yıllık Minimum Maaş</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">
                    {formatCurrency(chartData.salaryStats?.min_salary || 0)}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Yıllık Maksimum Maaş</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">
                    {formatCurrency(chartData.salaryStats?.max_salary || 0)}
                  </p>
                </div>
              </div>
            </div>

            {chartData.skillSalaryRoi && chartData.skillSalaryRoi.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Yeteneklere Göre Ortalama Maaş</h3>
                <div className="space-y-2">
                  {chartData.skillSalaryRoi.slice(0, 10).map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-32 text-sm text-slate-700 dark:text-slate-300">{item.skill}</div>
                      <div className="flex-1 bg-slate-200 dark:bg-slate-600 rounded-full h-6 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${(item.avg_salary / (chartData.salaryStats?.max_salary || 200000)) * 100}%` }}
                        >
                          <span className="text-xs text-white font-medium">{formatCurrency(item.avg_salary)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Experience & Education Tab */}
        {activeTab === 'experience' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Deneyim Seviyeleri</h3>
              <BarChart
                data={chartData.experienceLevels}
                labelKey="level"
                valueKey="count"
                maxValue={getMaxCount(chartData.experienceLevels)}
                color="bg-amber-500"
              />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Eğitim Seviyeleri</h3>
              <BarChart
                data={chartData.educationLevels}
                labelKey="level"
                valueKey="count"
                maxValue={getMaxCount(chartData.educationLevels)}
                color="bg-rose-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;