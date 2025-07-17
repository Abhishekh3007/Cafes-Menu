'use client'

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brown-900 via-brown-800 to-brown-900">
      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 mb-8">
            OUR STORY
          </h1>
        </div>
      </div>

      {/* Story Content */}
      <div className="relative py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-brown-800 bg-opacity-30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-amber-300 border-opacity-20 shadow-2xl">
            
            {/* Sonna's Image Placeholder */}
            <div className="text-center mb-12">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-amber-300 to-orange-400 rounded-full flex items-center justify-center mb-6 shadow-2xl">
                <span className="text-4xl text-brown-900 font-bold">SA</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-amber-300 mb-2">
                SONNA SUBLOK
              </h2>
              <p className="text-brown-200 text-lg italic">
                Lovingly known as &apos;Sonna Aunty&apos;
              </p>
            </div>

            {/* Story Text */}
            <div className="space-y-8 text-center">
              <div className="text-lg md:text-xl text-brown-100 leading-relaxed max-w-3xl mx-auto">
                <p className="mb-6">
                  <span className="text-amber-300 font-semibold">Sonna Sublok</span>, lovingly known 
                  as <span className="text-amber-300 font-semibold">&apos;Sonna Aunty&apos;</span>, has been 
                  baking since she was young.
                </p>
                
                <p className="mb-6">
                  What started with a friend&apos;s request turned into years of making birthdays, 
                  anniversaries, and special occasions sweeter. Also sharing her knowledge by 
                  conducting cooking and baking classes.
                </p>
                
                <p className="mb-8 text-xl md:text-2xl text-amber-200 font-medium">
                  This café is her home, and we invite you to enjoy soul-filling food and her heartfelt cakes.
                </p>
                
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 rounded-2xl">
                  <p className="text-xl md:text-2xl font-display font-bold mb-2">
                    YOU ARE OUR FAMILY.
                  </p>
                </div>
              </div>
            </div>

            {/* Signature */}
            <div className="text-center mt-12">
              <p className="text-brown-200 text-lg mb-2">Love,</p>
              <p className="text-2xl font-display text-amber-300 font-bold">
                Team Sonna&apos;s
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-display font-bold text-center text-white mb-12">
            What Makes Us Special
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-brown-800 bg-opacity-30 backdrop-blur-sm rounded-2xl p-8 border border-amber-300 border-opacity-10">
              <div className="text-4xl mb-4">👩‍🍳</div>
              <h4 className="text-xl font-display font-bold text-amber-300 mb-4">
                Homemade with Love
              </h4>
              <p className="text-brown-200">
                Every dish is prepared with the same care and love as if cooking for our own family.
              </p>
            </div>
            
            <div className="text-center bg-brown-800 bg-opacity-30 backdrop-blur-sm rounded-2xl p-8 border border-amber-300 border-opacity-10">
              <div className="text-4xl mb-4">🎓</div>
              <h4 className="text-xl font-display font-bold text-amber-300 mb-4">
                Teaching & Sharing
              </h4>
              <p className="text-brown-200">
                We believe in sharing knowledge through our cooking and baking classes.
              </p>
            </div>
            
            <div className="text-center bg-brown-800 bg-opacity-30 backdrop-blur-sm rounded-2xl p-8 border border-amber-300 border-opacity-10">
              <div className="text-4xl mb-4">🏠</div>
              <h4 className="text-xl font-display font-bold text-amber-300 mb-4">
                A Home Away From Home
              </h4>
              <p className="text-brown-200">
                This café is more than a restaurant - it&apos;s a place where you become part of our family.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
            Ready to Experience Our Story?
          </h3>
          <p className="text-brown-200 text-lg mb-8">
            Come visit us and taste the love in every bite.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/menu" 
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-lg font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-xl hover:shadow-amber-500/25 hover:scale-105"
            >
              View Our Menu
            </a>
            <a 
              href="/contact" 
              className="border-2 border-white text-white hover:bg-white hover:text-brown-900 text-lg font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-xl hover:shadow-white/25 hover:scale-105"
            >
              Visit Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
