// src/app/terms/page.js
import Link from "next/link";
import Footer from "@/components/Footer";

// Metadata for SEO
export const metadata = {
  title: "Terms of Service - FixMyLife",
  description: "Terms of Service for FixMyLife YouTube automation platform",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <span className="mr-2">←</span> Back to Home
            </Link>
          </div>

          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

          <div className="prose max-w-none">
            <p className="text-lg mb-6">Last updated: March 20, 2025</p>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the FixMyLife service, website, and any other linked pages, features, content, or application services offered by FixMyLife (collectively, the "Service"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service ("Terms").
              </p>
              <p className="mt-3">
                If you do not agree to these Terms, you should not use or access the Service. These Terms apply to all visitors, users, and others who access or use the Service.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
              <p>
                FixMyLife provides a platform for content creators to automate their YouTube posting workflow, particularly for repurposing TikTok content to YouTube ("Service"). The Service may include features such as scheduling posts, content conversion, analytics, and other functionality as described on our website.
              </p>
              <p className="mt-3">
                We reserve the right to modify, suspend, or discontinue the Service or any part thereof at any time, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuation of the Service.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
              <p>
                To access certain features of the Service, you must register for an account. When you register, you agree to provide accurate, current, and complete information about yourself as prompted by the registration process.
              </p>
              <p className="mt-3">
                You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
              </p>
              <p className="mt-3">
                We reserve the right to disable any user account if we believe you have violated any provisions of these Terms.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">4. Content and Conduct</h2>
              <h3 className="text-xl font-medium mb-3">4.1 Your Content</h3>
              <p>
                "Your Content" refers to any content you submit, upload, or otherwise make available to the Service, including text, files, images, videos, and other materials.
              </p>
              <p className="mt-3">
                You retain all rights in Your Content. By providing Your Content to the Service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, distribute, and display Your Content in connection with providing and improving the Service.
              </p>
              
              <h3 className="text-xl font-medium mt-5 mb-3">4.2 Content Restrictions</h3>
              <p>
                You agree that you will not post, upload, or share any content that:
              </p>
              <ul className="list-disc pl-6 mt-2 mb-4">
                <li>Infringes on the intellectual property rights of others</li>
                <li>Violates the privacy or publicity rights of others</li>
                <li>Is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
                <li>Promotes discrimination, bigotry, racism, hatred, harassment, or harm against any individual or group</li>
                <li>Is violent or threatening or promotes violence or actions that are threatening to any person or entity</li>
                <li>Contains false, misleading, or deceptive statements or content</li>
              </ul>
              
              <h3 className="text-xl font-medium mt-5 mb-3">4.3 Platform Policies</h3>
              <p>
                You are solely responsible for ensuring that Your Content complies with all applicable laws and the terms of service of any third-party platforms (such as YouTube, TikTok, etc.) that you use in connection with our Service.
              </p>
              <p className="mt-3">
                We are not responsible for any violations of third-party platform policies that may result from your use of our Service. It is your responsibility to understand and follow the terms of service of all platforms where your content appears.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are owned by FixMyLife and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
              </p>
              <p className="mt-3">
                You may not copy, modify, create derivative works of, publicly display, publicly perform, republish, or transmit any of the material on our Service, or distribute material from this Service without our prior written consent.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
              <p>
                In no event shall FixMyLife, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc pl-6 mt-2 mb-4">
                <li>Your access to or use of or inability to access or use the Service</li>
                <li>Any conduct or content of any third party on the Service</li>
                <li>Any content obtained from the Service</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              </ul>
              <p>
                We do not warrant that the Service will be uninterrupted, timely, secure, or error-free.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">7. Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold harmless FixMyLife and its licensees and licensors, and their employees, contractors, agents, officers, and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees) arising from:
              </p>
              <ul className="list-disc pl-6 mt-2 mb-4">
                <li>Your use of and access to the Service</li>
                <li>Your violation of any term of these Terms</li>
                <li>Your violation of any third-party right, including without limitation any copyright, property, or privacy right</li>
                <li>Any claim that Your Content caused damage to a third party</li>
              </ul>
              <p>
                This defense and indemnification obligation will survive these Terms and your use of the Service.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">8. Subscription and Payments</h2>
              <p>
                Some aspects of the Service may be provided with a subscription fee ("Paid Services"). If you elect to use Paid Services, you agree to the pricing, payment, and billing terms applicable to such Paid Services.
              </p>
              <p className="mt-3">
                Payments will be processed through our third-party payment processors. By providing your payment information, you authorize us to charge such payment method at the prices indicated for the selected Service.
              </p>
              <p className="mt-3">
                Subscription fees are non-refundable. We may change the fees for Paid Services at any time with notice. If you do not agree to a price change, you may cancel your subscription before the change takes effect.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
              </p>
              <p className="mt-3">
                You may terminate your account at any time by contacting us. Upon termination, your right to use the Service will immediately cease.
              </p>
              <p className="mt-3">
                All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of the United States of America, without regard to its conflict of law provisions.
              </p>
              <p className="mt-3">
                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page and updating the "Last updated" date at the top of this page.
              </p>
              <p className="mt-3">
                By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> support@fixmylife.app
                <br />
                <strong>Address:</strong> FixMyLife, 123 Tech Avenue, San Francisco, CA 94123, USA
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}