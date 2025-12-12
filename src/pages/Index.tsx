import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { useNewProducts, useBestsellers } from '@/hooks/useProducts';
import { ArrowRight, Sparkles, Heart, Leaf, Check } from 'lucide-react';

const categories = [
  { id: 'visage', name: 'Visage', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop' },
  { id: 'yeux', name: 'Yeux', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop' },
  { id: 'levres', name: 'Lèvres', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop' },
  { id: 'palettes', name: 'Palettes', image: 'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=400&h=400&fit=crop' },
  { id: 'accessoires', name: 'Accessoires', image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&h=400&fit=crop' },
];

const Index = () => {
  const { data: newProducts, isLoading: loadingNew } = useNewProducts();
  const { data: bestsellers, isLoading: loadingBest } = useBestsellers();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[85vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1920&h=1080&fit=crop)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-xl">
            <span className="inline-block text-primary text-sm tracking-[0.3em] uppercase mb-4">
              Collection 2024
            </span>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-foreground leading-tight mb-6">
              Révélez Votre Beauté
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md">
              Des produits de maquillage tendance, accessibles et de haute qualité pour sublimer votre beauté naturelle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="tracking-wider">
                <Link to="/boutique">
                  Découvrir
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* New Products */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-primary text-sm tracking-[0.2em] uppercase">Nouveautés</span>
              <h2 className="font-display text-2xl md:text-3xl mt-2">Nos Derniers Produits</h2>
            </div>
            <Link to="/boutique" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {loadingNew ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-sm" />
                  <div className="mt-4 h-4 bg-muted rounded w-3/4" />
                  <div className="mt-2 h-4 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {newProducts?.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary text-sm tracking-[0.2em] uppercase">Collections</span>
            <h2 className="font-display text-2xl md:text-3xl mt-2">Nos Catégories</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map(category => (
              <Link
                key={category.id}
                to={`/boutique?category=${category.id}`}
                className="group relative aspect-square overflow-hidden rounded-sm"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                <div className="absolute inset-0 flex items-end p-4">
                  <h3 className="font-display text-lg text-background tracking-wider">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-primary text-sm tracking-[0.2em] uppercase">Populaires</span>
              <h2 className="font-display text-2xl md:text-3xl mt-2">Meilleures Ventes</h2>
            </div>
            <Link to="/boutique" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {loadingBest ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-sm" />
                  <div className="mt-4 h-4 bg-muted rounded w-3/4" />
                  <div className="mt-2 h-4 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {bestsellers?.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why LUXA */}
      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary text-sm tracking-[0.2em] uppercase">Nos Engagements</span>
            <h2 className="font-display text-2xl md:text-3xl mt-2">Pourquoi LUXA ?</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-medium mb-2">100% Vegan</h3>
              <p className="text-sm text-muted-foreground">Produits sans ingrédients d'origine animale</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Cruelty-Free</h3>
              <p className="text-sm text-muted-foreground">Non testés sur les animaux</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Tendance</h3>
              <p className="text-sm text-muted-foreground">Les dernières tendances beauté</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Accessible</h3>
              <p className="text-sm text-muted-foreground">Qualité premium à prix abordable</p>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary text-sm tracking-[0.2em] uppercase">@luxa</span>
            <h2 className="font-display text-2xl md:text-3xl mt-2">Suivez-nous sur Instagram</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
            ].map((url, i) => (
              <a
                key={i}
                href="https://www.instagram.com/luxa.lab?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-sm"
              >
                <img
                  src={url}
                  alt="Instagram"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
