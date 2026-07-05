"use client";

import {
  Trophy,
  Flame,
  Medal,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const leaders = [
  {
    rank: "🥇",
    name: "Brijmohan",
    streak: "8 day streak",
    points: "3666",
  },
  {
    rank: "🥈",
    name: "Mudavathbantu",
    streak: "6 day streak",
    points: "2486",
  },
  {
    rank: "🥉",
    name: "Karantilakrana",
    streak: "5 day streak",
    points: "1396",
  },
  {
    rank: "#4",
    name: "Ankitha M",
    streak: "3 day streak",
    points: "1086",
  },
];

export default function DailyEngagementMockup() {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#13203a] to-[#0b1220] p-4 shadow-2xl">

      {/* Header */}

      <div className="flex items-center gap-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/15">

          <Trophy className="h-7 w-7 text-orange-400" />

        </div>

        <div>

          <h4 className="text-xl font-bold text-white">
            Daily Engagement
          </h4>

          <p className="text-sm text-slate-400">
            Students practise every single day.
          </p>

        </div>

      </div>

      {/* Leaderboard */}

      <div className="mt-8 rounded-2xl border border-white/10 bg-[#18243d] overflow-hidden">

        <div className="border-b border-white/10 px-5 py-4">

          <p className="font-semibold text-white">
            Daily RC Championship
          </p>

        </div>

        {leaders.map((user) => (

          <div
            key={user.name}
            className="flex items-center justify-between border-b border-white/5 px-5 py-4 last:border-0"
          >

            <div className="flex items-center gap-4">

              <div className="text-lg font-bold text-white">

                {user.rank}

              </div>

              <div>

                <p className="font-medium text-white">

                  {user.name}

                </p>

                <div className="mt-1 flex items-center gap-1 text-xs text-orange-400">

                  <Flame size={12} />

                  {user.streak}

                </div>

              </div>

            </div>

            <div className="font-bold text-cyan-400">

              {user.points}

            </div>

          </div>

        ))}

      </div>

      {/* Bottom Stats */}

      <div className="mt-6 grid grid-cols-2 gap-4">

        <div className="rounded-2xl bg-[#18243d] p-4">

          <div className="flex items-center gap-2">

            <Flame className="h-5 w-5 text-orange-400" />

            <span className="text-sm text-slate-300">

              Current Streak

            </span>

          </div>

          <p className="mt-3 text-4xl font-black text-orange-400">

            12

          </p>

          <p className="text-sm text-slate-400">

            Days

          </p>

        </div>

        <div className="rounded-2xl bg-[#18243d] p-4">

          <div className="flex items-center gap-2">

            <Medal className="h-5 w-5 text-yellow-400" />

            <span className="text-sm text-slate-300">

              Rank

            </span>

          </div>

          <p className="mt-3 text-4xl font-black text-cyan-400">

            #28

          </p>

          <p className="text-sm text-slate-400">

            This Month

          </p>

        </div>

      </div>

     

      {/* CTA */}

      <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 font-semibold text-white transition hover:bg-orange-600">

        Continue Today's Workout

        <ArrowRight className="h-5 w-5" />

      </button>

    </div>
  );
}