import { DIMENSIONS } from "@/constants/ui";

export function VideoSection() {
  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`aspect-video bg-muted border border-border ${DIMENSIONS.RADIUS_FILE_DROP} overflow-hidden shadow-sample`}
        >
          <video controls className="w-full h-full object-cover">
            <source src="/video/medial_video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
}
