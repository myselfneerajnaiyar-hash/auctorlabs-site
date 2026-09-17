import dotenv from "dotenv";

dotenv.config({path:".env.local",quiet:true});

const endpoint="https://api.dataforseo.com/v3/appendix/user_data";
const login=process.env.DATAFORSEO_LOGIN||"";
const password=process.env.DATAFORSEO_PASSWORD||"";
const present=Boolean(login&&password);
let httpStatus=null,statusCode=null,statusMessage=null;

if(present){
 try{
  const authorization=`Basic ${Buffer.from(`${login}:${password}`).toString("base64")}`;
  const response=await fetch(endpoint,{method:"GET",headers:{Authorization:authorization,Accept:"application/json"},signal:AbortSignal.timeout(15000)});
  httpStatus=response.status;
  let body=null;try{body=await response.json();}catch{}
  statusCode=body?.status_code??body?.tasks?.[0]?.status_code??null;
  statusMessage=body?.status_message??body?.tasks?.[0]?.status_message??(response.statusText||null);
 }catch(error){statusMessage=error instanceof Error?error.message:String(error);}
}

console.log(JSON.stringify({credentialsPresent:present?"YES":"NO",loginLength:login.length,passwordLength:password.length,endpointUrl:endpoint,httpStatus,dataForSeoStatusCode:statusCode,dataForSeoStatusMessage:statusMessage},null,2));
if(!present||httpStatus!==200||Number(statusCode)!==20000)process.exitCode=1;
