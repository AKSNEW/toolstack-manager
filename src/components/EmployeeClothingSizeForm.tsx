
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ClothingSize, Employee } from '@/lib/types';
import { Shirt } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface EmployeeClothingSizeFormProps {
  employee: Employee;
  onUpdate: (employee: Employee) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const shirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const gloveSizes = ['XS', 'S', 'M', 'L', 'XL'];
const helmetSizes = ['S', 'M', 'L', 'XL'];

const EmployeeClothingSizeForm: React.FC<EmployeeClothingSizeFormProps> = ({
  employee,
  onUpdate,
  open,
  onOpenChange
}) => {
  const { toast } = useToast();
  const [clothingSize, setClothingSize] = useState<ClothingSize>(
    employee.clothingSize || {
      shirt: 'M',
      pants: 32,
      shoes: 42,
      gloves: 'M',
      helmet: 'M'
    }
  );

  const handleSubmit = () => {
    const updatedEmployee = {
      ...employee,
      clothingSize
    };
    
    onUpdate(updatedEmployee);
    
    toast({
      title: "Размеры обновлены",
      description: "Размеры спецодежды успешно обновлены",
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shirt className="h-5 w-5" />
            Размеры спецодежды
          </DialogTitle>
          <DialogDescription>
            Укажите размеры спецодежды для сотрудника {employee.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shirt-size">Размер рубашки/куртки</Label>
              <Select
                value={clothingSize.shirt}
                onValueChange={(value) => 
                  setClothingSize({ ...clothingSize, shirt: value as any })
                }
              >
                <SelectTrigger id="shirt-size">
                  <SelectValue placeholder="Выберите размер" />
                </SelectTrigger>
                <SelectContent>
                  {shirtSizes.map(size => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pants-size">Размер брюк (см)</Label>
              <Select
                value={clothingSize.pants.toString()}
                onValueChange={(value) => 
                  setClothingSize({ ...clothingSize, pants: parseInt(value) })
                }
              >
                <SelectTrigger id="pants-size">
                  <SelectValue placeholder="Выберите размер" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 20 }, (_, i) => i + 28).map(size => (
                    <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shoes-size">Размер обуви (EU)</Label>
              <Select
                value={clothingSize.shoes.toString()}
                onValueChange={(value) => 
                  setClothingSize({ ...clothingSize, shoes: parseInt(value) })
                }
              >
                <SelectTrigger id="shoes-size">
                  <SelectValue placeholder="Выберите размер" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 15 }, (_, i) => i + 36).map(size => (
                    <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gloves-size">Размер перчаток</Label>
              <Select
                value={clothingSize.gloves}
                onValueChange={(value) => 
                  setClothingSize({ ...clothingSize, gloves: value as any })
                }
              >
                <SelectTrigger id="gloves-size">
                  <SelectValue placeholder="Выберите размер" />
                </SelectTrigger>
                <SelectContent>
                  {gloveSizes.map(size => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="helmet-size">Размер каски</Label>
              <Select
                value={clothingSize.helmet || 'M'}
                onValueChange={(value) => 
                  setClothingSize({ ...clothingSize, helmet: value as any })
                }
              >
                <SelectTrigger id="helmet-size">
                  <SelectValue placeholder="Выберите размер" />
                </SelectTrigger>
                <SelectContent>
                  {helmetSizes.map(size => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
          <Button onClick={handleSubmit}>Сохранить размеры</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeClothingSizeForm;
