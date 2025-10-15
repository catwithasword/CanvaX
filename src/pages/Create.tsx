import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Download, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

const Create = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [isDrawing, setIsDrawing] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#FFFFFF",
      isDrawingMode: true,
    });

    const brush = new PencilBrush(canvas);
    brush.color = "#000000";
    brush.width = 2;
    canvas.freeDrawingBrush = brush;

    setFabricCanvas(canvas);
    toast("Canvas ready! Start drawing your artwork.");

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;
    fabricCanvas.isDrawingMode = isDrawing;
  }, [isDrawing, fabricCanvas]);

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#FFFFFF";
    fabricCanvas.renderAll();
    toast("Canvas cleared!");
  };

  const handleExport = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1,
    });

    const link = document.createElement("a");
    link.download = `artwork-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
    
    toast("Artwork exported as PNG!");
  };

  const handleToggleDrawing = () => {
    setIsDrawing(!isDrawing);
    toast(isDrawing ? "Selection mode" : "Drawing mode");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={true} />
      
      <main className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Create Your Art</h1>
            <p className="text-muted-foreground">
              Draw your unique creation. It will be verified and minted as an NFT.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Canvas */}
            <div className="flex-1">
              <div className="border-2 border-primary rounded-2xl overflow-hidden shadow-lg bg-white">
                <canvas ref={canvasRef} />
              </div>
            </div>

            {/* Tools Sidebar */}
            <div className="lg:w-64 space-y-4">
              <div className="border border-border rounded-xl p-4 space-y-3">
                <h3 className="font-semibold mb-3">Tools</h3>
                
                <Button
                  onClick={handleToggleDrawing}
                  className="w-full justify-start gap-2"
                  variant={isDrawing ? "default" : "outline"}
                >
                  <Pencil className="w-4 h-4" />
                  {isDrawing ? "Drawing" : "Select"}
                </Button>

                <Button
                  onClick={handleClear}
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Canvas
                </Button>

                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export PNG
                </Button>
              </div>

              <div className="border border-border rounded-xl p-4 space-y-3">
                <h3 className="font-semibold mb-3">Next Steps</h3>
                <p className="text-sm text-muted-foreground">
                  Once you're happy with your artwork, export it and mint it as an NFT 
                  to prove its human origin.
                </p>
                <Button className="w-full hover-invert" disabled>
                  Mint as NFT
                  <span className="text-xs ml-2">(Coming Soon)</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Create;
