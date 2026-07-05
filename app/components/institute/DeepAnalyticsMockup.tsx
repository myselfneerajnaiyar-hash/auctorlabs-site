"use client";

import {
  TrendingUp,
  Brain,
  Clock,
  Target,
} from "lucide-react";

export default function DeepAnalyticsMockup() {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#13203a] to-[#0b1220] p-4 shadow-2xl">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h3 className="text-xl font-bold text-white">
            Learning Analytics
          </h3>

          <p className="text-sm text-slate-400">
            AI powered student insights
          </p>

        </div>

        <div className="rounded-xl bg-green-500/10 px-3 py-2 text-green-400 text-sm font-semibold">
          +18%
        </div>

      </div>

      {/* KPI */}

      <div className="mt-6 grid grid-cols-2 gap-4">

        <Card
          icon={<Target className="h-5 w-5 text-orange-400" />}
          title="Accuracy"
          value="84%"
        />

        <Card
          icon={<Clock className="h-5 w-5 text-cyan-400" />}
          title="Reading Speed"
          value="198 WPM"
        />

        <Card
          icon={<Brain className="h-5 w-5 text-purple-400" />}
          title="Reading IQ"
          value="92"
        />

        <Card
          icon={<TrendingUp className="h-5 w-5 text-green-400" />}
          title="Improvement"
          value="+27%"
        />

      </div>

      {/* Fake Chart */}

      <div className="mt-8 rounded-2xl border border-white/10 bg-[#18243d] p-5">

        <p className="text-sm font-medium text-slate-300">
          Progress Over Time
        </p>

        <div className="mt-6 flex h-36 items-end justify-between">

          {[25,40,35,55,60,75,90].map((h)=>(
            <div
              key={h}
              className="w-8 rounded-t-xl bg-gradient-to-t from-orange-500 to-cyan-400"
              style={{height:`${h}%`}}
            />
          ))}

        </div>

      </div>

      {/* AI Insight */}

      <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5">

        <p className="text-sm font-semibold text-cyan-300">
          AI Insight
        </p>

        <p className="mt-2 text-sm leading-7 text-slate-300">
          Students improved reading speed by
          <span className="font-semibold text-white">
            {" "}27%
          </span>{" "}
          after completing
          <span className="font-semibold text-orange-400">
            {" "}12 Daily Workouts
          </span>.
          Inference questions remain the weakest area.
        </p>

      </div>

    </div>
  );
}

function Card({
  icon,
  title,
  value,
}:{
  icon:any;
  title:string;
  value:string;
}){

  return(

    <div className="rounded-xl bg-[#18243d] p-4">

      <div className="flex items-center gap-2">

        {icon}

        <span className="text-xs text-slate-400">
          {title}
        </span>

      </div>

      <p className="mt-3 text-2xl font-bold text-white">
        {value}
      </p>

    </div>

  );
}