import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block">
              <img 
                src="/luxa-logo.svg" 
                alt="LUXA" 
                className="h-8 w-auto brightness-0 invert"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </Link>
            <p className="mt-4 text-sm text-background/70 leading-relaxed">
              Maquillage tendance et accessible pour toutes les beautistas algériennes.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-medium mb-4 text-sm tracking-wider uppercase">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-background/70 hover:text-background transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/boutique" className="text-sm text-background/70 hover:text-background transition-colors">
                  Boutique
                </Link>
              </li>
              <li>
                <Link to="/a-propos" className="text-sm text-background/70 hover:text-background transition-colors">
                  À Propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-medium mb-4 text-sm tracking-wider uppercase">Catégories</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/boutique?category=visage" className="text-sm text-background/70 hover:text-background transition-colors">
                  Visage
                </Link>
              </li>
              <li>
                <Link to="/boutique?category=yeux" className="text-sm text-background/70 hover:text-background transition-colors">
                  Yeux
                </Link>
              </li>
              <li>
                <Link to="/boutique?category=levres" className="text-sm text-background/70 hover:text-background transition-colors">
                  Lèvres
                </Link>
              </li>
              <li>
                <Link to="/boutique?category=palettes" className="text-sm text-background/70 hover:text-background transition-colors">
                  Palettes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium mb-4 text-sm tracking-wider uppercase">Contact</h4>
            <ul className="space-y-3">
              <li className="text-sm text-background/70">
                Algérie
              </li>
              <li>
                <a 
                  href="https://www.instagram.com/luxa.lab?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-background/70 hover:text-background transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  @luxa
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/20">
          <p className="text-center text-xs text-background/50">
            © {new Date().getFullYear()} LUXA. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
