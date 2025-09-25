import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-600 mb-6">
          At AI Expense Tracker, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our services.
        </p>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            1. Information We Collect
          </h2>
          <ul className="list-disc pl-6 text-gray-600">
            <li>
              <strong>Personal Information:</strong> Name, email address, and payment details when you register or subscribe.
            </li>
            <li>
              <strong>Financial Data:</strong> Expense entries, categories, and transaction history you input into the platform.
            </li>
            <li>
              <strong>Non-Personal Information:</strong> Browser type, device information, and usage patterns for analytics purposes.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 text-gray-600">
            <li>To provide and improve our expense tracking services.</li>
            <li>To send account updates, notifications, and relevant offers.</li>
            <li>To analyze usage trends and enhance user experience.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            3. Sharing Your Information
          </h2>
          <p className="text-gray-600">
            We do not sell or rent your personal information. However, we may share your data with:
          </p>
          <ul className="list-disc pl-6 text-gray-600">
            <li>Trusted third-party services for secure payment processing and infrastructure support.</li>
            <li>Legal authorities when required to comply with applicable laws and regulations.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            4. Data Security
          </h2>
          <p className="text-gray-600">
            We implement industry-standard security measures to protect your data. While we strive to ensure security, no method of transmission or storage is 100% secure.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            5. Cookies
          </h2>
          <p className="text-gray-600">
            We use cookies to personalize your experience and analyze usage. You may disable cookies in your browser settings, though some features may be affected.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            6. Your Rights
          </h2>
          <p className="text-gray-600">
            You have the right to access, update, or delete your personal information. Contact us at{" "}
            <a
              href="mailto:support@aiexpense.com"
              className="text-blue-500 underline"
            >
              support@aiexpense.com
            </a>{" "}
            for assistance.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            7. Changes to This Policy
          </h2>
          <p className="text-gray-600">
            We may revise this Privacy Policy from time to time. Updates will be posted on this page, and we encourage you to review it periodically.
          </p>
        </section>

        <p className="text-gray-600">
          If you have any questions or concerns about this Privacy Policy, please contact us at{" "}
          <a
            href="mailto:support@aiexpense.com"
            className="text-blue-500 underline"
          >
            support@aiexpense.com
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
