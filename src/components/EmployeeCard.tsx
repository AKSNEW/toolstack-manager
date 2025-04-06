
import React, { useState } from 'react';
import { Employee } from '@/lib/types';
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Phone, User, BadgeCheck, Shirt, MessageCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Edit, Trash } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import EmployeeClothingSizeForm from './EmployeeClothingSizeForm';

interface EmployeeCardProps {
  employee: Employee;
  onUpdate: (employee: Employee) => void;
  onDelete: (id: string) => void;
  onClick?: (employee: Employee) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onUpdate, onDelete, onClick }) => {
  const { toast } = useToast();
  const [isClothingSizeOpen, setIsClothingSizeOpen] = useState(false);

  const handleCopyToClipboard = () => {
    const employeeInfo = `
      Name: ${employee.name}
      Position: ${employee.position}
      Department: ${employee.department}
      Email: ${employee.email}
      Phone: ${employee.phone}
      ${employee.whatsapp ? `WhatsApp: ${employee.whatsapp}` : ''}
      ${employee.telegram ? `Telegram: ${employee.telegram}` : ''}
    `;

    navigator.clipboard.writeText(employeeInfo);
    toast({
      title: "Скопировано в буфер обмена",
      description: "Информация о сотруднике скопирована в буфер обмена",
    });
  };

  return (
    <Card className="glass" onClick={() => onClick && onClick(employee)}>
      <CardHeader>
        <div className="flex items-center">
          <Avatar className="mr-4">
            <AvatarImage src={employee.avatar} alt={employee.name} />
            <AvatarFallback>{employee.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{employee.name}</CardTitle>
            <CardDescription>{employee.position}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground space-y-1">
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            <span>{employee.email}</span>
          </div>
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2" />
            <span>{employee.phone}</span>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            <span>{employee.department}</span>
          </div>
          {employee.telegram && (
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-2" />
              <span>{employee.telegram}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          <BadgeCheck className="h-4 w-4 mr-1 inline-block" />
          <span>{employee.activeRentals.length} Активные аренды</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="px-2">
              Действия
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleCopyToClipboard}>
              <Copy className="h-4 w-4 mr-2" />
              Копировать информацию
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Редактировать
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(employee.id)} 
              disabled={!!employee.user_id}
            >
              <Trash className="h-4 w-4 mr-2" />
              Удалить
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setIsClothingSizeOpen(true)}
              className="flex items-center gap-1"
            >
              <Shirt className="h-4 w-4 mr-2" />
              Размеры одежды
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
      <EmployeeClothingSizeForm
        employee={employee}
        onUpdate={onUpdate}
        open={isClothingSizeOpen}
        onOpenChange={setIsClothingSizeOpen}
      />
    </Card>
  );
};

export default EmployeeCard;
