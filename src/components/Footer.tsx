import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-charcoal-brown border-t border-taupe-dark">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-display font-bold text-soft-gold mb-4">
              SONNAS
            </h3>
            <p className="text-warm-cream mb-6 max-w-md">
              Experience exceptional cuisine crafted with passion and served with elegance. 
              We bring you the finest dining experience with a perfect blend of traditional and modern flavors.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-light-taupe rounded-full flex items-center justify-center text-white hover:bg-vibrant-coral transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-light-taupe rounded-full flex items-center justify-center text-white hover:bg-vibrant-coral transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-light-taupe rounded-full flex items-center justify-center text-white hover:bg-vibrant-coral transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-brown-800 rounded-full flex items-center justify-center text-white hover:bg-amber-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.036 6.803c-2.86 0-5.166 2.32-5.166 5.18 0 2.86 2.306 5.18 5.166 5.18 2.86 0 5.166-2.32 5.166-5.18 0-2.86-2.306-5.18-5.166-5.18zm0 8.545c-1.856 0-3.365-1.509-3.365-3.365S10.18 8.618 12.036 8.618s3.365 1.509 3.365 3.365-1.509 3.365-3.365 3.365zm6.59-8.759c0 .668-.541 1.209-1.209 1.209-.668 0-1.209-.541-1.209-1.209s.541-1.209 1.209-1.209 1.209.541 1.209 1.209zm3.431 1.227c-.077-1.621-.447-3.058-1.634-4.244-1.187-1.187-2.623-1.557-4.244-1.634-1.674-.095-6.688-.095-8.362 0-1.621.077-3.058.447-4.244 1.634-1.187 1.187-1.557 2.623-1.634 4.244-.095 1.674-.095 6.688 0 8.362.077 1.621.447 3.058 1.634 4.244 1.187 1.187 2.623 1.557 4.244 1.634 1.674.095 6.688.095 8.362 0 1.621-.077 3.058-.447 4.244-1.634 1.187-1.187 1.557-2.623 1.634-4.244.095-1.674.095-6.688 0-8.362zm-2.155 10.119c-.346.871-.994 1.556-1.865 1.902-1.292.513-4.357.394-5.789.394s-4.497.119-5.789-.394c-.871-.346-1.519-.994-1.865-1.902-.513-1.292-.394-4.357-.394-5.789s-.119-4.497.394-5.789c.346-.871.994-1.519 1.865-1.865 1.292-.513 4.357-.394 5.789-.394s4.497-.119 5.789.394c.871.346 1.519.994 1.865 1.865.513 1.292.394 4.357.394 5.789s.119 4.497-.394 5.789z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-warm-cream font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-brown-light hover:text-soft-gold transition-colors">Home</Link></li>
              <li><Link href="/menu" className="text-brown-light hover:text-soft-gold transition-colors">Full Menu</Link></li>
              <li><Link href="/about" className="text-brown-light hover:text-soft-gold transition-colors">About Us</Link></li>
              <li><Link href="/reserve" className="text-brown-light hover:text-soft-gold transition-colors">Reservations</Link></li>
              <li><Link href="/contact" className="text-soft-gold hover:text-gold-light transition-colors font-medium">📞 Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-warm-cream font-semibold mb-4">📞 Quick Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-soft-gold mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-brown-light">SONNAS Restaurant<br />123 Main Street, Hubballi</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-vibrant-coral mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+919876543210" className="text-coral-light hover:text-vibrant-coral font-medium">+91 98765 43210</a>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-soft-gold mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:orders@sonnas.com" className="text-gold-light hover:text-soft-gold">orders@sonnas.com</a>
              </li>
              <li className="flex items-center">
                <span className="text-vibrant-coral mr-2 text-lg">💬</span>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="text-coral-light hover:text-vibrant-coral font-medium">WhatsApp Orders</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="border-t border-taupe-dark mt-12 pt-8">
          <div className="text-center">
            <h4 className="text-warm-cream font-semibold mb-4">Operating Hours</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="text-brown-light">
                <span className="font-medium">Mon - Thu:</span> 5:00 PM - 10:00 PM
              </div>
              <div className="text-brown-light">
                <span className="font-medium">Fri - Sat:</span> 5:00 PM - 11:00 PM
              </div>
              <div className="text-brown-light">
                <span className="font-medium">Sunday:</span> 4:00 PM - 9:00 PM
              </div>
              <div className="text-brown-light">
                <span className="font-medium">Brunch:</span> Sat-Sun 10:00 AM - 3:00 PM
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-taupe-dark mt-8 pt-8 text-center">
          <p className="text-brown-light">
            © 2025 SONNAS Restaurant. All rights reserved. | 
            <Link href="/privacy" className="hover:text-soft-gold ml-1">Privacy Policy</Link> | 
            <Link href="/terms" className="hover:text-soft-gold ml-1">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
