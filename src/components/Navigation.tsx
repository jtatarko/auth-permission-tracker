import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Users } from "lucide-react";

const Navigation: React.FC = () => {
  const navItems = [
    {
      path: "/email",
      label: "Email Notification",
      icon: Mail,
      description: "Daily permission changes summary",
    },
    {
      path: "/authorizations",
      label: "Authorizations Page",
      icon: Users,
      description: "Manage authorization entities",
    },
  ];

  return (
    <Card className="bg-white w-screen shadow-none border-none fixed bottom-0 z-10">
      <CardContent className="p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm">
            <img
              src="/logos/Adverity_Brandmark.svg"
              alt="Adverity"
              className="h-6 w-6"
            />
            {/* <Home className="h-5 w-5 text-blue-600" /> */}
            <span>Adverity Entities Demo</span>
          </div>
          <div className="flex space-x-2">
            <div className="mt-2 text-sm text-gray-600">Navigate between</div>
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="outline"
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
      </CardContent>
    </Card>
  );
};

export default Navigation;
