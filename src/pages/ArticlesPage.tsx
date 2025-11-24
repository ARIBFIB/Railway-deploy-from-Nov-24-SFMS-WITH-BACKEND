import React, { useState, useEffect } from 'react';
import { Search, Plus, Grid, Printer, RotateCcw, Trash2, CheckSquare, Square } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { CreateArticleModal } from '../components/CreateArticleModal';
import { articlesService } from '../services/articlesService';

interface Article {
  id: string;
  itemNo: string;
  name: string;
  startingPrice: number;
  estimatedCost: number;
  inStock: number;
  reserved: number;
  disposable: number;
  storageLocation: string;
  stockValue: number;
  isActive: boolean;
}

const mockArticles: Article[] = [
  {
    id: '1',
    itemNo: 'ART001',
    name: 'Sample Article 1',
    startingPrice: 100.00,
    estimatedCost: 80.00,
    inStock: 50,
    reserved: 5,
    disposable: 45,
    storageLocation: 'A1-B2',
    stockValue: 4000.00,
    isActive: true
  },
  {
    id: '2',
    itemNo: 'ART002',
    name: 'Sample Article 2',
    startingPrice: 250.00,
    estimatedCost: 200.00,
    inStock: 25,
    reserved: 3,
    disposable: 22,
    storageLocation: 'B1-C3',
    stockValue: 5500.00,
    isActive: true
  },
  {
    id: '3',
    itemNo: 'ART003',
    name: 'Inactive Article',
    startingPrice: 75.00,
    estimatedCost: 60.00,
    inStock: 0,
    reserved: 0,
    disposable: 0,
    storageLocation: 'D1-E2',
    stockValue: 0.00,
    isActive: false
  }
];

