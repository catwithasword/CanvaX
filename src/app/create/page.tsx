"use client";

import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Download, Trash2, Pencil, Eraser } from "lucide-react";
import { toast } from "sonner";

type DrawingMode = 'freehand' | 'pixel' | 'shapes';

const ERASER_CURSOR =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='10' fill='%23ffffff' stroke='%23000000' stroke-width='2'/%3E%3C/svg%3E\") 16 16, crosshair";

const SHAPE_BUTTONS = [
  {
    type: 'line',
    label: 'Line',
    renderIcon: () => (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="2" y1="14" x2="14" y2="2" />
      </svg>
    ),
  },
  {
    type: 'arrow',
    label: 'Arrow',
    renderIcon: () => (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="8,4 18,12 8,20" />
        <line x1="6" y1="12" x2="18" y2="12" />
      </svg>
    ),
  },
  {
    type: 'rect',
    label: 'Rectangle',
    renderIcon: () => (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="12" height="8" />
      </svg>
    ),
  },
  {
    type: 'rounded-rect',
    label: 'Rounded Rectangle',
    renderIcon: () => (
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="5" width="14" height="10" rx="3" ry="3" />
      </svg>
    ),
  },
  {
    type: 'diamond',
    label: 'Diamond',
    renderIcon: () => (
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="10,2 18,10 10,18 2,10" />
      </svg>
    ),
  },
  {
    type: 'circle',
    label: 'Circle',
    renderIcon: () => (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="8" r="6" />
      </svg>
    ),
  },
  {
    type: 'ellipse',
    label: 'Ellipse',
    renderIcon: () => (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="8" cy="8" rx="6" ry="4" />
      </svg>
    ),
  },
  {
    type: 'triangle',
    label: 'Triangle',
    renderIcon: () => (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="8,2 14,14 2,14" />
      </svg>
    ),
  },
  {
    type: 'hexagon',
    label: 'Hexagon',
    renderIcon: () => (
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="6,3 14,3 18,10 14,17 6,17 2,10" />
      </svg>
    ),
  },
  {
    type: 'star',
    label: 'Star',
    renderIcon: () => (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
        <polygon points="8,1 10,6 15,6 11,9 13,14 8,11 3,14 5,9 1,6 6,6" />
      </svg>
    ),
  },
] as const satisfies ReadonlyArray<{
  type: 'line' | 'arrow' | 'rect' | 'rounded-rect' | 'diamond' | 'circle' | 'ellipse' | 'triangle' | 'hexagon' | 'star';
  label: string;
  renderIcon: () => JSX.Element;
}>;

type ShapeType = typeof SHAPE_BUTTONS[number]['type'];

