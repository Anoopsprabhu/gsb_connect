"use client";

import { useState, useEffect } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
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
} from "lucide-react";
import Button from "@/components/Button";

export default function EditStartup() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isLoaded: isUserLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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

  useEffect(() => {
    async function fetchStartup() {
      if (!isUserLoaded) return;

      // If user is not logged in, stop loading and show sign-in prompt
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/startups/${id}`);
        if (res.ok) {
          const data = await res.json();
          setFormData(data);
        } else {
          const err = await res.json();
          alert(err.error || "Failed to load startup data");
          router.push("/");
        }
      } catch (error) {
        console.error(error);
        alert("Error fetching startup");
      } finally {
        setIsLoading(false);
      }
    }
    fetchStartup();
  }, [id, isUserLoaded, user, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/startups/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
      alert("Failed to update. Check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show sign-in prompt if user is not logged in
  if (!isLoading && !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-slate-100">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserIcon className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Sign In Required
          </h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            You&apos;ve been invited to collaborate on a startup. Please sign in to access the application.
          </p>
          <SignInButton mode="modal">
            <button className="w-full py-4 px-6 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-sm">
              Sign In to Continue
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-slate-100">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Changes Saved!
          </h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Your startup profile has been updated successfully. The team will
            review any new changes.
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
              Edit Your <br />
              <span className="text-indigo-400">Startup.</span>
            </h1>
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
                      Update your venture details.
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
                    <input
                      type="email"
                      name="cofounderEmail"
                      value={formData.cofounderEmail}
                      onChange={handleChange}
                      placeholder="cofounder@startup.com"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:bg-white focus:border-indigo-500 transition-all outline-none"
                    />
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
                label={isSubmitting ? "Updating..." : "Update Application"}
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
