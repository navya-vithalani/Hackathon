-- seed.sql — Demo data for hackathon presentation.
-- Run after migrations: supabase db seed
-- Creates realistic events, registrations, and screening results.
-- NOTE: Auth users must be created manually or via Supabase Auth API before seeding profiles.
--       UUIDs below are fixed so this file is idempotent when re-run against a reset DB.

-- ============================================================
-- Institutions
-- ============================================================
insert into institutions (id, name, address, place_id, provider, verified) values
  (
    'a1000000-0000-0000-0000-000000000001',
    'Delhi Public School, R.K. Puram',
    'Sector 8, R.K. Puram, New Delhi, Delhi 110022, India',
    'ChIJN1t_tDeuEmsRUsoyG83frY4_dps',
    'google',
    true
  ),
  (
    'a1000000-0000-0000-0000-000000000002',
    'IIT Delhi',
    'Hauz Khas, New Delhi, Delhi 110016, India',
    'ChIJLVV8y7PjDDkRmW5yT7DtUTA_iitd',
    'google',
    true
  )
on conflict (place_id) do nothing;

-- ============================================================
-- Profiles
-- NOTE: These rows mirror auth.users rows that must be created
--       before seeding. UUIDs here match the auth.users IDs.
-- ============================================================
insert into profiles (id, full_name, account_type, institution_id, grade, stream, designation) values
  -- student1: Arjun Sharma, Class 11, Science, DPS RK Puram
  (
    'b1000000-0000-0000-0000-000000000001',
    'Arjun Sharma',
    'student',
    'a1000000-0000-0000-0000-000000000001',
    'Class 11',
    'Science',
    null
  ),
  -- student2: Priya Nair, Class 12, Commerce, DPS RK Puram
  (
    'b1000000-0000-0000-0000-000000000002',
    'Priya Nair',
    'student',
    'a1000000-0000-0000-0000-000000000001',
    'Class 12',
    'Commerce',
    null
  ),
  -- organizer1: Rahul Verma, B.Tech 3rd year, IIT Delhi
  (
    'b1000000-0000-0000-0000-000000000003',
    'Rahul Verma',
    'student',
    'a1000000-0000-0000-0000-000000000002',
    'B.Tech Year 3',
    'Computer Science',
    null
  ),
  -- staff1: Ms. Kavitha Rao, Teacher, DPS RK Puram
  (
    'b1000000-0000-0000-0000-000000000004',
    'Kavitha Rao',
    'staff',
    'a1000000-0000-0000-0000-000000000001',
    null,
    null,
    'Computer Science Teacher'
  )
on conflict (id) do nothing;

