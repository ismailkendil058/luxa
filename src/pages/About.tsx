import Layout from '@/components/layout/Layout';
import { Sparkles, Heart, Leaf, Award } from 'lucide-react';

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 md:py-32">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1920&h=800&fit=crop)',
          }}
        >
          <div className="absolute inset-0 bg-foreground/60" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="font-display text-3xl md:text-5xl text-background mb-4">
            À Propos de LUXA
          </h1>
          <p className="text-background/80 max-w-2xl mx-auto text-lg">
            Une marque de maquillage moderne dédiée à sublimer votre beauté naturelle
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary text-sm tracking-[0.2em] uppercase">Notre Histoire</span>
              <h2 className="font-display text-2xl md:text-3xl mt-2 mb-6">
                La Beauté Accessible pour Toutes
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  LUXA est une marque de maquillage moderne dédiée à offrir des produits tendance, 
                  accessibles et de haute qualité. Inspirée par les standards internationaux et 
                  adaptée aux besoins des beautistas algériennes, LUXA combine élégance, 
                  innovation et simplicité.
                </p>
                <p>
                  Notre mission est de rendre la beauté accessible à toutes, sans compromis sur 
                  la qualité. Chaque produit est soigneusement sélectionné pour vous offrir le 
                  meilleur de la cosmétique moderne.
                </p>
                <p>
                  Basée en Algérie, LUXA s'engage à proposer une expérience d'achat simple et 
                  agréable, avec une livraison rapide dans toutes les 58 wilayas.
                </p>
              </div>
            </div>
            <div className="aspect-square rounded-sm overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop"
                alt="LUXA Beauty"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary text-sm tracking-[0.2em] uppercase">Nos Valeurs</span>
            <h2 className="font-display text-2xl md:text-3xl mt-2">Ce Qui Nous Définit</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-background p-8 rounded-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-lg mb-2">100% Vegan</h3>
              <p className="text-sm text-muted-foreground">
                Tous nos produits sont formulés sans aucun ingrédient d'origine animale
              </p>
            </div>
            
            <div className="bg-background p-8 rounded-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-lg mb-2">Cruelty-Free</h3>
              <p className="text-sm text-muted-foreground">
                Jamais testés sur les animaux, nous respectons toutes les formes de vie
              </p>
            </div>
            
            <div className="bg-background p-8 rounded-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-lg mb-2">Tendance</h3>
              <p className="text-sm text-muted-foreground">
                Les dernières tendances beauté internationales à portée de main
              </p>
            </div>
            
            <div className="bg-background p-8 rounded-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-lg mb-2">Qualité Premium</h3>
              <p className="text-sm text-muted-foreground">
                Des formules de haute qualité à des prix accessibles
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Promise */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <span className="text-primary text-sm tracking-[0.2em] uppercase">Notre Promesse</span>
          <h2 className="font-display text-2xl md:text-3xl mt-2 mb-6">
            Beauté Sans Compromis
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Chez LUXA, nous croyons que chaque femme mérite d'avoir accès à des produits de 
            maquillage de qualité. C'est pourquoi nous travaillons sans relâche pour vous 
            proposer les meilleurs produits au meilleur prix, avec un service client 
            irréprochable et une livraison rapide dans toute l'Algérie.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div>
              <span className="font-display text-3xl text-primary block">58</span>
              <span className="text-muted-foreground">Wilayas livrées</span>
            </div>
            <div>
              <span className="font-display text-3xl text-primary block">100%</span>
              <span className="text-muted-foreground">Vegan & Cruelty-free</span>
            </div>
            <div>
              <span className="font-display text-3xl text-primary block">24h</span>
              <span className="text-muted-foreground">Expédition rapide</span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
