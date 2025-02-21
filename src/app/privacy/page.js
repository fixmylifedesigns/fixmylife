// src/app/privacy/page.js
import Link from "next/link";
import Footer from "@/components/Footer";

// Metadata for SEO
export const metadata = {
  title: "Privacy Policy - FixMyLife",
  description:
    "Privacy Policy and Terms of Service for FixMyLife YouTube automation platform",
};

export default function PrivacyPage() {
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

          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

          <div className="prose max-w-none">
            <p className="text-lg mb-6">Last updated: February 20, 2025</p>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p>
                Welcome to FixMyLife (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We respect your
                privacy and are committed to protecting your personal data. This
                privacy policy explains how we collect, use, and share
                information about you when you use our website and services.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">
                2. Information We Collect
              </h2>

              <h3 className="text-xl font-medium mb-3">
                2.1 Information You Provide
              </h3>
              <p className="mb-4">
                When you use our service, we collect information that you
                provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  Account information: When you create an account, we collect
                  your name, email address, and other contact information.
                </li>
                <li>
                  Profile information: Information you add to your profile, such
                  as profile picture, location, and preferences.
                </li>
                <li>
                  Content: Information you provide when using our services,
                  including TikTok URLs, YouTube titles, descriptions, and
                  scheduling preferences.
                </li>
                <li>
                  Communications: Information you provide when contacting us,
                  including feedback and support requests.
                </li>
              </ul>

              <h3 className="text-xl font-medium mb-3">
                2.2 Information We Collect Automatically
              </h3>
              <p className="mb-4">
                When you use our services, we automatically collect certain
                information, including:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  Device information: Information about the device you use to
                  access our services, including hardware model, operating
                  system, unique device identifiers, and mobile network
                  information.
                </li>
                <li>
                  Usage information: Information about your use of our services,
                  including pages visited, features used, and actions taken.
                </li>
                <li>
                  Log information: Information automatically logged by our
                  systems, including IP address, browser type, referring/exit
                  pages, date/time stamps, and clickstream data.
                </li>
                <li>
                  Cookies and similar technologies: We use cookies and similar
                  technologies to collect information about your browsing
                  behavior and preferences.
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">
                3. How We Use Your Information
              </h2>
              <p className="mb-4">
                We use the information we collect for various purposes,
                including:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  Providing and improving our services: To operate and maintain
                  our services, develop new features, and enhance user
                  experience.
                </li>
                <li>
                  Communication: To communicate with you about our services,
                  respond to inquiries, and provide customer support.
                </li>
                <li>
                  Marketing: To send promotional messages, updates, and other
                  information that may interest you (with your consent where
                  required).
                </li>
                <li>
                  Security and fraud prevention: To detect, prevent, and address
                  fraud, security issues, and technical problems.
                </li>
                <li>
                  Legal compliance: To comply with legal obligations and enforce
                  our terms and policies.
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">
                4. Information Sharing
              </h2>
              <p className="mb-4">
                We may share your information in the following circumstances:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  With service providers: We share information with third-party
                  service providers who perform services on our behalf, such as
                  hosting, data analysis, payment processing, and customer
                  service.
                </li>
                <li>
                  With YouTube and other platforms: To fulfill the functionality
                  of our services, we share necessary information with YouTube
                  and other platforms you connect with.
                </li>
                <li>
                  For legal reasons: We may disclose information if required by
                  law, regulation, legal process, or governmental request.
                </li>
                <li>
                  With your consent: We may share information with third parties
                  when you have given us your consent to do so.
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">
                5. Your Rights and Choices
              </h2>
              <p className="mb-4">
                Depending on your location, you may have certain rights
                regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  Access: You can request access to the personal information we
                  hold about you.
                </li>
                <li>
                  Correction: You can request that we correct inaccurate or
                  incomplete information.
                </li>
                <li>
                  Deletion: You can request that we delete your personal
                  information in certain circumstances.
                </li>
                <li>
                  Restriction: You can request that we restrict the processing
                  of your information in certain circumstances.
                </li>
                <li>
                  Data portability: You may have the right to receive your
                  personal information in a structured, commonly used, and
                  machine-readable format.
                </li>
                <li>
                  Objection: You can object to our processing of your personal
                  information in certain circumstances.
                </li>
              </ul>
              <p>
                To exercise these rights, please contact us using the
                information provided in the &quot;Contact Us&quot; section.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, loss, or destruction. However, no security system is
                impenetrable, and we cannot guarantee the absolute security of
                our systems.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">
                7. International Data Transfers
              </h2>
              <p>
                Your information may be transferred to, and processed in,
                countries other than the one in which you reside. These
                countries may have data protection laws that differ from those
                in your country. We take appropriate safeguards to require that
                your personal information remains protected in accordance with
                this Privacy Policy.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">
                8. Children&apos;s Privacy
              </h2>
              <p>
                Our services are not directed to children under the age of 13,
                and we do not knowingly collect personal information from
                children under 13. If we learn that we have collected personal
                information from a child under 13, we will take steps to delete
                such information as soon as possible.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">
                9. Changes to This Privacy Policy
              </h2>
              <p>
                We may update this privacy policy from time to time. If we make
                material changes, we will notify you by email or by posting a
                notice on our website prior to the change becoming effective. We
                encourage you to review our privacy policy periodically.
              </p>
            </section>
{/* 
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
              <p>
                If you have any questions, concerns, or requests regarding this
                privacy policy or our data practices, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> privacy@fixmylife.app
                <br />
                <strong>Address:</strong> FixMyLife, 123 Tech Avenue, San
                Francisco, CA 94123, USA
              </p>
            </section> */}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
