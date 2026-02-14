/**
 * Supabase API Service
 * Handles all interactions with the Supabase backend
 */

const SupabaseAPI = {
    // Configuration
    config: {
        url: 'https://qewjczzsiaavpxdulmka.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFld2pjenpzaWFhdnB4ZHVsbWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzY5NDQsImV4cCI6MjA4NjY1Mjk0NH0.zfFF5vGZ4Ha8W8lmlPXP5QHiaTIM1GbyiSSh4NlRdL0'
    },

    _client: null,

    /**
     * Get or create the Supabase client instance
     * @returns {object} Supabase client
     */
    getClient() {
        if (!this._client) {
            this._client = supabase.createClient(this.config.url, this.config.anonKey);
        }
        return this._client;
    },

    /**
     * Fetch all projects
     * @param {object} options - Query options
     * @returns {Promise<Array>} - Projects data
     */
    async getProjects(options = {}) {
        const client = this.getClient();
        let query = client
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (options.featured) {
            query = query.eq('featured', true);
        }

        if (options.limit) {
            query = query.limit(options.limit);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Supabase getProjects error:', error);
            throw error;
        }

        return { data: data || [] };
    },

    /**
     * Fetch single project by slug
     * @param {string} slug - Project slug
     * @returns {Promise<object>} - Project data
     */
    async getProjectBySlug(slug) {
        const client = this.getClient();
        const { data, error } = await client
            .from('projects')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            console.error('Supabase getProjectBySlug error:', error);
            throw error;
        }

        return { data };
    },

    /**
     * Fetch all testimonials
     * @param {object} options - Query options
     * @returns {Promise<object>} - Testimonials data
     */
    async getTestimonials(options = {}) {
        const client = this.getClient();
        let query = client
            .from('testimonials')
            .select('*')
            .order('created_at', { ascending: true });

        if (options.featured) {
            query = query.eq('featured', true);
        }

        if (options.limit) {
            query = query.limit(options.limit);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Supabase getTestimonials error:', error);
            throw error;
        }

        return { data: data || [] };
    },

    /**
     * Submit contact form
     * @param {object} formData - Form data
     * @returns {Promise<object>} - Submission response
     */
    async submitContactForm(formData) {
        const client = this.getClient();
        const { data, error } = await client
            .from('contact_inquiries')
            .insert([{
                name: formData.name,
                email: formData.email,
                project_type: formData.projectType,
                message: formData.message,
                status: 'new'
            }])
            .select();

        if (error) {
            console.error('Supabase submitContactForm error:', error);
            throw error;
        }

        return { data };
    },

    /**
     * Check if Supabase is available
     * @returns {Promise<boolean>} - Availability status
     */
    async checkConnection() {
        try {
            const client = this.getClient();
            // Try a lightweight query to check connectivity
            const { error } = await client
                .from('projects')
                .select('id')
                .limit(1);

            return !error;
        } catch {
            return false;
        }
    }
};

// Export for use in other scripts
window.SupabaseAPI = SupabaseAPI;
