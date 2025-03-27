
import React from 'react';
import { Crew } from '@/lib/data';
import { employees } from '@/lib/data';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Users, User, UserCog } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CrewCardProps {
  crew: Crew;
  onClick: (crew: Crew) => void;
}

const CrewCard = ({ crew, onClick }: CrewCardProps) => {
  const foreman = employees.find(e => e.id === crew.foreman);
  const supervisor = employees.find(e => e.id === crew.supervisor);
  const memberCount = crew.members.length;
  
  return (
    <Card 
      className="h-full overflow-hidden hover:shadow-md transition-all cursor-pointer border border-border"
      onClick={() => onClick(crew)}
    >
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold line-clamp-1">{crew.name}</h3>
          <div className="flex items-center bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
            <Users className="h-3.5 w-3.5 mr-1" />
            {memberCount}
          </div>
        </div>

        <div className="space-y-4">
          {foreman && (
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={foreman.avatar} alt={foreman.name} />
                  <AvatarFallback>{foreman.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium line-clamp-1">{foreman.name}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <User className="h-3 w-3 mr-1" />
                  <span>Бригадир</span>
                </div>
              </div>
            </div>
          )}
          
          {supervisor && (
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={supervisor.avatar} alt={supervisor.name} />
                  <AvatarFallback>{supervisor.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium line-clamp-1">{supervisor.name}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <UserCog className="h-3 w-3 mr-1" />
                  <span>ГИП</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="px-6 py-4 bg-muted/50 border-t">
        <div className="flex -space-x-2 overflow-hidden">
          {crew.members.slice(0, 4).map(memberId => {
            const member = employees.find(e => e.id === memberId);
            if (!member) return null;
            
            return (
              <Avatar key={member.id} className="h-7 w-7 border-2 border-background">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
            );
          })}
          
          {memberCount > 4 && (
            <div className="flex items-center justify-center h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs border-2 border-background">
              +{memberCount - 4}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CrewCard;
