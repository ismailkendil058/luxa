import { Link } from 'react-router-dom';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const imageUrl = product.images?.[0] || '/placeholder.svg';

  return (
    <Link to={`/produit/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden bg-muted rounded-sm">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.is_new && (
          <span className="absolute top-3 left-3 bg-foreground text-background text-xs px-2 py-1 tracking-wider">
            NOUVEAU
          </span>
        )}
        {product.is_bestseller && (
          <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs px-2 py-1 tracking-wider">
            BESTSELLER
          </span>
        )}
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {product.price.toLocaleString('fr-DZ')} DA
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
