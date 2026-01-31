import React from 'react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      title: "Create Account",
      description: "Sign up in less than a minute with your email address",
      icon: "📝"
    },
    {
      title: "Add Tasks",
      description: "Create and organize your tasks with intuitive tools",
      icon: "➕"
    },
    {
      title: "Stay Productive",
      description: "Track your progress and boost your productivity",
      icon: "🚀"
    }
  ];

  return (
    <section id="how-it-works" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Getting started with our task management solution is simple and straightforward
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
            >
              <div className="text-4xl mb-4 text-center">{step.icon}</div>
              <h3 className="text-xl font-semibold text-center mb-2">{step.title}</h3>
              <p className="text-gray-600 text-center">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;