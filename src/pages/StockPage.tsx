import React, { useState, useEffect } from 'react';
import { Search, Plus, Warehouse, TrendingUp, Package, AlertCircle } from 'lucide-react';
import { stockService } from '../services/stockService';

const StockPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stockLevels, setStockLevels] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, [selectedWarehouse]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [levels, warehousesData] = await Promise.all([
        stockService.getStockLevels(selectedWarehouse !== 'all' ? { warehouse_id: selectedWarehouse } : {}),
        stockService.getWarehouses({ status: 'active' })
      ]);
      setStockLevels(levels);
      setWarehouses(warehousesData);
    } catch (e) {
      console.error('Failed to load stock data', e);
      setError('Failed to load stock data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
          <p className="text-gray-600">Manage inventory and stock levels</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="all">All Warehouses</option>
            {warehouses.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500">Loading stock data...</p>
        </div>
      ) : stockLevels.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No stock data available. Start by managing articles and warehouses.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warehouse</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Reserved</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Available</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stockLevels.map((level) => (
                <tr key={level.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {level.products?.name || 'Unknown Product'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {level.products?.article_number || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {level.warehouses?.name || 'No Warehouse'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {parseFloat(level.quantity).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {parseFloat(level.reserved_quantity).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {parseFloat(level.available_quantity).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    {parseFloat(level.available_quantity) < (level.reorder_point || 0) ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        In Stock
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StockPage;

