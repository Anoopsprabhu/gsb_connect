"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
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

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const [roadmap, setRoadmap] = useState([{ time: "", activity: "" }]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/admin/events?id=${eventId}`);
        if (!res.ok) {
          console.error("Failed to fetch event:", res.status);
          return;
        }
        const event = await res.json();

        if (event && !event.error) {
          setFormData({
            title: event.title || "",
            description: event.description || "",
            about: event.about || "",
            date: event.date ? new Date(event.date).toISOString().split('T')[0] : "",
            startTime: event.startTime || "",
            endTime: event.endTime || "",
            venue: event.location || "",
            mapUrl: event.mapUrl || "",
            topic: event.topic || event.type || "",
            type: event.type || "workshop",
            speakers: event.speakers || "",
            featured: event.featured || "",
            imageUrl: event.imageUrl || "",
            publicId: event.publicId || "",
          });
          if (event.roadmap) {
            setRoadmap(event.roadmap);
          }
        }
      } catch (error) {
        console.error("Failed to fetch event:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) fetchEvent();
  }, [eventId]);

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

  const handleSubmit = async (status: "published" | "draft") => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.date ||
      !formData.venue ||
      !formData.topic
    ) {
      alert("Please fill in all required fields (title, description, date, venue, topic).");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/admin/events", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: eventId,
          title: formData.title,
          description: formData.description,
          about: formData.about,
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          location: formData.venue,
          mapUrl: formData.mapUrl,
          topic: formData.topic,
          type: formData.topic || formData.type,
          speakers: formData.speakers,
          featured: formData.featured,
          imageUrl: formData.imageUrl || null,
          publicId: formData.publicId || null,
          roadmap,
          status,
        }),
      });

      if (res.ok) {
        router.push("/admin/events");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update event");
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("An error occurred while updating the event");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/events" className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Events
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Edit Event</h1>
          <p className="text-slate-500 mt-1">Update the event details and status.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleSubmit('draft')}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button 
            onClick={() => handleSubmit('published')}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Update & Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* General Info */}
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
                ></textarea>
              </div>
            </div>
          </div>

          {/* Speakers */}
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
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Featured Speakers</label>
                <input 
                  type="text" 
                  name="featured"
                  value={formData.featured}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Roadmap */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                Event Roadmap
              </h2>
              <button onClick={addRoadmapItem} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-md">
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>
            <div className="space-y-3">
              {roadmap.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="w-1/3">
                    <input 
                      type="text" 
                      value={item.time}
                      onChange={(e) => updateRoadmapItem(idx, 'time', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input 
                      type="text" 
                      value={item.activity}
                      onChange={(e) => updateRoadmapItem(idx, 'activity', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                    />
                    <button onClick={() => removeRoadmapItem(idx)} disabled={roadmap.length === 1} className="p-2 text-slate-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Image */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-indigo-500" />
              Banner Image
            </h2>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 cursor-pointer relative overflow-hidden h-40 flex items-center justify-center ${formData.imageUrl ? 'border-solid border-indigo-500' : ''}`}
            >
              {formData.imageUrl ? (
                <img src={formData.imageUrl} className="absolute inset-0 w-full h-full object-cover" alt="Banner" />
              ) : (
                <div className="text-slate-400">
                  {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ImageIcon className="w-6 h-6 mx-auto mb-2" />}
                  <p className="text-xs">Click to change image</p>
                </div>
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
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg" />
                <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg" />
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
              <input type="text" name="venue" value={formData.venue} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="Venue Name" />
              <input type="text" name="mapUrl" value={formData.mapUrl} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="Paste Google Maps iframe or URL" />
              <p className="text-[10px] text-slate-500 mt-1">Paste the full &lt;iframe&gt; code or just the src URL from Google Maps</p>
            </div>
          </div>

          {/* Topic */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 font-bold">Topic</h2>
            <select name="topic" value={formData.topic} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <option value="">Select Topic</option>
              <option value="technology">Technology</option>
              <option value="banking">Banking & Finance</option>
              <option value="culture">Culture & Heritage</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
