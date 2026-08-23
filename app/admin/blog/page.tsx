import { redirect } from "next/navigation";
import { isBlogAdmin } from "@/lib/blog-admin-auth";
import BlogStudio from "./studio";
export const dynamic="force-dynamic";
export default async function Page(){if(!await isBlogAdmin())redirect("/admin/blog/login");return <BlogStudio/>;}
