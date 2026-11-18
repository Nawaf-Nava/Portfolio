import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import VideoGallery from "@/components/ui/VideoGallery";
import { getYoutubeChannelData } from "@/lib/youtube";
import socials from "@/data/socials.json";

export default async function Videos() {
  const { videos, avatarUrl } = await getYoutubeChannelData();
  const channel = socials.find((s) => s.name === "YouTube")?.url ?? "#";

  return (
    <section id="videos" className="relative py-24 px-5 md:px-8 bg-[#0a0d10]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <SectionHeading eyebrow="From The Channel" title="YouTube Videos" accent="red" />
          <a
            href={channel}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Nawaf YouTube channel"
            className="inline-flex items-center justify-center self-start md:mb-4 rounded-full transition-transform hover:scale-105"
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Nawaf YouTube channel"
                width={40}
                height={40}
                unoptimized
                className="h-10 w-10 rounded-full object-cover border-2 border-neon-red shadow-[0_0_12px_rgba(255,0,60,0.35)]"
              />
            ) : (
              <span className="h-10 w-10 rounded-full border-2 border-neon-red flex items-center justify-center text-[10px] font-hack text-neon-red">
                NAWAF
              </span>
            )}
          </a>
        </div>
      </div>

      <VideoGallery videos={videos} />
    </section>
  );
}
