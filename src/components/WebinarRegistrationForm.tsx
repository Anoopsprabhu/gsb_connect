"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import Button from "./Button";

interface WebinarRegistrationFormProps {
  webinarId: string;
  webinarTitle: string;
}

export default function WebinarRegistrationForm({
  webinarId,
  webinarTitle,
}: WebinarRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    interest: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/webinars/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, webinarId }),
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit registration");
      }
    } catch {
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
        <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
          Registration Successful! 🎉
        </h2>
        <p className="text-lg text-slate-600 mb-4 max-w-md mx-auto leading-relaxed">
          You&apos;re registered for{" "}
          <span className="font-bold text-indigo-600">{webinarTitle}</span>.
        </p>
        <p className="text-base text-slate-500 mb-10 max-w-md mx-auto leading-relaxed">
          A confirmation email has been sent to you. The Webinar Join URL will be sent 48 hours before the Webinar.
        </p>
        <Button
          href={`/webinars/${webinarId}`}
          variant="primary"
          size="large"
          icon={<ArrowLeft className="w-5 h-5" />}
          label="Back to Webinar"
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="mb-10">
        <Button
          href={`/webinars/${webinarId}`}
          variant="ghost"
          className="mb-6 group px-0"
          icon={
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          }
          label="Back to Webinar Details"
        />
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Register for Webinar
        </h1>
        <p className="text-lg text-slate-500 mt-2">
          Registering for:{" "}
          <span className="font-bold text-indigo-600">{webinarTitle}</span>
        </p>
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
              <FormField
                label="Full Name *"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <FormField
                label="Email Address *"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                label="Phone Number *"
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Category / Profession
                </label>
                <div className="relative">
                  <select
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none"
                  >
                    <option value="" disabled>Select your category</option>
                    <option value="Entrepreneur">Entrepreneur</option>
                    <option value="Student">Student</option>
                    <option value="Professional">Professional</option>
                    <option value="Investor">Investor</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Why are you interested in this webinar?
              </label>
              <textarea
                name="interest"
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
                label={
                  isSubmitting ? "Processing..." : "Register for Webinar"
                }
              />
              <p className="text-center text-slate-400 text-xs mt-6">
                The Webinar Join URL will be sent 48 hours before the Webinar.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label}
      </label>
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
