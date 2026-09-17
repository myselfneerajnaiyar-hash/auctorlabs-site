import dotenv from "dotenv";

dotenv.config({path:".env.local",quiet:true});

const login=process.env.DATAFORSEO_LOGIN||"";
const password=process.env.DATAFORSEO_PASSWORD||"";
if(!login||!password){console.error("DataForSEO credentials are not present.");process.exit(1);}

const authorization=`Basic ${Buffer.from(`${login}:${password}`).toString("base64")}`;
const requests=[
 {
  endpoint:"https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live",
  payload:[{keywords:["cat preparation"],location_name:"India",language_name:"English"}],
 },
 {
  endpoint:"https://api.dataforseo.com/v3/dataforseo_labs/google/bulk_keyword_difficulty/live",
  payload:[{keywords:["cat preparation"],location_name:"India",language_name:"English"}],
 },
];

function resultError(result){
 if(!result)return null;
 if(typeof result.error_message==="string")return result.error_message;
 if(typeof result.message==="string"&&result.status_code&&Number(result.status_code)!==20000)return result.message;
 if(Array.isArray(result))return result.map(resultError).find(Boolean)||null;
 if(typeof result==="object")return Object.values(result).map(resultError).find(Boolean)||null;
 return null;
}

for(const item of requests){
 let httpStatus=null,body=null,transportError=null;
 try{
  const response=await fetch(item.endpoint,{method:"POST",headers:{Authorization:authorization,"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(item.payload),signal:AbortSignal.timeout(30000)});
  httpStatus=response.status;
  try{body=await response.json();}catch{transportError="Response body was not valid JSON.";}
 }catch(error){transportError=error instanceof Error?error.message:String(error);}
 const task=body?.tasks?.[0]||null;
 console.log(JSON.stringify({
  endpoint:item.endpoint,
  httpStatus,
  dataForSeoStatusCode:body?.status_code??null,
  dataForSeoStatusMessage:body?.status_message??null,
  taskStatusCode:task?.status_code??null,
  taskStatusMessage:task?.status_message??null,
  taskOrResultError:transportError||resultError(task?.result)||null,
  cost:task?.cost??body?.cost??null,
 },null,2));
}
