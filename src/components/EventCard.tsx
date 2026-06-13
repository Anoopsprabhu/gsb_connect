import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import Button from "./Button";

type EventCardProps = {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  type: string;
  imageUrl?: string | null;
  speakers?: string | null;
  featured?: string | null;
  startTime?: string | null;
};

export default function EventCard({
  id,
  title,
  description,
  date,
  location,
  type,
  imageUrl,
  speakers,
  featured,
  startTime,
}: EventCardProps) {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "workshop":
        return "bg-blue-100 text-blue-700";
      case "networking":
        return "bg-green-100 text-green-700";
      case "hackathon":
        return "bg-purple-100 text-purple-700";
      case "cultural":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up">
      <Link
        href={`/events/${id}`}
        className="relative h-48 w-full bg-slate-100 overflow-hidden block"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100">
            <svg
              className="w-12 h-12 text-indigo-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider shadow-sm ${getTypeColor(type)}`}
          >
            {type}
          </span>
        </div>
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <time dateTime={date.toISOString()}>
            {format(date, "MMM d, yyyy")} • {startTime || format(date, "h:mm a")}
          </time>
        </div>
        <Link href={`/events/${id}`}>
          <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Speakers Snippet */}
        {(speakers || featured) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {featured && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                  Featured: {featured.split(",")[0].trim()}
                </span>
              </div>
            )}
            {speakers && !featured && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Speakers: {speakers.split(",")[0].trim()}
                </span>
              </div>
            )}
          </div>
        )}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 truncate max-w-[60%]">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="truncate">{location}</span>
          </div>
          <Button
            href={`/events/${id}`}
            variant="ghost"
            className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm p-0 gap-1 group/link"
            icon={
              <svg
                className="w-4 h-4 group-hover/link:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            }
            label="Details"
          />
        </div>
      </div>
    </div>
  );
}
