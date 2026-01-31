import React from 'react';
import Link from 'next/link';

const CallToAction: React.FC = () => {
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
          Join thousands of users who have transformed their productivity with our task management solution
        </p>
        <Link
          href="/signup"
          className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
        >
          Create Free Account
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;