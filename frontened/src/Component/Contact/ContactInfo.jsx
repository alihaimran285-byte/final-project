import React from "react";
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";

export default function ContactInfo({ phone, email, location }) {
  return (
    <div className="space-y-7">

      {/* Contact Info Card */}
      <div className="bg-white/80 rounded-2xl p-6 shadow-xl border border-orange-200">
        <h2 className="text-2xl font-bold text-orange-700 mb-4">Contact Info</h2>

        <div className="flex items-center gap-3 mb-3">
          <Phone className="text-orange-600" />
          <p className="text-orange-700 font-medium">{phone}</p>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <Mail className="text-orange-600" />
          <p className="text-orange-700 font-medium">{email}</p>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="text-orange-600" />
          <p className="text-orange-700 font-medium">{location}</p>
        </div>
      </div>

      {/* Social Media Card */}
      <div className="bg-white/80 rounded-2xl p-6 shadow-xl border border-orange-200">
        <h2 className="text-2xl font-bold text-orange-700 mb-4">Follow Us</h2>

        <div className="flex gap-6 text-orange-600">
          <Facebook size={30} className="cursor-pointer hover:scale-110 transition" />
          <Instagram size={30} className="cursor-pointer hover:scale-110 transition" />
          <Linkedin size={30} className="cursor-pointer hover:scale-110 transition" />
        </div>
      </div>

      {/* Google Map */}
      <div className="rounded-2xl overflow-hidden shadow-xl border border-orange-200">
        <iframe
          className="w-full h-56"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27221.58674110348!2d74.3120275!3d31.520369599999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391904d3e36e3de1%3A0xfee6b7bdc3f2afa7!2sLahore%2C%20Punjab!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

    </div>
  );
}
