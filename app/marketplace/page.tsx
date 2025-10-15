'use client';

import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Verified } from "lucide-react";

export default function MarketplacePage() {
  // Mock data for NFT cards
  const mockNFTs = [
    { id: 1, title: "Abstract Dreams", artist: "0x1234...5678", price: "0.5 ETH", verified: true },
    { id: 2, title: "Pixel Paradise", artist: "0x8765...4321", price: "0.3 ETH", verified: true },
    { id: 3, title: "Geometric Mind", artist: "0xabcd...efgh", price: "0.7 ETH", verified: true },
    { id: 4, title: "Human Touch", artist: "0x9999...1111", price: "0.4 ETH", verified: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
            <p className="text-muted-foreground">
              Discover and collect verified human-made art
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockNFTs.map((nft) => (
              <Card key={nft.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gradient-to-br from-muted to-accent rounded-t-lg" />
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold group-hover:underline">{nft.title}</h3>
                        <p className="text-sm text-muted-foreground">{nft.artist}</p>
                      </div>
                      {nft.verified && (
                        <Verified className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="font-mono">
                        {nft.price}
                      </Badge>
                      <span className="text-sm text-muted-foreground">Verified Human</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              More artworks coming soon as our community grows
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
