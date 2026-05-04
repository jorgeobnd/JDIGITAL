'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Download, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { mockProducts, mockMovements } from '@/lib/mockData';

export default function KardexPage() {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [movements, setMovements] = useState<any[]>([]);



  const handleConsult = () => {
    if (!selectedProduct) {
      alert('Por favor selecciona un producto');
      return;
    }

    let filtered = mockMovements.filter(m => m.productId === selectedProduct);

    if (dateFrom) {
      filtered = filtered.filter(m => new Date(m.date) >= new Date(dateFrom));
    }

    if (dateTo) {
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59);
      filtered = filtered.filter(m => new Date(m.date) <= endDate);
    }

    setMovements(filtered);
  };

  const getProduct = () => {
    return mockProducts.find(p => p.id === selectedProduct);
  };

  const product = getProduct();

  // Calculate running stock
  const movementsWithStock = movements.map((movement, idx) => {
    let runningStock = product?.stock || 0;
    
    // Calculate stock from all movements up to this point
    movements.slice(0, idx + 1).forEach(m => {
      if (m.type === 'entrada' || m.type === 'ajuste') {
        runningStock += m.quantity;
      } else {
        runningStock -= m.quantity;
      }
    });

    return { ...movement, runningStock };
  });

  const handleExportPDF = () => {
    alert('Exportar a PDF - Funcionalidad en desarrollo');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 overflow-auto pt-16 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Kardex / Auditoría
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Consulta el historial completo de un producto
              </p>
            </div>

            {/* Query Card */}
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Consultar Producto
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Product Selection */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Selecciona un Producto *
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="">Elige un producto</option>
                    {mockProducts.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.sku})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date From */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Desde
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Date To */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Hasta
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Query Button */}
                <div className="flex items-end">
                  <Button
                    onClick={handleConsult}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Consultar
                  </Button>
                </div>
              </div>
            </Card>

            {/* Product Info */}
            {product && (
              <Card className="p-6 mb-6 bg-blue-50 border border-blue-200">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 font-medium">SKU</p>
                    <p className="text-lg font-bold text-gray-900">
                      {product.sku}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Nombre</p>
                    <p className="text-lg font-bold text-gray-900 truncate">
                      {product.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Stock Actual</p>
                    <p className="text-lg font-bold text-gray-900">
                      {product.stock}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Categoría</p>
                    <p className="text-lg font-bold text-gray-900">
                      {product.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Precio Venta</p>
                    <p className="text-lg font-bold text-green-600">
                      ${product.sellPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Movements Table */}
            {movements.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Historial de Movimientos
                  </h2>
                  <Button
                    onClick={handleExportPDF}
                    size="sm"
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Exportar PDF
                  </Button>
                </div>

                <Card className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Fecha
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Tipo
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                          Cantidad
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                          Stock Resultante
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Usuario
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Notas
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {movementsWithStock.map((movement, idx) => {
                        const typeLabels: { [key: string]: string } = {
                          entrada: 'Entrada',
                          salida: 'Salida',
                          ajuste: 'Ajuste',
                          devolucion: 'Devolución',
                        };

                        const typeColors: { [key: string]: string } = {
                          entrada: 'bg-green-100 text-green-800',
                          salida: 'bg-blue-100 text-blue-800',
                          ajuste: 'bg-yellow-100 text-yellow-800',
                          devolucion: 'bg-red-100 text-red-800',
                        };

                        return (
                          <tr
                            key={movement.id}
                            className="border-b border-gray-200 hover:bg-gray-50"
                          >
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {new Date(movement.date).toLocaleDateString()} {' '}
                              {new Date(movement.date).toLocaleTimeString()}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  typeColors[movement.type]
                                }`}
                              >
                                {typeLabels[movement.type]}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                              {movement.quantity}
                            </td>
                            <td className="px-4 py-3 text-sm text-right font-bold text-blue-600">
                              {movement.runningStock}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {movement.userId}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">
                              {movement.notes || '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Card>

                {/* Summary */}
                <Card className="p-6 mt-6 bg-gray-50">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Resumen del Período
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Movimientos Totales</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {movementsWithStock.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Entradas</p>
                      <p className="text-2xl font-bold text-green-600">
                        {movementsWithStock.filter(m => m.type === 'entrada').length}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Salidas</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {movementsWithStock.filter(m => m.type === 'salida').length}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Ajustes</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {movementsWithStock.filter(
                          m => m.type === 'ajuste' || m.type === 'devolucion'
                        ).length}
                      </p>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {/* Empty State */}
            {selectedProduct && movements.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-gray-600">
                  No hay movimientos registrados para este producto en el rango de fechas seleccionado
                </p>
              </Card>
            )}

            {!selectedProduct && (
              <Card className="p-8 text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">
                  Selecciona un producto y consulta su historial
                </p>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
