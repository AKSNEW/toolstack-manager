
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Site } from '@/lib/types';
import SiteDefectsJournal from '@/components/SiteDefectsJournal';
import AddSiteForm from '@/components/AddSiteForm';
import SiteDetails from './SiteDetails';

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
  onAddSuccess,
}) => {
  return (
    <>
      {/* Site Details Dialog */}
      <Dialog
        open={selectedSite !== null && !isDefectJournalOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedSite(null);
        }}
      >
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          {selectedSite && <SiteDetails site={selectedSite} />}
        </DialogContent>
      </Dialog>
      
      {/* Add Site Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <AddSiteForm onSuccess={onAddSuccess} />
        </DialogContent>
      </Dialog>
      
      {/* Defect Journal Dialog */}
      <Dialog
        open={isDefectJournalOpen}
        onOpenChange={setIsDefectJournalOpen}
      >
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          {selectedSite && <SiteDefectsJournal site={selectedSite} />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SiteDialogs;
