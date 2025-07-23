import { useState } from "react";
import { Search, Calendar, MessageSquare, CheckCircle } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: <Search className="h-8 w-8 text-[#9678b4]" />,
    title: "Personalised Therapist Match",
    description: "Fill out a quick form and we'll connect you with a licensed therapist who best fits your needs and preferences."
  },
  {
    id: 2,
    icon: <Calendar className="h-8 w-8 text-[#9678b4]" />,
    title: "Book a Session",
    description: "Choose a convenient time slot that works with your schedule, with flexible options for in-person or virtual meetings."
  },
  {
    id: 3,
    icon: <MessageSquare className="h-8 w-8 text-[#9678b4]" />,
    title: "Initial Consultation",
    description: "Discuss your needs and goals to create a personalized therapy plan tailored to your unique situation."
  },
  {
    id: 4,
    icon: <CheckCircle className="h-8 w-8 text-[#9678b4]" />,
    title: "Begin Your Journey",
    description: "Start regular sessions and work together towards better mental health and wellbeing for your golden years."
  }
];

const HowItWorks = () => {
  return (
    <div className="py-8 px-4 md:px-6 lg:px-8 bg-[#7a5aa0]/10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-black mb-3">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our simple process to connect you with the right therapist and start your journey to better mental health.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
          {steps.map((step) => (
            <div 
              key={step.id}
              className="bg-white rounded-2xl shadow-md p-6 transition-all duration-300 hover:shadow-lg flex flex-col items-center text-center w-full max-w-md"
            >
              <div className={`rounded-full p-4 mb-4 flex items-center justify-center ${
                step.id === 1 ? "bg-blue-100" :
                step.id === 2 ? "bg-purple-100" :
                step.id === 3 ? "bg-green-100" :
                "bg-orange-100"
              }`}>
                <div className="relative">
                  <div className="absolute -left-4 -top-4 w-8 h-8 flex items-center justify-center bg-[#9678b4] text-white font-bold rounded-full">
                    {step.id}
                  </div>
                  {step.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;