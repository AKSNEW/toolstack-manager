
import React from 'react';
import { ClipboardList } from 'lucide-react';
import { Site } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AddSiteForm from '@/components/AddSiteForm';
import SiteDefectsJournal from '@/components/SiteDefectsJournal';

interface SiteDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isDefectJournalOpen: boolean;
  setIsDefectJournalOpen: (open: boolean) => void;
  selectedSite: Site | null;
  setSelectedSite: (site: Site | null) => void;
  onAddSuccess: () => void;
}

const SiteDialogs: React.FC<SiteDialogsProps> = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isDefectJournalOpen,
  setIsDefectJournalOpen,
  selectedSite,
  setSelectedSite,
  onAddSuccess
}) => {
  return (
    <>
      {/* Add Site Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Добавить новый объект</DialogTitle>
          </DialogHeader>
          <AddSiteForm onSuccess={onAddSuccess} />
        </DialogContent>
      </Dialog>
      
      {/* Defects Journal Dialog */}
      <Dialog 
        open={isDefectJournalOpen} 
        onOpenChange={(open) => {
          setIsDefectJournalOpen(open);
          if (!open) setSelectedSite(null);
        }}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Журнал неисправностей
              {selectedSite && <span className="text-muted-foreground ml-2">— {selectedSite.name}</span>}
            </DialogTitle>
          </DialogHeader>
          
          {selectedSite && (
            <SiteDefectsJournal siteId={selectedSite.id} siteName={selectedSite.name} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SiteDialogs;
