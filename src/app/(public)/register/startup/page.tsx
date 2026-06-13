"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Rocket,
  User as UserIcon,
  Mail,
  Phone,
  Globe,
  Building2,
  Layout,
  AlignLeft,
  Send,
  CheckCircle2,
  Loader2,
  Coins,
  TrendingUp,
  BarChart3,
  HelpCircle,
  Lightbulb,
  Users as UsersIcon,
  UserPlus,
} from "lucide-react";
import Button from "@/components/Button";

export default function StartupRegistration() {
  const { user, isLoaded } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<"idle" | "sent" | "error">("idle");
  const [formData, setFormData] = useState({
    startupName: "",
    founderName: "",
    email: "",
    phone: "",
    cofounderEmail: "",
    problem: "",
    solution: "",
    demoLink: "",
    category: "",
    progress: "",
    funding: "",
    revenueStage: "",
    burnRate: "",
    roundSize: "",
    roundStructure: "",
    valuation: "",
  });

  // Prefill founder name and email from Clerk if available
  useEffect(() => {
    if (isLoaded && user) {
      setFormData(prev => ({
        ...prev,
        founderName: prev.founderName || user.fullName || "",
        email: prev.email || user.primaryEmailAddress?.emailAddress || "",
      }));
    }
  }, [isLoaded, user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInvite = async () => {
    if (!formData.cofounderEmail || !formData.startupName) {
      alert("Please enter both a startup name and co-founder email first.");
      return;
    }
    setIsInviting(true);
    setInviteStatus("idle");
    try {
      const res = await fetch("/api/startups/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cofounderEmail: formData.cofounderEmail,
          startupName: formData.startupName,
        }),
      });
      if (res.ok) {
        setInviteStatus("sent");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to send invite.");
        setInviteStatus("error");
      }
    } catch {
      alert("Network error. Please try again.");
      setInviteStatus("error");
    } finally {
      setIsInviting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to register your startup");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/startups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId: user.id,
        }),
      });
      if (res.ok) {
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const error = await res.json();
        alert(error.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to submit. Check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-slate-100">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Application Sent!
          </h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Your startup registration has been submitted successfully. Our
            investment committee will review the details and reach out to you.
          </p>
          <Button
            href="/"
            size="large"
            variant="primary"
            className="w-full"
            label="Back to Home"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden" data-reveal-off>
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=2000"
            alt="Startup Hero"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/90 via-indigo-900/80 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-medium text-white mb-6 tracking-tight leading-tight">
              Scale Your <br />
              <span className="text-indigo-400">Startup.</span>
            </h1>
            {/* <p className="text-xl text-indigo-50/80 leading-relaxed max-w-lg font-medium">
              Join the GSB Connect ecosystem. Submit your pitch to access
              mentorship, funding, and community support.
            </p> */}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <div className="relative z-20 -mt-16 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-[40px] shadow-2xl shadow-indigo-200/50 border border-slate-100 overflow-hidden"
          >
            <div className="p-8 md:p-16 space-y-12">
              {/* Section 1: Basic Info */}
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                    <UserIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Founder & Identity
                    </h2>
                    <p className="text-sm text-slate-500">
                      How should we identify your venture?
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      Name of your startup? *
                    </label>
                    <input
                      required
                      type="text"
                      name="startupName"
                      value={formData.startupName}
                      onChange={handleChange}
                      placeholder="e.g. InnovateX"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:bg-white focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      Founder Name *
                    </label>
                    <input
                      required
                      type="text"
                      name="founderName"
                      value={formData.founderName}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:bg-white focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="founder@startup.com"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:bg-white focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      Phone Number *
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 ..."
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:bg-white focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      Cofounder Email (Optional)
                    </label>
                    <div className="flex gap-3 items-start">
                      <input
                        type="email"
                        name="cofounderEmail"
                        value={formData.cofounderEmail}
                        onChange={(e) => {
                          handleChange(e);
                          if (inviteStatus === "sent") setInviteStatus("idle");
                        }}
                        placeholder="cofounder@startup.com"
                        className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:bg-white focus:border-indigo-500 transition-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleInvite}
                        disabled={!formData.cofounderEmail || isInviting || inviteStatus === "sent"}
                        className={`flex items-center gap-2 px-5 py-4 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
                          inviteStatus === "sent"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default"
                            : formData.cofounderEmail
                              ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm cursor-pointer"
                              : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                        }`}
                      >
                        {isInviting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : inviteStatus === "sent" ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <UserPlus className="w-4 h-4" />
                        )}
                        {isInviting ? "Sending..." : inviteStatus === "sent" ? "Invited" : "Invite"}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 ml-1">
                      {inviteStatus === "sent"
                        ? "✓ Invite sent! Your co-founder will receive an email with a link."
                        : "Enter an email and click Invite to send a collaboration link."}
                    </p>
                  </div>
                </div>
              </section>

              <hr className="border-slate-100" />

              {/* Section 2: Product & Problem */}
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Product & Vision
                    </h2>
                    <p className="text-sm text-slate-500">
                      What makes your solution unique?
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      The Problem Statement *
                    </label>
                    <textarea
                      required
                      name="problem"
                      value={formData.problem}
                      onChange={handleChange}
                      rows={3}
                      placeholder="What problem are you solving? (3-4 sentences)"
                      className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:bg-white focus:border-indigo-500 transition-all outline-none resize-none"
                    ></textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      Your Solution *
                    </label>
                    <textarea
                      required
                      name="solution"
                      value={formData.solution}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Describe your solution (3-4 sentences)"
                      className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:bg-white focus:border-indigo-500 transition-all outline-none resize-none"
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Category *
                      </label>
                      <select
                        required
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none appearance-none cursor-pointer"
                      >
                        <option value="">Select Category</option>
                        <option value="fintech">Fintech</option>
                        <option value="edtech">Edtech</option>
                        <option value="healthtech">Healthtech</option>
                        <option value="saas">SaaS</option>
                        <option value="ai-ml">AI / ML</option>
                        <option value="ecommerce">E-commerce</option>
                        <option value="clean-tech">Clean Tech</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Current Progress *
                      </label>
                      <select
                        required
                        name="progress"
                        value={formData.progress}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none appearance-none cursor-pointer"
                      >
                        <option value="">Select Stage</option>
                        <option value="ideation">Ideation</option>
                        <option value="mvp">MVP</option>
                        <option value="beta">Beta</option>
                        <option value="advanced">Advanced Stage</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      Demo / Video Link
                    </label>
                    <input
                      type="url"
                      name="demoLink"
                      value={formData.demoLink}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-full focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                    />
                  </div>
                </div>
              </section>

              <hr className="border-slate-100" />

              {/* Section 3: Financials */}
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                    <Coins className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Financials & Funding
                    </h2>
                    <p className="text-sm text-slate-500">
                      Tell us about your round requirements.
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      External Funding Details *
                    </label>
                    <textarea
                      required
                      name="funding"
                      value={formData.funding}
                      onChange={handleChange}
                      placeholder="Previous rounds, investors, etc."
                      className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none resize-none"
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Revenue Stage *
                      </label>
                      <select
                        required
                        name="revenueStage"
                        value={formData.revenueStage}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none"
                      >
                        <option value="">Select Stage</option>
                        <option value="pre-revenue">Pre-Revenue</option>
                        <option value="early-revenue">Early Revenue</option>
                        <option value="profitable">Profitable</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Monthly Burn (Rs)
                      </label>
                      <input
                        type="text"
                        name="burnRate"
                        value={formData.burnRate}
                        onChange={handleChange}
                        placeholder="e.g. 50,000"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Current Round Size (Rs)
                      </label>
                      <input
                        type="text"
                        name="roundSize"
                        value={formData.roundSize}
                        onChange={handleChange}
                        placeholder="e.g. 10,00,000"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Round Valuation (Rs)
                      </label>
                      <input
                        type="text"
                        name="valuation"
                        value={formData.valuation}
                        onChange={handleChange}
                        placeholder="e.g. 1,00,00,000"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      Round Structure
                    </label>
                    <textarea
                      name="roundStructure"
                      value={formData.roundStructure}
                      onChange={handleChange}
                      placeholder="Committed vs soft commitments"
                      className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none resize-none"
                    ></textarea>
                  </div>
                </div>
              </section>
            </div>

            <div className="p-8 md:p-12 bg-slate-50 border-t border-slate-100 flex flex-col items-center">
              <Button
                type="submit"
                size="large"
                variant="primary"
                loading={isSubmitting}
                className="w-full max-w-md"
                icon={
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                }
                label={isSubmitting ? "Sending..." : "Submit Application"}
              />
              <p className="text-slate-400 text-xs mt-6">
                By submitting, you agree to our Venture Terms and Privacy
                Policy.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
