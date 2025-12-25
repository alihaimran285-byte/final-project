import { Mail, User, MessageSquare } from "lucide-react";

export default function ContactForm() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold text-orange-700">Contact Us</h1>
      <p className="text-orange-600 mt-2">We'd love to hear from you!</p>

      <div className="flex items-center my-6">
        <span className="flex-grow h-px bg-orange-400"></span>
        <Mail className="mx-3 text-orange-600" size={22} />
        <span className="flex-grow h-px bg-orange-400"></span>
      </div>

      <form
        action="https://formspree.io/f/mgvdoykz"
        method="POST"
        className="space-y-6"
      >
        <div className="relative">
          <User className="absolute left-3 top-3 text-orange-600" size={20} />
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full p-3 pl-10 rounded-xl bg-white border border-orange-300 focus:ring-2 focus:ring-orange-400 outline-none"
            required
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-3 text-orange-600" size={20} />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="w-full p-3 pl-10 rounded-xl bg-white border border-orange-300 focus:ring-2 focus:ring-orange-400 outline-none"
            required
          />
        </div>

        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 text-orange-600" size={20} />
          <textarea
            name="message"
            placeholder="Your Message"
            className="w-full p-3 pl-10 h-36 rounded-xl bg-white border border-orange-300 focus:ring-2 focus:ring-orange-400 outline-none resize-none"
            required
          ></textarea>
        </div>

        <button className="w-full py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition">
          Send Message ✨
        </button>
      </form>
    </div>
  );
}
