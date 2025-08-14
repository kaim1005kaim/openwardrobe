'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Images } from 'lucide-react';

export function TabNavigation() {
  const pathname = usePathname();

  const tabs = [
    {
      name: 'Generator',
      href: '/',
      icon: Home,
      active: pathname === '/'
    },
    {
      name: 'Gallery',
      href: '/gallery',
      icon: Images,
      active: pathname === '/gallery'
    }
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="flex space-x-8 px-6" aria-label="Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${tab.active
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              <Icon className={`
                mr-2 h-5 w-5
                ${tab.active
                  ? 'text-blue-500 dark:text-blue-400'
                  : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                }
              `} />
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}