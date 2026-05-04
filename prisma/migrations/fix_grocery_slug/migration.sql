-- Update category slug from 'grocery' to 'groceries' to match the frontend configuration
UPDATE "Category" SET slug = 'groceries' WHERE slug = 'grocery';
