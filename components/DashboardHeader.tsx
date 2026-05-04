'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export function DashboardHeader() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser({
          name: user.email?.split('@')[0] || 'Usuario',
          role: 'admin',
          avatar: user.email?.charAt(0).toUpperCase() || 'U'
        });
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 z-10 bg-white border-b border-gray-200 h-16">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo for mobile */}
        <div className="md:hidden flex items-center gap-2 pl-12">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">J</span>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4 ml-auto">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-blue-600">
                {user.avatar}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-600 capitalize">{user.role}</p>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            size="sm"
            variant="outline"
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Salir</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
