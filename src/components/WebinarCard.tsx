import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import Button from "./Button";

type WebinarCardProps = {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime?: string | null;
  speakers?: string | null;
  imageUrl?: string | null;
  posterUrl?: string | null;
  platform: string;
};

export default function WebinarCard({
  id,
  title,
  description,
  date,
  startTime,
  speakers,
  imageUrl,
  posterUrl,
  platform,
}: WebinarCardProps) {
  const cardImage = posterUrl || imageUrl;
  const getPlatformColor = (p: string) => {
    switch (p.toLowerCase()) {
      case "zoom":
        return "bg-blue-100 text-blue-700";
      case "google meet":
        return "bg-green-100 text-green-700";
      case "microsoft teams":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const isPast = new Date(date) < new Date();

  return (
    <div className="group flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up">
      <Link
        href={`/webinars/${id}`}
        className="relative h-48 w-full bg-slate-100 overflow-hidden block"
      >
        {cardImage ? (
          <Image
            src={cardImage}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900">
            <div className="text-center">
              <svg
                className="w-10 h-10 text-indigo-300 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs font-semibold text-indigo-200 uppercase tracking-widest">
                Webinar
              </span>
            </div>
          </div>
        )}
        {/* Platform Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider shadow-sm ${getPlatformColor(platform)}`}
          >
            {platform}
          </span>
        </div>
        {/* Past Badge */}
        {isPast && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider bg-slate-800/80 text-white shadow-sm">
              Past
            </span>
          </div>
        )}
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        {/* Date & Time */}
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
          <time dateTime={new Date(date).toISOString()}>
            {format(new Date(date), "MMM d, yyyy")} •{" "}
            {startTime || format(new Date(date), "h:mm a")}
          </time>
        </div>

        {/* Title */}
        <Link href={`/webinars/${id}`}>
          <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Speakers Snippet */}
        {speakers && (
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-lg">
              <svg
                className="w-3 h-3 text-indigo-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                {speakers.split(",")[0].trim()}
                {speakers.split(",").length > 1 &&
                  ` +${speakers.split(",").length - 1} more`}
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
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
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span>Online</span>
          </div>
          <Button
            href={`/webinars/${id}`}
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