-- ============================================================
-- Events
-- ============================================================
insert into events (
  id, slug, owner_id, title, description_structured,
  type, mode, venue, starts_at, ends_at,
  cost_amount, registration_mode, screening_criteria,
  eligibility, capacity, status
) values
  -- 1. Published Hackathon with screened registration (the core demo-loop event)
  (
    'c1000000-0000-0000-0000-000000000001',
    'iit-delhi-hackathon-2026',
    'b1000000-0000-0000-0000-000000000003',
    'IIT Delhi Hackathon 2026',
    '{
      "summary": "A 24-hour hackathon open to school and college students across Delhi NCR. Build something that solves a real problem.",
      "schedule": [
        {"time": "09:00", "activity": "Registration & Breakfast"},
        {"time": "10:00", "activity": "Opening ceremony & problem statements"},
        {"time": "10:30", "activity": "Hacking begins"},
        {"time": "10:30 (next day)", "activity": "Submission deadline"},
        {"time": "11:00 (next day)", "activity": "Presentations & judging"},
        {"time": "14:00 (next day)", "activity": "Prize ceremony"}
      ],
      "rules": [
        "Teams of 2-4 people",
        "All code must be written during the event",
        "Open-source libraries and APIs are allowed",
        "AI tools are permitted but must be declared",
        "No pre-built projects"
      ],
      "prizes": [
        {"position": "1st", "award": "₹50,000 + internship opportunity"},
        {"position": "2nd", "award": "₹25,000"},
        {"position": "3rd", "award": "₹10,000"},
        {"position": "Best School Team", "award": "₹10,000"}
      ],
      "faqs": [
        {"q": "Can I participate alone?", "a": "No, minimum team size is 2."},
        {"q": "Is food provided?", "a": "Yes, all meals and snacks are covered."},
        {"q": "What should I bring?", "a": "Laptop, charger, and any hardware you need. Wi-Fi is provided."}
      ],
      "contacts": [
        {"name": "Rahul Verma", "role": "Organizer", "email": "rahul@example.com"}
      ],
      "open_questions": []
    }'::jsonb,
    'hackathon',
    'offline',
    'IIT Delhi Main Auditorium, Hauz Khas',
    '2026-12-05 09:00:00+05:30',
    '2026-12-06 15:00:00+05:30',
    0,
    'screened',
    '{
      "what_we_look_for": "Curiosity, problem-solving mindset, ability to learn quickly under pressure, teamwork",
      "num_questions": 5,
      "tone": "friendly but challenging",
      "focus_areas": ["past projects", "motivation", "technical thinking", "teamwork"]
    }'::jsonb,
    '{"type": "open"}'::jsonb,
    200,
    'published'
  ),
  -- 2. Published MUN with direct registration
  (
    'c1000000-0000-0000-0000-000000000002',
    'dps-mun-2026',
    'b1000000-0000-0000-0000-000000000004',
    'DPS Model United Nations 2026',
    '{
      "summary": "The annual Model United Nations conference hosted by Delhi Public School RK Puram. Debate global issues across 6 committees.",
      "schedule": [
        {"time": "Day 1, 09:00", "activity": "Inauguration & committee orientation"},
        {"time": "Day 1, 10:30", "activity": "Committee sessions begin"},
        {"time": "Day 2, 18:00", "activity": "Closing ceremony & award distribution"}
      ],
      "rules": [
        "Formal dress code mandatory",
        "Delegates must submit position papers 48 hours before the conference",
        "English is the official language of debate",
        "Phones permitted only during breaks"
      ],
      "prizes": [
        {"position": "Best Delegate", "award": "Trophy + Certificate"},
        {"position": "High Commendation", "award": "Certificate"},
        {"position": "Verbal Mention", "award": "Certificate"}
      ],
      "faqs": [
        {"q": "Is this open to other schools?", "a": "Yes, students from any school are welcome."},
        {"q": "Do I need prior MUN experience?", "a": "No, beginners are welcome. A preparation guide will be shared."}
      ],
      "contacts": [
        {"name": "Kavitha Rao", "role": "Faculty Advisor", "email": "kavitha@example.com"}
      ],
      "open_questions": []
    }'::jsonb,
    'mun',
    'offline',
    'DPS RK Puram, New Delhi',
    '2026-11-15 09:00:00+05:30',
    '2026-11-16 18:00:00+05:30',
    500.00,
    'direct',
    null,
    '{"type": "open"}'::jsonb,
    150,
    'published'
  ),
  -- 3. Draft workshop (not visible to general users)
  (
    'c1000000-0000-0000-0000-000000000003',
    'web-dev-workshop-dps-nov',
    'b1000000-0000-0000-0000-000000000004',
    'Intro to Web Development Workshop',
    '{
      "summary": "A hands-on one-day workshop covering HTML, CSS, and JavaScript basics. Students will build and deploy a personal portfolio site.",
      "schedule": [
        {"time": "10:00", "activity": "HTML fundamentals"},
        {"time": "12:00", "activity": "Lunch break"},
        {"time": "13:00", "activity": "CSS and Tailwind"},
        {"time": "15:00", "activity": "JavaScript basics"},
        {"time": "16:30", "activity": "Deploy your site on Vercel"}
      ],
      "rules": ["Bring your own laptop", "VS Code pre-installed recommended"],
      "prizes": [],
      "faqs": [],
      "contacts": [],
      "open_questions": ["What is the maximum number of participants?", "Will we provide lunch?"]
    }'::jsonb,
    'workshop',
    'offline',
    'DPS RK Puram, Computer Lab 2',
    '2026-11-28 10:00:00+05:30',
    '2026-11-28 17:00:00+05:30',
    0,
    'direct',
    null,
    '{"type": "institution", "institution_id": "a1000000-0000-0000-0000-000000000001"}'::jsonb,
    30,
    'draft'
  )