export const ArticlesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('active');
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load articles from backend
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const apiArticles = await articlesService.list({ search: searchTerm, status: activeFilter });
        if (!mounted) return;
        // Map API data to UI format
        const mapped: Article[] = apiArticles.map(a => ({
          id: a.id,
          itemNo: a.article_number,
          name: a.name,
          startingPrice: a.price || 0,
          estimatedCost: a.cost || 0,
          inStock: 0, // Not in API yet
          reserved: 0, // Not in API yet
          disposable: 0, // Not in API yet
          storageLocation: '', // Not in API yet
          stockValue: 0, // Not in API yet
          isActive: a.is_active
        }));
        setArticles(mapped);
      } catch (e) {
        console.error('Failed to load articles', e);
        setError('Failed to load articles');
        setArticles([]);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [searchTerm, activeFilter]);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.itemNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'active' && article.isActive) ||
                         (activeFilter === 'inactive' && !article.isActive);
    return matchesSearch && matchesFilter;
  });

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(filteredArticles.map(article => article.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectArticle = (articleId: string) => {
    if (selectedArticles.includes(articleId)) {
      setSelectedArticles(selectedArticles.filter(id => id !== articleId));
    } else {
      setSelectedArticles([...selectedArticles, articleId]);
    }
  };

  const handleCreateArticle = () => {
    setShowCreateModal(true);
  };

  const handleCreateModalClose = () => {
    setShowCreateModal(false);
  };

  const handleCreateModalSave = (articleData: any) => {
    console.log('New article created:', articleData);
    // Here you would typically add the new article to your data
    setShowCreateModal(false);
  };

  const handleExportCSV = () => {
    console.log('Export CSV clicked');
  };

  const handlePrintList = () => {
    console.log('Print list clicked');
  };

  const handleResetPriceUpdate = () => {
    console.log('Reset price update clicked');
  };

  const handleDelete = () => {
    console.log('Delete clicked');
  };

  const handleActivate = () => {
    console.log('Activate clicked');
  };

  const handleDisable = () => {
    console.log('Disable clicked');
  };

  const handlePriceUpdateAll = () => {
    console.log('Price update all clicked');
  };

  const handlePriceUpdateSelected = () => {
    console.log('Price update selected clicked');
  };

  const selectedActiveItems = selectedArticles.filter(articleId => {
    const article = mockArticles.find(a => a.id === articleId);
    return article?.isActive === true;
  });
  const selectedInactiveItems = selectedArticles.filter(articleId => {
    const article = mockArticles.find(a => a.id === articleId);
    return article?.isActive === false;
  });
  const hasActiveSelected = selectedActiveItems.length > 0;
  const hasInactiveSelected = selectedInactiveItems.length > 0;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase">Index - Articles</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Article number, Description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80"
            />
          </div>
          <button className="text-blue-600 hover:text-blue-800 text-sm">
            Advanced search
          </button>
          <Button
            onClick={handleCreateArticle}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
          >
            <Plus className="w-4 h-4" />
            Create article
          </Button>
        </div>
      </div>

      {/* Secondary Action Bar */}
      <div className="flex items-center justify-between">
        <div></div>
        <div className="flex items-center space-x-6">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
            <Grid className="w-4 h-4" />
            Export CSV
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
            <Printer className="w-4 h-4" />
            Print list
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
            <RotateCcw className="w-4 h-4" />
            Reset price update
          </button>
          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-gray-100 rounded">
              <div className="w-4 h-4 border border-gray-300 bg-white"></div>
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <div className="w-4 h-4 border border-gray-300 bg-white"></div>
            </button>
            <span className="text-sm text-gray-600 ml-2">{filteredArticles.length}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 text-sm font-medium rounded ${
            activeFilter === 'all'
              ? 'bg-white border border-gray-300 text-gray-900'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter('active')}
          className={`px-4 py-2 text-sm font-medium rounded ${
            activeFilter === 'active'
              ? 'bg-white border border-gray-300 text-gray-900'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setActiveFilter('inactive')}
          className={`px-4 py-2 text-sm font-medium rounded ${
            activeFilter === 'inactive'
              ? 'bg-white border border-gray-300 text-gray-900'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Inactive
        </button>
      </div>

      {/* Table Section */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 w-12">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center justify-center"
                  >
                    {selectAll ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 bg-gray-100">
                  ITEM NO.
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  NAME
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  STARTING PRICE (PRICE LIST A)
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  ESTIMATED COST
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  IN STOCK
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  RESERVED
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  DISPOSABLE
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  STORAGE LOCATION
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  STOCK VALUE
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-gray-500">
                    No articles found
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr 
                    key={article.id} 
                    className={`border-b border-gray-100 hover:bg-gray-50 ${
                      !article.isActive ? 'bg-gray-50 opacity-75' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleSelectArticle(article.id)}
                        className="flex items-center justify-center"
                      >
                        {selectedArticles.includes(article.id) ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                      {article.itemNo}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <span>{article.name}</span>
                        {!article.isActive && (
                          <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">
                            Inactive
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      ${article.startingPrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      ${article.estimatedCost.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {article.inStock}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {article.reserved}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {article.disposable}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {article.storageLocation}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      ${article.stockValue.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleDelete}
            disabled={selectedArticles.length === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedArticles.length > 0
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <span className="text-sm text-gray-600">
            {selectedArticles.length} selected
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleActivate}
            disabled={!hasInactiveSelected}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              hasInactiveSelected
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Activate
          </Button>
          <Button
            onClick={handleDisable}
            disabled={!hasActiveSelected}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              hasActiveSelected
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Disable
          </Button>
          <Button
            onClick={handlePriceUpdateAll}
            className="px-4 py-2 rounded-lg font-medium bg-gray-700 hover:bg-gray-800 text-white"
          >
            Price update all
          </Button>
          <Button
            onClick={handlePriceUpdateSelected}
            disabled={selectedArticles.length === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedArticles.length > 0
                ? 'bg-gray-600 hover:bg-gray-700 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Price update selected
          </Button>
        </div>
      </div>

      {/* Create Article Modal */}
      <CreateArticleModal
        isOpen={showCreateModal}
        onClose={handleCreateModalClose}
        onSave={handleCreateModalSave}
      />
    </div>
  );
};
