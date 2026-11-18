"use client";

import Image from "next/image";
import { PlayCircle, Eye, MonitorPlay } from "lucide-react";
import Marquee from "@/components/ui/Marquee";
import type { VideoItem } from "@/lib/youtube";

export default function VideoGallery({ videos }: { videos: VideoItem[] }) {
  const playableVideos = videos.filter((video) => !video.id.startsWith("pending-"));

  return (
    <Marquee speed={45} edgeColor="#0a0d10">
      {playableVideos.map((video) => {
        const videoUrl = video.playlistId
          ? `https://www.youtube.com/playlist?list=${encodeURIComponent(video.playlistId)}`
          : `https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`;

        return (
          <a
            key={video.id}
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch ${video.title} on YouTube`}
            className="cyber-card w-[340px] shrink-0 overflow-hidden group text-left"
          >
            <div className="relative w-full aspect-video bg-white/5 overflow-hidden">
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                sizes="340px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle
                  className="text-neon-red drop-shadow-[0_0_14px_rgba(255,0,60,0.9)]"
                  size={48}
                />
              </div>
              <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded bg-neon-red/90 text-[10px] font-hack uppercase tracking-wider text-white">
                <MonitorPlay size={11} /> {video.playlistId ? "Playlist" : "Watch"}
              </span>
              {video.duration && (
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[11px] font-hack text-white">
                  {video.duration}
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-display font-semibold leading-snug mb-2 line-clamp-2 text-sm">
                {video.title}
              </h3>
              <p className="flex items-center gap-1.5 text-white/50 text-xs font-hack">
                <Eye size={12} />
                {video.views && <>{video.views} views &middot; </>}
                {video.date}
              </p>
            </div>
          </a>
        );
      })}
    </Marquee>
  );
}
