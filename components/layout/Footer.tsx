import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";

export const Footer = () => (
  <footer className="bg-sepia text-crema py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <h2 className="text-3xl font-serif font-bold italic text-terracota">
            Molotes <span className="text-crema font-normal not-italic">El Tradicional</span>
          </h2>
          <p className="text-crema/60 leading-relaxed">
            Llevando el sabor auténtico de Puebla a tu mesa desde 1985. Calidad artesanal en cada
            ingrediente.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="p-2 bg-crema/10 hover:bg-terracota rounded-full transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="p-2 bg-crema/10 hover:bg-terracota rounded-full transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="p-2 bg-crema/10 hover:bg-terracota rounded-full transition-colors">
              <Twitter size={20} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 uppercase tracking-widest text-mostaza">Enlaces</h4>
          <ul className="space-y-4 text-crema/70">
            <li>
              <Link href="/menu" className="hover:text-crema transition-colors">
                Menú
              </Link>
            </li>
            <li>
              <Link href="/nosotros" className="hover:text-crema transition-colors">
                Sobre Nosotros
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:text-crema transition-colors">
                Contacto
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-crema transition-colors">
                Administrador
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 uppercase tracking-widest text-mostaza">Contacto</h4>
          <ul className="space-y-4 text-crema/70">
            <li className="flex items-start space-x-3">
              <MapPin size={20} className="text-terracota flex-shrink-0" />
              <span>Av. Reforma 123, Centro Histórico, Puebla, Pue.</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone size={20} className="text-terracota flex-shrink-0" />
              <span>+52 (222) 123 4567</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail size={20} className="text-terracota flex-shrink-0" />
              <span>hola@molotestradicional.com</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 uppercase tracking-widest text-mostaza">Horario</h4>
          <ul className="space-y-4 text-crema/70">
            <li className="flex justify-between">
              <span>Lun - Vie:</span>
              <span className="text-crema">9:00 - 21:00</span>
            </li>
            <li className="flex justify-between">
              <span>Sábados:</span>
              <span className="text-crema">9:00 - 22:00</span>
            </li>
            <li className="flex justify-between">
              <span>Domingos:</span>
              <span className="text-crema">10:00 - 18:00</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-crema/10 flex flex-col md:flex-row justify-between items-center text-sm text-crema/40">
        <p>© 2026 Molotes El Tradicional. Todos los derechos reservados.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-crema">
            Privacidad
          </a>
          <a href="#" className="hover:text-crema">
            Términos
          </a>
          <a href="#" className="hover:text-crema">
            Cookies
          </a>
        </div>
      </div>
    </div>
  </footer>
);
