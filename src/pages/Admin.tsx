import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useOrders, useUpdateOrderStatus, useDeleteOrder } from '@/hooks/useOrders';
import { useWilayas, useUpdateWilaya } from '@/hooks/useWilayas';
import { useAdminSettings, useUpdateAdminSettings } from '@/hooks/useAdminSettings';
import { useAllProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { Lock, Package, MapPin, Settings, LogOut, FileSpreadsheet, ShoppingBag, Plus, Pencil, Trash2, Upload, X, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Order, Wilaya, Product, categoryLabels, Category } from '@/types';

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { data: settings, error: settingsError, isLoading: settingsLoading } = useAdminSettings();

  const hashPassword = async (plainPassword: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plainPassword);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        setError('Configuration Supabase manquante. Vérifiez les variables d\'environnement VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY dans Vercel.');
        setIsLoading(false);
        return;
      }

      // Check if settings are loading
      if (settingsLoading) {
        setError('Chargement des paramètres...');
        setIsLoading(false);
        return;
      }

      // Check for settings error
      if (settingsError) {
        console.error('Settings error:', settingsError);
        setError('Erreur de connexion à la base de données. Vérifiez que Supabase est correctement configuré et que les variables d\'environnement sont définies dans Vercel.');
        setIsLoading(false);
        return;
      }

      if (settings) {
        const hashedPassword = await hashPassword(password);
        if (hashedPassword === settings.admin_password_hash) {
          sessionStorage.setItem('admin_authenticated', 'true');
          sessionStorage.setItem('admin_auth_time', Date.now().toString());
          onLogin();
        } else {
          setError('Mot de passe incorrect');
        }
      } else {
        setError('Impossible de charger les paramètres. Vérifiez la connexion à la base de données.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Erreur lors de la vérification. Vérifiez la console pour plus de détails.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl text-foreground">Administration LUXA</h1>
          <p className="text-muted-foreground mt-2">Entrez le mot de passe pour accéder</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1"
            />
          </div>
          
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
              <p className="text-destructive text-sm font-medium">{error}</p>
              {error.includes('Configuration Supabase') && (
                <p className="text-destructive/80 text-xs mt-2">
                  Pour Vercel: Allez dans Settings → Environment Variables et ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY
                </p>
              )}
            </div>
          )}
          
          {settingsError && !error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
              <p className="text-destructive text-sm font-medium">
                Erreur de connexion à Supabase
              </p>
              <p className="text-destructive/80 text-xs mt-1">
                {settingsError instanceof Error ? settingsError.message : 'Vérifiez les variables d\'environnement'}
              </p>
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Vérification...' : 'Connexion'}
          </Button>
        </form>
      </div>
    </div>
  );
};

