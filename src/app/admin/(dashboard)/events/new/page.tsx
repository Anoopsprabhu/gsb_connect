"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Clock, 
  MapPin, 
  AlignLeft, 
  Users, 
  Calendar, 
  Map,
  Loader2
} from "lucide-react";
import { uploadImage } from "@/lib/upload-image";

export default function AddEventPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    about: "",
    date: "",
    startTime: "",
    endTime: "",
    venue: "",
    mapUrl: "",
    topic: "",
    type: "workshop",
    speakers: "",
    featured: "",
    imageUrl: "",
    publicId: "",
  });

  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [roadmap, setRoadmap] = useState([{ time: "", activity: "" }]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addRoadmapItem = () => {
    setRoadmap([...roadmap, { time: "", activity: "" }]);
  };

  const removeRoadmapItem = (index: number) => {
    const newRoadmap = [...roadmap];
    newRoadmap.splice(index, 1);
    setRoadmap(newRoadmap);
  };

  const updateRoadmapItem = (index: number, field: 'time' | 'activity', value: string) => {
    const newRoadmap = [...roadmap];
    newRoadmap[index][field] = value;
    setRoadmap(newRoadmap);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const result = await uploadImage(file, "events");
      setFormData((prev) => ({
        ...prev,
        imageUrl: result.url,
        publicId: result.publicId,
      }));
    } catch (error) {
      console.error("Upload failed:", error);
      alert(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (status: 'published' | 'draft') => {
    if (!formData.title || !formData.description || !formData.date || !formData.venue || !formData.topic) {
      alert("Please fill in all required fields marked with *");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          location: formData.venue,
          type: formData.topic, // using topic as type for now or mapping it
          roadmap,
          status,
          registrationOpen,
        }),
      });

      if (res.ok) {
        router.push("/admin/events");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create event");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      alert("An error occurred during submission");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/events" className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Events
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Create New Event</h1>
          <p className="text-slate-500 mt-1">Fill in the details to publish a new event to the platform.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleSubmit('draft')}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
          >
            Save Draft
          </button>
          <button 
            onClick={() => handleSubmit('published')}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Publish Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* General Info Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlignLeft className="w-5 h-5 text-indigo-500" />
              General Information
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Event Title *</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. Innovators & Heritage Workshop"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Short Description *</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                  placeholder="A brief summary of the event (max 150 characters)"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">About This Event *</label>
                <textarea 
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Provide comprehensive details about what attendees can expect..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Speakers Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" />
              Speakers
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Main Speaker(s)</label>
                <input 
                  type="text" 
                  name="speakers"
                  value={formData.speakers}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. John Doe, Jane Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Featured Speakers (Comma separated)</label>
                <input 
                  type="text" 
                  name="featured"
                  value={formData.featured}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. Dr. Alan Turing, Grace Hopper"
                />
              </div>
            </div>
          </div>

          {/* Event Roadmap */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                Event Roadmap
              </h2>
              <button 
                onClick={addRoadmapItem}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-md transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>
            
            <div className="space-y-3">
              {roadmap.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start group">
                  <div className="w-1/3">
                    <input 
                      type="text" 
                      value={item.time}
                      onChange={(e) => updateRoadmapItem(idx, 'time', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                      placeholder="e.g. 2:00 PM"
                    />
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input 
                      type="text" 
                      value={item.activity}
                      onChange={(e) => updateRoadmapItem(idx, 'activity', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                      placeholder="e.g. Registration on entrance"
                    />
                    <button 
                      onClick={() => removeRoadmapItem(idx)}
                      disabled={roadmap.length === 1}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          
          {/* Banner Image */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-indigo-500" />
              Banner Image
            </h2>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden" 
              accept="image/*"
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 hover:border-indigo-400 transition-colors cursor-pointer group relative overflow-hidden ${formData.imageUrl ? 'border-solid border-indigo-500' : ''}`}
            >
              {formData.imageUrl ? (
                <img src={formData.imageUrl} className="absolute inset-0 w-full h-full object-cover" alt="Banner" />
              ) : (
                <>
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ImageIcon className="w-6 h-6" />}
                  </div>
                  <p className="text-sm font-medium text-slate-700">Click to upload image</p>
                  <p className="text-xs text-slate-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                </>
              )}
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              Date & Timings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Event Date *</label>
                <input 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                  <input 
                    type="time" 
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                  <input 
                    type="time" 
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-500" />
              Location
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Venue Name *</label>
                <input 
                  type="text" 
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. Main Auditorium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Map Embed URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Map className="h-4 w-4 text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    name="mapUrl"
                    value={formData.mapUrl}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Paste Google Maps iframe or URL"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Paste the full &lt;iframe&gt; code or just the src URL from Google Maps</p>
              </div>
            </div>
          </div>

          {/* Categorization */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Categorization
            </h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Event Topic *</label>
              <select 
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none"
              >
                <option value="">Select a topic...</option>
                <option value="technology">Technology</option>
                <option value="banking">Banking & Finance</option>
                <option value="culture">Culture & Heritage</option>
                <option value="education">Education</option>
                <option value="networking">Networking</option>
              </select>
            </div>
          </div>

          {/* Registration */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Registration</h2>
            <label className="flex items-center justify-between gap-4 cursor-pointer">
              <div>
                <p className="text-sm font-medium text-slate-800">Accept registrations</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Turn off to stop new sign-ups for this event
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={registrationOpen}
                onClick={() => setRegistrationOpen((v) => !v)}
                className={`relative inline-flex h-7 w-12 shrink-0 rounded-full transition-colors ${
                  registrationOpen ? "bg-indigo-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform mt-1 ${
                    registrationOpen ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
          </div>

        </div>
      </div>
    </div>
  );
}
