-- Create moods table
CREATE TABLE IF NOT EXISTS public.moods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    mood_value INTEGER NOT NULL CHECK (mood_value >= 1 AND mood_value <= 5),
    mood_label TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries by user_id
CREATE INDEX IF NOT EXISTS idx_moods_user_id ON public.moods(user_id);

-- Create index for mood_value queries
CREATE INDEX IF NOT EXISTS idx_moods_value ON public.moods(mood_value);

-- Create index for date range queries
CREATE INDEX IF NOT EXISTS idx_moods_created_at ON public.moods(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.moods ENABLE ROW LEVEL SECURITY;

-- Create RLS policy to allow users to only see their own moods
CREATE POLICY "Users can view their own moods" ON public.moods
    FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policy to allow users to insert their own moods
CREATE POLICY "Users can insert their own moods" ON public.moods
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policy to allow users to update their own moods
CREATE POLICY "Users can update their own moods" ON public.moods
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policy to allow users to delete their own moods
CREATE POLICY "Users can delete their own moods" ON public.moods
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_moods_updated_at 
    BEFORE UPDATE ON public.moods 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 