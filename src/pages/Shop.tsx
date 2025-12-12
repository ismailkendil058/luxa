import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categoryLabels, Category } from '@/types';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') as Category | null;
  const [priceFilter, setPriceFilter] = useState<string>('all');
  
  const { data: products, isLoading } = useProducts();

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let filtered = [...products];
    
    if (categoryParam) {
      filtered = filtered.filter(p => p.category === categoryParam);
    }
    
    if (priceFilter !== 'all') {
      const [min, max] = priceFilter.split('-').map(Number);
      filtered = filtered.filter(p => {
        if (max) return p.price >= min && p.price <= max;
        return p.price >= min;
      });
    }
    
    return filtered;
  }, [products, categoryParam, priceFilter]);

  const handleCategoryChange = (category: string) => {
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl md:text-4xl mb-4">Notre Boutique</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Découvrez notre collection complète de maquillage haut de gamme
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={!categoryParam ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryChange('all')}
            >
              Tous
            </Button>
            {(Object.keys(categoryLabels) as Category[]).map(cat => (
              <Button
                key={cat}
                variant={categoryParam === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryChange(cat)}
              >
                {categoryLabels[cat]}
              </Button>
            ))}
          </div>
          
          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Prix" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les prix</SelectItem>
              <SelectItem value="0-1000">Moins de 1000 DA</SelectItem>
              <SelectItem value="1000-2000">1000 - 2000 DA</SelectItem>
              <SelectItem value="2000-3000">2000 - 3000 DA</SelectItem>
              <SelectItem value="3000-">Plus de 3000 DA</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-sm" />
                <div className="mt-4 h-4 bg-muted rounded w-3/4" />
                <div className="mt-2 h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Aucun produit trouvé</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Shop;
