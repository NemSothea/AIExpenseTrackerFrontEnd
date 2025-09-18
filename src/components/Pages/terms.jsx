import React from "react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Terms of Service
        </h1>
        <p className="text-gray-600 mb-6">
          Welcome to IA Expense Tracker! By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions.
        </p>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            1. Account Registration and Access
          </h2>
          <ul className="list-disc pl-6 text-gray-600">
            <li>Users must provide accurate and complete information during registration.</li>
            <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
            <li>We reserve the right to suspend or terminate accounts for any unauthorized use or violation of these terms.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            2. Subscription and Payment
          </h2>
          <ul className="list-disc pl-6 text-gray-600">
            <li>Some features may require a paid subscription.</li>
            <li>Payments must be made in accordance with the pricing and billing terms presented at the time of purchase.</li>
            <li>We reserve the right to change our pricing plans with prior notice.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            3. Data Privacy and Security
          </h2>
          <p className="text-gray-600">
            We take data privacy seriously. Your financial data is encrypted and stored securely. Please refer to our Privacy Policy for more details.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            4. Limitation of Liability
          </h2>
          <p className="text-gray-600">
            IA Expense Tracker is not liable for any financial loss, data breach, or damages resulting from the use of our services. Users are responsible for their own financial decisions.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            5. Changes to Terms
          </h2>
          <p className="text-gray-600">
            We reserve the right to update these terms at any time. Continued use of our services after changes implies acceptance of the revised terms.
          </p>
        </section>

        <p className="text-gray-600">
          If you have any questions about our Terms of Service, please contact us at{" "}
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

export default TermsOfService;
