import { useState } from 'react';
import populerUnvanlar from '../data/Analysis_Data/populer_unvanlar.json';
import populerSoftSkills from '../data/Analysis_Data/populer_soft_skills.json';
import populerEyaletler from '../data/Analysis_Data/populer_eyaletler.json';
import populerSehirler from '../data/Analysis_Data/populer_sehirler.json';
import skillMaasOrani from '../data/Analysis_Data/skill_maas_orani.json';
import populerEgitim from '../data/Analysis_Data/populer_egitim.json';
import populerDeneyim from '../data/Analysis_Data/populer_deneyim.json';
import yayinGunleriAnalizi from '../data/Analysis_Data/yayin_gunleri_analizi.json';
import populerYetenekler from '../data/Analysis_Data/populer_yetenekler.json';
import maasOranlari from '../data/Analysis_Data/maas_oranlari.json';
import remoteOrani from '../data/Analysis_Data/remote_orani.json';
import populerYayincilar from '../data/Analysis_Data/populer_yayincilar.json';
import populerIsverenler from '../data/Analysis_Data/populer_isverenler.json';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');

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
    return Math.max(...data.map(item => item.count || 0));
  };

  const getMaxSalary = (data) => {
    return Math.max(...data.map(item => item.avg_salary || 0));
  };

  // Eğitim seviyesi Türkçe çevirisi
  const getEducationLabel = (educationLevel) => {
    const translations = {
      'Bachelor': 'Lisans',
      'Master': 'Yüksek Lisans',
      'PhD': 'Doktora'
    };
    return translations[educationLevel] || educationLevel;
  };

  // Bar Chart Component
  const BarChart = ({ data, labelKey, valueKey, maxValue, color = 'bg-blue-500', formatLabel }) => {
    return (
      <div className="space-y-2">
        {data.map((item, index) => {
          const percentage = (item[valueKey] / maxValue) * 100;
          const label = formatLabel ? formatLabel(item[labelKey]) : item[labelKey];
          return (
            <div key={index} className="flex items-center gap-3">
              <div className="w-40 text-sm text-slate-700 dark:text-slate-300 truncate transition-colors duration-200">
                {item[labelKey]} {formatLabel && `(${label})`}
              </div>
              <div className="flex-1 bg-slate-200 dark:bg-slate-600 rounded-full h-6 overflow-hidden">
                <div
                  className={`${color} h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                  style={{ width: `${percentage}%` }}
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

  // Salary Bar Chart Component
  const SalaryBarChart = ({ data }) => {
    const maxSalary = getMaxSalary(data);
    return (
      <div className="space-y-2">
        {data.map((item, index) => {
          const percentage = (item.avg_salary / maxSalary) * 100;
          return (
            <div key={index} className="flex items-center gap-3">
              <div className="w-32 text-sm text-slate-700 dark:text-slate-300 transition-colors duration-200">{item.skill}</div>
              <div className="flex-1 bg-slate-200 dark:bg-slate-600 rounded-full h-6 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: `${percentage}%` }}
                >
                  <span className="text-xs text-white font-medium">
                    {formatCurrency(item.avg_salary)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Pie Chart Component
  const PieChart = ({ data, size = 200 }) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    const radius = size / 2 - 10;
    const centerX = size / 2;
    const centerY = size / 2;
    let currentAngle = -90; // Start from top

    const paths = data.map((item) => {
      const percentage = (item.count / total) * 100;
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

      const color = item.is_remote ? '#10b981' : '#3b82f6';
      currentAngle = endAngle;

      return { pathData, color };
    });

    return (
      <div className="flex flex-col items-center">
        <svg width={size} height={size} className="transform -rotate-90">
          {paths.map((path, index) => (
            <path
              key={index}
              d={path.pathData}
              fill={path.color}
              className="transition-all duration-500 hover:opacity-80"
            />
          ))}
        </svg>
        <div className="mt-4 space-y-2 w-full">
          {data.map((item, index) => {
            const percentage = ((item.count / total) * 100).toFixed(1);
            return (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.is_remote ? '#10b981' : '#3b82f6' }}
                  />
                  <span className="text-slate-700 dark:text-slate-300 transition-colors duration-200">
                    {item.is_remote ? 'Remote' : 'Ofis'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 dark:text-slate-300 font-medium transition-colors duration-200">{item.count}</span>
                  <span className="text-slate-500 dark:text-slate-400 transition-colors duration-200">({percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2 transition-colors duration-200"> İş Analizleri</h1>
          <p className="text-slate-600 dark:text-slate-400 transition-colors duration-200">İş ilanları hakkında detaylı analizler ve istatistikler</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 transition-colors duration-200">
          {[
            { id: 'overview', label: 'Genel Bakış' },
            { id: 'skills', label: 'Yetenekler' },
            { id: 'location', label: 'Lokasyon' },
            { id: 'salary', label: 'Maaş Analizleri' },
            { id: 'experience', label: 'Deneyim & Eğitim' },
            { id: 'publishers', label: 'Yayıncılar & İşverenler' },
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Remote Oranı */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 transition-colors duration-200">Remote Çalışma Oranı</h3>
              <PieChart data={remoteOrani} size={200} />
            </div>

            {/* Top Unvanlar */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 transition-colors duration-200">Popüler Unvanlar</h3>
              <BarChart
                data={populerUnvanlar.slice(0, 5)}
                labelKey="job_title"
                valueKey="count"
                maxValue={getMaxCount(populerUnvanlar)}
                color="bg-purple-500"
              />
            </div>

            {/* Yayın Günleri */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 transition-colors duration-200">Yayın Günleri</h3>
              <BarChart
                data={yayinGunleriAnalizi}
                labelKey="day"
                valueKey="count"
                maxValue={getMaxCount(yayinGunleriAnalizi)}
                color="bg-orange-500"
              />
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Popüler Yetenekler */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 transition-colors duration-200">Popüler Teknik Yetenekler</h3>
              <BarChart
                data={populerYetenekler}
                labelKey="skill"
                valueKey="count"
                maxValue={getMaxCount(populerYetenekler)}
                color="bg-indigo-500"
              />
            </div>

            {/* Soft Skills */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 transition-colors duration-200">Popüler Soft Skills</h3>
              <BarChart
                data={populerSoftSkills}
                labelKey="soft_skill"
                valueKey="count"
                maxValue={getMaxCount(populerSoftSkills)}
                color="bg-pink-500"
              />
            </div>
          </div>
        )}

        {/* Location Tab */}
        {activeTab === 'location' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Popüler Eyaletler */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 transition-colors duration-200">Popüler Eyaletler</h3>
              <BarChart
                data={populerEyaletler}
                labelKey="state"
                valueKey="count"
                maxValue={getMaxCount(populerEyaletler)}
                color="bg-teal-500"
              />
            </div>

            {/* Popüler Şehirler */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 transition-colors duration-200">Popüler Şehirler</h3>
              <BarChart
                data={populerSehirler}
                labelKey="city"
                valueKey="count"
                maxValue={getMaxCount(populerSehirler)}
                color="bg-cyan-500"
              />
            </div>
          </div>
        )}

        {/* Salary Tab */}
        {activeTab === 'salary' && (
          <div className="space-y-6">
            {/* Skill Maaş Oranları */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 transition-colors duration-200">
                Yeteneklere Göre Ortalama Maaş
              </h3>
              <SalaryBarChart data={skillMaasOrani} />
            </div>

            {/* Maaş Dağılımı İstatistikleri */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 transition-colors duration-200">Maaş Dağılımı</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 transition-colors duration-200">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1 transition-colors duration-200">Ortalama Maaş</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white transition-colors duration-200">
                    {formatCurrency(
                      maasOranlari.reduce((sum, item) => sum + item.avg_salary, 0) /
                      maasOranlari.length
                    )}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 transition-colors duration-200">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1 transition-colors duration-200">Minimum Maaş</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white transition-colors duration-200">
                    {formatCurrency(Math.min(...maasOranlari.map(item => item.job_min_salary)))}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 transition-colors duration-200">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1 transition-colors duration-200">Maksimum Maaş</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white transition-colors duration-200">
                    {formatCurrency(Math.max(...maasOranlari.map(item => item.job_max_salary)))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Experience & Education Tab */}
        {activeTab === 'experience' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Deneyim Seviyeleri */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 transition-colors duration-200">Deneyim Seviyeleri</h3>
              <BarChart
                data={populerDeneyim}
                labelKey="experience_level"
                valueKey="count"
                maxValue={getMaxCount(populerDeneyim)}
                color="bg-amber-500"
              />
            </div>

            {/* Eğitim Seviyeleri */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 transition-colors duration-200">Eğitim Seviyeleri</h3>
              <BarChart
                data={populerEgitim}
                labelKey="education_level"
                valueKey="count"
                maxValue={getMaxCount(populerEgitim)}
                color="bg-rose-500"
                formatLabel={getEducationLabel}
              />
            </div>
          </div>
        )}

        {/* Publishers & Employers Tab */}
        {activeTab === 'publishers' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Popüler Yayıncılar */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 transition-colors duration-200">Popüler Yayıncılar</h3>
              <BarChart
                data={populerYayincilar}
                labelKey="publisher"
                valueKey="count"
                maxValue={getMaxCount(populerYayincilar)}
                color="bg-violet-500"
              />
            </div>

            {/* Popüler İşverenler */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 transition-colors duration-200">Popüler İşverenler</h3>
              <BarChart
                data={populerIsverenler}
                labelKey="employer"
                valueKey="count"
                maxValue={getMaxCount(populerIsverenler)}
                color="bg-emerald-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;