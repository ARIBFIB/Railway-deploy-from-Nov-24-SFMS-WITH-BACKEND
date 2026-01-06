import React from 'react';
import { Headset, Check, ChevronRight, Folder, CreditCard, Clock } from 'lucide-react';

export const InvoiceServiceMarketingTab: React.FC = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-[#6F6F6F] mb-4">
        <span>Fortnox products</span>
        <ChevronRight size={16} className="mx-2" />
        <span>Invoice service</span>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left Content */}
        <div>
          {/* Status Indicators */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-20 h-1.5 bg-[#0A7A3B] rounded-full"></div>
            <div className="w-20 h-1.5 bg-[#FFC400] rounded-full"></div>
            <div className="w-20 h-1.5 bg-[#1ED760] rounded-full"></div>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-[#0B3A2E] mb-4">
            Get help with the entire invoicing flow
          </h1>

          {/* Description Paragraph */}
          <p className="text-base text-[#4A4A4A] max-w-[520px] mb-8">
            Streamline your invoicing process with our comprehensive service. We handle everything from creation to delivery, ensuring accuracy and efficiency.
          </p>

          {/* Free Support Badge */}
          <div className="flex items-center gap-2 mb-8">
            <Headset size={20} className="text-[#0A7A3B]" />
            <span className="text-sm font-medium text-[#0B3A2E]">Free support</span>
          </div>

          {/* Pricing Card */}
          <div className="bg-[#FFC400] rounded-xl p-8 max-w-[520px]">
            <div className="text-3xl font-bold text-[#0B3A2E] mb-3">4.90 SEK/pc</div>
            
            <button 
              className="h-11 px-6 bg-[#C7C7C7] text-white text-sm font-semibold rounded-full disabled"
              disabled
            >
              Activate
            </button>

            {/* Feature List */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <Check size={18} className="text-[#0A7A3B]" />
                <span className="text-sm text-[#0B3A2E]">Automated invoice creation</span>
              </div>
              <div className="flex items-center gap-3">
                <Check size={18} className="text-[#0A7A3B]" />
                <span className="text-sm text-[#0B3A2E]">Secure delivery</span>
              </div>
              <div className="flex items-center gap-3">
                <Check size={18} className="text-[#0A7A3B]" />
                <span className="text-sm text-[#0B3A2E]">Payment tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <Check size={18} className="text-[#0A7A3B]" />
                <span className="text-sm text-[#0B3A2E]">Compliance assurance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - Hero Image */}
        <div>
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 md:h-80 lg:h-96 flex items-center justify-center">
            <span className="text-gray-500">Invoice service hero image</span>
          </div>
        </div>
      </div>

      {/* How Invoice Service Works Section */}
      <div className="mt-16 bg-[#063C2D] rounded-xl p-6 md:p-10 max-w-6xl mx-auto">
        <div className="max-w-6xl mx-auto px-6">
          {/* Top Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              {/* Accent Bar */}
              <div className="w-14 h-1.5 bg-[#FFC400] rounded mb-4"></div>
              
              {/* Section Title */}
              <h2 className="text-sm font-semibold tracking-[0.04em] text-white mb-3">
                How Invoice Service works
              </h2>
              
              {/* Main Heading */}
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-lg">
                An easier way to get paid
              </h3>
            </div>
            
            {/* Image Block */}
            <div className="lg:order-last">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 md:h-64 lg:h-80 flex items-center justify-center">
                <span className="text-gray-500">How it works image</span>
              </div>
            </div>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {/* Feature 1 */}
            <div className="text-white">
              <div className="flex justify-center mb-4">
                <Folder size={24} className="text-[#FFC400]" />
              </div>
              <h4 className="text-xl font-semibold mb-3">We take care of the administration</h4>
              <p className="text-[#D6E5DF] max-w-xs">
                Let us handle the paperwork and compliance so you can focus on running your business.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="text-white">
              <div className="flex justify-center mb-4">
                <CreditCard size={24} className="text-[#FFC400]" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Improve your liquidity</h4>
              <p className="text-[#D6E5DF] max-w-xs">
                Get paid faster with our streamlined invoicing process that reduces payment delays.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="text-white">
              <div className="flex justify-center mb-4">
                <Clock size={24} className="text-[#FFC400]" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Automatic reminders</h4>
              <p className="text-[#D6E5DF] max-w-xs">
                Never miss a payment with our automated reminder system that follows up on overdue invoices.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* More about Invoice Service Section */}
      <div className="mt-16 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Content Column */}
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#063C2D] mb-8">
              More about Invoice Service
            </h2>
            
            {/* Feature List Blocks */}
            <div className="space-y-8">
              {/* Feature 1 */}
              <div>
                <div className="flex items-start">
                  <div className="mt-1 mr-3 text-[#1A7F5A]">
                    →
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#063C2D] mb-2">
                      Choose when you want to use Invoice Service
                    </h3>
                    <p className="text-[#334B42] max-w-[520px]">
                      Flexible usage that adapts to your business needs. You can choose to use the service for specific invoices or all of them.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div>
                <div className="flex items-start">
                  <div className="mt-1 mr-3 text-[#1A7F5A]">
                    →
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#063C2D] mb-2">
                      Simple and flexible payment for your customers
                    </h3>
                    <p className="text-[#334B42] max-w-[520px]">
                      Offer your customers multiple payment options that make it easy for them to pay on time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Content Column - Image */}
          <div>
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96 flex items-center justify-center">
              <span className="text-gray-500">More about image</span>
            </div>
          </div>
        </div>
        
        {/* Bottom CTA Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mt-16">
          {/* Pricing Card */}
          <div className="bg-[#FFC400] rounded-xl p-8 max-w-[480px]">
            <div className="text-4xl font-bold text-[#063C2D] mb-4">4.90 SEK/pc</div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center">
                <span className="mr-2 text-[#063C2D]">→</span>
                <span className="text-sm text-[#063C2D]">Automated invoice creation</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-[#063C2D]">→</span>
                <span className="text-sm text-[#063C2D]">Secure delivery</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-[#063C2D]">→</span>
                <span className="text-sm text-[#063C2D]">Payment tracking</span>
              </div>
            </div>
            
            <button 
              className="h-12 px-5 bg-[#E5E5E5] text-[#063C2D] text-sm font-semibold rounded-full"
              disabled
            >
              Activate Invoice Service
            </button>
          </div>
          
          {/* Contact CTA */}
          <div>
            <h3 className="text-xl font-semibold text-[#063C2D] mb-3">
              Do you want to know more?
            </h3>
            <p className="text-[#334B42] mb-4">
              Contact us for a personalized demo and learn how Invoice Service can benefit your business.
            </p>
            <button className="h-12 px-6 border-2 border-[#1A7F5A] text-[#1A7F5A] font-semibold rounded-full">
              I want to be contacted
            </button>
          </div>
        </div>
      </div>

      {/* More products and services Section */}
      <div className="mt-16 max-w-6xl mx-auto px-6 py-16 md:py-20 lg:py-24">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#063C2D] mb-10">
          More products and services
        </h2>
        
        {/* Product Cards (Accounting & Billing) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Card 1 */}
          <div className="bg-white border border-[#C9D4CF] rounded-xl p-6 min-h-[180px] flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-[#063C2D] mb-2">Accounting, Billing</h3>
              <p className="text-[#334B42] mb-4">
                Comprehensive accounting and billing solutions to streamline your financial processes.
              </p>
              <div className="text-[#063C2D] font-semibold">From 189 SEK/month</div>
            </div>
            <button className="mt-4 self-start bg-transparent border-2 border-[#1A7F5A] text-[#1A7F5A] px-5 py-2 text-sm font-semibold rounded-full">
              Read more
            </button>
          </div>
          
          {/* Product Card 2 */}
          <div className="bg-white border border-[#C9D4CF] rounded-xl p-6 min-h-[180px] flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-[#063C2D] mb-2">Payroll, HR</h3>
              <p className="text-[#334B42] mb-4">
                Manage your employees and payroll efficiently with our integrated solutions.
              </p>
              <div className="text-[#063C2D] font-semibold">From 189 SEK/month</div>
            </div>
            <button className="mt-4 self-start bg-transparent border-2 border-[#1A7F5A] text-[#1A7F5A] px-5 py-2 text-sm font-semibold rounded-full">
              Read more
            </button>
          </div>
        </div>
        
        {/* Bottom Grid Section (Help + FAQ) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {/* Help Card */}
          <div className="bg-[#E9F0ED] rounded-xl p-8 min-h-[360px]">
            <div className="w-14 h-1.5 bg-[#FFC400] rounded mb-4"></div>
            <div className="text-sm font-semibold text-[#1A7F5A] mb-2">Which program is right for you?</div>
            <h3 className="text-2xl md:text-3xl font-bold text-[#063C2D] my-2">We help you</h3>
            <p className="text-[#334B42] max-w-[420px]">
              Our experts are ready to assist you in choosing the right solution for your business needs.
            </p>
            <button className="mt-6 bg-[#0A6B44] text-white px-6 py-3 font-semibold rounded-full">
              Contact me
            </button>
          </div>
          
          {/* FAQ Card */}
          <div className="bg-[#E9F0ED] rounded-xl p-8">
            <div className="w-14 h-1.5 bg-[#FFC400] rounded mb-4"></div>
            <div className="text-sm font-semibold text-[#1A7F5A] mb-2">FAQ</div>
            <h3 className="text-xl md:text-2xl font-bold text-[#063C2D] mb-3">Frequently asked questions about Invoice Service</h3>
            <p className="text-[#334B42] mb-6">
              Find answers to common questions about our invoice service.
            </p>
            
            {/* FAQ Accordion Items */}
            <div className="border-b border-[#C9D4CF] py-4 flex justify-between items-center">
              <div className="text-[#063C2D] font-semibold">How does the invoice service work?</div>
              <div className="text-[#1A7F5A]">→</div>
            </div>
            <div className="border-b border-[#C9D4CF] py-4 flex justify-between items-center">
              <div className="text-[#063C2D] font-semibold">What are the pricing options?</div>
              <div className="text-[#1A7F5A]">→</div>
            </div>
            <div className="border-b border-[#C9D4CF] py-4 flex justify-between items-center">
              <div className="text-[#063C2D] font-semibold">How secure is my data?</div>
              <div className="text-[#1A7F5A]">→</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA Section */}
      <div className="mt-12 pt-8 border-t border-gray-200 text-center">
        <h2 className="text-lg font-semibold text-[#0B3A2E] mb-2">Do you want to know more?</h2>
        <p className="text-sm text-[#4A4A4A] mb-4">Contact us for a personalized demo</p>
        <button className="h-11 px-7 border-2 border-[#0A7A3B] text-[#0A7A3B] font-semibold rounded-full hover:bg-[#E9F6EC] transition-colors">
          Contact us
        </button>
      </div>
    </div>
  );
};