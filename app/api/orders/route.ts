import { NextResponse } from "next/server";
import { db } from "@/lib/db";
export async function POST(req:Request) {
  try {
    const body=await req.json();
    const table=String(body.table||"");
    const items=Array.isArray(body.items)?body.items:[];
    if(!/^0?[1-3]$/.test(table) || !items.length) return NextResponse.json({error:"Invalid table or empty order."},{status:400});
    const client=db();
    const ids=items.map((x:any)=>String(x.product_id));
    const {data:products,error}=await client.from("products").select("id,name_en,price,active").in("id",ids);
    if(error) throw error;
    if(!products || products.length!==new Set(ids).size) return NextResponse.json({error:"One or more products are unavailable."},{status:400});
    let total=0;
    const lines=items.map((x:any)=>{
      const p=products.find((z:any)=>z.id===x.product_id);
      const qty=Math.max(1,Math.min(20,Number(x.quantity)||1));
      if(!p || !p.active) throw new Error("Unavailable product");
      const unit=Number(p.price);
      total+=unit*qty;
      return {product_id:p.id,product_name:p.name_en,quantity:qty,unit_price:unit,options:x.options||{}};
    });
    const {data:order,error:oe}=await client.from("orders").insert({
      table_number:Number(table),total_amount:Number(total.toFixed(2)),payment_method:"cash_at_counter",
      payment_status:"unpaid",status:"new",customer_note:String(body.note||"").slice(0,300),language:["en","ar","zh"].includes(body.language)?body.language:"en"
    }).select().single();
    if(oe) throw oe;
    const {error:ie}=await client.from("order_items").insert(lines.map(x:any)=>({...x,order_id:order.id})));
    if(ie) throw ie;
    return NextResponse.json({id:order.id,total:order.total_amount,table:order.table_number});
  } catch(e:any) { return NextResponse.json({error:e.message||"Could not place order."},{status:500}); }
}