const OrdersTab = () => {
  const { data: orders, isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleStatusChange = (orderId: string, status: string) => {
    updateStatus.mutate({ id: orderId, status }, {
      onSuccess: () => {
        toast({ title: 'Statut mis à jour' });
      }
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      en_attente: 'bg-amber-100 text-amber-800',
      confirmee: 'bg-blue-100 text-blue-800',
      expediee: 'bg-green-100 text-green-800',
      livree: 'bg-emerald-100 text-emerald-800',
      annulee: 'bg-red-100 text-red-800'
    };
    const labels = {
      en_attente: 'En attente',
      confirmee: 'Confirmée',
      expediee: 'Expédiée',
      livree: 'Livrée',
      annulee: 'Annulée'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.en_attente}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const filteredOrders = orders?.filter((order: Order) => {
    const matchesStatus = statusFilter === 'all' ? true : order.status === statusFilter;
    const matchesSearch = searchQuery === '' || 
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  }) || [];

  const handleDelete = async (id: string) => {
    try {
      await deleteOrder.mutateAsync(id);
      toast({ title: 'Commande supprimée' });
      setDeleteConfirmId(null);
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({ 
        title: 'Erreur lors de la suppression', 
        description: error.message || 'Impossible de supprimer la commande. Vérifiez les permissions de la base de données.', 
        variant: 'destructive' 
      });
    }
  };

  const exportToExcel = () => {
    if (!filteredOrders.length) {
      toast({ title: 'Aucune commande à exporter', variant: 'destructive' });
      return;
    }

    const headers = ['N° Commande', 'Client', 'Téléphone', 'Wilaya', 'Livraison', 'Frais', 'Produits', 'Total', 'Statut', 'Date'];
    const statusLabels: Record<string, string> = {
      en_attente: 'En attente',
      confirmee: 'Confirmée',
      expediee: 'Expédiée',
      livree: 'Livrée',
      annulee: 'Annulée'
    };

    const rows = filteredOrders.map((order: Order) => [
      order.order_number,
      order.customer_name,
      order.phone,
      order.wilaya?.name || '-',
      order.delivery_method === 'bureau' ? 'Bureau' : 'Domicile',
      `${order.shipping_cost} DA`,
      (order.items as any[]).map((item: any) => `${item.quantity}x ${item.name}${item.variant ? ` (${item.variant})` : ''}`).join('; '),
      `${order.total_amount} DA`,
      statusLabels[order.status] || order.status,
      new Date(order.created_at).toLocaleDateString('fr-FR')
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `commandes_luxa_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast({ title: 'Export réussi' });
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="font-display text-xl">Commandes ({filteredOrders.length})</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="en_attente">En attente</SelectItem>
              <SelectItem value="confirmee">Confirmée</SelectItem>
              <SelectItem value="expediee">Expédiée</SelectItem>
              <SelectItem value="livree">Livrée</SelectItem>
              <SelectItem value="annulee">Annulée</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={exportToExcel} variant="outline" className="gap-2">
            <FileSpreadsheet className="w-4 h-4" />
            Exporter Excel
          </Button>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher par code de commande..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Commande</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Wilaya</TableHead>
              <TableHead>Livraison</TableHead>
              <TableHead>Produits</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order: Order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm">{order.order_number}</TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell>{order.phone}</TableCell>
                <TableCell>{order.wilaya?.name || '-'}</TableCell>
                <TableCell>
                  {order.delivery_method === 'bureau' ? 'Bureau' : 'Domicile'}
                  <br />
                  <span className="text-xs text-muted-foreground">{order.shipping_cost} DA</span>
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px]">
                    {(order.items as any[]).map((item: any, i: number) => (
                      <div key={i} className="text-xs">
                        {item.quantity}x {item.name}
                        {item.variant && ` (${item.variant})`}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="font-semibold">{order.total_amount} DA</TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onValueChange={(value) => handleStatusChange(order.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue>{getStatusBadge(order.status)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en_attente">En attente</SelectItem>
                      <SelectItem value="confirmee">Confirmée</SelectItem>
                      <SelectItem value="expediee">Expédiée</SelectItem>
                      <SelectItem value="livree">Livrée</SelectItem>
                      <SelectItem value="annulee">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell>
                  {deleteConfirmId === order.id ? (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete(order.id)}
                      >
                        Confirmer
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setDeleteConfirmId(null)}
                      >
                        Annuler
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setDeleteConfirmId(order.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {filteredOrders.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Aucune commande {statusFilter !== 'all' ? 'avec ce statut' : 'pour le moment'}
        </div>
      )}
    </div>
  );
};

const ProductFormDialog = ({ 
  product, 
  isOpen, 
  onClose, 
  onSave 
}: { 
  product?: Product | null; 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (data: any) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    description: '',
    category: 'visage' as Category,
    stock: '',
    is_new: false,
    is_bestseller: false
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        slug: product.slug,
        price: product.price.toString(),
        description: product.description || '',
        category: product.category as Category,
        stock: product.stock?.toString() || '0',
        is_new: product.is_new || false,
        is_bestseller: product.is_bestseller || false
      });
      setImageUrls(product.images || []);
    } else {
      setFormData({
        name: '',
        slug: '',
        price: '',
        description: '',
        category: 'visage',
        stock: '',
        is_new: false,
        is_bestseller: false
      });
      setImageUrls([]);
    }
    setPendingFiles([]);
  }, [product, isOpen]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate files
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({ title: `${file.name} n'est pas une image valide`, variant: 'destructive' });
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: `${file.name} dépasse 5MB`, variant: 'destructive' });
        return false;
      }
      return true;
    });

    setPendingFiles(prev => [...prev, ...validFiles]);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePendingFile = (index: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const file of pendingFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);
      
      if (error) {
        console.error('Upload error:', error);
        throw new Error(`Erreur lors du téléchargement de ${file.name}`);
      }
      
      const { data: publicUrl } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
      
      uploadedUrls.push(publicUrl.publicUrl);
    }
    
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.slug || !formData.price || !formData.category) {
      toast({ title: 'Veuillez remplir tous les champs obligatoires', variant: 'destructive' });
      return;
    }

    try {
      setUploading(true);
      
      // Upload pending files
      const newImageUrls = await uploadImages();
      const allImages = [...imageUrls, ...newImageUrls];

      onSave({
        name: formData.name,
        slug: formData.slug,
        price: parseFloat(formData.price),
        description: formData.description || null,
        category: formData.category,
        images: allImages.length > 0 ? allImages : null,
        stock: parseInt(formData.stock) || 0,
        is_new: formData.is_new,
        is_bestseller: formData.is_bestseller,
        variants: []
      });
    } catch (error: any) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData({ ...formData, slug });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Modifier le produit' : 'Ajouter un produit'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              onBlur={() => !formData.slug && generateSlug()}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="slug">Slug *</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
              <Button type="button" variant="outline" size="sm" onClick={generateSlug}>
                Générer
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Prix (DA) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="category">Catégorie *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as Category })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1"
              rows={3}
            />
          </div>
          
          <div>
            <Label>Images du produit</Label>
            <div className="mt-2 space-y-3">
              {/* Existing images */}
              {imageUrls.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={url} 
                        alt={`Image ${index + 1}`} 
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Pending files preview */}
              {pendingFiles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {pendingFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={file.name} 
                        className="w-16 h-16 object-cover rounded border border-dashed border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => removePendingFile(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-0 left-0 right-0 bg-primary/80 text-primary-foreground text-[8px] text-center truncate px-1">
                        Nouveau
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Upload button */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Ajouter des images
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG, WEBP. Max 5MB par image.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="is_new"
                checked={formData.is_new}
                onCheckedChange={(checked) => setFormData({ ...formData, is_new: checked as boolean })}
              />
              <Label htmlFor="is_new">Nouveau</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="is_bestseller"
                checked={formData.is_bestseller}
                onCheckedChange={(checked) => setFormData({ ...formData, is_bestseller: checked as boolean })}
              />
              <Label htmlFor="is_bestseller">Bestseller</Label>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={uploading}>
              {uploading ? 'Téléchargement...' : (product ? 'Mettre à jour' : 'Ajouter')}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={uploading}>
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ProductsTab = () => {
  const { data: products, isLoading } = useAllProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleAdd = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleSave = async (data: any) => {
    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct.id, ...data });
        toast({ title: 'Produit mis à jour' });
      } else {
        await createProduct.mutateAsync(data);
        toast({ title: 'Produit ajouté' });
      }
      setDialogOpen(false);
    } catch (error: any) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast({ title: 'Produit supprimé' });
      setDeleteConfirmId(null);
    } catch (error: any) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl">Produits ({products?.length || 0})</h2>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          Ajouter un produit
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Nouveau</TableHead>
              <TableHead>Bestseller</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product: Product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.images && product.images[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{categoryLabels[product.category as Category] || product.category}</TableCell>
                <TableCell>{product.price} DA</TableCell>
                <TableCell>{product.stock || 0}</TableCell>
                <TableCell>
                  {product.is_new ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Oui</span>
                  ) : (
                    <span className="text-muted-foreground text-xs">Non</span>
                  )}
                </TableCell>
                <TableCell>
                  {product.is_bestseller ? (
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">Oui</span>
                  ) : (
                    <span className="text-muted-foreground text-xs">Non</span>
                  )}
                </TableCell>
                <TableCell>
                  {deleteConfirmId === product.id ? (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete(product.id)}
                      >
                        Confirmer
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setDeleteConfirmId(null)}
                      >
                        Annuler
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setDeleteConfirmId(product.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {(!products || products.length === 0) && (
        <div className="text-center py-12 text-muted-foreground">
          Aucun produit. Cliquez sur "Ajouter un produit" pour commencer.
        </div>
      )}

      <ProductFormDialog
        product={editingProduct}
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

const WilayasTab = () => {
  const { data: wilayas, isLoading } = useWilayas();
  const updateWilaya = useUpdateWilaya();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState({ bureau: '', domicile: '' });

  const handleEdit = (wilaya: Wilaya) => {
    setEditingId(wilaya.id);
    setEditValues({
      bureau: wilaya.shipping_bureau.toString(),
      domicile: wilaya.shipping_domicile.toString()
    });
  };

  const handleSave = (wilayaId: number) => {
    updateWilaya.mutate({
      id: wilayaId,
      shipping_bureau: parseFloat(editValues.bureau),
      shipping_domicile: parseFloat(editValues.domicile)
    }, {
      onSuccess: () => {
        toast({ title: 'Tarifs mis à jour' });
        setEditingId(null);
      }
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl">Wilayas et Tarifs de Livraison</h2>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Wilaya</TableHead>
              <TableHead>Bureau (DA)</TableHead>
              <TableHead>Domicile (DA)</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wilayas?.map((wilaya: Wilaya) => (
              <TableRow key={wilaya.id}>
                <TableCell>{wilaya.code}</TableCell>
                <TableCell>{wilaya.name}</TableCell>
                <TableCell>
                  {editingId === wilaya.id ? (
                    <Input
                      type="number"
                      value={editValues.bureau}
                      onChange={(e) => setEditValues({ ...editValues, bureau: e.target.value })}
                      className="w-24"
                    />
                  ) : (
                    `${wilaya.shipping_bureau} DA`
                  )}
                </TableCell>
                <TableCell>
                  {editingId === wilaya.id ? (
                    <Input
                      type="number"
                      value={editValues.domicile}
                      onChange={(e) => setEditValues({ ...editValues, domicile: e.target.value })}
                      className="w-24"
                    />
                  ) : (
                    `${wilaya.shipping_domicile} DA`
                  )}
                </TableCell>
                <TableCell>
                  {editingId === wilaya.id ? (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSave(wilaya.id)}>
                        Sauvegarder
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                        Annuler
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleEdit(wilaya)}>
                      Modifier
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const SettingsTab = () => {
  const { data: settings, isLoading } = useAdminSettings();
  const updateSettings = useUpdateAdminSettings();
  const [defaultBureau, setDefaultBureau] = useState('');
  const [defaultDomicile, setDefaultDomicile] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (settings) {
      setDefaultBureau(settings.default_shipping_bureau.toString());
      setDefaultDomicile(settings.default_shipping_domicile.toString());
    }
  }, [settings]);

  const handleSaveShipping = () => {
    updateSettings.mutate({
      default_shipping_bureau: parseFloat(defaultBureau),
      default_shipping_domicile: parseFloat(defaultDomicile)
    }, {
      onSuccess: () => {
        toast({ title: 'Paramètres de livraison mis à jour' });
      }
    });
  };

  const hashPassword = async (plainPassword: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plainPassword);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 4) {
      toast({ title: 'Le mot de passe doit contenir au moins 4 caractères', variant: 'destructive' });
      return;
    }
    try {
      const hashedPassword = await hashPassword(newPassword);
      updateSettings.mutate({
        admin_password_hash: hashedPassword
      }, {
        onSuccess: () => {
          toast({ title: 'Mot de passe mis à jour' });
          setNewPassword('');
        }
      });
    } catch (error) {
      toast({ title: 'Erreur lors du hachage du mot de passe', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-8 max-w-xl">
      <div className="space-y-4">
        <h2 className="font-display text-xl">Tarifs de Livraison par Défaut</h2>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="defaultBureau">Bureau (DA)</Label>
            <Input
              id="defaultBureau"
              type="number"
              value={defaultBureau}
              onChange={(e) => setDefaultBureau(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="defaultDomicile">Domicile (DA)</Label>
            <Input
              id="defaultDomicile"
              type="number"
              value={defaultDomicile}
              onChange={(e) => setDefaultDomicile(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button onClick={handleSaveShipping}>
            Sauvegarder les tarifs
          </Button>
        </div>
      </div>

      <div className="space-y-4 pt-8 border-t">
        <h2 className="font-display text-xl">Changer le Mot de Passe</h2>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1"
            />
          </div>
          <Button onClick={handleChangePassword}>
            Changer le mot de passe
          </Button>
        </div>
      </div>
    </div>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_authenticated');
    const authTime = sessionStorage.getItem('admin_auth_time');
    
    if (auth === 'true' && authTime) {
      const timeDiff = Date.now() - parseInt(authTime);
      const hoursSinceAuth = timeDiff / (1000 * 60 * 60);
      
      if (hoursSinceAuth < 24) {
        setIsAuthenticated(true);
      } else {
        sessionStorage.removeItem('admin_authenticated');
        sessionStorage.removeItem('admin_auth_time');
      }
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="flex items-center">
              <img 
                src="/luxa-logo.svg" 
                alt="LUXA" 
                className="h-6 w-auto"
              />
            </button>
            <span className="text-muted-foreground">|</span>
            <span className="text-sm text-muted-foreground">Administration</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-4">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Commandes</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Produits</span>
            </TabsTrigger>
            <TabsTrigger value="wilayas" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Wilayas</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Paramètres</span>
            </TabsTrigger>
          </TabsList>

          <div className="bg-background rounded-lg border p-6">
            <TabsContent value="orders" className="mt-0">
              <OrdersTab />
            </TabsContent>
            <TabsContent value="products" className="mt-0">
              <ProductsTab />
            </TabsContent>
            <TabsContent value="wilayas" className="mt-0">
              <WilayasTab />
            </TabsContent>
            <TabsContent value="settings" className="mt-0">
              <SettingsTab />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;