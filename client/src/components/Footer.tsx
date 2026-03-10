import { Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-card border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display text-xl font-bold text-primary mb-4">SS Jewels</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Exquisite traditional jewelry and imitation pieces that celebrate elegance and craftsmanship.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" data-testid="link-facebook">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="link-instagram">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="link-twitter">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Button variant="ghost" className="h-auto p-0 justify-start" data-testid="link-necklaces">Necklaces</Button></li>
              <li><Button variant="ghost" className="h-auto p-0 justify-start" data-testid="link-bangles">Bangles</Button></li>
              <li><Button variant="ghost" className="h-auto p-0 justify-start" data-testid="link-earrings">Earrings</Button></li>
              <li><Button variant="ghost" className="h-auto p-0 justify-start" data-testid="link-rings">Rings</Button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Button variant="ghost" className="h-auto p-0 justify-start" data-testid="link-contact">Contact Us</Button></li>
              <li><Button variant="ghost" className="h-auto p-0 justify-start" data-testid="link-shipping">Shipping Info</Button></li>
              <li><Button variant="ghost" className="h-auto p-0 justify-start" data-testid="link-returns">Returns</Button></li>
              <li><Button variant="ghost" className="h-auto p-0 justify-start" data-testid="link-faq">FAQ</Button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Button variant="ghost" className="h-auto p-0 justify-start" data-testid="link-our-story">Our Story</Button></li>
              <li><Button variant="ghost" className="h-auto p-0 justify-start" data-testid="link-privacy">Privacy Policy</Button></li>
              <li><Button variant="ghost" className="h-auto p-0 justify-start" data-testid="link-terms">Terms of Service</Button></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 SS Imitation Jewels & Traditional Wear. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
