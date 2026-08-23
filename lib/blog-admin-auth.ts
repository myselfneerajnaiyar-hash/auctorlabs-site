import "server-only";
import { createClient, type User } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const COOKIE = "auctor_blog_session";
const MAX_AGE = 60 * 60 * 24 * 7;
export type BlogAdminRole = "owner" | "editor";
export type BlogAdmin = { id:string; userId:string; email:string; name:string; role:BlogAdminRole };

function config(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL,anonKey=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;if(!url||!anonKey)throw new Error("Supabase Auth is not configured for Blog Studio.");return{url,anonKey};}
function authClient(accessToken?:string){const{url,anonKey}=config();return createClient(url,anonKey,{auth:{autoRefreshToken:false,persistSession:false},global:accessToken?{headers:{Authorization:`Bearer ${accessToken}`}}:undefined});}
async function authorizedAdmin(user:User,accessToken:string):Promise<BlogAdmin|null>{const client=authClient(accessToken),{data,error}=await client.from("blog_admins").select("id,user_id,email,name,role,active").eq("user_id",user.id).eq("active",true).maybeSingle();if(error||!data)return null;return{id:String(data.id),userId:String(data.user_id),email:String(data.email||user.email||""),name:String(data.name||user.email||"Admin"),role:data.role as BlogAdminRole};}
export async function signInBlogAdmin(email:string,password:string){const client=authClient(),{data,error}=await client.auth.signInWithPassword({email,password});if(error||!data.session||!data.user)throw new Error("Invalid email or password.");const admin=await authorizedAdmin(data.user,data.session.access_token);if(!admin)throw new Error("This account is not authorized for Blog Studio.");return{admin,accessToken:data.session.access_token,expiresIn:data.session.expires_in||MAX_AGE};}
export async function getBlogAdmin():Promise<BlogAdmin|null>{const token=(await cookies()).get(COOKIE)?.value;if(!token)return null;const client=authClient(token),{data,error}=await client.auth.getUser(token);if(error||!data.user)return null;return authorizedAdmin(data.user,token);}
export async function isBlogAdmin(){return Boolean(await getBlogAdmin());}
export function setAdminSession(response:{cookies:{set:(name:string,value:string,options:Record<string,unknown>)=>void}},token:string,maxAge=MAX_AGE){response.cookies.set(COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:Math.min(maxAge,MAX_AGE)});}
export function clearAdminSession(response:{cookies:{set:(name:string,value:string,options:Record<string,unknown>)=>void}}){response.cookies.set(COOKIE,"",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:0});}
