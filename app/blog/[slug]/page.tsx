import fs from "fs";
import path from "path";
import ProgressBar from "../../components/ProgressBar";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import TableOfContents from "../../components/TableOfContents";

type Props = {
  params: {
    slug: string;
  };
};

function extractHeadings(content: string) {
  const regex = /^##\s+(.*)/gm;
  const matches = [...content.matchAll(regex)];

  return matches.map((match, index) => {
  const text = match[1];

  return {
    text,
  id: text.toLowerCase().replace(/\s+/g, "-")
  };
});
}

/* ================= METADATA ================= */

export async function generateMetadata({ params }: any) {
  const resolvedParams = await params;   // 🔥 IMPORTANT
  const slug = resolvedParams.slug;

  const filePath = path.join(
    process.cwd(),
    "content",
    "blog",
    `${slug}.mdx`
  );

  if (!fs.existsSync(filePath)) {
    return {
      title: "Blog",
      description: "Auctor Labs Blog",
    };
  }

  const source = fs.readFileSync(filePath, "utf-8");
  const {content,  data } = matter(source);
  const headings = extractHeadings(content);

  return {
    title: data.title,
    description: data.description,
  };
}
/* ================= PAGE ================= */

export default async function BlogPage({ params }: any) {
  const resolvedParams = await params;   // 🔥 same fix
  const slug = resolvedParams.slug;
  const filePath = path.join(
    process.cwd(),
    "content",
    "blog",
    `${slug}.mdx`
  );

  // DEBUG (remove later if you want)
  console.log("SLUG:", slug);
  console.log("PATH:", filePath);

  if (!fs.existsSync(filePath)) {
    return (
      <div className="bg-[#0B0F1A] text-white min-h-screen flex items-center justify-center">
        <div className="text-xl">Blog not found</div>
      </div>
    );
  }

  const source = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(source);
  const headings = extractHeadings(content);

 return (
  <div className="bg-[#0B0F1A] text-white min-h-screen">

    {/* 🔥 PROGRESS BAR */}
  <ProgressBar />

    <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-12 gap-10">

      {/* 📖 MAIN CONTENT */}
     <div className="col-span-12 lg:col-span-8 max-w-2xl">

        <h1 className="text-5xl font-bold leading-tight mb-6">
          {data.title}
        </h1>

        <p className="text-gray-400 mb-12">
          {data.date} • 5 min read
        </p>


       <article className="prose-custom max-w-none">
         
         <MDXRemote
  source={content}

  components={{
 

h2: (props) => {
  const text = String(props.children);

  const id = text.toLowerCase().replace(/\s+/g, "-");

  return (
    <h2
      id={id}
      className="text-3xl font-bold mt-20 mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
    >
      {props.children}
    </h2>
  );
},

    h3: (props) => (
      <h3 className="text-2xl font-semibold mt-10 mb-4">
        {props.children}
      </h3>
    ),

 img: (props) => (
  <img
    {...props}
    className="my-10 rounded-xl shadow-xl border border-white/10"
  />
),
video: (props) => (
  <video
    {...props}
    controls
    playsInline
    className="my-10 w-full rounded-xl shadow-xl border border-white/10"
  />
),

iframe: (props) => (
  <div className="my-10 w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-xl">
    <iframe
      {...props}
      className="w-full h-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>
),

   p: (props) => (
  <p className="text-gray-300 leading-8 mb-6 text-[17px]">
    {props.children}
  </p>
),

    hr: () => (
  <div className="my-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
),

    ul: (props) => (
      <ul className="pl-6 my-6 border-l border-white/10">
        {props.children}
      </ul>
    ),

    li: (props) => (
      <li className="mb-2 text-gray-300">
        {props.children}
      </li>
    ),
blockquote: (props) => (
  <div className="my-10 p-6 rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 backdrop-blur text-lg leading-relaxed text-white">
    {props.children}
  </div>
),
  }}
/>
        </article>

        {/* CTA */}
        <div className="mt-16 p-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-center">
          <h3 className="text-2xl font-semibold mb-2">
            Stop solving. Start improving.
          </h3>
          <p className="text-white/80 mb-4">
            Train how you read, think and eliminate options.
          </p>
          <a
            href="https://rc.auctorlabs.in"
            className="inline-block bg-orange-500 px-6 py-3 rounded-lg font-semibold"
          >
            Try Auctor RC →
          </a>
        </div>

      </div>

      {/* 📌 SIDEBAR (DYNAMIC) */}
<div className="hidden lg:block col-span-4">
 <div className="sticky top-24 bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-md shadow-[0_0_30px_rgba(255,165,0,0.08)]">
    
    <p className="text-sm text-gray-400 mb-4">ON THIS PAGE</p>

   <TableOfContents headings={headings} />

  </div>
</div>

    </div>
  </div>
);
}