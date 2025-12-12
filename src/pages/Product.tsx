import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';

const Product = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { data: product, isLoading, error } = useProduct(slug || '');
  const { data: relatedProducts } = useProducts(product?.category);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>();

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="animate-pulse aspect-square bg-muted rounded-sm" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-6 bg-muted rounded w-1/4" />
              <div className="h-24 bg-muted rounded" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-2xl mb-4">Produit non trouvé</h1>
          <Button onClick={() => navigate('/boutique')}>
            Retour à la boutique
          </Button>
        </div>
      </Layout>
    );
  }

  const images = product.images?.length ? product.images : ['/placeholder.svg'];
  const variants = product.variants || [];

  const handleAddToCart = () => {
    if (variants.length > 0 && !selectedVariant) {
      toast({ 
        title: 'Veuillez sélectionner une option',
        variant: 'destructive' 
      });
      return;
    }
    
    addItem(product, quantity, selectedVariant);
    toast({ title: 'Produit ajouté au panier' });
  };

  const handleBuyNow = () => {
    if (variants.length > 0 && !selectedVariant) {
      toast({ 
        title: 'Veuillez sélectionner une option',
        variant: 'destructive' 
      });
      return;
    }
    
    addItem(product, quantity, selectedVariant);
    navigate('/commander');
  };

  const related = relatedProducts?.filter(p => p.id !== product.id).slice(0, 4) || [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden bg-muted rounded-sm">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-sm overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl md:text-3xl mb-2">{product.name}</h1>
              <p className="text-2xl text-primary font-medium">
                {product.price.toLocaleString('fr-DZ')} DA
              </p>
            </div>

            {product.description && (
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Variants */}
            {variants.length > 0 && variants.map((variant, i) => (
              <div key={i}>
                <label className="block text-sm font-medium mb-2">{variant.name}</label>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map(option => (
                    <button
                      key={option}
                      onClick={() => setSelectedVariant(option)}
                      className={`px-4 py-2 border rounded-sm text-sm transition-colors ${
                        selectedVariant === option
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-2">Quantité</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-muted transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-muted transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {product.stock !== null && product.stock > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {product.stock} en stock
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Ajouter au panier
              </Button>
              <Button
                size="lg"
                className="flex-1"
                onClick={handleBuyNow}
              >
                Commander maintenant
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16 md:mt-24">
            <h2 className="font-display text-xl md:text-2xl mb-8">Produits Similaires</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Product;
