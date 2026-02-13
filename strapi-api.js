/**
 * Strapi API Service
 * Handles all interactions with the Strapi headless CMS
 */

const StrapiAPI = {
    // Configuration - Update these values when deploying
    config: {
        baseURL: import.meta.env?.VITE_STRAPI_URL || 'http://localhost:1337',
        apiToken: import.meta.env?.VITE_STRAPI_TOKEN || '',
        prefix: '/api'
    },

    /**
     * Fetch data from Strapi
     * @param {string} endpoint - API endpoint (e.g., 'projects' or 'projects?populate=*')
     * @param {object} options - Fetch options
     * @returns {Promise<object>} - Response data
     */
    async fetch(endpoint, options = {}) {
        const url = `${this.config.baseURL}${this.config.prefix}/${endpoint}`;
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Add API token if available
        if (this.config.apiToken) {
            headers['Authorization'] = `Bearer ${this.config.apiToken}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Strapi API Error:', error);
            throw error;
        }
    },

    /**
     * Fetch all projects with optional population
     * @param {object} options - Query options
     * @returns {Promise<object>} - Projects data
     */
    async getProjects(options = {}) {
        const query = this._buildQuery({
            populate: options.populate || ['thumbnail', 'category'],
            sort: options.sort || '-createdAt',
            pagination: options.pagination || { pageSize: 10 }
        });
        return this.fetch(`projects${query}`);
    },

    /**
     * Fetch single project by slug
     * @param {string} slug - Project slug
     * @returns {Promise<object>} - Project data
     */
    async getProjectBySlug(slug) {
        return this.fetch(`projects?filters[slug][$eq]=${slug}&populate=deep`);
    },

    /**
     * Fetch all testimonials
     * @param {object} options - Query options
     * @returns {Promise<object>} - Testimonials data
     */
    async getTestimonials(options = {}) {
        const query = this._buildQuery({
            populate: options.populate || ['avatar'],
            sort: options.sort || 'createdAt',
            pagination: options.pagination || { pageSize: 20 }
        });
        return this.fetch(`testimonials${query}`);
    },

    /**
     * Fetch all services
     * @param {object} options - Query options
     * @returns {Promise<object>} - Services data
     */
    async getServices(options = {}) {
        const query = this._buildQuery({
            populate: options.populate || ['icon'],
            sort: options.sort || 'order'
        });
        return this.fetch(`services${query}`);
    },

    /**
     * Fetch site settings
     * @returns {Promise<object>} - Settings data
     */
    async getSettings() {
        return this.fetch('site-settings?populate=deep');
    },

    /**
     * Submit contact form to Strapi
     * @param {object} formData - Form data
     * @returns {Promise<object>} - Submission response
     */
    async submitContactForm(formData) {
        return this.fetch('contact-inquiries', {
            method: 'POST',
            body: JSON.stringify({
                data: {
                    name: formData.name,
                    email: formData.email,
                    projectType: formData.projectType,
                    message: formData.message,
                    status: 'new'
                }
            })
        });
    },

    /**
     * Build query string from options
     * @private
     * @param {object} options - Query options
     * @returns {string} - Query string
     */
    _buildQuery(options) {
        const params = new URLSearchParams();

        if (options.populate) {
            params.append('populate', options.populate.join(','));
        }

        if (options.sort) {
            params.append('sort', options.sort);
        }

        if (options.pagination) {
            Object.entries(options.pagination).forEach(([key, value]) => {
                params.append(`pagination[${key}]`, value);
            });
        }

        if (options.filters) {
            params.append('filters', JSON.stringify(options.filters));
        }

        const queryString = params.toString();
        return queryString ? `?${queryString}` : '';
    },

    /**
     * Get image URL from Strapi media
     * @param {object} media - Strapi media object
     * @returns {string} - Full image URL
     */
    getImageUrl(media) {
        if (!media) return '';
        if (typeof media === 'string') return media;
        
        const url = media.url;
        if (url.startsWith('http') || url.startsWith('//')) {
            return url;
        }
        return `${this.config.baseURL}${url}`;
    },

    /**
     * Check if Strapi is available
     * @returns {Promise<boolean>} - Availability status
     */
    async checkConnection() {
        try {
            await this.fetch('');
            return true;
        } catch {
            return false;
        }
    }
};

// Export for use in other scripts
window.StrapiAPI = StrapiAPI;
