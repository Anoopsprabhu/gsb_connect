"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Button from "./Button";

interface RegistrationFormProps {
  eventId: string;
  eventTitle: string;
}

export default function RegistrationForm({ eventId, eventTitle }: RegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    profession: "",
    category: "RSB",
    interest: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, eventId }),
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit registration");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Registration Successful!</h2>
        <p className="text-lg text-slate-600 mb-10 max-w-md mx-auto leading-relaxed">
          Thank you for registering for <span className="font-bold text-indigo-600">{eventTitle}</span>. 
          We have received your information and will contact you soon with more details.
        </p>
        <Button
          href={`/events/${eventId}`}
          variant="primary"
          size="large"
          icon={<ArrowLeft className="w-5 h-5" />}
          label="Back to Event"
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4" data-reveal-block>
      <div className="mb-10">
        <Button
          href={`/events/${eventId}`}
          variant="ghost"
          className="mb-6 group px-0"
          icon={<ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />}
          label="Back to Event Details"
        />
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Event Registration</h1>
        <p className="text-lg text-slate-500 mt-2">Registering for: <span className="font-bold text-indigo-600">{eventTitle}</span></p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 text-red-600 p-5 rounded-2xl text-sm font-semibold border border-red-100 flex items-center gap-3">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField label="Full Name *" name="fullName" type="text" placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} required />
              <FormField label="Email Address *" name="email" type="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField label="Phone Number *" name="phone" type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} required />
              <FormField label="Date of Birth *" name="dob" type="date" value={formData.dob} onChange={handleChange} required />
            </div>

            <div className="space-y-6">
              <FormField label="Current Address *" name="address" type="text" placeholder="House No, Street, Area" value={formData.address} onChange={handleChange} required />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField label="Country *" name="country" type="text" placeholder="India" value={formData.country} onChange={handleChange} required />
                <FormField label="State *" name="state" type="text" placeholder="Karnataka" value={formData.state} onChange={handleChange} required />
                <FormField label="City *" name="city" type="text" placeholder="Udupi" value={formData.city} onChange={handleChange} required />
                <FormField label="Pincode *" name="pincode" type="text" placeholder="576101" value={formData.pincode} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField label="Profession *" name="profession" type="text" placeholder="e.g. Software Engineer" value={formData.profession} onChange={handleChange} required />
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Category *</label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="RSB">RSB</option>
                  <option value="GSB">GSB</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Why are you interested in this event? *</label>
              <textarea
                name="interest"
                required
                rows={4}
                value={formData.interest}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none"
                placeholder="Share your motivation for attending..."
              ></textarea>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                size="large"
                variant="primary"
                loading={isSubmitting}
                className="w-full"
                label={isSubmitting ? "Processing..." : "Complete Registration"}
              />
              <p className="text-center text-slate-400 text-xs mt-6">
                By clicking "Complete Registration", you agree to our terms and conditions.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, name, type, placeholder, value, onChange, required }: any) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
      />
    </div>
  );
}
