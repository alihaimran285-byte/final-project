import React from "react";
import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";

export default function Contact() {
  const info = {
    phone: "+92 300 1234567",
    email: "support@example.com",
    location: "Lahore, Pakistan",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 to-orange-100  px-4 pt-20">
      <div className="flex justify-center mb-10">
        <span className="bg-white/70 backdrop-blur-xl px-6 py-2 mt-5 rounded-full text-orange-600 font-semibold shadow-lg border border-white/40 pt-30">
          Get in Touch ✨
        </span>
      </div>

      <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/40 p-10 grid lg:grid-cols-2 gap-10">
        <ContactForm />
        <ContactInfo {...info} />
      </div>
    </div>
  );
}
