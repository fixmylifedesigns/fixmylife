// src/app/page.js
"use client";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function Home() {
  // Feature cards data
  const features = [
    {
      title: "Schedule YouTube Posts",
      description:
        "Plan your content calendar and schedule posts at optimal times",
      icon: "/icons/calendar.svg",
    },
    {
      title: "TikTok to YouTube Conversion",
      description: "Easily repurpose your TikTok content for YouTube",
      icon: "/icons/conversion.svg",
    },
    {
      title: "Analytics Dashboard",
      description: "Track performance and optimize your content strategy",
      icon: "/icons/analytics.svg",
    },
    {
      title: "Automated Publishing",
      description: "Set it and forget it with our reliable publishing system",
      icon: "/icons/automation.svg",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section - Based on Berry Material UI style */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              <span className="block">Automate Your</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                YouTube Workflow
              </span>
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Focus on creating great content while FixMyLife handles your
              posting schedule, TikTok conversions, and optimization.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/login">
                <button className="bg-white text-indigo-700 hover:bg-blue-50 px-8 py-3 rounded-md font-medium transition shadow-xl">
                  Get Started
                </button>
              </Link>
              <Link href="#features">
                <button className="bg-indigo-700 bg-opacity-20 hover:bg-opacity-30 text-white border border-indigo-300 px-8 py-3 rounded-md font-medium transition">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-500 rounded-lg opacity-20"></div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-purple-500 rounded-lg opacity-20"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-xl shadow-2xl p-8">
                <div className="w-full h-64 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-lg flex items-center justify-center">
                  <div className="w-3/4 bg-white rounded-lg shadow-lg p-4">
                    <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
                    <div className="flex space-x-2 mb-4">
                      <div className="h-10 w-10 bg-blue-500 rounded"></div>
                      <div className="h-10 flex-grow bg-gray-100 rounded"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between items-center">
                    <div className="h-3 w-1/3 bg-white/50 rounded"></div>
                    <div className="h-6 w-6 rounded-full bg-white/50"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800">
              Why Choose FixMyLife?
            </h2>
            <div className="w-24 h-1 bg-indigo-600 mx-auto my-4 rounded-full"></div>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform streamlines your content workflow so you can focus on
              what matters most
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-8 transition duration-300 hover:shadow-lg border border-gray-100 hover:border-indigo-100 group"
              >
                <div className="w-16 h-16 bg-indigo-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-indigo-100 transition-colors">
                  <div className="w-8 h-8 bg-indigo-600 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-8 md:p-12 shadow-sm">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
                  <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full"></div>
                  </div>
                </div>
                <div className="md:w-2/3 md:pl-8">
                  <p className="text-xl italic text-gray-700 mb-4">
                    &quot;FixMyLife has completely transformed how we manage our
                    YouTube content. What used to take hours now takes minutes,
                    and our engagement has improved significantly.&quot;
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900">Sarah Johnson</p>
                    <p className="text-sm text-gray-600">
                      Content Creator, 500K+ Subscribers
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800">How It Works</h2>
            <div className="w-24 h-1 bg-indigo-600 mx-auto my-4 rounded-full"></div>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to automate your YouTube workflow
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center space-y-12 md:space-y-0 md:space-x-16">
            {[
              {
                step: "1",
                title: "Connect",
                description: "Link your YouTube account",
              },
              {
                step: "2",
                title: "Schedule",
                description: "Set up your posting calendar",
              },
              {
                step: "3",
                title: "Automate",
                description: "Let our system handle the rest",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center max-w-xs relative"
              >
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 right-[-6rem] w-20 border-t-2 border-dashed border-indigo-300"></div>
                )}
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-md">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { value: "10K+", label: "Active Users" },
              { value: "2M+", label: "Videos Published" },
              { value: "500%", label: "Average Growth" },
              { value: "24/7", label: "Support" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-indigo-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800">
              Simple, Transparent Pricing
            </h2>
            <div className="w-24 h-1 bg-indigo-600 mx-auto my-4 rounded-full"></div>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works best for your content strategy
            </p>
          </div>

          <div className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch space-y-8 lg:space-y-0 lg:space-x-8">
            {/* Basic Plan */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-sm transition-transform hover:-translate-y-1 hover:shadow-lg">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Basic</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-gray-900">$9</span>
                  <span className="text-gray-600 ml-1">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Up to 20 scheduled posts</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Basic analytics</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Single YouTube account</span>
                  </li>
                  <li className="flex items-center text-gray-400">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Advanced customization</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-medium transition">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-sm border-2 border-indigo-600 transform scale-105 transition-transform hover:-translate-y-1 hover:shadow-lg">
              <div className="bg-indigo-600 text-white text-center py-2">
                <span className="text-sm font-medium">MOST POPULAR</span>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Professional
                </h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-gray-900">$29</span>
                  <span className="text-gray-600 ml-1">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Unlimited scheduled posts</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Up to 3 YouTube accounts</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Custom thumbnails</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-medium transition">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-sm transition-transform hover:-translate-y-1 hover:shadow-lg">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Enterprise
                </h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-gray-900">$99</span>
                  <span className="text-gray-600 ml-1">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Everything in Professional</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Unlimited YouTube accounts</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>API access</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-md font-medium transition">
                    Contact Sales
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to streamline your YouTube workflow?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-indigo-100">
            Join content creators who save hours each week with FixMyLife
          </p>
          <Link href="/login">
            <button className="bg-white text-indigo-700 hover:bg-blue-50 px-8 py-4 rounded-md font-medium transition shadow-xl">
              Get Started Free
            </button>
          </Link>
          <p className="mt-4 text-sm text-indigo-200">
            No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
