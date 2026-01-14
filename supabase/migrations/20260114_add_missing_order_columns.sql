-- Add missing columns to 'orders' table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS valid_until DATE,
ADD COLUMN IF NOT EXISTS shipping_fee NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS invoice_fee NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS invoice_discount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS order_text TEXT,
ADD COLUMN IF NOT EXISTS print_template TEXT,
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'Swedish',
ADD COLUMN IF NOT EXISTS distribution_method TEXT;

-- Add missing columns to 'order_items' table (if they don't exist)
ALTER TABLE order_items
ADD COLUMN IF NOT EXISTS account_number TEXT,
ADD COLUMN IF NOT EXISTS tg_percent NUMERIC DEFAULT 0;

-- Refresh schema cache (optional, but good practice if running in SQL editor)
NOTIFY pgrst, 'reload config';
