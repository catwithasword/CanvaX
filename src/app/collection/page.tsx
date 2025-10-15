'use client';

import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Palette } from "lucide-react";

export default function CollectionPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">My Collection</h1>
            <p className="text-muted-foreground">
              Your verified artworks and collected pieces
            </p>
          </div>

          {/* Empty state */}
          <Card className="max-w-md mx-auto">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Palette className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">No Artworks Yet</h3>
                <p className="text-muted-foreground text-sm">
                  Create your first piece or collect from the marketplace to see them here
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
