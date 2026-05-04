'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Package, DollarSign, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { mockProducts } from '@/lib/mockData';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
      setLoading(false);
    };
    getUser();
  }, []);

  // Calculate KPIs
  const totalProducts = mockProducts.length;
  const totalInventoryValue = mockProducts.reduce(
    (sum, p) => sum + p.stock * p.sellPrice,
    0
  );
  const lowStockCount = mockProducts.filter(p => p.stock <= p.minStock).length;
  const activeProducts = mockProducts.filter(p => p.status === 'active').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <DashboardHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-auto pt-16 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Bienvenido, {user?.email}</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Total Productos */}
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total de Productos
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {totalProducts}
                    </p>
                    <p className="text-xs text-green-600 mt-2">
                      {activeProducts} activos
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </Card>

              {/* Valor Total Inventario */}
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Valor Total Inventario
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      ${totalInventoryValue.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      Precio de venta
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </Card>

              {/* Stock Bajo */}
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Stock Bajo
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {lowStockCount}
                    </p>
                    <p className="text-xs text-red-600 mt-2">
                      Necesitan reabastecimiento
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </Card>

              {/* Tasa de Rotación */}
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Rentabilidad Promedio
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {(
                        mockProducts.reduce((sum, p) => {
                          return (
                            sum +
                            ((p.sellPrice - p.buyPrice) / p.buyPrice) * 100
                          );
                        }, 0) / mockProducts.length
                      ).toFixed(1)}
                      %
                    </p>
                    <p className="text-xs text-blue-600 mt-2">
                      Ganancia por venta
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Alerts Section */}
            {lowStockCount > 0 && (
              <Card className="p-6 mb-8 border-yellow-200 bg-yellow-50">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-yellow-900">
                      Atención: Productos con Stock Bajo
                    </h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      {lowStockCount} producto(s) tienen stock por debajo del
                      mínimo configurado. Se recomienda realizar compras para
                      reabastecimiento.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Acciones Rápidas
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <a
                  href="/dashboard/productos"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-center"
                >
                  <Package className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm font-medium text-gray-900">
                    Ver Productos
                  </p>
                </a>
                <a
                  href="/dashboard/movimientos"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-center"
                >
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <p className="text-sm font-medium text-gray-900">
                    Registrar Movimiento
                  </p>
                </a>
                <a
                  href="/dashboard/reportes"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-center"
                >
                  <DollarSign className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                  <p className="text-sm font-medium text-gray-900">
                    Ver Reportes
                  </p>
                </a>
                <a
                  href="/dashboard/configuracion"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-center"
                >
                  <AlertCircle className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                  <p className="text-sm font-medium text-gray-900">
                    Configuración
                  </p>
                </a>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
