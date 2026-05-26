ALTER TABLE "Product" ALTER COLUMN "currency" SET DEFAULT 'XAF';
ALTER TABLE "Order" ALTER COLUMN "currency" SET DEFAULT 'XAF';

UPDATE "Product" SET "currency" = 'XAF' WHERE "currency" = 'USD';
UPDATE "Order" SET "currency" = 'XAF' WHERE "currency" = 'USD';
