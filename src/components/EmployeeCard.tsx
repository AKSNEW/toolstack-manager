
import React from 'react';
import { Employee } from '@/lib/data';
import { User, Briefcase, Building, Phone, Mail, Package } from 'lucide-react';

interface EmployeeCardProps {
  employee: Employee;
  onClick?: (employee: Employee) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onClick }) => {
  const handleClick = () => {
    if (onClick) onClick(employee);
  };

  return (
    <div 
      className="card-hover glass rounded-xl overflow-hidden flex flex-col h-full"
      onClick={handleClick}
    >
      <div className="p-6 flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/50 shadow-lg">
            <img
              src={employee.avatar}
              alt={employee.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 shadow-lg">
            <User className="h-4 w-4" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold">{employee.name}</h3>
        <div className="flex items-center justify-center space-x-1 mt-1 text-muted-foreground">
          <Briefcase className="h-3.5 w-3.5" />
          <span className="text-sm">{employee.position}</span>
        </div>
        
        <div className="w-full mt-5 space-y-3">
          <div className="flex items-center text-sm">
            <Building className="h-4 w-4 text-muted-foreground mr-2.5" />
            <span>{employee.department}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 text-muted-foreground mr-2.5" />
            <span className="truncate">{employee.email}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Phone className="h-4 w-4 text-muted-foreground mr-2.5" />
            <span>{employee.phone}</span>
          </div>
        </div>
        
        <div className="w-full mt-5 pt-5 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Активные заказы:</span>
            <span className="flex items-center bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-medium">
              <Package className="h-3.5 w-3.5 mr-1" />
              {employee.activeRentals.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
