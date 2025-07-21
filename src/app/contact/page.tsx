'use client'

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brown-900 via-brown-800 to-brown-900">
      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center bg-green-100 bg-opacity-10 backdrop-blur-sm border border-green-300 border-opacity-20 rounded-full px-6 py-2 mb-8">
            <span className="text-green-300 text-sm font-medium tracking-wide">📞 QUICK CONTACT • INSTANT RESPONSE</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 mb-8">
            CONTACT US
          </h1>
          <p className="text-xl md:text-2xl text-brown-100 max-w-2xl mx-auto mb-8">
            We&apos;re here to help! Get in touch for orders, reservations, or any questions
          </p>
          
          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="tel:+1234567890" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-xl">
              📞 Call Now: +91 98765 43210
            </a>
            <a href="mailto:orders@sonnas.com" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-xl">
              ✉️ Email Orders
            </a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-xl">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          
          {/* Contact Details */}
          <div className="bg-brown-800 bg-opacity-30 backdrop-blur-sm rounded-3xl p-8 border border-amber-300 border-opacity-20 shadow-2xl">
            <h2 className="text-3xl font-display font-bold text-amber-300 mb-8">📍 Visit Our Restaurant</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="text-2xl text-amber-400">📍</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Address</h3>
                  <p className="text-brown-200">
                    SONNAS Restaurant<br />
                    123 Main Street, Food District<br />
                    New Delhi, India 110001
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="text-2xl text-green-400">📞</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Phone (Orders & Reservations)</h3>
                  <p className="text-green-300 font-semibold text-lg">+91 98765 43210</p>
                  <p className="text-brown-200 text-sm">Available 24/7 for orders</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="text-2xl text-blue-400">✉️</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
                  <p className="text-blue-300">orders@sonnas.com</p>
                  <p className="text-brown-300">info@sonnas.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="text-2xl text-green-400">💬</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">WhatsApp</h3>
                  <p className="text-green-300">+91 98765 43210</p>
                  <p className="text-brown-200 text-sm">Quick orders & support</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="text-2xl text-amber-400">🕒</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Hours</h3>
                  <div className="text-brown-200 space-y-1">
                    <p><span className="text-amber-300">Monday - Friday:</span> 11:00 AM - 11:00 PM</p>
                    <p><span className="text-amber-300">Saturday - Sunday:</span> 10:00 AM - 12:00 AM</p>
                    <p className="text-green-300 text-sm font-medium">🍕 Online ordering: 24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-brown-800 bg-opacity-30 backdrop-blur-sm rounded-3xl p-8 border border-amber-300 border-opacity-20 shadow-2xl">
            <h2 className="text-3xl font-display font-bold text-amber-300 mb-8">Send Us a Message</h2>
            
            <form className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Name</label>
                <input 
                  type="text" 
                  className="w-full bg-brown-700 bg-opacity-50 border border-brown-600 rounded-lg px-4 py-3 text-white placeholder-brown-300 focus:outline-none focus:border-amber-400 transition-colors"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Mobile Number</label>
                <input 
                  type="tel" 
                  className="w-full bg-brown-700 bg-opacity-50 border border-brown-600 rounded-lg px-4 py-3 text-white placeholder-brown-300 focus:outline-none focus:border-amber-400 transition-colors"
                  placeholder="+91 9999999999"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Subject</label>
                <select className="w-full bg-brown-700 bg-opacity-50 border border-brown-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-400 transition-colors">
                  <option>General Inquiry</option>
                  <option>Reservation</option>
                  <option>Catering</option>
                  <option>Cooking Classes</option>
                  <option>Feedback</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Message</label>
                <textarea 
                  rows={4}
                  className="w-full bg-brown-700 bg-opacity-50 border border-brown-600 rounded-lg px-4 py-3 text-white placeholder-brown-300 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-xl hover:shadow-amber-500/25 hover:scale-105"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Map Section (Placeholder) */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center text-white mb-8">Find Us</h2>
          <div className="bg-brown-800 bg-opacity-30 backdrop-blur-sm rounded-3xl p-8 border border-amber-300 border-opacity-20 shadow-2xl">
            <div className="aspect-video bg-brown-700 bg-opacity-50 rounded-2xl flex items-center justify-center">
              <div className="text-center text-brown-300">
                <div className="text-4xl mb-4">🗺️</div>
                <p className="text-lg">Interactive Map Coming Soon</p>
                <p className="text-sm mt-2">Visit us at 123 Café Street, Foodie District</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
            Ready to Taste the Love?
          </h3>
          <p className="text-brown-200 text-lg mb-8">
            Join our café family and experience Sonna&apos;s heartfelt cooking.
          </p>
          <a 
            href="/menu" 
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-lg font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-xl hover:shadow-amber-500/25 hover:scale-105"
          >
            Order Now
          </a>
        </div>
      </div>
    </div>
  )
}
