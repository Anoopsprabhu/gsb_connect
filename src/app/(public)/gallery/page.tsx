import GalleryMasonryGrid from "@/components/GalleryMasonryGrid";
import { getGalleryItemModel } from "@/lib/gallery-prisma";
import { Camera, Image as ImageIcon, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Gallery | GSB Connect",
  description:
    "Explore highlights from GSB Connect events, celebrations, workshops, and community moments.",
};

type GalleryItem = {
  id: string;
  title: string;
  caption: string | null;
  altText: string | null;
  imageUrl: string;
};

export default async function GalleryPage() {
  let galleryItems: GalleryItem[] = [];
  let dbError = false;

  try {
    const galleryItem = getGalleryItemModel();

    galleryItems = (await galleryItem.findMany({
      where: { status: "published" },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        caption: true,
        altText: true,
        imageUrl: true,
      },
    })) as GalleryItem[];
  } catch (error) {
    console.error("Failed to load gallery items.", error);
    dbError = true;
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 pt-32 pb-20 md:pt-40 md:pb-32" data-reveal-off>
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full bg-[radial-gradient(circle_at_20%_30%,_rgba(79,70,229,0.15),_transparent_50%),radial-gradient(circle_at_80%_70%,_rgba(14,165,233,0.1),_transparent_50%)]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-medium text-white tracking-tight mb-8 leading-[1.1]">
            Our Journey <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400">
              In Frames
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed font-medium">
            Capturing the spirit of GSB Connect — from high-energy workshops to
            meaningful community celebrations.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 md:py-20 flex-grow">
        <div className="container mx-auto px-4 md:px-6">
          {dbError && (
            <div className="mb-12 max-w-2xl mx-auto p-6 bg-red-50 border border-red-100 rounded-[32px] text-red-900 flex items-start gap-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Connection Error</h4>
                <p className="text-sm mt-1 opacity-80">
                  We're having trouble reaching our visual archive. Please try
                  refreshing the page in a few moments.
                </p>
              </div>
            </div>
          )}

          {galleryItems.length > 0 ? (
            <GalleryMasonryGrid items={galleryItems} />
          ) : (
            <div className="bg-slate-50/50 rounded-[48px] border border-dashed border-slate-200 p-16 md:p-24 text-center max-w-4xl mx-auto">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-sm text-slate-300">
                <ImageIcon className="h-12 w-12" />
              </div>
              <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
                Moments Loading...
              </h2>
              <p className="mt-6 text-slate-500 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
                The gallery is currently being curated. We'll be showcasing the
                latest highlights from our community very soon.
              </p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <div className="h-1 w-12 rounded-full bg-slate-200" />
                <div className="h-1 w-1 rounded-full bg-slate-200" />
                <div className="h-1 w-1 rounded-full bg-slate-200" />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
