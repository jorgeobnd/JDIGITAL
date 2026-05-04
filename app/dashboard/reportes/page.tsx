'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, FileText, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { mockProducts } from '@/lib/mockData';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function ReportesPage() {
  const router = useRouter();

  useEffect(() => {
    const user = sessionStorage.getItem('currentUser');
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  // Prepare data for charts
  const categorySales = mockProducts.reduce((acc, product) => {
    const existing = acc.find(c => c.name === product.category);
    if (existing) {
      existing.value += product.stock * product.sellPrice;
    } else {
      acc.push({
        name: product.category,
        value: product.stock * product.sellPrice,
      });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const monthlyData = [
    { name: 'Ene', sales: 4000, purchases: 2400 },
    { name: 'Feb', sales: 3000, purchases: 1398 },
    { name: 'Mar', sales: 2000, purchases: 9800 },
    { name: 'Abr', sales: 2780, purchases: 3908 },
    { name: 'May', sales: 1890, purchases: 4800 },
    { name: 'Jun', sales: 2390, purchases: 3800 },
  ];

  const topProducts = mockProducts
    .sort((a, b) => b.stock * b.sellPrice - a.stock * a.sellPrice)
    .slice(0, 5)
    .map(p => ({
      name: p.name,
      sku: p.sku,
      value: p.stock * p.sellPrice,
      quantity: p.stock,
    }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const totalActiveProducts = mockProducts.filter(
    p => p.status === 'active'
  ).length;
  const totalInventoryValue = mockProducts.reduce(
    (sum, p) => sum + p.stock * p.sellPrice,
    0
  );
  const lowStockCount = mockProducts.filter(
    p => p.stock <= p.minStock
  ).length;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 overflow-auto pt-16 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
              <p className="text-gray-600 text-sm mt-1">
                Análisis e información del inventario
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="p-6">
                <p className="text-sm font-medium text-gray-600">
                  Total de Productos Activos
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalActiveProducts}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Del total de {mockProducts.length}
                </p>
              </Card>

              <Card className="p-6">
                <p className="text-sm font-medium text-gray-600">
                  Valor Total Inventario
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${totalInventoryValue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Costo de venta estimado
                </p>
              </Card>

              <Card className="p-6">
                <p className="text-sm font-medium text-gray-600">
                  Productos con Stock Bajo
                </p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {lowStockCount}
                </p>
                <p className="text-xs text-red-600 mt-2">
                  Requieren reabastecimiento
                </p>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Bar Chart */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Últimos 6 Meses
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="#10B981" name="Ventas" />
                    <Bar dataKey="purchases" fill="#3B82F6" name="Compras" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Pie Chart */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Distribución por Categoría
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categorySales}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categorySales.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value}`} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Top Products Table */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Top 5 Productos Más Vendidos
                </h2>
                <Button
                  onClick={() => alert('Exportar a PDF')}
                  size="sm"
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Producto
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        SKU
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                        Cantidad
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                        Valor Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {product.sku}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">
                          {product.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                          ${product.value.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
