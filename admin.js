/**
 * Admin Dashboard — Logic
 * Handles authentication, CRUD operations for Projects & Testimonials,
 * and Contact Inquiry management via Supabase.
 */

(function () {
    'use strict';

    // ==========================================
    // STATE
    // ==========================================
    const state = {
        currentTab: 'projects',
        editingId: null,
        editingType: null
    };

    // ==========================================
    // DOM REFERENCES
    // ==========================================
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const loginScreen = $('#login-screen');
    const dashboard = $('#dashboard');
    const loginForm = $('#login-form');
    const loginError = $('#login-error');
    const logoutBtn = $('#logout-btn');
    const pageTitle = $('#page-title');
    const addNewBtn = $('#add-new-btn');

    const modalOverlay = $('#modal-overlay');
    const modalTitle = $('#modal-title');
    const modalBody = $('#modal-body');
    const modalForm = $('#modal-form');
    const modalClose = $('#modal-close');
    const modalCancel = $('#modal-cancel');

    const toast = $('#toast');

    // ==========================================
    // INIT
    // ==========================================
    async function init() {
        lucide.createIcons();

        // Check if already logged in
        const client = SupabaseAPI.getClient();
        const { data: { session } } = await client.auth.getSession();

        if (session) {
            showDashboard();
        } else {
            showLogin();
        }

        setupEventListeners();
    }

    // ==========================================
    // AUTH
    // ==========================================
    function showLogin() {
        loginScreen.style.display = '';
        dashboard.style.display = 'none';
    }

    function showDashboard() {
        loginScreen.style.display = 'none';
        dashboard.style.display = 'flex';
        loadTab('projects');
    }

    async function handleLogin(e) {
        e.preventDefault();
        const email = $('#login-email').value.trim();
        const password = $('#login-password').value;

        loginError.textContent = '';
        const btn = $('#login-btn');
        btn.innerHTML = '<span>Signing in...</span>';
        btn.disabled = true;

        try {
            const client = SupabaseAPI.getClient();
            const { error } = await client.auth.signInWithPassword({ email, password });

            if (error) {
                loginError.textContent = error.message || 'Invalid credentials.';
                btn.innerHTML = '<span>Sign In</span>';
                btn.disabled = false;
                return;
            }

            showDashboard();
        } catch (err) {
            loginError.textContent = 'Connection error. Please try again.';
            btn.innerHTML = '<span>Sign In</span>';
            btn.disabled = false;
        }
    }

    async function handleLogout() {
        const client = SupabaseAPI.getClient();
        await client.auth.signOut();
        showLogin();
        loginForm.reset();
    }

    // ==========================================
    // TAB NAVIGATION
    // ==========================================
    function loadTab(tabName) {
        state.currentTab = tabName;

        // Update sidebar
        $$('.sidebar__link[data-tab]').forEach(link => {
            link.classList.toggle('active', link.dataset.tab === tabName);
        });

        // Update panels
        $$('.panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `panel-${tabName}`);
        });

        // Update title and button
        const titles = { projects: 'Projects', testimonials: 'Testimonials', inquiries: 'Inquiries' };
        pageTitle.textContent = titles[tabName] || tabName;

        // Hide "Add New" for inquiries
        addNewBtn.style.display = tabName === 'inquiries' ? 'none' : '';

        // Load data
        if (tabName === 'projects') loadProjects();
        else if (tabName === 'testimonials') loadTestimonials();
        else if (tabName === 'inquiries') loadInquiries();
    }

    // ==========================================
    // PROJECTS CRUD
    // ==========================================
    async function loadProjects() {
        const tbody = $('#projects-tbody');
        const empty = $('#projects-empty');
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--text-muted)">Loading...</td></tr>';

        try {
            const client = SupabaseAPI.getClient();
            const { data, error } = await client
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (!data || data.length === 0) {
                tbody.innerHTML = '';
                empty.style.display = '';
                return;
            }

            empty.style.display = 'none';
            tbody.innerHTML = data.map(p => `
                <tr>
                    <td class="cell-title">${esc(p.title)}</td>
                    <td>${esc(p.category)}</td>
                    <td>${esc(p.client)}</td>
                    <td>${p.featured ? '<span class="status-badge status-badge--featured">★ Featured</span>' : '—'}</td>
                    <td>${formatDate(p.created_at)}</td>
                    <td class="cell-actions">
                        <button class="btn btn--ghost btn--sm" onclick="AdminActions.editProject('${p.id}')">Edit</button>
                        <button class="btn btn--danger btn--sm" onclick="AdminActions.deleteProject('${p.id}')">Delete</button>
                    </td>
                </tr>
            `).join('');
        } catch (err) {
            console.error('Load projects error:', err);
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--error)">Failed to load projects</td></tr>`;
        }
    }

    function showProjectForm(project = null) {
        state.editingId = project?.id || null;
        state.editingType = 'project';
        modalTitle.textContent = project ? 'Edit Project' : 'Add Project';

        modalBody.innerHTML = `
            <div class="form-field">
                <label for="f-title">Title *</label>
                <input type="text" id="f-title" required value="${esc(project?.title || '')}">
            </div>
            <div class="form-field">
                <label for="f-slug">Slug</label>
                <input type="text" id="f-slug" placeholder="auto-generated from title" value="${esc(project?.slug || '')}">
            </div>
            <div class="form-field">
                <label for="f-category">Category</label>
                <input type="text" id="f-category" placeholder="e.g. Fintech, Healthcare" value="${esc(project?.category || '')}">
            </div>
            <div class="form-field">
                <label for="f-client">Client</label>
                <input type="text" id="f-client" placeholder="Client name" value="${esc(project?.client || '')}">
            </div>
            <div class="form-field">
                <label for="f-thumbnail">Thumbnail URL</label>
                <input type="url" id="f-thumbnail" placeholder="https://..." value="${esc(project?.thumbnail_url || '')}">
            </div>
            <div class="form-field form-field--checkbox">
                <input type="checkbox" id="f-featured" ${project?.featured ? 'checked' : ''}>
                <label for="f-featured">Featured project</label>
            </div>
        `;

        openModal();
    }

    async function saveProject() {
        const title = $('#f-title').value.trim();
        let slug = $('#f-slug').value.trim();
        const category = $('#f-category').value.trim();
        const clientName = $('#f-client').value.trim();
        const thumbnail_url = $('#f-thumbnail').value.trim();
        const featured = $('#f-featured').checked;

        if (!title) { showToast('Title is required', 'error'); return; }
        if (!slug) slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const record = { title, slug, category, client: clientName, thumbnail_url, featured };
        const client = SupabaseAPI.getClient();

        try {
            if (state.editingId) {
                const { error } = await client.from('projects').update(record).eq('id', state.editingId);
                if (error) throw error;
                showToast('Project updated!', 'success');
            } else {
                const { error } = await client.from('projects').insert([record]);
                if (error) throw error;
                showToast('Project created!', 'success');
            }
            closeModal();
            loadProjects();
        } catch (err) {
            console.error('Save project error:', err);
            showToast('Failed to save: ' + (err.message || 'Unknown error'), 'error');
        }
    }

    async function deleteProject(id) {
        if (!confirm('Delete this project? This cannot be undone.')) return;

        try {
            const client = SupabaseAPI.getClient();
            const { error } = await client.from('projects').delete().eq('id', id);
            if (error) throw error;
            showToast('Project deleted', 'success');
            loadProjects();
        } catch (err) {
            showToast('Failed to delete project', 'error');
        }
    }

    async function editProject(id) {
        const client = SupabaseAPI.getClient();
        const { data, error } = await client.from('projects').select('*').eq('id', id).single();
        if (error || !data) { showToast('Project not found', 'error'); return; }
        showProjectForm(data);
    }

    // ==========================================
    // TESTIMONIALS CRUD
    // ==========================================
    async function loadTestimonials() {
        const tbody = $('#testimonials-tbody');
        const empty = $('#testimonials-empty');
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:30px;color:var(--text-muted)">Loading...</td></tr>';

        try {
            const client = SupabaseAPI.getClient();
            const { data, error } = await client
                .from('testimonials')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (!data || data.length === 0) {
                tbody.innerHTML = '';
                empty.style.display = '';
                return;
            }

            empty.style.display = 'none';
            tbody.innerHTML = data.map(t => `
                <tr>
                    <td class="cell-title">${esc(t.name)}</td>
                    <td>${esc(t.role)}</td>
                    <td>${esc(t.company)}</td>
                    <td title="${esc(t.quote)}">${esc(truncate(t.quote, 60))}</td>
                    <td class="cell-actions">
                        <button class="btn btn--ghost btn--sm" onclick="AdminActions.editTestimonial('${t.id}')">Edit</button>
                        <button class="btn btn--danger btn--sm" onclick="AdminActions.deleteTestimonial('${t.id}')">Delete</button>
                    </td>
                </tr>
            `).join('');
        } catch (err) {
            console.error('Load testimonials error:', err);
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:30px;color:var(--error)">Failed to load testimonials</td></tr>`;
        }
    }

    function showTestimonialForm(testimonial = null) {
        state.editingId = testimonial?.id || null;
        state.editingType = 'testimonial';
        modalTitle.textContent = testimonial ? 'Edit Testimonial' : 'Add Testimonial';

        modalBody.innerHTML = `
            <div class="form-field">
                <label for="f-name">Name *</label>
                <input type="text" id="f-name" required value="${esc(testimonial?.name || '')}">
            </div>
            <div class="form-field">
                <label for="f-role">Role</label>
                <input type="text" id="f-role" placeholder="e.g. CEO, Founder" value="${esc(testimonial?.role || '')}">
            </div>
            <div class="form-field">
                <label for="f-company">Company</label>
                <input type="text" id="f-company" placeholder="Company name" value="${esc(testimonial?.company || '')}">
            </div>
            <div class="form-field">
                <label for="f-quote">Quote *</label>
                <textarea id="f-quote" rows="4" required>${esc(testimonial?.quote || '')}</textarea>
            </div>
            <div class="form-field form-field--checkbox">
                <input type="checkbox" id="f-featured" ${testimonial?.featured !== false ? 'checked' : ''}>
                <label for="f-featured">Featured testimonial</label>
            </div>
        `;

        openModal();
    }

    async function saveTestimonial() {
        const name = $('#f-name').value.trim();
        const role = $('#f-role').value.trim();
        const company = $('#f-company').value.trim();
        const quote = $('#f-quote').value.trim();
        const featured = $('#f-featured').checked;

        if (!name || !quote) { showToast('Name and quote are required', 'error'); return; }

        const record = { name, role, company, quote, featured };
        const client = SupabaseAPI.getClient();

        try {
            if (state.editingId) {
                const { error } = await client.from('testimonials').update(record).eq('id', state.editingId);
                if (error) throw error;
                showToast('Testimonial updated!', 'success');
            } else {
                const { error } = await client.from('testimonials').insert([record]);
                if (error) throw error;
                showToast('Testimonial created!', 'success');
            }
            closeModal();
            loadTestimonials();
        } catch (err) {
            console.error('Save testimonial error:', err);
            showToast('Failed to save: ' + (err.message || 'Unknown error'), 'error');
        }
    }

    async function deleteTestimonial(id) {
        if (!confirm('Delete this testimonial? This cannot be undone.')) return;

        try {
            const client = SupabaseAPI.getClient();
            const { error } = await client.from('testimonials').delete().eq('id', id);
            if (error) throw error;
            showToast('Testimonial deleted', 'success');
            loadTestimonials();
        } catch (err) {
            showToast('Failed to delete testimonial', 'error');
        }
    }

    async function editTestimonial(id) {
        const client = SupabaseAPI.getClient();
        const { data, error } = await client.from('testimonials').select('*').eq('id', id).single();
        if (error || !data) { showToast('Testimonial not found', 'error'); return; }
        showTestimonialForm(data);
    }

    // ==========================================
    // INQUIRIES (Read + Status Update)
    // ==========================================
    async function loadInquiries() {
        const tbody = $('#inquiries-tbody');
        const empty = $('#inquiries-empty');
        const countBadge = $('#inquiry-count');
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--text-muted)">Loading...</td></tr>';

        try {
            const client = SupabaseAPI.getClient();
            const { data, error } = await client
                .from('contact_inquiries')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Update count badge
            const newCount = (data || []).filter(i => i.status === 'new').length;
            countBadge.textContent = newCount > 0 ? newCount : '';

            if (!data || data.length === 0) {
                tbody.innerHTML = '';
                empty.style.display = '';
                return;
            }

            empty.style.display = 'none';
            tbody.innerHTML = data.map(i => `
                <tr>
                    <td class="cell-title">${esc(i.name)}</td>
                    <td><a href="mailto:${esc(i.email)}" style="color:var(--accent)">${esc(i.email)}</a></td>
                    <td>${esc(i.project_type)}</td>
                    <td title="${esc(i.message)}">${esc(truncate(i.message, 50))}</td>
                    <td>
                        <select class="status-select" onchange="AdminActions.updateInquiryStatus('${i.id}', this.value)" style="background:var(--bg-input);border:1px solid var(--border);color:var(--text-primary);padding:4px 8px;border-radius:6px;font-size:12px;font-family:var(--font);cursor:pointer;">
                            <option value="new" ${i.status === 'new' ? 'selected' : ''}>New</option>
                            <option value="read" ${i.status === 'read' ? 'selected' : ''}>Read</option>
                            <option value="archived" ${i.status === 'archived' ? 'selected' : ''}>Archived</option>
                        </select>
                    </td>
                    <td>${formatDate(i.created_at)}</td>
                    <td class="cell-actions">
                        <button class="btn btn--danger btn--sm" onclick="AdminActions.deleteInquiry('${i.id}')">Delete</button>
                    </td>
                </tr>
            `).join('');
        } catch (err) {
            console.error('Load inquiries error:', err);
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--error)">Failed to load inquiries</td></tr>`;
        }
    }

    async function updateInquiryStatus(id, status) {
        try {
            const client = SupabaseAPI.getClient();
            const { error } = await client.from('contact_inquiries').update({ status }).eq('id', id);
            if (error) throw error;
            showToast(`Status updated to "${status}"`, 'success');
            // Refresh count
            loadInquiries();
        } catch (err) {
            showToast('Failed to update status', 'error');
        }
    }

    async function deleteInquiry(id) {
        if (!confirm('Delete this inquiry? This cannot be undone.')) return;

        try {
            const client = SupabaseAPI.getClient();
            const { error } = await client.from('contact_inquiries').delete().eq('id', id);
            if (error) throw error;
            showToast('Inquiry deleted', 'success');
            loadInquiries();
        } catch (err) {
            showToast('Failed to delete inquiry', 'error');
        }
    }

    // ==========================================
    // MODAL
    // ==========================================
    function openModal() {
        modalOverlay.classList.add('active');
        const firstInput = modalBody.querySelector('input, textarea');
        if (firstInput) setTimeout(() => firstInput.focus(), 100);
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        state.editingId = null;
        state.editingType = null;
    }

    // ==========================================
    // TOAST
    // ==========================================
    let toastTimer = null;
    function showToast(message, type = 'success') {
        toast.textContent = message;
        toast.className = 'toast visible toast--' + type;

        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.remove('visible');
        }, 3000);
    }

    // ==========================================
    // UTILITIES
    // ==========================================
    function esc(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function truncate(str, max) {
        if (!str) return '';
        return str.length > max ? str.substring(0, max) + '…' : str;
    }

    function formatDate(dateStr) {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    // ==========================================
    // EVENT LISTENERS
    // ==========================================
    function setupEventListeners() {
        // Login
        loginForm.addEventListener('submit', handleLogin);

        // Logout
        logoutBtn.addEventListener('click', handleLogout);

        // Tab navigation
        $$('.sidebar__link[data-tab]').forEach(link => {
            link.addEventListener('click', () => loadTab(link.dataset.tab));
        });

        // Add New
        addNewBtn.addEventListener('click', () => {
            if (state.currentTab === 'projects') showProjectForm();
            else if (state.currentTab === 'testimonials') showTestimonialForm();
        });

        // Modal close
        modalClose.addEventListener('click', closeModal);
        modalCancel.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });

        // Modal form submit
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (state.editingType === 'project') saveProject();
            else if (state.editingType === 'testimonial') saveTestimonial();
        });

        // ESC key closes modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }

    // ==========================================
    // GLOBAL ACTIONS (for inline onclick handlers)
    // ==========================================
    window.AdminActions = {
        editProject,
        deleteProject,
        editTestimonial,
        deleteTestimonial,
        updateInquiryStatus,
        deleteInquiry
    };

    // ==========================================
    // START
    // ==========================================
    init();

})();
