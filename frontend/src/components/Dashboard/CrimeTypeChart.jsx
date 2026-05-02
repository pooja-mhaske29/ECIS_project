import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api } from '@services/api';
import LoadingSpinner from '@components/Common/LoadingSpinner';

export default function CrimeTypeChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCrimeData();
    const interval = setInterval(fetchCrimeData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchCrimeData = async () => {
    try {
      const response = await api.get('/stats');
      const crimesByType = response.data?.crimes_by_type || [];
      
      // Transform API data to chart format
      const chartData = Object.entries(crimesByType).map(([type, count]) => ({
        name: type.charAt(0).toUpperCase() + type.slice(1),
        count: count,
      }));
      
      setData(chartData.length > 0 ? chartData : DEFAULT_DATA);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch crime data:', err);
      setData(DEFAULT_DATA);
      setLoading(false);
    }
  };

  const DEFAULT_DATA = [
    { name: 'Mining', count: 0 },
    { name: 'Logging', count: 0 },
    { name: 'Pollution', count: 0 },
    { name: 'Degradation', count: 0 },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-gray-800/50 border border-emerald-500/20 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Crime Type Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.1)" />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1f3a',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
            }}
            cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
          />
          <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
