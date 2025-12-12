import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/contexts/CartContext';
import { useWilayas } from '@/hooks/useWilayas';
import { useCreateOrder } from '@/hooks/useOrders';
import { toast } from '@/hooks/use-toast';
import { Check, Package } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { data: wilayas, isLoading: loadingWilayas } = useWilayas();
  const createOrder = useCreateOrder();

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    wilayaId: '',
    deliveryMethod: 'bureau'
  });
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const selectedWilaya = wilayas?.find(w => w.id.toString() === formData.wilayaId);
  const shippingCost = selectedWilaya
    ? formData.deliveryMethod === 'bureau'
      ? selectedWilaya.shipping_bureau
      : selectedWilaya.shipping_domicile
    : 0;
  const finalTotal = totalPrice + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName || !formData.phone || !formData.wilayaId) {
      toast({ 
        title: 'Veuillez remplir tous les champs',
        variant: 'destructive'
      });
      return;
    }

    try {
      const order = await createOrder.mutateAsync({
        customer_name: formData.customerName,
        phone: formData.phone,
        wilaya_id: parseInt(formData.wilayaId),
        delivery_method: formData.deliveryMethod,
        shipping_cost: shippingCost,
        items: items,
        total_amount: finalTotal
      });

      setOrderNumber(order.order_number);
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      toast({
        title: 'Erreur lors de la commande',
        description: 'Veuillez réessayer',
        variant: 'destructive'
      });
    }
  };

  if (items.length === 0 && !orderComplete) {
    navigate('/panier');
    return null;
  }

  if (orderComplete) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center max-w-lg">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl mb-4">Commande Confirmée!</h1>
          <p className="text-muted-foreground mb-2">
            Merci pour votre commande. Votre numéro de commande est:
          </p>
          <p className="font-mono text-lg font-medium mb-8">{orderNumber}</p>
          <p className="text-sm text-muted-foreground mb-8">
            Nous vous contacterons bientôt pour confirmer la livraison.
          </p>
          <Button onClick={() => navigate('/boutique')}>
            Continuer mes achats
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="font-display text-2xl md:text-3xl mb-8">Finaliser la Commande</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border rounded-sm p-6 space-y-4">
              <h2 className="font-display text-lg mb-4">Informations de Livraison</h2>
              
              <div>
                <Label htmlFor="customerName">Nom complet *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Votre nom complet"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Numéro de téléphone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0XXX XXX XXX"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="wilaya">Wilaya *</Label>
                <Select
                  value={formData.wilayaId}
                  onValueChange={(value) => setFormData({ ...formData, wilayaId: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionnez votre wilaya" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingWilayas ? (
                      <SelectItem value="loading" disabled>Chargement...</SelectItem>
                    ) : (
                      wilayas?.map(wilaya => (
                        <SelectItem key={wilaya.id} value={wilaya.id.toString()}>
                          {wilaya.code} - {wilaya.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-3 block">Méthode de livraison *</Label>
                <RadioGroup
                  value={formData.deliveryMethod}
                  onValueChange={(value) => setFormData({ ...formData, deliveryMethod: value })}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 border rounded-sm p-4">
                    <RadioGroupItem value="bureau" id="bureau" />
                    <Label htmlFor="bureau" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          <span>Livraison au bureau</span>
                        </div>
                        <span className="font-medium">
                          {selectedWilaya ? `${selectedWilaya.shipping_bureau} DA` : '-'}
                        </span>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-sm p-4">
                    <RadioGroupItem value="domicile" id="domicile" />
                    <Label htmlFor="domicile" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          <span>Livraison à domicile</span>
                        </div>
                        <span className="font-medium">
                          {selectedWilaya ? `${selectedWilaya.shipping_domicile} DA` : '-'}
                        </span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full"
              disabled={createOrder.isPending}
            >
              {createOrder.isPending ? 'Traitement...' : 'Confirmer la commande'}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              Paiement à la livraison uniquement (Cash on Delivery)
            </p>
          </form>

          {/* Order Summary */}
          <div>
            <div className="border rounded-sm p-6 sticky top-24">
              <h2 className="font-display text-lg mb-4">Votre Commande</h2>
              
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.product.images?.[0] || '/placeholder.svg'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                      {item.variant && (
                        <p className="text-xs text-muted-foreground">{item.variant}</p>
                      )}
                      <p className="text-xs text-muted-foreground">Qté: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">
                      {(item.product.price * item.quantity).toLocaleString('fr-DZ')} DA
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{totalPrice.toLocaleString('fr-DZ')} DA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Livraison</span>
                  <span>{shippingCost > 0 ? `${shippingCost} DA` : '-'}</span>
                </div>
                <div className="flex justify-between font-medium text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{finalTotal.toLocaleString('fr-DZ')} DA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
