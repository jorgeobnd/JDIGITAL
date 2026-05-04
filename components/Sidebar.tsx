'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  FileText,
  Settings,
  Menu,
  X,
  ChevronDown,
  BarChart3
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Package, label: 'Productos', href: '/dashboard/productos' },
  { icon: Package, label: 'Catálogo', href: '/dashboard/catalogo' },
  { icon: TrendingUp, label: 'Movimientos', href: '/dashboard/movimientos' },
  { icon: BarChart3, label: 'Kardex', href: '/dashboard/kardex' },
  { icon: FileText, label: 'Reportes', href: '/dashboard/reportes' },
  { icon: Settings, label: 'Configuración', href: '/dashboard/configuracion' }
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 hover:bg-gray-100 rounded-lg"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:relative left-0 top-0 z-30 h-screen bg-white border-r border-gray-200 transition-all duration-300 ${
          isMobileOpen ? 'w-64' : 'hidden md:flex'
        } ${isOpen ? 'md:w-64' : 'md:w-20'} flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
          {(isMobileOpen || isOpen) && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">J</span>
              </div>
              <span className="font-bold text-gray-900">JDIGITAL</span>
            </div>
          )}
          {!isMobileOpen && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:flex hidden p-1 hover:bg-gray-100 rounded"
            >
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  isOpen ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {(isMobileOpen || isOpen) && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 text-xs text-gray-600 text-center">
          {isMobileOpen || isOpen ? 'v1.0' : null}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
