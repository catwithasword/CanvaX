'use client';

import { useState } from "react";
import { Header } from "@/components/Header";
import { SignInModal } from "@/components/SignInModal";
import { Button } from "@/components/ui/button";
import { Shield, Palette, Verified, Globe } from "lucide-react";
import Logo from '@/components/Logo';

export default function Home() {
  const [showSignIn, setShowSignIn] = useState(false);

  const features = [
    {
      icon: Palette,
      title: "Create Authentic Art",
      description: "Draw freehand, design pixel art, or compose with shapes. Your creativity, your rules.",
    },
    {
      icon: Verified,
      title: "Verify Your Humanity",
      description: "World ID ensures every piece is created by a real human, not an algorithm.",
    },
    {
      icon: Shield,
      title: "Mint as NFT",
      description: "Turn your verified artwork into a unique, blockchain-backed digital asset.",
    },
    {
      icon: Globe,
      title: "Trade on Marketplace",
      description: "Buy, sell, and collect authentic human-made art in a curated gallery.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onSignInClick={() => setShowSignIn(true)} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <div className="inline-block">
            <div className="px-4 py-2 rounded-full border border-border bg-muted/50 text-sm font-medium">
              Read Before You Sign In
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            CanvaX
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A platform where human creativity meets blockchain verification. 
            Create, verify, and mint authentic art that proves its human origin.
          </p>

          <div className="flex gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => setShowSignIn(true)}
              className="rounded-full px-8 h-12 hover-invert"
            >
              Sign In to Start
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 h-12"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 gradient-subtle">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">
              Four simple steps to create and mint verified human art
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl border border-border bg-card hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Detail */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Why CanvaX?</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              In an age where AI can generate endless images, we believe in celebrating 
              and preserving authentic human creativity. Every piece on our platform is 
              verified through World ID, ensuring that what you see, buy, and collect 
              was made by real people.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold">The Tools</h2>
            <div className="space-y-3 text-muted-foreground">
              <p className="flex items-start gap-2">
                <span className="font-medium text-foreground">Freehand Drawing:</span>
                <span>Express yourself with natural brush strokes</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-medium text-foreground">Pixel Art Grid:</span>
                <span>Create retro-style art pixel by pixel</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-medium text-foreground">Shape Tools:</span>
                <span>Build compositions with geometric precision</span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Built on Trust</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              World ID verification ensures one person, one identity. Your artwork becomes 
              a timestamped proof of human creativity, minted on the blockchain for 
              authenticity and ownership.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 gradient-subtle">
        <div className="container mx-auto max-w-3xl text-center space-y-8">
          <h2 className="text-4xl font-bold">Ready to Create?</h2>
          <p className="text-xl text-muted-foreground">
            Join a community of verified human artists and start minting your unique creations today.
          </p>
          <Button
            size="lg"
            onClick={() => setShowSignIn(true)}
            className="rounded-full px-8 h-12 hover-invert"
          >
            Sign In to Start Creating
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Logo size={20} />
              <span className="font-semibold">CanvaX</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 CanvaX. Celebrating authentic human creativity.
            </p>
          </div>
        </div>
      </footer>

      <SignInModal open={showSignIn} onOpenChange={setShowSignIn} />
    </div>
  );
}
