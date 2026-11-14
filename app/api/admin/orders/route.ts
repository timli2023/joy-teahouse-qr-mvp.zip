import { NextResponse } from "next/server";
import { db, validAdmin } from "@/lib/db";
export async function GET(req:Request) {
  const pin=new URL(req.url).searchParams.get("pin");
  if(!validAdmin(pin)) return NextResponse.json({error:"Unauthorized"},{status:401});
  try {
    const {data,error}=await db().from("orders").select("*,order_items(*)").order("created_at",{ascending:false}).limit(100);
    if(error) throw error;
    return NextResponse.json(data);
  } catch(e:any) { return NextResponse.json({error:e.message},{status:500}); }
}
export async function PATCH(req:Request) {
  try {
    const body=await req.json();
    if(!validAdmin(body.pin)) return NextResponse.json({error:"Unauthorized"},{status:401});
    const allowed=["new","preparing","ready","served","cancelled"];
    if(!allowed.includes(body.status)) return NextResponse.json({error:"Invalid status"},{status:400});
    const patch:any={status:body.status};
    if(body.payment_status==="paid" || body.payment_status==="unpaid") patch.payment_status=body.payment_status;
    const {error}=await db().from("orders").update(patch).eq("id",body.id);
    if(error) throw error;
    return NextResponse.json({ok:true});
  } catch(e:any) { return NextResponse.json({error:e.message},{status:500}); }
}