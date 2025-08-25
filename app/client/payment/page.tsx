"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ChevronDown, CreditCard, Shield, ArrowRight, Package, Info, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import SiteFooter from "@/components/site-footer"

interface Package {
  pid: number;
  name: string;
  description: string | null;
  cost: string;
  duration: string;
  min_commitment: string | null;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch packages from API
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/packages');
        
        if (!response.ok) {
          throw new Error('Failed to fetch packages');
        }

        const data = await response.json();
        setPackages(data.packages || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const extractAmount = (costString: string): number => {
    // Extract number from cost string (e.g., "₹2000/session" -> 2000)
    const match = costString.match(/₹?(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const handlePayment = async () => {
    if (!selectedPackage) return;

    setIsProcessing(true);

    try {
      // Create order on backend
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId: selectedPackage.pid,
          amount: extractAmount(selectedPackage.cost) * 100, // Amount in paise
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();

      // Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Your Razorpay key
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Echoing Healthy Aging',
        description: `Payment for ${selectedPackage.name}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                packageId: selectedPackage.pid,
              }),
            });

            if (verifyResponse.ok) {
              // Payment successful
              alert('Payment successful! You will be redirected to your dashboard.');
              // Redirect to dashboard or success page
              window.location.href = '/client/dashboard';
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: '', // Get from user session if available
          email: '', // Get from user session if available
          contact: '', // Get from user session if available
        },
        theme: {
          color: '#a98cc8',
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-[#fef6f9]">
        <section className="py-16 md:py-24">
          <div className="container max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-6 text-gray-800">Complete Your Payment</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Select your therapy package and proceed with secure payment to begin your wellness journey with us.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 relative">
              {/* Step 1: Package Selection */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="bg-[#a98cc8] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">
                    1
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Select Your Package</h2>
                </div>

                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#a98cc8]"></div>
                    <p className="ml-4 text-gray-600">Loading packages...</p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-600 mb-4">Error loading packages: {error}</p>
                    <Button 
                      onClick={() => window.location.reload()} 
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Try Again
                    </Button>
                  </div>
                )}

                {!loading && !error && (
                  <div className="space-y-4">
                    {/* Package Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-[#a98cc8] transition-colors duration-200"
                      >
                        <div className="flex items-center">
                          <Package className="h-5 w-5 text-gray-500 mr-3" />
                          <span className="text-gray-700">
                            {selectedPackage ? selectedPackage.name : 'Choose a therapy package...'}
                          </span>
                        </div>
                        <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-64 overflow-y-auto">
                          {packages.map((pkg) => (
                            <button
                              key={pkg.pid}
                              onClick={() => {
                                setSelectedPackage(pkg);
                                setIsDropdownOpen(false);
                              }}
                              className="w-full text-left p-4 hover:bg-[#fef6f9] border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                            >
                              <div className="font-medium text-gray-800">{pkg.name}</div>
                              <div className="text-sm text-gray-600 mt-1">
                                {pkg.cost} • {pkg.duration}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Learn More Button */}
                    <div className="flex justify-center">
                      <Link href="/client/services" passHref>
                        <Button variant="outline" className="border-[#a98cc8] text-[#a98cc8] hover:bg-[#a98cc8] hover:text-white">
                          <Info className="h-4 w-4 mr-2" />
                          Learn More About Our Packages
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Package Details */}
              {selectedPackage && (
                <div className="mb-12">
                  <div className="flex items-center mb-6">
                    <div className="bg-[#a98cc8] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">
                      2
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Package Details</h2>
                  </div>

                  <div className="bg-gradient-to-r from-[#a98cc8]/5 to-[#f4c9c8]/5 rounded-xl p-6 border border-[#a98cc8]/20">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{selectedPackage.name}</h3>
                    
                    {selectedPackage.description && (
                      <p className="text-gray-600 mb-4">{selectedPackage.description}</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Cost</div>
                        <div className="font-bold text-[#a98cc8] text-lg">{selectedPackage.cost}</div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Duration</div>
                        <div className="font-semibold text-gray-800">{selectedPackage.duration}</div>
                      </div>
                      
                      {selectedPackage.min_commitment && (
                        <div className="bg-white p-4 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">Min. Commitment</div>
                          <div className="font-semibold text-gray-800">{selectedPackage.min_commitment}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {selectedPackage && (
                <div className="mb-8">
                  <div className="flex items-center mb-6">
                    <div className="bg-[#a98cc8] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">
                      3
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Secure Payment</h2>
                  </div>

                  {/* Security Features */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                    <div className="flex items-center mb-4">
                      <Shield className="h-6 w-6 text-green-600 mr-3" />
                      <h3 className="text-lg font-semibold text-green-800">Your payment is secure</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-700">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        SSL Encrypted
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        PCI Compliant
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Razorpay Secured
                      </div>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <div className="text-center">
                    <Button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="bg-[#a98cc8] hover:bg-[#9678b4] text-white px-12 py-4 text-lg rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <CreditCard className="h-5 w-5 mr-3" />
                      {isProcessing ? 'Processing...' : 'Pay Now'}
                    </Button>
                    
                    <p className="text-base text-[#a98cc8] font-medium mt-3">
                      Please confirm the package cost before proceeding
                    </p>
                  </div>
                </div>
              )}

              {/* No Package Selected State */}
              {!selectedPackage && !loading && !error && (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Please select a package to proceed with payment</p>
                </div>
              )}

              {/* Terms and Conditions - Now positioned at bottom right of card */}
              <div className="absolute bottom-4 right-4">
                <p className="text-xs text-gray-500">
                  By proceeding, you agree to our terms and conditions
                </p>
              </div>
            </div>

            {/* Support Information */}
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-2">Need help with your payment?</p>
              <p className="text-[#a98cc8] font-semibold">Contact our support team at support@echoinghealthyaging.com</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}