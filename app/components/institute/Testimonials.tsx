"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react"
import { Play, Star, X } from "lucide-react";

const videos = [
  {
    name: "Ishaan Chandrakar",
    thumbnail: "/testimonials/video1.jpeg",
    video: "/testimonials/video1.mp4",
    title: "From Avoiding RC to Enjoying Reading",
  },
  {
    name: "Bhoomi Saluja",
    thumbnail: "/testimonials/video2.jpeg",
    video: "/testimonials/video2.mp4",
    title: "Daily Workouts Changed My Reading Habit",
  },
  {
    name: "Rushill",
    thumbnail: "/testimonials/video3.jpeg",
    video: "/testimonials/video3.mp4",
    title: "Birbal Helped Me Understand My Mistakes",
  },
];

const reviews = [
  {
    name: "Keshu Sharma",
    photo: "/testimonials/student1.jpeg",
    text: "I used to avoid reading because I never enjoyed it. After using Auctor consistently, reading has become a daily habit and I can clearly feel the improvement in my comprehension.",
  },
  {
    name: "Pushti Kapoor",
    photo: "/testimonials/student2.jpeg",
    text: "The Daily Workout feature kept me consistent. Instead of randomly practising RCs, I finally had a proper learning routine every day.",
  },
  {
    name: "Nabeel",
    photo: "/testimonials/student3.jpeg",
    text: "Birbal doesn't just tell you the right answer. It explains why you were wrong, which completely changed how I approached Reading Comprehension.",
  },
];

export default function Testimonials() {
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [videoIndex, setVideoIndex] = useState(0);
const [reviewIndex, setReviewIndex] = useState(0);
    const [videoRef, videoApi] = useEmblaCarousel({
  loop: true,
  align: "start",
});

const [reviewRef, reviewApi] = useEmblaCarousel({
  loop: true,
  align: "start",
});

useEffect(() => {
  if (!videoApi) return;

  const onSelect = () => {
    setVideoIndex(videoApi.selectedScrollSnap());
  };

  onSelect();
  videoApi.on("select", onSelect);

  return () => {
    videoApi.off("select", onSelect);
  };
}, [videoApi]);

useEffect(() => {
  if (!reviewApi) return;

  const onSelect = () => {
    setReviewIndex(reviewApi.selectedScrollSnap());
  };

  onSelect();
  reviewApi.on("select", onSelect);

  return () => {
    reviewApi.off("select", onSelect);
  };
}, [reviewApi]);

  return (
    <section className="py-20">

      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}

        <div className="mx-auto max-w-3xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">
            SUCCESS STORIES
          </p>

          <h2 className="mt-5 text-4xl md:text-6xl font-black text-white">
            Trusted by Students.
            <br />
            Built for Institutes.
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Real students. Real experiences. See how Auctor RC is helping
            learners become stronger readers every single day.
          </p>

        </div>

        {/* VIDEO TESTIMONIALS */}

     <div
  className="mt-20 overflow-hidden touch-pan-y"
  ref={videoRef}
>
  <div className="flex">

          {videos.map((video) => (

           <div
  key={video.name}
  className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-3"
>

<div className="group overflow-hidden rounded-3xl border border-white/10 bg-[#101828]">
              <div className="relative">

                <img
                  src={video.thumbnail}
                  alt={video.name}
                  className="aspect-video w-full object-contain bg-black"
                />

              <button
  onClick={() => setSelectedVideo(video.video)}
  className="absolute inset-0 flex items-center justify-center"
>

                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 transition duration-300 group-hover:scale-110">

                    <Play
                      className="ml-1 text-white"
                      size={36}
                      fill="white"
                    />

                  </div>

                </button>

              </div>

              <div className="p-6">

                <h3 className="text-xl font-bold text-white">
                  {video.title}
                </h3>

                <p className="mt-2 text-slate-400">
                  {video.name}
                </p>

              </div>

            </div>
            </div>

          ))}

        </div>
        </div>
        <div className="mt-6 flex justify-center gap-2">
  {videos.map((_, index) => (
    <button
      key={index}
      onClick={() => videoApi?.scrollTo(index)}
      className={`h-2.5 rounded-full transition-all ${
        videoIndex === index
          ? "w-6 bg-orange-500"
          : "w-2.5 bg-white/20"
      }`}
    />
  ))}
</div>
        

        {/* WRITTEN TESTIMONIALS */}

        <div className="mt-24">

          <h3 className="mb-10 text-center text-3xl font-bold text-white">
            What Students Say
          </h3>

          <div className="overflow-hidden mt-10 touch-pan-y" ref={reviewRef}>
  <div className="flex">

            {reviews.map((review) => (

              <div
  key={review.name}
 className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-3"
>

<div className="rounded-3xl border border-white/10 bg-[#101828] p-8 h-full">

                <div className="flex gap-1">

                  {[...Array(5)].map((_, i) => (

                    <Star
                      key={i}
                      size={18}
                      fill="#f59e0b"
                      className="text-yellow-400"
                    />

                  

                  ))}

                </div>

                <p className="mt-6 leading-8 text-slate-300">
                  "{review.text}"
                </p>

                <div className="mt-8 flex items-center gap-4">

                  <img
                    src={review.photo}
                    alt={review.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />

                  <div>

                    <p className="font-semibold text-white">
                      {review.name}
                    </p>

                  </div>

                </div>

              </div>
              </div>

            ))}
            </div>

          </div>

          <div className="mt-6 flex justify-center gap-2">
  {reviews.map((_, index) => (
    <button
      key={index}
      onClick={() => reviewApi?.scrollTo(index)}
      className={`h-2.5 w-2.5 rounded-full transition-all ${
        reviewIndex === index
          ? "bg-orange-500 w-6"
          : "bg-white/20"
      }`}
    />
  ))}
</div>

        </div>

      </div>
      {selectedVideo && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
    onClick={() => setSelectedVideo(null)}
  >
    <div
  className="relative w-full max-w-sm md:max-w-md lg:max-w-lg"
  onClick={(e) => e.stopPropagation()}
>
      <button
        onClick={() => setSelectedVideo(null)}
        className="absolute -top-12 right-0 rounded-full bg-white/10 p-2 hover:bg-white/20"
      >
        <X className="text-white" size={24} />
      </button>

     <video
  src={selectedVideo}
  controls
  autoPlay
  playsInline
  className="w-full max-h-[80vh] rounded-3xl object-contain shadow-2xl"
/>
    </div>
  </div>
)}

    </section>
  );
}