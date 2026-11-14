import { NextResponse } from "next/server";
import { db } from "@/lib/db";
export async function GET() {
  try {
    const {data,error}=await db().from("products").select("*").eq("active",true).order("category").order("name_en");
    if(error) throw error;
    return NextResponse.json(data);
  } catch(e:any) { return NextResponse.json({error:e.message},{status:500}); }
}