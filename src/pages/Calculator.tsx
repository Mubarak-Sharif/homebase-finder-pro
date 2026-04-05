import { useState } from "react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { useData } from "@/contexts/DataContext";
import { Calculator as CalcIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const Calculator = () => {
  const { products } = useData();
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [rooms, setRooms] = useState("1");
  const [productId, setProductId] = useState("none");

  const area = (Number(length) || 0) * (Number(width) || 0) * (Number(rooms) || 1);
  const selectedProduct = products.find(p => p.id === productId);
  const cost = selectedProduct ? area * selectedProduct.price : 0;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopBar />
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="flex items-center gap-2 mb-6">
          <CalcIcon className="w-6 h-6 text-primary" />
          <h1 className="font-heading text-3xl font-bold text-foreground">Marble Calculator</h1>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground">Length (ft)</label>
              <input type="number" value={length} onChange={e => setLength(e.target.value)} min={0} placeholder="e.g. 12"
                className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Width (ft)</label>
              <input type="number" value={width} onChange={e => setWidth(e.target.value)} min={0} placeholder="e.g. 10"
                className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Number of Rooms</label>
            <input type="number" value={rooms} onChange={e => setRooms(e.target.value)} min={1} placeholder="1"
              className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Select Marble (optional)</label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger className="mt-1 bg-secondary"><SelectValue placeholder="Choose marble" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No marble selected</SelectItem>
                {products.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name} - Rs.{p.price}/sqft</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results */}
          <div className="bg-secondary rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Area</span>
              <span className="text-foreground font-bold text-lg">{area.toLocaleString()} sqft</span>
            </div>
            {selectedProduct && area > 0 && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price/sqft</span>
                  <span className="text-foreground">Rs. {selectedProduct.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="text-foreground font-semibold">Estimated Cost</span>
                  <span className="text-primary font-bold text-xl">Rs. {cost.toLocaleString()}</span>
                </div>
              </>
            )}
          </div>

          <p className="text-[11px] text-muted-foreground text-center">⚠️ Approximate estimate. Final price may vary based on marble availability and cutting.</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Calculator;
