'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

export default function ShareDataPage() {
  const { shareToken: encodedToken } = useParams();
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [emailFilter, setEmailFilter] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/get_all_data`, {
          params: { encodedToken }
        });

        setData(res.data);
        setFilteredData(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (encodedToken) fetchData();
  }, [encodedToken]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmailFilter(value);

    if (!value) {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item: any) =>
        item.email?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (loading) return <div className="text-center mt-8">Loading data...</div>;
  if (!filteredData.length) return <div className="text-center mt-8 text-gray-500">No data available.</div>;

  return (
    <div className="card">
      <h1 className="text-2xl font-semibold mb-6 text-center">Shared Data</h1>

      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search by email..."
          value={emailFilter}
          onChange={handleFilterChange}
          className="w-full max-w-xs"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {Object.keys(filteredData[0] || {}).map((key) => (
                <th key={key} className="text-left px-3 py-2 font-medium text-gray-700 dark:text-gray-300">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item: any, index: number) => (
              <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">
                {Object.values(item).map((val, i) => (
                  <td key={i} className="px-3 py-2">
                    {typeof val === 'object' ? JSON.stringify(val) : val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
