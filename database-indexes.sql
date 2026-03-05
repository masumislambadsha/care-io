-- Performance Optimization: Database Indexes
-- Run these SQL commands in your Supabase SQL Editor to improve query performance

-- Bookings table indexes
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_caregiver_id ON bookings(caregiver_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_start_date ON bookings(start_date);
CREATE INDEX IF NOT EXISTS idx_bookings_caregiver_status ON bookings(caregiver_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_client_status ON bookings(client_id, status);

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_role_status ON users(role, status);

-- Caregiver profiles indexes
CREATE INDEX IF NOT EXISTS idx_caregiver_profiles_user_id ON caregiver_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_caregiver_profiles_verification ON caregiver_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_caregiver_profiles_rating ON caregiver_profiles(avg_rating DESC);

-- Services table indexes
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);

-- Notifications table indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read);

-- Reviews table indexes (if exists)
CREATE INDEX IF NOT EXISTS idx_reviews_caregiver_id ON reviews(caregiver_id);
CREATE INDEX IF NOT EXISTS idx_reviews_client_id ON reviews(client_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Addresses table indexes (if exists)
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_bookings_caregiver_payment ON bookings(caregiver_id, payment_status, status);
CREATE INDEX IF NOT EXISTS idx_bookings_client_created ON bookings(client_id, created_at DESC);

-- Analyze tables to update statistics
ANALYZE bookings;
ANALYZE users;
ANALYZE caregiver_profiles;
ANALYZE services;
ANALYZE notifications;