on conflict (slug) do nothing;

-- ============================================================
-- event_members: Rahul is owner of hackathon (already set via owner_id)
-- Add staff1 as organizer of the MUN
-- ============================================================
insert into event_members (event_id, profile_id, role) values
  (
    'c1000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000004',
    'organizer'
  )
on conflict (event_id, profile_id) do nothing;

-- ============================================================
-- form_fields for the hackathon
-- ============================================================
insert into form_fields (id, event_id, label, type, options, required, position) values
  (
    'd1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'Tell us about a project you have built (describe the problem, your solution, and what you learned)',
    'long_text',
    null,
    true,
    0
  ),
  (
    'd1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000001',
    'What technologies are you comfortable with?',
    'short_text',
    null,
    true,
    1
  ),
  (
    'd1000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000001',
    'Do you already have a team?',
    'dropdown',
    '["Yes, full team of 4", "Yes, partial team", "No, looking for teammates", "Will decide later"]'::jsonb,
    true,
    2
  )
on conflict (id) do nothing;

-- ============================================================
-- Registrations for the hackathon (both submitted, pending screening)
-- ============================================================
insert into registrations (
  id, event_id, profile_id, answers, payment_status, status
) values
  (
    'e1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',  -- Arjun Sharma
    '{
      "d1000000-0000-0000-0000-000000000001": "I built a flood-prediction web app for my geography project. I scraped 10 years of IMD rainfall data, trained a simple regression model in Python, and built a dashboard with Chart.js. I learnt a lot about data cleaning and that real-world data is always messier than tutorials suggest.",
      "d1000000-0000-0000-0000-000000000002": "Python, JavaScript, HTML/CSS, a bit of React",
      "d1000000-0000-0000-0000-000000000003": "No, looking for teammates"
    }'::jsonb,
    null,
    'submitted'
  ),
  (
    'e1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000002',  -- Priya Nair
    '{
      "d1000000-0000-0000-0000-000000000001": "I made a budgeting app for students called PocketWise. It lets you log daily expenses and shows a monthly breakdown. Built it with React and localStorage because I did not know about databases then. Learnt that UX matters more than features — my classmates actually used it once I made it simpler.",
      "d1000000-0000-0000-0000-000000000002": "React, basic JavaScript, Figma for design",
      "d1000000-0000-0000-0000-000000000003": "Yes, partial team"
    }'::jsonb,
    null,
    'submitted'
  )
on conflict (event_id, profile_id) do nothing;