export default function CreatePage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const pixelCanvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<any | null>(null);
  const fabricRef = useRef<any | null>(null);
  const [mode, setMode] = useState<DrawingMode>('freehand');
  const [pixelSize] = useState(20); // Grid cell size for pixel mode
  const [currentColor, setCurrentColor] = useState('#000000');
  const [pixelGrid, setPixelGrid] = useState<string[][]>([]);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!canvasContainerRef.current) return;

      try {
        const mod = await import('fabric');
        const FabricCanvasDyn = (mod as any).Canvas;
        const PencilBrushDyn = (mod as any).PencilBrush;

        // If an existing fabric instance exists, dispose it first to prevent duplicate initialization
        if (fabricRef.current) {
          try {
            fabricRef.current.dispose();
          } catch (e) {
            // ignore
          }
          fabricRef.current = null;
        }

        // Create a fresh canvas element inside the container so re-mounting always gets a new element
        const createdCanvas = document.createElement('canvas');
        createdCanvas.width = 800;
        createdCanvas.height = 600;
        // ensure it starts visible; pixel mode toggles visibility after mount
        createdCanvas.style.display = 'block';
        // append before pixel canvas (pixel canvas is absolute overlay)
        canvasContainerRef.current.appendChild(createdCanvas);

        // keep a ref to the created element for cleanup and other logic
        canvasRef.current = createdCanvas;

        const canvas = new FabricCanvasDyn(createdCanvas, {
          width: 800,
          height: 600,
          backgroundColor: "#FFFFFF",
          isDrawingMode: true,
        });

        const brush = new PencilBrushDyn(canvas);
        brush.color = "#000000";
        brush.width = 2;
        canvas.freeDrawingBrush = brush;

  if (!mounted) return;
  fabricRef.current = canvas;
  setFabricCanvas(canvas);
        toast("Canvas ready! Start drawing your artwork.");

      } catch (err) {
        console.error('Failed to initialize fabric:', err);
        toast.error?.("Canvas failed to load. Check console for details.");
      }
    })();

    return () => {
      mounted = false;
      if (fabricRef.current) {
        try { fabricRef.current.dispose(); } catch (e) { /* ignore */ }
        fabricRef.current = null;
      }
      // remove the created canvas element from the DOM if present
      try {
        if (canvasRef.current && canvasRef.current.parentNode) {
          canvasRef.current.parentNode.removeChild(canvasRef.current);
        }
      } catch (e) { /* ignore */ }
      canvasRef.current = null;
      // Also clear state reference
      setFabricCanvas(null);
    };
  }, []);

  // Initialize pixel grid
  useEffect(() => {
    const cols = Math.floor(800 / pixelSize);
    const rows = Math.floor(600 / pixelSize);
    const grid: string[][] = [];
    for (let i = 0; i < rows; i++) {
      grid[i] = [];
      for (let j = 0; j < cols; j++) {
        grid[i][j] = '#FFFFFF';
      }
    }
    setPixelGrid(grid);
  }, [pixelSize]);

  useEffect(() => {
    if (mode === 'shapes' && tool !== 'brush') {
      setTool('brush');
    }
  }, [mode, tool]);

  useEffect(() => {
    if (!fabricCanvas) return;
    
    // Set canvas drawing mode based on current mode
    fabricCanvas.isDrawingMode = mode === 'freehand';
    fabricCanvas.selection = mode === 'shapes';
    
    // Enable/disable object selection
    fabricCanvas.forEachObject((obj: any) => {
      obj.selectable = mode === 'shapes';
      obj.evented = mode === 'shapes';
    });

    // Apply color to brush in freehand mode
    if (mode === 'freehand' && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = tool === 'eraser' ? '#FFFFFF' : currentColor;
      fabricCanvas.freeDrawingBrush.width = tool === 'eraser' ? 20 : 2;
    }
    
    fabricCanvas.renderAll();
  }, [mode, fabricCanvas, currentColor, tool]);

  useEffect(() => {
    if (!fabricCanvas) return;

    const cursor =
      mode === 'freehand'
        ? tool === 'eraser'
          ? ERASER_CURSOR
          : 'crosshair'
        : mode === 'shapes'
          ? 'default'
          : 'crosshair';

    try {
      fabricCanvas.freeDrawingCursor = cursor;
      if (fabricCanvas.upperCanvasEl) {
        fabricCanvas.upperCanvasEl.style.cursor = cursor;
      }
    } catch (e) {
      // ignore cursor assignment failures
    }
  }, [fabricCanvas, mode, tool]);

  useEffect(() => {
    const pixelCanvas = pixelCanvasRef.current;
    if (!pixelCanvas) return;

    const cursor =
      mode === 'pixel'
        ? tool === 'eraser'
          ? ERASER_CURSOR
          : 'crosshair'
        : 'default';

    pixelCanvas.style.cursor = cursor;
  }, [mode, tool]);

  useEffect(() => {
    if (!fabricCanvas) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Backspace' && event.key !== 'Delete') return;
      if (mode !== 'shapes') return;

      const target = event.target as HTMLElement | null;
      if (target) {
        const tagName = target.tagName;
        if (
          tagName === 'INPUT' ||
          tagName === 'TEXTAREA' ||
          tagName === 'SELECT' ||
          target.isContentEditable
        ) {
          return;
        }
      }

      const activeObject = fabricCanvas.getActiveObject();
      if (!activeObject) return;

      event.preventDefault();

      if (
        activeObject.type === 'activeSelection' &&
        typeof (activeObject as any).forEachObject === 'function'
      ) {
        (activeObject as any).forEachObject((obj: any) => {
          try {
            fabricCanvas.remove(obj);
          } catch (e) {
            // ignore removal issues
          }
        });
      } else {
        try {
          fabricCanvas.remove(activeObject);
        } catch (e) {
          // ignore removal issues
        }
      }

      fabricCanvas.discardActiveObject();
      fabricCanvas.requestRenderAll();
      toast("Shape removed");
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fabricCanvas, mode]);

  // Toggle display/pointer behavior when mode changes so canvas/pixel overlay don't interfere
  useEffect(() => {
    // main created canvas
    try {
      if (canvasRef.current) {
        (canvasRef.current as HTMLCanvasElement).style.display = mode === 'pixel' ? 'none' : 'block';
        (canvasRef.current as HTMLCanvasElement).style.pointerEvents = mode === 'pixel' ? 'none' : 'auto';
      }
    } catch (e) { /* ignore */ }

    // pixel overlay
    try {
      if (pixelCanvasRef.current) {
        pixelCanvasRef.current.style.display = mode === 'pixel' ? 'block' : 'none';
        pixelCanvasRef.current.style.pointerEvents = mode === 'pixel' ? 'auto' : 'none';
      }
    } catch (e) { /* ignore */ }
  }, [mode]);

  // Render pixel canvas
  useEffect(() => {
    if (mode !== 'pixel' || !pixelCanvasRef.current || pixelGrid.length === 0) return;
    
    const ctx = pixelCanvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 800, 600);

    // Draw filled pixels
    pixelGrid.forEach((row, i) => {
      row.forEach((color, j) => {
        if (color !== '#FFFFFF') {
          ctx.fillStyle = color;
          ctx.fillRect(j * pixelSize, i * pixelSize, pixelSize, pixelSize);
        }
      });
    });

    // Draw grid lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= 800; x += pixelSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 600);
      ctx.stroke();
    }

    for (let y = 0; y <= 600; y += pixelSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(800, y);
      ctx.stroke();
    }
  }, [mode, pixelGrid, pixelSize]);

  const handleClear = () => {
    if (mode === 'pixel') {
      // Reset pixel grid to white
      const cols = Math.floor(800 / pixelSize);
      const rows = Math.floor(600 / pixelSize);
      const newGrid: string[][] = [];
      for (let i = 0; i < rows; i++) {
        newGrid[i] = [];
        for (let j = 0; j < cols; j++) {
          newGrid[i][j] = '#FFFFFF';
        }
      }
      setPixelGrid(newGrid);
      // clear pixel canvas immediate draw
      try {
        const ctx = pixelCanvasRef.current?.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, 800, 600);
      } catch (e) { /* ignore */ }
      toast('Pixel canvas cleared!');
      return;
    }

    // For Fabric-based canvas (freehand / shapes)
    const c = fabricRef.current || fabricCanvas;
    if (!c) {
      toast.error?.('No canvas to clear');
      return;
    }

    try {
      // Remove all objects explicitly and clear
      const objs = c.getObjects ? c.getObjects() : [];
      objs.forEach((o: any) => {
        try { c.remove(o); } catch (e) { /* ignore */ }
      });
      // clear() may remove background depending on version, so set background afterwards
      try { c.clear(); } catch (e) { /* ignore */ }

      if (typeof c.setBackgroundColor === 'function') {
        try { c.setBackgroundColor('#FFFFFF', c.renderAll.bind(c)); } catch (e) { c.renderAll(); }
      } else {
        try { c.backgroundColor = '#FFFFFF'; c.renderAll(); } catch (e) { /* ignore */ }
      }

      toast('Canvas cleared!');
    } catch (err) {
      console.error('Clear canvas failed:', err);
      toast.error?.('Failed to clear canvas');
    }
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

  const handlePixelClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'pixel' || !pixelCanvasRef.current) return;
    
    const rect = pixelCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const col = Math.floor(x / pixelSize);
    const row = Math.floor(y / pixelSize);
    
    if (row >= 0 && row < pixelGrid.length && col >= 0 && col < pixelGrid[0].length) {
      const newGrid = pixelGrid.map(r => [...r]);
      newGrid[row][col] = tool === 'eraser' ? '#FFFFFF' : currentColor;
      setPixelGrid(newGrid);
    }
  };

  const addShape = async (shapeType: ShapeType) => {
    if (!fabricCanvas) return;
    
    try {
      // Import fabric module and get the constructors
      const fabricModule = await import('fabric');
      
      // Access constructors from the fabric namespace
      const Rect = (fabricModule as any).Rect || (window as any).fabric?.Rect;
      const Circle = (fabricModule as any).Circle || (window as any).fabric?.Circle;
      const Triangle = (fabricModule as any).Triangle || (window as any).fabric?.Triangle;
      const Line = (fabricModule as any).Line || (window as any).fabric?.Line;
      const Ellipse = (fabricModule as any).Ellipse || (window as any).fabric?.Ellipse;
      const Polygon = (fabricModule as any).Polygon || (window as any).fabric?.Polygon;
      
      let shape: any;
      const randomOffset = Math.floor(Math.random() * 100);

      switch (shapeType) {
        case 'rect':
          if (Rect) {
            shape = new Rect({
              left: 100 + randomOffset,
              top: 100 + randomOffset,
              fill: currentColor,
              width: 100,
              height: 80,
              selectable: true,
              hasControls: true,
              hasBorders: true,
            });
          }
          break;
        case 'circle':
          if (Circle) {
            shape = new Circle({
              left: 100 + randomOffset,
              top: 100 + randomOffset,
              radius: 50,
              fill: currentColor,
              selectable: true,
              hasControls: true,
              hasBorders: true,
            });
          }
          break;
        case 'triangle':
          if (Triangle) {
            shape = new Triangle({
              left: 100 + randomOffset,
              top: 100 + randomOffset,
              fill: currentColor,
              width: 80,
              height: 80,
              selectable: true,
              hasControls: true,
              hasBorders: true,
            });
          }
          break;
        case 'line':
          if (Line) {
            shape = new Line([50 + randomOffset, 100, 150 + randomOffset, 100], {
              stroke: currentColor,
              strokeWidth: 4,
              selectable: true,
              hasControls: true,
              hasBorders: true,
            });
          }
          break;
        case 'arrow':
          if (Polygon) {
            const arrowPoints = [
              { x: 0, y: 20 },
              { x: 70, y: 20 },
              { x: 70, y: 0 },
              { x: 110, y: 40 },
              { x: 70, y: 80 },
              { x: 70, y: 60 },
              { x: 0, y: 60 },
            ];
            shape = new Polygon(arrowPoints, {
              fill: currentColor,
              left: 80 + randomOffset,
              top: 80 + randomOffset,
              selectable: true,
              hasControls: true,
              hasBorders: true,
            });
          }
          break;
        case 'rounded-rect':
          if (Rect) {
            shape = new Rect({
              left: 100 + randomOffset,
              top: 100 + randomOffset,
              fill: currentColor,
              width: 120,
              height: 80,
              rx: 20,
              ry: 20,
              selectable: true,
              hasControls: true,
              hasBorders: true,
            });
          }
          break;
        case 'diamond':
          if (Polygon) {
            const diamondPoints = [
              { x: 0, y: 60 },
              { x: 60, y: 0 },
              { x: 120, y: 60 },
              { x: 60, y: 120 },
            ];
            shape = new Polygon(diamondPoints, {
              fill: currentColor,
              left: 80 + randomOffset,
              top: 80 + randomOffset,
              selectable: true,
              hasControls: true,
              hasBorders: true,
            });
          }
          break;
        case 'ellipse':
          if (Ellipse) {
            shape = new Ellipse({
              left: 100 + randomOffset,
              top: 100 + randomOffset,
              rx: 60,
              ry: 40,
              fill: currentColor,
              selectable: true,
              hasControls: true,
              hasBorders: true,
            });
          }
          break;
        case 'hexagon':
          if (Polygon) {
            const hexagonPoints = [];
            const radius = 60;
            for (let i = 0; i < 6; i++) {
              const angle = (Math.PI / 3) * i;
              hexagonPoints.push({
                x: radius + radius * Math.cos(angle),
                y: radius + radius * Math.sin(angle),
              });
            }
            shape = new Polygon(hexagonPoints, {
              fill: currentColor,
              left: 80 + randomOffset,
              top: 80 + randomOffset,
              selectable: true,
              hasControls: true,
              hasBorders: true,
            });
          }
          break;
        case 'star':
          if (Polygon) {
            const points = [];
            const spikes = 5;
            const outerRadius = 50;
            const innerRadius = 25;
            for (let i = 0; i < spikes * 2; i++) {
              const radius = i % 2 === 0 ? outerRadius : innerRadius;
              const angle = (i * Math.PI) / spikes;
              points.push({
                x: radius * Math.sin(angle),
                y: -radius * Math.cos(angle),
              });
            }
            shape = new Polygon(points, {
              fill: currentColor,
              left: 100 + randomOffset,
              top: 100 + randomOffset,
              selectable: true,
              hasControls: true,
              hasBorders: true,
            });
          }
          break;
      }

      if (shape) {
        fabricCanvas.add(shape);
        fabricCanvas.setActiveObject(shape);
        fabricCanvas.renderAll();
        toast.success(`${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} added with color ${currentColor}!`);
      } else {
        throw new Error('Shape constructor not available');
      }
    } catch (err) {
      console.error('Add shape failed:', err);
      toast.error(`Could not add ${shapeType}. Check console for details.`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
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
            <div className="flex-1 space-y-4">
              {mode === 'shapes' && (
                <div className="border border-border rounded-lg bg-white shadow-sm px-3 py-2 space-y-2">
                  <h3 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                    Shape Tools
                  </h3>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                    {SHAPE_BUTTONS.map(({ type, label, renderIcon }) => (
                      <Button
                        key={type}
                        onClick={() => addShape(type)}
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        title={label}
                        aria-label={label}
                      >
                        {renderIcon()}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-2 border-primary rounded-2xl overflow-hidden shadow-lg bg-white relative">
                  {/* Container where the dynamic Fabric canvas will be appended */}
                  <div ref={canvasContainerRef} style={{ width: 800, height: 600 }} />

                  <canvas 
                    ref={pixelCanvasRef} 
                    width={800} 
                    height={600}
                    onClick={handlePixelClick}
                    className="absolute top-0 left-0"
                    style={{
                      display: mode === 'pixel' ? 'block' : 'none',
                      pointerEvents: mode === 'pixel' ? 'auto' : 'none',
                      cursor: mode === 'pixel'
                        ? tool === 'eraser'
                          ? ERASER_CURSOR
                          : 'crosshair'
                        : 'default',
                    }}
                  />
                </div>
            </div>

            {/* Tools Sidebar */}
            <div className="lg:w-64 space-y-4">
              {/* Drawing Modes */}
              <div className="border border-border rounded-xl p-4 space-y-4">
                <h3 className="font-semibold">Drawing Mode</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Plain Canvas
                    </h4>
                    <div className="space-y-2">
                      <Button
                        onClick={() => {
                          setMode('freehand');
                          toast("Freehand Drawing: Express yourself with natural brush strokes");
                        }}
                        className="w-full justify-start gap-2"
                        variant={mode === 'freehand' ? "default" : "outline"}
                      >
                        <Pencil className="w-4 h-4" />
                        Freehand Drawing
                      </Button>

                      <Button
                        onClick={() => {
                          setMode('shapes');
                          toast("Shape Tools: Build compositions with geometric precision");
                        }}
                        variant={mode === 'shapes' ? "default" : "outline"}
                        className="w-full justify-start gap-2"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="1" y="1" width="6" height="6"/>
                          <circle cx="12" cy="4" r="3"/>
                          <polygon points="4,15 7,9 1,9"/>
                        </svg>
                        Shape Tools
                      </Button>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Pixel Grid
                    </h4>
                    <Button
                      onClick={() => {
                        setMode('pixel');
                        toast("Pixel Art Grid: Create retro-style art pixel by pixel");
                      }}
                      variant={mode === 'pixel' ? "default" : "outline"}
                      className="w-full justify-start gap-2"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                        <rect x="0" y="0" width="4" height="4"/>
                        <rect x="6" y="0" width="4" height="4"/>
                        <rect x="12" y="0" width="4" height="4"/>
                        <rect x="0" y="6" width="4" height="4"/>
                        <rect x="6" y="6" width="4" height="4"/>
                        <rect x="12" y="6" width="4" height="4"/>
                        <rect x="0" y="12" width="4" height="4"/>
                        <rect x="6" y="12" width="4" height="4"/>
                        <rect x="12" y="12" width="4" height="4"/>
                      </svg>
                      Pixel Art Grid
                    </Button>
                  </div>
                </div>
              </div>

              {/* Color Picker */}
              <div className="border border-border rounded-xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold">Tools & Color</h3>
                  <div className="flex gap-2">
                    <Button
                      variant={tool === 'brush' ? "default" : "outline"}
                      size="sm"
                      className="gap-1"
                      onClick={() => setTool('brush')}
                    >
                      <Pencil className="w-4 h-4" />
                      Brush
                    </Button>
                    <Button
                      variant={tool === 'eraser' ? "default" : "outline"}
                      size="sm"
                      className="gap-1"
                      onClick={() => {
                        if (mode === 'shapes') return;
                        setTool('eraser');
                      }}
                      disabled={mode === 'shapes'}
                    >
                      <Eraser className="w-4 h-4" />
                      Eraser
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => {
                      const newColor = e.target.value;
                      setCurrentColor(newColor);
                      if (tool === 'eraser') {
                        setTool('brush');
                      }
                      
                      // If in shapes mode, update selected shape's color
                      if (mode === 'shapes' && fabricCanvas) {
                        const activeObject = fabricCanvas.getActiveObject();
                        if (activeObject) {
                          if (activeObject.type === 'line') {
                            activeObject.set('stroke', newColor);
                          } else {
                            activeObject.set('fill', newColor);
                          }
                          fabricCanvas.renderAll();
                          toast.success(`Shape color updated to ${newColor}`);
                        }
                      }
                      }}
                    className="w-12 h-12 rounded cursor-pointer border-2 border-border"
                    disabled={tool === 'eraser'}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {tool === 'eraser' ? 'Eraser active' : currentColor.toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tool === 'eraser'
                        ? mode === 'pixel'
                          ? 'Click pixels to clear them'
                          : 'Brush erases with the canvas background'
                        : mode === 'freehand'
                          ? 'Brush color'
                          : mode === 'pixel'
                            ? 'Pixel color'
                            : mode === 'shapes' && fabricCanvas?.getActiveObject()
                              ? 'Selected shape'
                              : 'New shapes'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'].map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        setCurrentColor(color);
                        if (tool === 'eraser') {
                          setTool('brush');
                        }
                        
                        // If in shapes mode, update selected shape's color
                        if (mode === 'shapes' && fabricCanvas) {
                          const activeObject = fabricCanvas.getActiveObject();
                          if (activeObject) {
                            if (activeObject.type === 'line') {
                              activeObject.set('stroke', color);
                            } else {
                              activeObject.set('fill', color);
                            }
                            fabricCanvas.renderAll();
                            toast.success(`Shape color updated to ${color}`);
                          }
                        }
                      }}
                      className="w-6 h-6 rounded border-2 border-border hover:scale-110 transition-transform disabled:opacity-40"
                      style={{ backgroundColor: color }}
                      title={color}
                      disabled={tool === 'eraser'}
                    />
                  ))}
                </div>
              </div>

              {/* Canvas Actions */}
              <div className="border border-border rounded-xl p-4 space-y-3">
                <h3 className="font-semibold mb-3">Canvas Actions</h3>
                
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
                  Once you&apos;re happy with your artwork, export it and mint it as an NFT 
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
}
