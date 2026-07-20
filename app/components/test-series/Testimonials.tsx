"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Play, Star, ArrowRight, Quote, X } from "lucide-react";
import { motion } from "framer-motion";

const videos = [
  {
    name: "Ishaan Chandrakar",
    title: "From Struggling With RCs To Reading With Confidence",
    thumbnail: "/testimonials/video1.jpeg",
    video: "/testimonials/video1.mp4",
  },
  {
    name: "Bhoomi Saluja",
    title: "How Auctor Changed The Way I Read",
    thumbnail: "/testimonials/video2.jpeg",
    video: "/testimonials/video2.mp4",
  },
  {
    name: "Rushill",
    title: "Finally Understood Why I Was Losing Marks",
    thumbnail: "/testimonials/video3.jpeg",
    video: "/testimonials/video3.mp4",
  },
];

const reviews = [
  {
    initials: "KS",
    name: "Keshu Sharma",
    role: "CAT Aspirant",
    text: "The AI analysis didn't just tell me which option was correct. It showed me why I was thinking incorrectly. That's something no mock platform had ever done before.",
  },
  {
    initials: "PK",
    name: "Pushti Kapoor",
    role: "CAT Aspirant",
    text: "For the first time I wasn't simply solving RCs. I actually understood my reading behaviour and could see exactly where I was losing marks.",
  },
  {
    initials: "NB",
    name: "Nabeel",
    role: "Working Professional",
    text: "The Mentor Verdict felt like having a personal mentor after every mock. Every report gave me a clear plan for the next attempt.",
  },
  {
    initials: "IC",
    name: "Ishaan Chandrakar",
    role: "CAT Aspirant",
    text: "The Cognitive Diagnosis was surprisingly accurate. It highlighted habits I didn't even realise I had while attempting RCs.",
  },
];

