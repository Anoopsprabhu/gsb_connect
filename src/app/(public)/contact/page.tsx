"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  Clock, 
  Globe,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Button from "@/components/Button";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Illustration */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-slate-50" data-reveal-off>
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-200/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-200/50 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
                <MessageSquare className="w-3.5 h-3.5" />
                Contact Us
              </div>
              <h1 className="text-5xl md:text-7xl font-medium text-slate-900 tracking-tight mb-8 leading-[1.1]">
                Let's Start a <br />
                <span className="text-indigo-600">Conversation.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg mb-10">
                Have questions about GSB Startup Angels? Whether you&apos;re a
                founder, an investor, or a mentor — we&apos;re here to help.
              </p>
              
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Us</p>
                    <a href="mailto:contact@gsbstartupangels.com" className="text-slate-900 font-medium hover:text-indigo-600 transition-colors">
                      contact@gsbstartupangels.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Website</p>
                    <a href="https://gsbstartupangels.com" target="_blank" rel="noopener noreferrer" className="text-slate-900 font-medium hover:text-indigo-600 transition-colors">
                      gsbstartupangels.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:flex justify-center relative"
            >
              <div className="relative w-full max-w-md aspect-square">
                {/* Floating Elements Animation */}
                <motion.div 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-10 right-0 w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center z-20 border border-slate-100"
                >
                  <div className="text-center">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Fast Response</p>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-10 left-0 w-40 h-40 bg-white rounded-3xl shadow-xl flex items-center justify-center z-20 border border-slate-100"
                >
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Globe className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">Global Support</p>
                    <div className="mt-2 h-1.5 w-16 bg-slate-100 rounded-full mx-auto overflow-hidden">
                      <div className="h-full w-2/3 bg-indigo-500 rounded-full" />
                    </div>
                  </div>
                </motion.div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-72 h-72 bg-gradient-to-br from-indigo-500 to-sky-400 rounded-full opacity-20 blur-3xl animate-pulse" />
                  <div className="relative z-10 w-64 h-64 bg-white rounded-[40px] shadow-2xl flex items-center justify-center border border-slate-100 transform -rotate-6">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Send className="w-12 h-12 text-indigo-600 transform rotate-12" />
                      </div>
                      <div className="space-y-2 px-6 text-left">
                        <div className="h-2 w-full bg-slate-100 rounded-full" />
                        <div className="h-2 w-5/6 bg-slate-100 rounded-full" />
                        <div className="h-2 w-4/6 bg-indigo-200 rounded-full" />
                      </div>
                    </div>
                  </div>
                  {/* Decorative background circle */}
                  <div className="absolute -z-10 w-[120%] h-[120%] border-2 border-dashed border-slate-200 rounded-full animate-[spin_60s_linear_infinite]" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Contact Info Sidebar */}
            <div className="lg:w-1/3 space-y-10" data-stagger>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Visit Our Office</h3>
                <div className="flex gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 mb-1">HQ Address</p>
                    <p className="text-slate-600 leading-relaxed">
                      No7, VijayNest, 2nd floor, 14th A Cross,<br />
                      Malleshwaram, Bangalore-560003
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Support Hours</h3>
                <div className="flex gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 mb-1">Business Hours</p>
                    <p className="text-slate-600 leading-relaxed">
                      Mon - Fri: 9:00 AM - 6:00 PM<br />
                      Sat: 10:00 AM - 2:00 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-indigo-900 rounded-[40px] text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4">Want a Callback?</h3>
                  <p className="text-indigo-100 mb-6 leading-relaxed">
                    Leave your number and our team will get back to you within 24 hours.
                  </p>
                  <Button 
                    variant="white" 
                    className="w-full"
                    onClick={() => {
                      const element = document.getElementById("contact-form");
                      element?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Request Call
                  </Button>
                </div>
                {/* Decorative background shape */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              </div>
            </div>

            {/* Form Section */}
            <div className="lg:w-2/3" id="contact-form" data-reveal-block>
              <div className="bg-white rounded-[48px] border border-slate-200 shadow-sm p-8 md:p-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Send us a message</h2>
                <p className="text-slate-500 mb-10">Fill out the form below and we'll be in touch shortly.</p>

                {status === "success" ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-50 border border-emerald-100 rounded-3xl p-10 text-center"
                  >
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-900 mb-2">Message Sent!</h3>
                    <p className="text-emerald-700 max-w-sm mx-auto mb-8">
                      Thank you for reaching out. Our team has received your enquiry and will get back to you soon.
                    </p>
                    <Button variant="outline" onClick={() => setStatus("idle")}>
                      Send another message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                        <input
                          required
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                        <input
                          required
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Phone Number (Optional)</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 00000 00000"
                          className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none appearance-none"
                        >
                          <option value="">Select a subject</option>
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Startup Pitch">Startup Pitch</option>
                          <option value="Investor Relations">Investor Relations</option>
                          <option value="Partnership">Partnership</option>
                          <option value="Feedback">Feedback</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Your Message</label>
                      <textarea
                        required
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Tell us how we can help..."
                        className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none resize-none"
                      />
                    </div>

                    {status === "error" && (
                      <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-medium">{errorMessage}</p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="indigo"
                      size="large"
                      loading={status === "loading"}
                      className="w-full"
                      icon={<Send className="w-5 h-5" />}
                    >
                      Send Message
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
