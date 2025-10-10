import CategoryTile from '../CategoryTile';
import necklaceImg from "@assets/stock_images/elegant_traditional__f8f6bf4e.jpg";

export default function CategoryTileExample() {
  return (
    <div className="p-8 flex gap-4">
      <CategoryTile name="Necklaces" image={necklaceImg} count={45} />
      <CategoryTile name="Bangles" image={necklaceImg} count={32} />
    </div>
  );
}
