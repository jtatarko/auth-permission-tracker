import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Users, Home } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    {
      path: '/email',
      label: 'Email Notification',
      icon: Mail,
      description: 'Daily permission changes summary'
    },
    {
      path: '/authorizations',
      label: 'Authorizations',
      icon: Users,
      description: 'Manage authorization permissions'
    }
  ];

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Home className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-lg">Adverity Permissions Demo</span>
          </div>
          <div className="flex space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Navigate between different views to test the user flows
        </div>
      </CardContent>
    </Card>
  );
};

export default Navigation;