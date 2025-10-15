'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, Wallet } from "lucide-react";
import { useRouter } from 'next/navigation';

interface SignInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SignInModal = ({ open, onOpenChange }: SignInModalProps) => {
  const router = useRouter();

  const handleSignIn = () => {
    // For now, just navigate to the create page and close the modal
    router.push('/create');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-2 border-primary">
        <DialogHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <DialogTitle className="text-2xl font-semibold text-center">
            CanvaX
          </DialogTitle>
          <p className="text-muted-foreground text-center text-sm">
            Verify your humanity and connect your wallet to start creating
          </p>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
              <Shield className="w-5 h-5 mt-0.5 text-foreground" />
              <div className="flex-1">
                <h4 className="font-medium text-sm">Verification Level</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  World ID Orb verification required
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
              <Wallet className="w-5 h-5 mt-0.5 text-foreground" />
              <div className="flex-1">
                <h4 className="font-medium text-sm">Wallet Address</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Connect to mint and trade your artwork
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={handleSignIn}
            className="w-full h-12 rounded-full font-medium hover-invert"
          >
            Continue with World ID
          </Button>
          <Button 
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full h-12 rounded-full font-medium"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
