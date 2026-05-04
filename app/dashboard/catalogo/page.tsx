'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { mockCategories, mockProviders } from '@/lib/mockData';
import type { Category, Provider } from '@/lib/mockData';

export default function CatalogoPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'categories' | 'providers'>('categories');
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [providers, setProviders] = useState<Provider[]>(mockProviders);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showProviderForm, setShowProviderForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);

  useEffect(() => {
    const user = sessionStorage.getItem('currentUser');
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(c => c.id !== categoryId));
  };

  const handleSaveCategory = (category: Category) => {
    if (editingCategory) {
      setCategories(
        categories.map(c => (c.id === category.id ? category : c))
      );
    } else {
      setCategories([...categories, { ...category, id: Date.now().toString() }]);
    }
    setShowCategoryForm(false);
    setEditingCategory(null);
  };

  const handleEditProvider = (provider: Provider) => {
    setEditingProvider(provider);
    setShowProviderForm(true);
  };

  const handleDeleteProvider = (providerId: string) => {
    setProviders(providers.filter(p => p.id !== providerId));
  };

  const handleSaveProvider = (provider: Provider) => {
    if (editingProvider) {
      setProviders(
        providers.map(p => (p.id === provider.id ? provider : p))
      );
    } else {
      setProviders([...providers, { ...provider, id: Date.now().toString() }]);
    }
    setShowProviderForm(false);
    setEditingProvider(null);
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
                Gestión de Catálogo
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Administra categorías y proveedores
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('categories')}
                className={`pb-3 px-1 font-medium text-sm border-b-2 transition ${
                  activeTab === 'categories'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Categorías
              </button>
              <button
                onClick={() => setActiveTab('providers')}
                className={`pb-3 px-1 font-medium text-sm border-b-2 transition ${
                  activeTab === 'providers'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Proveedores
              </button>
            </div>

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div>
                <div className="flex justify-end mb-4">
                  <Button
                    onClick={() => {
                      setEditingCategory(null);
                      setShowCategoryForm(true);
                    }}
                    className="bg-green-600 hover:bg-green-700 gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Nueva Categoría
                  </Button>
                </div>

                <Card className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Nombre
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Descripción
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map(category => (
                        <tr
                          key={category.id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {category.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {category.description}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEditCategory(category)}
                                className="p-1 hover:bg-gray-100 rounded-lg text-gray-600"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteCategory(category.id)
                                }
                                className="p-1 hover:bg-red-100 rounded-lg text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {categories.length === 0 && (
                    <div className="p-8 text-center">
                      <p className="text-gray-600">
                        No hay categorías disponibles
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* Providers Tab */}
            {activeTab === 'providers' && (
              <div>
                <div className="flex justify-end mb-4">
                  <Button
                    onClick={() => {
                      setEditingProvider(null);
                      setShowProviderForm(true);
                    }}
                    className="bg-green-600 hover:bg-green-700 gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Nuevo Proveedor
                  </Button>
                </div>

                <Card className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Nombre
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Descripción
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {providers.map(provider => (
                        <tr
                          key={provider.id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {provider.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {provider.description}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEditProvider(provider)}
                                className="p-1 hover:bg-gray-100 rounded-lg text-gray-600"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteProvider(provider.id)
                                }
                                className="p-1 hover:bg-red-100 rounded-lg text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {providers.length === 0 && (
                    <div className="p-8 text-center">
                      <p className="text-gray-600">
                        No hay proveedores disponibles
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Category Form Modal */}
      {showCategoryForm && (
        <FormModal
          title={editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
          fields={[
            { name: 'name', label: 'Nombre', type: 'text' },
            {
              name: 'description',
              label: 'Descripción',
              type: 'textarea',
            },
          ]}
          initialData={editingCategory}
          onClose={() => {
            setShowCategoryForm(false);
            setEditingCategory(null);
          }}
          onSave={(data) => handleSaveCategory(data as Category)}
        />
      )}

      {/* Provider Form Modal */}
      {showProviderForm && (
        <FormModal
          title={editingProvider ? 'Editar Proveedor' : 'Nuevo Proveedor'}
          fields={[
            { name: 'name', label: 'Nombre', type: 'text' },
            {
              name: 'description',
              label: 'Descripción',
              type: 'textarea',
            },
          ]}
          initialData={editingProvider}
          onClose={() => {
            setShowProviderForm(false);
            setEditingProvider(null);
          }}
          onSave={(data) => handleSaveProvider(data as Provider)}
        />
      )}
    </div>
  );
}

// Form Modal Component
function FormModal({
  title,
  fields,
  initialData,
  onClose,
  onSave,
}: {
  title: string;
  fields: { name: string; label: string; type: string }[];
  initialData?: any;
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [formData, setFormData] = useState(
    initialData || fields.reduce((acc, f) => ({ ...acc, [f.name]: '' }), {})
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(field => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <Input
                    name={field.name}
                    type={field.type}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                  />
                )}
              </div>
            ))}

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
              >
                Guardar
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
