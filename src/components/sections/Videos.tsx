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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md neon-border-red text-neon-red font-hack text-xs uppercase tracking-wider hover:bg-neon-red/10 transition-colors self-start md:mb-4"
          >
            {avatarUrl ? (
              <Image src={avatarUrl} alt="Nawaf YouTube channel" width={28} height={28} unoptimized className="h-7 w-7 rounded-full object-cover" />
            ) : (
              <span className="text-[10px]">NAWAF</span>
            )}
          </a>
        </div>
      </div>

      <VideoGallery videos={videos} />
    </section>
  );
}
