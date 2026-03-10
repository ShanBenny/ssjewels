import { Button } from "@/components/ui/button";

interface CategoryTileProps {
  name: string;
  image: string;
  count?: number;
}

export default function CategoryTile({ name, image, count }: CategoryTileProps) {
  return (
    <Button
      variant="ghost"
      className="flex flex-col items-center gap-3 h-auto p-4 hover-elevate active-elevate-2"
      data-testid={`category-${name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-ring">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-center">
        <p className="font-medium text-sm" data-testid={`text-category-${name.toLowerCase().replace(/\s+/g, '-')}`}>
          {name}
        </p>
        {count && (
          <p className="text-xs text-muted-foreground">{count} items</p>
        )}
      </div>
    </Button>
  );
}
