import React from 'react';
import { Trash2, Eye, EyeOff } from 'lucide-react';
import type { Hotspot } from '../types/hotspot';

interface HotspotTableProps {
  hotspots: Hotspot[];
  selectedHotspot: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (hotspot: Hotspot) => void;
}

const HotspotTable: React.FC<HotspotTableProps> = ({
  hotspots,
  selectedHotspot,
  onSelect,
  onDelete,
  onUpdate,
}) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleNameChange = (hotspot: Hotspot, newName: string) => {
    onUpdate({ ...hotspot, name: newName });
  };

  const toggleActive = (hotspot: Hotspot) => {
    onUpdate({ ...hotspot, isActive: !hotspot.isActive });
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              #
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time Range
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {hotspots.map((hotspot, index) => (
            <tr
              key={hotspot.id}
              className={`${
                selectedHotspot === hotspot.id ? 'bg-blue-50' : ''
              } hover:bg-gray-50 cursor-pointer`}
              onClick={() => onSelect(hotspot.id)}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {index + 1}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="text"
                  value={hotspot.name || `Hotspot ${index + 1}`}
                  onChange={(e) => handleNameChange(hotspot, e.target.value)}
                  className="text-sm text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                  onClick={(e) => e.stopPropagation()}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatTime(hotspot.startTime)} - {formatTime(hotspot.endTime)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleActive(hotspot);
                  }}
                  className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${
                    hotspot.isActive !== false
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {hotspot.isActive !== false ? (
                    <>
                      <Eye className="w-3 h-3 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3 mr-1" />
                      Inactive
                    </>
                  )}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(hotspot.id);
                  }}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HotspotTable;