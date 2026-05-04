'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Power, Search, Filter, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';

import type { Product } from '@/lib/mockData';
import { supabase } from '@/lib/supabase';

export default function ProductosPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data: cats } = await supabase.from('categories').select('*').order('name');
    if (cats) setCategories(cats);

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching products:', error);
    } else if (data) {
      const formattedData = data.map((item: any) => ({
        id: item.id,
        sku: item.sku,
        name: item.name,
        category: item.category,
        stock: item.stock,
        minStock: item.minstock,
        buyPrice: item.buyprice,
        sellPrice: item.sellprice,
        status: item.status
      }));
      setProducts(formattedData);
    }
    setIsLoading(false);
  };

  // Filter products
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (selectedStatus) {
      filtered = filtered.filter(p => p.status === selectedStatus);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedStatus, products]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleToggleStatus = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    
    const { error } = await supabase
      .from('products')
      .update({ status: newStatus })
      .eq('id', productId);
      
    if (!error) {
      setProducts(
        products.map(p =>
          p.id === productId ? { ...p, status: newStatus } : p
        )
      );
    } else {
      console.error('Error updating status:', error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardHeader />

        <main className="flex-1 overflow-auto pt-16 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
                <p className="text-gray-600 text-sm mt-1">
                  Gestiona el catálogo de productos
                </p>
              </div>
              <Button
                onClick={handleNewProduct}
                className="bg-green-600 hover:bg-green-700 gap-2"
              >
                <Plus className="w-4 h-4" />
                Nuevo Producto
              </Button>
            </div>

            {/* Search and Filters */}
            <Card className="p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Buscar
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="SKU o nombre..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Categoría
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todas</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Estado
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>

                {/* Results Count */}
                <div className="flex items-end">
                  <div className="text-sm text-gray-600">
                    Mostrando {paginatedProducts.length} de {filteredProducts.length}
                  </div>
                </div>
              </div>
            </Card>

            {/* Products Table */}
            <Card className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      SKU
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Nombre
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Categoría
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                      Precio Venta
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product) => {
                    const isLowStock = product.stock <= product.minStock;

                    return (
                      <tr
                        key={product.id}
                        className={`border-b border-gray-200 hover:bg-gray-50 ${
                          isLowStock ? 'bg-red-50' : ''
                        }`}
                      >
                        <td className="px-4 py-3 text-sm font-mono text-gray-900">
                          {product.sku}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {product.category}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isLowStock && (
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                            )}
                            <span className="font-semibold text-gray-900">
                              {product.stock}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">
                          ${product.sellPrice.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {product.status === 'active'
                              ? 'Activo'
                              : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="p-1 hover:bg-gray-100 rounded-lg text-gray-600"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(product.id)}
                              className={`p-1 rounded-lg transition ${
                                product.status === 'active'
                                  ? 'hover:bg-red-100 text-red-600'
                                  : 'hover:bg-green-100 text-green-600'
                              }`}
                            >
                              <Power className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {paginatedProducts.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-gray-600">
                    {isLoading ? 'Cargando productos...' : 'No hay productos disponibles'}
                  </p>
                </div>
              )}
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50"
                >
                  Anterior
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage(prev => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          onClose={handleCloseForm}
          onSave={async (product) => {
            const stock = parseInt(product.stock as any) || 0;
            const minStock = parseInt(product.minStock as any) || 0;
            const buyPrice = parseFloat(product.buyPrice as any) || 0;
            const sellPrice = parseFloat(product.sellPrice as any) || 0;

            if (editingProduct) {
              const { error } = await supabase
                .from('products')
                .update({
                  sku: product.sku,
                  name: product.name,
                  category: product.category,
                  stock,
                  minstock: minStock,
                  buyprice: buyPrice,
                  sellprice: sellPrice,
                  status: product.status
                })
                .eq('id', product.id);
                
              if (!error) {
                setProducts(products.map(p => (p.id === product.id ? { ...product, stock, minStock, buyPrice, sellPrice } : p)));
                handleCloseForm();
              } else {
                console.error("Error updating", error);
              }
            } else {
              const { data, error } = await supabase
                .from('products')
                .insert([{
                  sku: product.sku,
                  name: product.name,
                  category: product.category,
                  stock,
                  minstock: minStock,
                  buyprice: buyPrice,
                  sellprice: sellPrice,
                  status: product.status
                }])
                .select()
                .single();
                
              if (!error && data) {
                setProducts([...products, { ...product, id: data.id, stock, minStock, buyPrice, sellPrice }]);
                handleCloseForm();
              } else {
                console.error("Error inserting", error);
              }
            }
          }}
        />
      )}
    </div>
  );
}

// Product Form Modal Component
function ProductFormModal({
  product,
  categories,
  onClose,
  onSave,
}: {
  product: Product | null;
  categories: any[];
  onClose: () => void;
  onSave: (product: Product) => void;
}) {
  const [formData, setFormData] = useState<Product>(
    product || {
      id: '',
      sku: '',
      name: '',
      category: '',
      stock: 0,
      minStock: 0,
      buyPrice: 0,
      sellPrice: 0,
      status: 'active',
    }
  );
  const [priceWarning, setPriceWarning] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'sellPrice' || name === 'buyPrice') {
      const sell = name === 'sellPrice' ? parseFloat(value) : formData.sellPrice;
      const buy = name === 'buyPrice' ? parseFloat(value) : formData.buyPrice;
      if (sell <= buy && sell > 0) {
        setPriceWarning('El precio de venta debe ser mayor al precio de compra');
      } else {
        setPriceWarning('');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (priceWarning) {
      return;
    }
    onSave(formData as Product);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* SKU */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU
              </label>
              <Input
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="LP001"
                required
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Laptop Dell XPS 13"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Selecciona una categoría</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Buy Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio de Compra
              </label>
              <Input
                name="buyPrice"
                type="number"
                value={formData.buyPrice}
                onChange={handleInputChange}
                placeholder="800"
                required
              />
            </div>

            {/* Sell Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio de Venta
              </label>
              <Input
                name="sellPrice"
                type="number"
                value={formData.sellPrice}
                onChange={handleInputChange}
                placeholder="1100"
                required
              />
              {priceWarning && (
                <p className="text-xs text-red-600 mt-1">{priceWarning}</p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Actual
              </label>
              <Input
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="5"
                required
              />
            </div>

            {/* Min Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Mínimo
              </label>
              <Input
                name="minStock"
                type="number"
                value={formData.minStock}
                onChange={handleInputChange}
                placeholder="2"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={!!priceWarning}
              >
                {product ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
