import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="font-display text-2xl mb-4">Votre panier est vide</h1>
          <p className="text-muted-foreground mb-8">
            Découvrez nos produits et commencez votre shopping
          </p>
          <Button asChild>
            <Link to="/boutique">Continuer mes achats</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="font-display text-2xl md:text-3xl mb-8">Mon Panier</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div
                key={item.id}
                className="flex gap-4 p-4 border rounded-sm"
              >
                <Link to={`/produit/${item.product.slug}`} className="shrink-0">
                  <img
                    src={item.product.images?.[0] || '/placeholder.svg'}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-sm"
                  />
                </Link>
                
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/produit/${item.product.slug}`}
                    className="font-medium hover:text-primary transition-colors line-clamp-1"
                  >
                    {item.product.name}
                  </Link>
                  {item.variant && (
                    <p className="text-sm text-muted-foreground">{item.variant}</p>
                  )}
                  <p className="text-primary font-medium mt-1">
                    {item.product.price.toLocaleString('fr-DZ')} DA
                  </p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border rounded-sm">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-muted transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-muted transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="border rounded-sm p-6 sticky top-24">
              <h2 className="font-display text-lg mb-4">Récapitulatif</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{totalPrice.toLocaleString('fr-DZ')} DA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Livraison</span>
                  <span className="text-muted-foreground">Calculé à l'étape suivante</span>
                </div>
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{totalPrice.toLocaleString('fr-DZ')} DA</span>
                </div>
              </div>
              
              <Button asChild className="w-full" size="lg">
                <Link to="/commander">Passer la commande</Link>
              </Button>
              
              <Link
                to="/boutique"
                className="block text-center text-sm text-muted-foreground hover:text-foreground mt-4 transition-colors"
              >
                Continuer mes achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
