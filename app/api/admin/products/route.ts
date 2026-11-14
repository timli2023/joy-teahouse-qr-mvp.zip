import { NextResponse } from "next/server";
import { db, validAdmin } from "@/lib/db";
export async function GET(req:Request) {
  const pin=new URL(req.url).searchParams.get("pin");
  if(!validAdmin(pin)) return NextResponse.json({error:"Unauthorized"},{status:401});
  const {data,error}=await db().from("products").select("*").order("category").order("name_en");
  if(error) return NextResponse.json({error:error.message},{status:500});
  return NextResponse.json(data);
}
export async function POST(req:Request) {
  try {
    const b=await req.json();
    if(!validAdmin(b.pin)) return NextResponse.json({error:"Unauthorized"},{status:401});
    const record={category:String(b.category),name_en:String(b.name_en),name_ar:String(b.name_ar||""),name_zh:String(b.name_zh||""),price:Number(b.price),emoji:String(b.emoji||"🧋"),active:b.active!==false};
    if(!record.name_en || !Number.isFinite(record.price) || record.price<0) return NextResponse.json({error:"Check product name and price."},{status:400});
    const {data,error}=await db().from("products").insert(record).select().single();
    if(error) throw error;
    return NextResponse.json(data);
  } catch(e:any) { return NextResponse.json({error:e.message},{status:500}); }
}
export async function PATCH(req:Request) {
  try {
    const b=await req.json();
    if(!validAdmin(b.pin)) return NextResponse.json({error:"Unauthorized"},{status:401});
    const {error}=await db().from("products").update({active:!!b.active,price:Number(b.price)}).eq("id",b.id);
    if(error) throw error;
    return NextResponse.json({ok:true});
  } catch(e:any) { return NextResponse.json({error:e.message},{status:500}); }
}