-- ============================================================
-- Screening result for Arjun (score 82 — strong candidate)
-- ============================================================
insert into screenings (
  id, registration_id, transcript, score, strengths, concerns, summary, recommendation
) values
  (
    'f1000000-0000-0000-0000-000000000001',
    'e1000000-0000-0000-0000-000000000001',
    '[
      {
        "role": "interviewer",
        "text": "Hi Arjun! Thanks for applying. To start, can you walk me through the flood-prediction project you mentioned? What was the hardest technical challenge you hit?"
      },
      {
        "role": "applicant",
        "text": "The hardest part was the data. IMD publishes PDFs, not CSVs. I had to write a Python script using pdfplumber to extract the tables, then deal with missing years and inconsistent column names. It took me two weekends just to get clean data before I could even think about the model."
      },
      {
        "role": "interviewer",
        "text": "That sounds frustrating but also a really valuable lesson. If you could restart that project today, what would you do differently?"
      },
      {
        "role": "applicant",
        "text": "I would look for an existing dataset or API first before scraping. And I would version my data files from day one — I accidentally overwrote a cleaned CSV once and had to redo two hours of work."
      },
      {
        "role": "interviewer",
        "text": "Good instincts. At a hackathon you have 24 hours. How do you decide what to build when there are too many ideas in your team?"
      },
      {
        "role": "applicant",
        "text": "I would probably write all the ideas on a whiteboard, then quickly score each one on: can we actually build it in 24 hours, does it solve a real problem, and do we have the skills. Kill anything that fails on the first question. Then pick the one with the highest combined score. I have not done this in a team before, but that is how I would approach it."
      },
      {
        "role": "interviewer",
        "text": "You mentioned you are looking for teammates. What role do you see yourself playing in a team?"
      },
      {
        "role": "applicant",
        "text": "Probably backend and data — that is where I am strongest. But I am happy to do frontend if needed. I am a fast learner and I do not mind picking up new things under pressure."
      },
      {
        "role": "interviewer",
        "text": "Last question: what is a technology or concept you have been curious about lately but have not had time to explore yet?"
      },
      {
        "role": "applicant",
        "text": "WebSockets. I want to build something real-time — like a live dashboard or a collaborative tool. I understand the concept but have never actually implemented it."
      },
      {
        "role": "interviewer",
        "text": "Great answer! That wraps up our interview. Good luck with your application!"
      }
    ]'::jsonb,
    82,
    ARRAY[
      'Strong independent project experience with real data challenges',
      'Reflective learner — articulates specific lessons from mistakes',
      'Pragmatic decision-making under constraints',
      'Intellectual curiosity and willingness to take on new technologies'
    ],
    ARRAY[
      'Limited team collaboration experience so far',
      'Frontend skills are self-assessed as weaker'
    ],
    'Arjun shows genuine engineering maturity for a Class 11 student. His flood-prediction project demonstrates initiative and the ability to work through messy, real-world problems without hand-holding. His answers are specific and honest — he names concrete mistakes and what he learned from them, rather than giving polished non-answers. His instinct for scoping ideas in a time-constrained environment is sound, even if untested in a team setting. The main uncertainty is teamwork under pressure, but his self-awareness about it is a good sign.',
    'Accept. Strong individual contributor with clear technical direction. Recommend pairing with a candidate who has strong frontend and team-coordination experience.'
  )
on conflict (registration_id) do nothing;

-- ============================================================
-- Broadcast for the hackathon
-- ============================================================
insert into broadcasts (id, event_id, author_id, audience, body) values
  (
    'g1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000003',
    'everyone',
    'Applications are now open for IIT Delhi Hackathon 2026! 🚀 We have 200 spots available. The screening interview takes about 10 minutes. Apply early — we review on a rolling basis and spots fill up fast. See you in December!'
  )
on conflict (id) do nothing;

-- ============================================================
-- Announcement for DPS (from staff1)
-- ============================================================
insert into announcements (id, institution_id, author_id, title, body) values
  (
    'h1000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000004',
    'Registrations Open: DPS MUN 2026',
    'Dear students, registrations for our annual Model United Nations conference are now open on hivai. This year we have 6 committees covering climate, tech governance, and conflict resolution. Seats are limited to 150 delegates. The registration fee is ₹500. Last date to register: 10 November 2026. All the best!'
  )
on conflict (id) do nothing;

-- ============================================================
-- Ideas (anonymous, institution-scoped to DPS)
-- ============================================================
insert into ideas (id, institution_id, author_id, body, status, upvote_count) values
  (
    'i1000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',  -- author stored but never exposed
    'Can we have a dedicated quiet study room in the library that is open until 7 PM on weekdays? The current library closes at 4:30 and a lot of us have long commutes and need somewhere to study before heading home.',
    'under_review',
    14
  ),
  (
    'i1000000-0000-0000-0000-000000000002',
    'a1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000002',  -- author stored but never exposed
    'It would be great to have a lost-and-found WhatsApp group or a board on this platform. I lost my calculator before my Class 12 boards mock and spent a week looking for it. A simple lost and found system would help a lot of people.',
    'new',
    7
  )
on conflict (id) do nothing;
