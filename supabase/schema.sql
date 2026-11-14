-- Joy Teahouse QR ordering database. Run this in Supabase SQL Editor.
create extension if not exists pgcrypto;
create table if not exists products (
 id uuid primary key default gen_random_uuid(),
 category text not null check (category in ('drinks','mala','rice','snacks')),
 name_en text not null, name_ar text default '', name_zh text default '',
 price numeric(10,2) not null check (price >= 0),
 emoji text default '🧋', active boolean not null default true,
 created_at timestamptz not null default now()
);
create table if not exists orders (
 id uuid primary key default gen_random_uuid(),
 table_number integer not null check (table_number between 1 and 3),
 total_amount numeric(10,2) not null,
 payment_method text not null default 'cash_at_counter',
 payment_status text not null default 'unpaid' check (payment_status in ('unpaid','paid')),
 status text not null default 'new' check (status in ('new','preparing','ready','served','cancelled')),
 customer_note text default '', language text not null default 'en',
 created_at timestamptz not null default now()
);
create table if not exists order_items (
 id uuid primary key default gen_random_uuid(),
 order_id uuid not null references orders(id) on delete cascade,
 product_id uuid references products(id) on delete set null,
 product_name text not null, quantity integer not null check (quantity between 1 and 20),
 unit_price numeric(10,2) not null, options jsonb not null default '{}'::jsonb
);
create index if not exists orders_created_at_idx on orders(created_at desc);
create index if not exists order_items_order_id_idx on order_items(order_id);
-- API uses the Supabase service-role key on the server only. Do NOT expose it in NEXT_PUBLIC variables.
-- Disable public table access; the Next.js server routes perform validation and use the service role.
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
-- Seed demo menu. Replace prices and products with the actual store menu.
insert into products(category,name_en,name_ar,name_zh,price,emoji) values
('drinks','Classic Pearl Milk Tea','شاي حليب باللؤلؤ','经典珍珠奶茶',3.00,'🧋'),
('drinks','Thai Milk Tea','شاي تايلندي بالحليب','泰式奶茶',3.00,'🥤'),
('drinks','Fruit Tea','شاي بالفواكه','水果茶',3.50,'🍹'),
('drinks','Brown Sugar Milk Tea','شاي الحليب بالسكر البني','黑糖奶茶',3.50,'🧋'),
('mala','Mala Tang','مالا تانغ','麻辣烫',4.50,'🍲'),
('rice','Fried Rice','أرز مقلي','炒饭',3.50,'🍚'),
('rice','Rice Bowl','وجبة أرز','盖饭',4.00,'🍛'),
('snacks','Chicken Bites','قطع دجاج','鸡米花',2.50,'🍗'),
('snacks','Fries','بطاطا مقلية','薯条',1.50,'🍟')
on conflict do nothing;
