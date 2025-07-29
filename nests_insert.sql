-- Insert Anonymous Nests into the database
-- These nests are created by the system admin for the heal section

-- Delete all existing nests
TRUNCATE TABLE public.nests RESTART IDENTITY CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_nests_name ON public.nests(name);
CREATE INDEX IF NOT EXISTS idx_nests_is_private ON public.nests(is_private);
CREATE INDEX IF NOT EXISTS idx_nests_created_at ON public.nests(created_at);

-- Anxiety Nest
INSERT INTO public.nests (
    name,
    description,
    avatar_url,
    is_private,
    member_count,
    created_by,
    created_at,
    updated_at
) VALUES (
    'Anxiety Nest',
    'A safe space to share anxiety struggles and find support from others who understand.',
    '😰',
    false,
    127,
    '0bcae321-50b8-4771-8b59-ba8d1662b81a',
    NOW(),
    NOW()
);

-- Overthinking Nest
INSERT INTO public.nests (
    name,
    description,
    avatar_url,
    is_private,
    member_count,
    created_by,
    created_at,
    updated_at
) VALUES (
    'Overthinking Nest',
    'For those who tend to overthink and need a place to share thoughts and get perspective.',
    '🤔',
    false,
    89,
    '0bcae321-50b8-4771-8b59-ba8d1662b81a',
    NOW(),
    NOW()
);

-- Burnout Nest
INSERT INTO public.nests (
    name,
    description,
    avatar_url,
    is_private,
    member_count,
    created_by,
    created_at,
    updated_at
) VALUES (
    'Burnout Nest',
    'Support for those dealing with work, life, or emotional burnout.',
    '😤',
    false,
    156,
    '0bcae321-50b8-4771-8b59-ba8d1662b81a',
    NOW(),
    NOW()
);

-- Heartbreak Nest
INSERT INTO public.nests (
    name,
    description,
    avatar_url,
    is_private,
    member_count,
    created_by,
    created_at,
    updated_at
) VALUES (
    'Heartbreak Nest',
    'Healing from relationships, breakups, and emotional pain.',
    '💔',
    false,
    203,
    '00000000-0000-0000-0000-000000000000',
    NOW(),
    NOW()
);

-- Money Stress Nest
INSERT INTO public.nests (
    name,
    description,
    avatar_url,
    is_private,
    member_count,
    created_by,
    created_at,
    updated_at
) VALUES (
    'Money Stress Nest',
    'Financial anxiety, money worries, and economic stress support.',
    '💰',
    false,
    94,
    '00000000-0000-0000-0000-000000000000',
    NOW(),
    NOW()
); 