export default function Testimonials() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const [videoIndex, setVideoIndex] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);

  const [videoRef, videoApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  });

  const [reviewRef, reviewApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

 useEffect(() => {
  if (!videoApi) {
    return;
  }

  const onSelect = () => {
    setVideoIndex(videoApi.selectedScrollSnap());
  };

  onSelect();
  videoApi.on("select", onSelect);

  const cleanup = () => {
    videoApi.off("select", onSelect);
  };

  return cleanup;
}, [videoApi]);

 useEffect(() => {
  if (!reviewApi) {
    return;
  }

  const onSelect = () => {
    setReviewIndex(reviewApi.selectedScrollSnap());
  };

  onSelect();
  reviewApi.on("select", onSelect);

  const cleanup = () => {
    reviewApi.off("select", onSelect);
  };

  return cleanup;
}, [reviewApi]);
  return (
    <section className="relative overflow-hidden bg-[#07152D] py-24">

      <div className="absolute left-1/2 top-0 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
          className="mx-auto max-w-4xl text-center"
        >

          <div className="inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">

            Student Experiences

          </div>

          <h2 className="mt-7 text-4xl font-black leading-tight text-white md:text-6xl">

            Loved By Students
            <br />

            <span className="text-orange-400">
              Across The Auctor Platform
            </span>

          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300">

            These are real experiences from students who have used Auctor's AI-powered learning platform. The same AI engine powers every mock inside this Test Series.

          </p>

        </motion.div>

        {/* Featured Video */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
          className="mt-20"
        >

          <div ref={videoRef} className="overflow-hidden">

            <div className="flex">

              {videos.map((video) => (

               <div
  key={video.name}
  className="min-w-0 flex-[0_0_100%] flex justify-center"
>

                 <div className="w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/10 bg-[#0D1E39] shadow-[0_20px_70px_rgba(0,0,0,.45)]">

                    <div className="relative">

                      <img
                        src={video.thumbnail}
                        alt={video.name}
                        className="aspect-video w-full object-cover"
                      />

                      <button
                        onClick={() => setSelectedVideo(video.video)}
                        className="absolute inset-0 flex items-center justify-center"
                      >

                        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/20 backdrop-blur-xl transition duration-300 hover:scale-110">

                          <Play
                            size={30}
                            fill="white"
                            className="ml-1 text-white"
                          />

                        </div>

                      </button>

                    </div>

                    <div className="p-8 text-center">

                      <h3 className="text-3xl font-black text-white">

                        {video.title}

                      </h3>

                      <p className="mt-3 text-lg text-slate-400">

                        {video.name}

                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

          <div className="mt-6 flex justify-center gap-3">

            {videos.map((_, index) => (

              <button
                key={index}
                onClick={() => videoApi?.scrollTo(index)}
                className={`h-2.5 rounded-full transition-all ${
                  videoIndex === index
                    ? "w-8 bg-orange-500"
                    : "w-2.5 bg-white/20"
                }`}
              />

            ))}

          </div>

        </motion.div>

        {/* Reviews */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: .1 }}
          className="mt-24"
        >

          <h3 className="text-center text-3xl font-black text-white md:text-4xl">

            More Student Experiences

          </h3>

          <div
            ref={reviewRef}
            className="mt-12 overflow-hidden"
          >

            <div className="flex">

              {reviews.map((review) => (

                <div
                  key={review.name}
                  className="min-w-0 flex-[0_0_100%] px-3 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
                >

                  <div className="flex h-full flex-col rounded-[30px] border border-white/10 bg-[#0D1E39] p-8">

                    <Quote
                      size={36}
                      className="text-orange-400"
                    />

                    <div className="mt-5 flex gap-1">

                      {[...Array(5)].map((_, i) => (

                        <Star
                          key={i}
                          size={18}
                          fill="#fb923c"
                          className="text-orange-400"
                        />

                      ))}

                    </div>

                    <p className="mt-6 flex-1 text-lg leading-8 text-slate-300">

                      "{review.text}"

                    </p>

                    <div className="mt-8 flex items-center gap-4">

                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-lg font-bold text-white">

                        {review.initials}

                      </div>

                      <div>

                        <p className="font-bold text-white">

                          {review.name}

                        </p>

                        <p className="text-sm text-slate-400">

                          {review.role}

                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              ))}
            </div>
          </div>
          <div className="mt-6 flex justify-center gap-3">

            {reviews.map((_, index) => (

              <button
                key={index}
                onClick={() => reviewApi?.scrollTo(index)}
                className={`h-2.5 rounded-full transition-all ${
                  reviewIndex === index
                    ? "w-8 bg-orange-500"
                    : "w-2.5 bg-white/20"
                }`}
              />

            ))}

          </div>

        </motion.div>

        {/* Bottom CTA */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: .2 }}
          className="mt-24"
        >

          <div className="rounded-[32px] border border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-[#0D1E39] to-cyan-500/10 p-10 text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-300">

              Join Thousands of Aspirants Who Are Learning Smarter

            </p>

            <h3 className="mt-5 text-3xl font-black leading-tight text-white md:text-5xl">

              Know Why You Lost Marks.
              <br />

              Not Just How Many.

            </h3>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">

              Experience the same AI Mentor Verdict, Cognitive Diagnosis,
              Trap Analysis and Detailed Review after every mock.

            </p>

            <button className="group mt-10 inline-flex items-center gap-3 rounded-2xl bg-orange-500 px-8 py-4 text-lg font-bold text-white transition duration-300 hover:scale-105 hover:bg-orange-400">

              Buy Test Series • ₹799

              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />

            </button>

            <p className="mt-6 text-sm text-slate-400">

              10 AI VARC Mocks • 24 CAT PYQs • Lifetime Access

            </p>

          </div>

        </motion.div>

      </div>

      {/* Video Modal */}

      {selectedVideo && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
          onClick={() => setSelectedVideo(null)}
        >

          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-14 right-0 rounded-full bg-white/10 p-2 transition hover:bg-white/20"
            >

              <X
                size={24}
                className="text-white"
              />

            </button>

            <video
              src={selectedVideo}
              controls
              autoPlay
              playsInline
              className="w-full rounded-[28px] shadow-2xl"
            />

          </div>

        </div>

      )}

    </section>

  );

}