import { Button } from "@/components/ui/button";
import heroBanner from "@assets/stock_images/beautiful_indian_wom_57ee3411.jpg";

export default function HeroSection() {
  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBanner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40" />
      </div>
      
      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
        <div className="max-w-2xl text-primary-foreground">
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-4" data-testid="text-hero-title">
            Exquisite Traditional Jewelry
          </h2>
          <p className="text-lg md:text-xl mb-8 text-primary-foreground/90" data-testid="text-hero-subtitle">
            Discover our handcrafted collection of imitation jewelry that celebrates tradition and elegance
          </p>
          <div className="flex gap-4 flex-wrap">
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-background/10 backdrop-blur-md border-primary-foreground/20 text-primary-foreground hover:bg-background/20"
              data-testid="button-shop-now"
            >
              Shop Collections
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-background/10 backdrop-blur-md border-primary-foreground/20 text-primary-foreground hover:bg-background/20"
              data-testid="button-new-arrivals"
            >
              New Arrivals
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
