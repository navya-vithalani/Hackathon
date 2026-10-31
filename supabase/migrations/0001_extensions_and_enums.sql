-- 0001_extensions_and_enums.sql
-- Sets up required Postgres extensions and all shared enum types.
-- Run first; all subsequent migrations depend on these types.

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Account types
create type account_type as enum ('student', 'staff');

-- Event enums
create type event_type as enum ('sports', 'hackathon', 'mun', 'cultural', 'workshop', 'other');
create type event_mode as enum ('online', 'offline');
create type event_status as enum ('draft', 'published', 'closed');
create type registration_mode as enum ('direct', 'screened');

-- Roles
create type event_role as enum ('owner', 'organizer', 'volunteer');

-- Registration / payment status
create type registration_status as enum ('submitted', 'accepted', 'rejected', 'waitlisted', 'checked_in');
create type payment_status as enum ('pending', 'paid', 'rejected');

-- Broadcast audience
create type broadcast_audience as enum ('everyone', 'participants', 'volunteers', 'organizing_team', 'selected_people');

-- Institution provider
create type institution_provider as enum ('google', 'osm', 'manual');

-- Idea status
create type idea_status as enum ('new', 'under_review', 'done');
