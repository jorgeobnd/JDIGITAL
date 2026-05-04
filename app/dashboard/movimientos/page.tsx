'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Search, Filter, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { mockMovements, mockProducts } from '@/lib/mockData';

export default function MovimientosPage() {
  const router = useRouter();
  const [movements, setMovements] = useState(mockMovements);
  const [filteredMovements, setFilteredMovements] = useState(mockMovements);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    const user = sessionStorage.getItem('currentUser');
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    let filtered = movements;

    if (searchTerm) {
      filtered = filtered.filter(m => {
        const product = mockProducts.find(p => p.id === m.productId);
        return (
          product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product?.sku.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    if (selectedType) {
      filtered = filtered.filter(m => m.type === selectedType);
    }

    if (dateFrom) {
      filtered = filtered.filter(
        m => new Date(m.date) >= new Date(dateFrom)
      );
    }

    if (dateTo) {
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59);
      filtered = filtered.filter(m => new Date(m.date) <= endDate);
    }

    setFilteredMovements(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedType, dateFrom, dateTo, movements]);

  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);
  const paginatedMovements = filteredMovements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getProductName = (productId: string) => {
    return mockProducts.find(p => p.id === productId)?.name || 'Producto desconocido';
  };

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      entrada: 'Entrada',
      salida: 'Salida',
      ajuste: 'Ajuste',
      devolucion: 'Devolución',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      entrada: 'bg-green-100 text-green-800',
      salida: 'bg-blue-100 text-blue-800',
      ajuste: 'bg-yellow-100 text-yellow-800',
      devolucion: 'bg-red-100 text-red-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 overflow-auto pt-16 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Movimientos</h1>
                <p className="text-gray-600 text-sm mt-1">
                  Registra y consulta movimientos de inventario
                </p>
              </div>
              <Button
                onClick={() => {
                  setSelectedMovement(null);
                  setShowForm(true);
                }}
                className="bg-green-600 hover:bg-green-700 gap-2"
              >
                <Plus className="w-4 h-4" />
                Registrar Movimiento
              </Button>
            </div>

            {/* Registration Form */}
            {showForm && (
              <MovementFormCard
                product={selectedMovement}
                onClose={() => {
                  setShowForm(false);
                  setSelectedMovement(null);
                }}
                onSave={(movement) => {
                  setMovements([movement, ...movements]);
                  setShowForm(false);
                }}
              />
            )}

            {/* Filters */}
            <Card className="p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Buscar Producto
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

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Tipo
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="">Todos</option>
                    <option value="entrada">Entrada</option>
                    <option value="salida">Salida</option>
                    <option value="ajuste">Ajuste</option>
                    <option value="devolucion">Devolución</option>
                  </select>
                </div>

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

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedType('');
                      setDateFrom('');
                      setDateTo('');
                    }}
                    className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            </Card>

            {/* Table */}
            <Card className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Fecha/Hora
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Tipo
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                      Cantidad
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Usuario
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMovements.map(movement => (
                    <tr
                      key={movement.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(movement.date).toLocaleDateString()} {new Date(movement.date).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(movement.type)}`}>
                          {getTypeLabel(movement.type)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {getProductName(movement.productId)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                        {movement.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {movement.userId}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-600">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {paginatedMovements.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-gray-600">No hay movimientos registrados</p>
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
    </div>
  );
}

// Movement Form Component
function MovementFormCard({
  product,
  onClose,
  onSave,
}: {
  product?: any;
  onClose: () => void;
  onSave: (movement: any) => void;
}) {
  const [movementType, setMovementType] = useState<'entrada' | 'salida' | 'ajuste' | 'devolucion'>('entrada');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [invoice, setInvoice] = useState('');
  const [provider, setProvider] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [cartItems, setCartItems] = useState<any[]>([]);

  const handleAddToCart = () => {
    if (!selectedProduct || !quantity) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    const prod = mockProducts.find(p => p.id === selectedProduct);
    if (!prod) return;

    if (movementType === 'salida' && parseInt(quantity) > prod.stock) {
      alert('La cantidad no puede superar el stock disponible');
      return;
    }

    const cartItem = {
      productId: selectedProduct,
      productName: prod.name,
      quantity: parseInt(quantity),
      price: movementType === 'entrada' ? prod.buyPrice : prod.sellPrice,
      subtotal: parseInt(quantity) * (movementType === 'entrada' ? prod.buyPrice : prod.sellPrice),
    };

    setCartItems([...cartItems, cartItem]);
    setSelectedProduct('');
    setQuantity('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert('Agrega al menos un producto');
      return;
    }

    if (movementType === 'entrada' && !invoice) {
      alert('El número de factura es requerido para entradas');
      return;
    }

    if (movementType === 'ajuste' && reason.length < 10) {
      alert('El motivo debe tener al menos 10 caracteres');
      return;
    }

    // Create movement record
    cartItems.forEach(item => {
      const movement = {
        id: Date.now().toString() + Math.random(),
        date: new Date(),
        type: movementType,
        productId: item.productId,
        quantity: item.quantity,
        userId: sessionStorage.getItem('currentUser') ? JSON.parse(sessionStorage.getItem('currentUser')!).id : '1',
        notes: notes || reason,
      };
      onSave(movement);
    });

    onClose();
  };

  return (
    <Card className="p-6 mb-6 border-2 border-blue-200 bg-blue-50">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Registrar Nuevo Movimiento
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Movement Type */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['entrada', 'salida', 'ajuste', 'devolucion'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setMovementType(type as any)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                movementType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Dynamic Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Product Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Producto *
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Selecciona un producto</option>
              {mockProducts.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} (Stock: {p.stock})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Cantidad *
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="0"
            />
          </div>

          {/* Action Button */}
          <div className="flex items-end">
            <Button
              type="button"
              onClick={handleAddToCart}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Agregar al Carrito
            </Button>
          </div>
        </div>

        {/* Type-specific fields */}
        {movementType === 'entrada' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Número de Factura *
              </label>
              <input
                type="text"
                value={invoice}
                onChange={(e) => setInvoice(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="FAC-001"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Proveedor
              </label>
              <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Nombre del proveedor"
              />
            </div>
          </div>
        )}

        {movementType === 'salida' && (
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Motivo *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Selecciona un motivo</option>
              <option value="Venta">Venta</option>
              <option value="Merma">Merma</option>
              <option value="Daño">Daño</option>
              <option value="Consumo">Consumo</option>
            </select>
          </div>
        )}

        {movementType === 'ajuste' && (
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Motivo del Ajuste *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              minLength={10}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="Describe el motivo del ajuste (mínimo 10 caracteres)"
            />
          </div>
        )}

        {/* General Notes */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Observaciones
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="Notas adicionales"
          />
        </div>

        {/* Cart Items */}
        {cartItems.length > 0 && (
          <div className="bg-white border border-gray-300 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Productos a Registrar
            </h3>
            <div className="space-y-2">
              {cartItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.productName}
                    </p>
                    <p className="text-xs text-gray-600">
                      {item.quantity} x ${item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      ${item.subtotal.toLocaleString()}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setCartItems(cartItems.filter((_, i) => i !== idx))
                      }
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Total</p>
              <p className="text-lg font-bold text-gray-900">
                ${cartItems.reduce((sum, item) => sum + item.subtotal, 0).toLocaleString()}
              </p>
            </div>
          </div>
        )}

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
            disabled={cartItems.length === 0}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Registrar Movimiento
          </Button>
        </div>
      </form>
    </Card>
  );
}
