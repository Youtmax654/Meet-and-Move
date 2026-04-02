-- ==========================================
-- INSERTION DE FAUSSES DONNEES (SEEDING)
-- ==========================================

-- Création d'intérêts
INSERT INTO interests (id, name) VALUES 
('11111111-1111-1111-1111-111111111111', 'sport'),
('22222222-2222-2222-2222-222222222222', 'voyage'),
('33333333-3333-3333-3333-333333333333', 'food');

-- Création d'utilisateurs
INSERT INTO users (id, username, email, age, gender, role, bio) VALUES 
('aaaa1111-aaaa-1111-aaaa-111111111111', 'Jean Dupont', 'jean@example.com', 28, 'M', 'pro_guide', 'Guide de moyenne montagne passionné.'),
('bbbb2222-bbbb-2222-bbbb-222222222222', 'Alice Dubois', 'alice@example.com', 25, 'F', 'user', 'Amoureuse de la nature et de la bonne bouffe.'),
('cccc3333-cccc-3333-cccc-333333333333', 'Marc Veyrat', 'marc@example.com', 35, 'M', 'user', 'Prêt pour l aventure !'),
('dddd4444-dddd-4444-dddd-444444444444', 'Sophie Martin', 'sophie@example.com', 31, 'F', 'user', 'Voyageuse et photographe passionnée.'),
('eeee5555-eeee-5555-eeee-555555555555', 'Thomas Lefevre', 'thomas@example.com', 26, 'M', 'user', 'Fan de cuisine et de nouvelles expériences.'),
('ffff6666-ffff-6666-ffff-666666666666', 'Marie Rousseau', 'marie@example.com', 29, 'F', 'pro_guide', 'Guide touristique avec 5 ans d''expérience.'),
('77777777-7777-7777-7777-777777777777', 'Lucas Bernard', 'lucas@example.com', 23, 'M', 'user', 'Jeune aventurier en quête de sensations fortes.'),
('88888888-8888-8888-8888-888888888888', 'Isabelle Durand', 'isabelle@example.com', 34, 'F', 'user', 'Amis des randos et des pique-niques en montagne.'),
('99999999-9999-9999-9999-999999999999', 'Pierre Moreau', 'pierre@example.com', 40, 'M', 'user', 'Explorateur amateur et chercheur de bons restaurants.'),
('00000000-0000-0000-0000-000000000000', 'Emma Garnier', 'emma@example.com', 27, 'F', 'user', 'Photographe de voyage et amoureuse de la nature.'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Antoine Petit', 'antoine@example.com', 32, 'M', 'user', 'Sportif et amoureux des activités en groupe.'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Celine Blanc', 'celine@example.com', 24, 'F', 'user', 'Passionnée de gastronomie régionale.'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Olivier Riviere', 'olivier@example.com', 45, 'M', 'pro_guide', 'Guide expérimenté avec spécialité alpine.');

-- Création d'activités (On fixe l'UUID volontairement pour pouvoir l'appeler depuis l'app Mobile facilement au début)
INSERT INTO activities (id, host_id, title, description, category_id, specific_details, latitude, longitude, max_participants, min_age, max_age, event_date) VALUES 
('123e4567-e89b-12d3-a456-426614174000', 'aaaa1111-aaaa-1111-aaaa-111111111111', 'Randonnée au Lac Blanc', 'Magnifique randonnée avec vue sur le Mont Blanc. Difficulté moyenne, prévoir de bonnes chaussures et un pique-nique.', '11111111-1111-1111-1111-111111111111', '{"price": 10, "difficulty": "medium", "duration_hours": 4, "price_breakdown": [{"label": "Restauration", "amount": 4, "color": "#006666"}, {"label": "Frais de Guide", "amount": 5, "color": "#4953AC"}, {"label": "Sécurité", "amount": 1, "color": "#9C3D2A"}]}', 45.9237, 6.8694, 10, 18, 60, '2026-05-15 09:00:00'),
('223e4567-e89b-12d3-a456-426614174001', 'ffff6666-ffff-6666-ffff-666666666666', 'Tour de la Vieille Ville - Lyon', 'Visite guidée des monuments historiques du Vieux Lyon. Parfait pour découvrir l''histoire et déguster des spécialités locales.', '22222222-2222-2222-2222-222222222222', '{"price": 15, "difficulty": "easy", "duration_hours": 3, "price_breakdown": [{"label": "Guide", "amount": 10, "color": "#4953AC"}, {"label": "Dégustation", "amount": 5, "color": "#006666"}]}', 45.2640, 4.8357, 15, 12, 80, '2026-06-10 10:00:00'),
('323e4567-e89b-12d3-a456-426614174002', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Escalade à Fontainebleau', 'Session d''escalade sportive avec équipement fourni. Tous niveaux bienvenus.', '11111111-1111-1111-1111-111111111111', '{"price": 25, "difficulty": "hard", "duration_hours": 5, "price_breakdown": [{"label": "Matériel", "amount": 15, "color": "#9C3D2A"}, {"label": "Assistance", "amount": 10, "color": "#4953AC"}]}', 48.4000, 2.7000, 8, 16, 65, '2026-05-20 08:00:00'),
('423e4567-e89b-12d3-a456-426614174003', '00000000-0000-0000-0000-000000000000', 'Tournée Gastronomique - Bordeaux', 'Découvrez les meilleurs vins et spécialités culinaires bordelaises. Dégustation dans des restaurants renommés.', '33333333-3333-3333-3333-333333333333', '{"price": 45, "difficulty": "easy", "duration_hours": 4, "price_breakdown": [{"label": "Vins", "amount": 25, "color": "#9C3D2A"}, {"label": "Restauration", "amount": 20, "color": "#006666"}]}', 44.8378, -0.5792, 12, 18, 75, '2026-06-15 19:00:00'),
('523e4567-e89b-12d3-a456-426614174004', 'aaaa1111-aaaa-1111-aaaa-111111111111', 'Vélo en Provence', 'Balade à vélo à travers les champs de lavande. Niveau facile, terrain plat, paysages magnifiques.', '22222222-2222-2222-2222-222222222222', '{"price": 20, "difficulty": "easy", "duration_hours": 3, "price_breakdown": [{"label": "Location Vélo", "amount": 15, "color": "#4953AC"}, {"label": "Collations", "amount": 5, "color": "#006666"}]}', 43.9500, 5.7500, 20, 10, 70, '2026-07-05 09:00:00'),
('623e4567-e89b-12d3-a456-426614174005', 'ffff6666-ffff-6666-ffff-666666666666', 'Kayak sur le Lac d''Annecy', 'Pagayage tranquille sur les eaux cristallines du lac. Équipement de sécurité complet fourni.', '11111111-1111-1111-1111-111111111111', '{"price": 30, "difficulty": "medium", "duration_hours": 3, "price_breakdown": [{"label": "Location Kayak", "amount": 20, "color": "#4953AC"}, {"label": "Sécurité", "amount": 10, "color": "#9C3D2A"}]}', 45.8626, 6.1202, 10, 18, 65, '2026-05-25 13:00:00'),
('723e4567-e89b-12d3-a456-426614174006', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Marché Provençal et Cuisine - Aix-en-Provence', 'Visite du marché local et cours de cuisine avec chef. Dégustez vos créations avec le groupe.', '33333333-3333-3333-3333-333333333333', '{"price": 35, "difficulty": "easy", "duration_hours": 4, "price_breakdown": [{"label": "Ingrédients", "amount": 20, "color": "#006666"}, {"label": "Cours", "amount": 15, "color": "#4953AC"}]}', 43.5298, 5.4464, 12, 16, 80, '2026-06-20 10:00:00'),
('823e4567-e89b-12d3-a456-426614174007', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Trek du Mont-Blanc', 'Trek de 3 jours autour du Mont-Blanc. Niveau intermédiaire, très bonne condition physique requise.', '11111111-1111-1111-1111-111111111111', '{"price": 150, "difficulty": "hard", "duration_hours": 24, "price_breakdown": [{"label": "Hébergement", "amount": 90, "color": "#4953AC"}, {"label": "Nourriture", "amount": 40, "color": "#006666"}, {"label": "Sécurité", "amount": 20, "color": "#9C3D2A"}]}', 45.8325, 6.8645, 6, 20, 60, '2026-07-10 07:00:00');

-- Participants à l'activité (distribution aléatoire)
INSERT INTO activity_participants (activity_id, user_id, status) VALUES 
-- Activité 1: Randonnée au Lac Blanc
('123e4567-e89b-12d3-a456-426614174000', 'aaaa1111-aaaa-1111-aaaa-111111111111', 'accepted'), -- Hôte
('123e4567-e89b-12d3-a456-426614174000', 'bbbb2222-bbbb-2222-bbbb-222222222222', 'accepted'),
('123e4567-e89b-12d3-a456-426614174000', 'cccc3333-cccc-3333-cccc-333333333333', 'accepted'),
('123e4567-e89b-12d3-a456-426614174000', 'dddd4444-dddd-4444-dddd-444444444444', 'accepted'),
('123e4567-e89b-12d3-a456-426614174000', '77777777-7777-7777-7777-777777777777', 'accepted'),
('123e4567-e89b-12d3-a456-426614174000', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'accepted'),

-- Activité 2: Tour de la Vieille Ville
('223e4567-e89b-12d3-a456-426614174001', 'ffff6666-ffff-6666-ffff-666666666666', 'accepted'), -- Hôte
('223e4567-e89b-12d3-a456-426614174001', 'eeee5555-eeee-5555-eeee-555555555555', 'accepted'),
('223e4567-e89b-12d3-a456-426614174001', '88888888-8888-8888-8888-888888888888', 'accepted'),
('223e4567-e89b-12d3-a456-426614174001', '00000000-0000-0000-0000-000000000000', 'accepted'),
('223e4567-e89b-12d3-a456-426614174001', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'accepted'),
('223e4567-e89b-12d3-a456-426614174001', 'cccc3333-cccc-3333-cccc-333333333333', 'accepted'),
('223e4567-e89b-12d3-a456-426614174001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'accepted'),

-- Activité 3: Escalade à Fontainebleau
('323e4567-e89b-12d3-a456-426614174002', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'accepted'), -- Hôte
('323e4567-e89b-12d3-a456-426614174002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'accepted'),
('323e4567-e89b-12d3-a456-426614174002', '77777777-7777-7777-7777-777777777777', 'accepted'),
('323e4567-e89b-12d3-a456-426614174002', '99999999-9999-9999-9999-999999999999', 'accepted'),
('323e4567-e89b-12d3-a456-426614174002', 'aaaa1111-aaaa-1111-aaaa-111111111111', 'accepted'),

-- Activité 4: Tournée Gastronomique
('423e4567-e89b-12d3-a456-426614174003', '00000000-0000-0000-0000-000000000000', 'accepted'), -- Hôte
('423e4567-e89b-12d3-a456-426614174003', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'accepted'),
('423e4567-e89b-12d3-a456-426614174003', '99999999-9999-9999-9999-999999999999', 'accepted'),
('423e4567-e89b-12d3-a456-426614174003', 'eeee5555-eeee-5555-eeee-555555555555', 'accepted'),
('423e4567-e89b-12d3-a456-426614174003', '88888888-8888-8888-8888-888888888888', 'accepted'),

-- Activité 5: Vélo en Provence
('523e4567-e89b-12d3-a456-426614174004', 'aaaa1111-aaaa-1111-aaaa-111111111111', 'accepted'), -- Hôte
('523e4567-e89b-12d3-a456-426614174004', 'bbbb2222-bbbb-2222-bbbb-222222222222', 'accepted'),
('523e4567-e89b-12d3-a456-426614174004', 'dddd4444-dddd-4444-dddd-444444444444', 'accepted'),
('523e4567-e89b-12d3-a456-426614174004', 'eeee5555-eeee-5555-eeee-555555555555', 'accepted'),
('523e4567-e89b-12d3-a456-426614174004', '00000000-0000-0000-0000-000000000000', 'accepted'),
('523e4567-e89b-12d3-a456-426614174004', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'accepted'),

-- Activité 6: Kayak sur le Lac
('623e4567-e89b-12d3-a456-426614174005', 'ffff6666-ffff-6666-ffff-666666666666', 'accepted'), -- Hôte
('623e4567-e89b-12d3-a456-426614174005', 'cccc3333-cccc-3333-cccc-333333333333', 'accepted'),
('623e4567-e89b-12d3-a456-426614174005', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'accepted'),
('623e4567-e89b-12d3-a456-426614174005', '77777777-7777-7777-7777-777777777777', 'accepted'),

-- Activité 7: Marché Provençal et Cuisine
('723e4567-e89b-12d3-a456-426614174006', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'accepted'), -- Hôte
('723e4567-e89b-12d3-a456-426614174006', '88888888-8888-8888-8888-888888888888', 'accepted'),
('723e4567-e89b-12d3-a456-426614174006', '99999999-9999-9999-9999-999999999999', 'accepted'),
('723e4567-e89b-12d3-a456-426614174006', 'dddd4444-dddd-4444-dddd-444444444444', 'accepted'),
('723e4567-e89b-12d3-a456-426614174006', 'eeee5555-eeee-5555-eeee-555555555555', 'accepted'),

-- Activité 8: Trek du Mont-Blanc
('823e4567-e89b-12d3-a456-426614174007', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'accepted'), -- Hôte
('823e4567-e89b-12d3-a456-426614174007', '00000000-0000-0000-0000-000000000000', 'accepted'),
('823e4567-e89b-12d3-a456-426614174007', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'accepted'),
('823e4567-e89b-12d3-a456-426614174007', 'bbbb2222-bbbb-2222-bbbb-222222222222', 'accepted');