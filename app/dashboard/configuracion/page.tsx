'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';

export default function ConfiguracionPage() {
  const router = useRouter();
  const [companyData, setCompanyData] = useState({
    name: 'JDIGITAL Nicaragua',
    address: 'Managua, Nicaragua',
    phone: '+505 8000-0000',
    email: 'info@jdigital.com',
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);



  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Cambios guardados correctamente');
    }, 500);
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
              <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
              <p className="text-gray-600 text-sm mt-1">
                Administra la configuración de tu empresa
              </p>
            </div>

            {/* Company Information */}
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Información de la Empresa
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Empresa
                  </label>
                  <Input
                    name="name"
                    value={companyData.name}
                    onChange={handleInputChange}
                    placeholder="Tu empresa"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <Input
                    name="phone"
                    value={companyData.phone}
                    onChange={handleInputChange}
                    placeholder="+505 8000-0000"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <Input
                    name="address"
                    value={companyData.address}
                    onChange={handleInputChange}
                    placeholder="Calle Principal 123"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={companyData.email}
                    onChange={handleInputChange}
                    placeholder="info@empresa.com"
                  />
                </div>
              </div>
            </Card>

            {/* Logo Management */}
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Logo de la Empresa
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subir Logo
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Arrastra tu logo aquí o haz clic para seleccionar
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label htmlFor="logo-upload">
                      <Button
                        as="span"
                        className="cursor-pointer"
                        size="sm"
                      >
                        Seleccionar Archivo
                      </Button>
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG o SVG (máx. 2MB)
                    </p>
                  </div>
                </div>

                {/* Preview Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vista Previa
                  </label>
                  <div className="border border-gray-300 rounded-lg p-6 flex items-center justify-center min-h-[200px] bg-gray-50">
                    {logoPreview ? (
                      <div className="text-center">
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="max-w-[150px] max-h-[150px] mx-auto"
                        />
                        <p className="text-xs text-gray-600 mt-2">
                          Esta es la vista previa de tu logo
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <span className="text-2xl font-bold text-blue-600">J</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Logo actual por defecto
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* System Settings */}
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Configuración del Sistema
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Notificaciones de Stock Bajo
                    </p>
                    <p className="text-xs text-gray-600">
                      Recibe alertas cuando el stock sea bajo
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Modo Oscuro
                    </p>
                    <p className="text-xs text-gray-600">
                      Cambiar a interfaz oscura
                    </p>
                  </div>
                  <input type="checkbox" className="w-5 h-5" />
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Backup Automático
                    </p>
                    <p className="text-xs text-gray-600">
                      Realizar backup diario de datos
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
              <Button variant="outline">
                Cancelar
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
