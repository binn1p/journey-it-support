class JourneyTracker {
    constructor() {
        this.notes = this.loadNotes();
        this.initializeEventListeners();
        this.renderNotes();
    }

    initializeEventListeners() {
        // Form submission
        document.getElementById('noteForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNote();
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', () => {
            this.filterAndRenderNotes();
        });

        // Category filter
        document.getElementById('filterCategory').addEventListener('change', () => {
            this.filterAndRenderNotes();
        });

        // Status filter
        document.getElementById('filterStatus').addEventListener('change', () => {
            this.filterAndRenderNotes();
        });

        // Clear filters
        document.getElementById('clearFilters').addEventListener('click', () => {
            this.clearFilters();
        });
    }

    addNote() {
        const skillName = document.getElementById('skillName').value.trim();
        const category = document.getElementById('category').value;
        const difficulty = document.getElementById('difficulty').value;
        const status = document.getElementById('status').value;
        const notes = document.getElementById('notes').value.trim();
        const resources = document.getElementById('resources').value.trim();

        if (!skillName || !category || !difficulty || !status) {
            alert('Please fill in all required fields');
            return;
        }

        const note = {
            id: Date.now(),
            skillName,
            category,
            difficulty,
            status,
            notes,
            resources,
            dateAdded: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };

        this.notes.unshift(note);
        this.saveNotes();
        this.renderNotes();
        this.resetForm();
        
        // Show success message
        this.showMessage('Note added successfully!', 'success');
    }

    editNote(id) {
        const note = this.notes.find(n => n.id === id);
        if (!note) return;

        // Populate form with note data
        document.getElementById('skillName').value = note.skillName;
        document.getElementById('category').value = note.category;
        document.getElementById('difficulty').value = note.difficulty;
        document.getElementById('status').value = note.status;
        document.getElementById('notes').value = note.notes;
        document.getElementById('resources').value = note.resources;

        // Change form to edit mode
        const form = document.getElementById('noteForm');
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Update Note';
        submitBtn.onclick = (e) => {
            e.preventDefault();
            this.updateNote(id);
        };

        // Scroll to form
        document.querySelector('.add-note-section').scrollIntoView({ behavior: 'smooth' });
    }

    updateNote(id) {
        const note = this.notes.find(n => n.id === id);
        if (!note) return;

        const skillName = document.getElementById('skillName').value.trim();
        const category = document.getElementById('category').value;
        const difficulty = document.getElementById('difficulty').value;
        const status = document.getElementById('status').value;
        const notes = document.getElementById('notes').value.trim();
        const resources = document.getElementById('resources').value.trim();

        if (!skillName || !category || !difficulty || !status) {
            alert('Please fill in all required fields');
            return;
        }

        note.skillName = skillName;
        note.category = category;
        note.difficulty = difficulty;
        note.status = status;
        note.notes = notes;
        note.resources = resources;
        note.lastUpdated = new Date().toISOString();

        this.saveNotes();
        this.renderNotes();
        this.resetForm();
        this.showMessage('Note updated successfully!', 'success');
    }

    deleteNote(id) {
        if (confirm('Are you sure you want to delete this note?')) {
            this.notes = this.notes.filter(note => note.id !== id);
            this.saveNotes();
            this.renderNotes();
            this.showMessage('Note deleted successfully!', 'success');
        }
    }

    resetForm() {
        document.getElementById('noteForm').reset();
        const submitBtn = document.querySelector('#noteForm button[type="submit"]');
        submitBtn.textContent = 'Add Note';
        submitBtn.onclick = null;
    }

    filterAndRenderNotes() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const categoryFilter = document.getElementById('filterCategory').value;
        const statusFilter = document.getElementById('filterStatus').value;

        let filteredNotes = this.notes.filter(note => {
            const matchesSearch = !searchTerm || 
                note.skillName.toLowerCase().includes(searchTerm) ||
                note.notes.toLowerCase().includes(searchTerm) ||
                note.resources.toLowerCase().includes(searchTerm);
            
            const matchesCategory = !categoryFilter || note.category === categoryFilter;
            const matchesStatus = !statusFilter || note.status === statusFilter;

            return matchesSearch && matchesCategory && matchesStatus;
        });

        this.renderNotes(filteredNotes);
    }

    clearFilters() {
        document.getElementById('searchInput').value = '';
        document.getElementById('filterCategory').value = '';
        document.getElementById('filterStatus').value = '';
        this.renderNotes();
    }

    renderNotes(notesToRender = null) {
        const notes = notesToRender || this.notes;
        const container = document.getElementById('notesContainer');
        const noNotesMessage = document.getElementById('noNotesMessage');

        if (notes.length === 0) {
            container.innerHTML = '';
            noNotesMessage.style.display = 'block';
            return;
        }

        noNotesMessage.style.display = 'none';
        
        container.innerHTML = notes.map(note => this.createNoteHTML(note)).join('');

        // Add event listeners to buttons
        notes.forEach(note => {
            const editBtn = document.querySelector(`[data-edit-id="${note.id}"]`);
            const deleteBtn = document.querySelector(`[data-delete-id="${note.id}"]`);

            if (editBtn) {
                editBtn.addEventListener('click', () => this.editNote(note.id));
            }
            
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => this.deleteNote(note.id));
            }
        });

        // Highlight search terms
        this.highlightSearchTerms();
    }

    createNoteHTML(note) {
        const dateAdded = new Date(note.dateAdded).toLocaleDateString();
        const lastUpdated = new Date(note.lastUpdated).toLocaleDateString();
        const isUpdated = dateAdded !== lastUpdated;

        return `
            <div class="note-card">
                <div class="note-header">
                    <div>
                        <div class="note-title">${this.escapeHtml(note.skillName)}</div>
                        <div class="note-meta">
                            <span class="badge category">${this.capitalizeFirst(note.category)}</span>
                            <span class="badge difficulty">${this.capitalizeFirst(note.difficulty)}</span>
                            <span class="badge status ${note.status}">${this.capitalizeFirst(note.status)}</span>
                        </div>
                    </div>
                    <div class="note-actions">
                        <button class="btn-small btn-edit" data-edit-id="${note.id}">Edit</button>
                        <button class="btn-small btn-danger" data-delete-id="${note.id}">Delete</button>
                    </div>
                </div>
                
                ${note.notes ? `
                    <div class="note-content">
                        <h4>Notes:</h4>
                        <p>${this.escapeHtml(note.notes).replace(/\n/g, '<br>')}</p>
                    </div>
                ` : ''}
                
                ${note.resources ? `
                    <div class="note-content">
                        <h4>Resources:</h4>
                        <p>${this.formatResources(note.resources)}</p>
                    </div>
                ` : ''}
                
                <div class="note-date">
                    Added: ${dateAdded}
                    ${isUpdated ? `• Updated: ${lastUpdated}` : ''}
                </div>
            </div>
        `;
    }

    formatResources(resources) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return this.escapeHtml(resources)
            .replace(/\n/g, '<br>')
            .replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    }

    highlightSearchTerms() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        if (!searchTerm) return;

        const noteCards = document.querySelectorAll('.note-card');
        noteCards.forEach(card => {
            const textNodes = this.getTextNodes(card);
            textNodes.forEach(node => {
                if (node.textContent.toLowerCase().includes(searchTerm)) {
                    const parent = node.parentNode;
                    if (parent) {
                        const highlighted = node.textContent.replace(
                            new RegExp(`(${this.escapeRegExp(searchTerm)})`, 'gi'),
                            '<span class="highlight">$1</span>'
                        );
                        parent.innerHTML = parent.innerHTML.replace(node.textContent, highlighted);
                    }
                }
            });
        });
    }

    getTextNodes(element) {
        const textNodes = [];
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.trim()) {
                textNodes.push(node);
            }
        }
        return textNodes;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    showMessage(message, type = 'info') {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            ${type === 'success' ? 'background: #48bb78;' : 'background: #f56565;'}
        `;
        messageEl.textContent = message;
        
        document.body.appendChild(messageEl);
        
        // Animate in
        setTimeout(() => {
            messageEl.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }

    loadNotes() {
        try {
            const stored = localStorage.getItem('journey-notes');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading notes:', error);
            return [];
        }
    }

    saveNotes() {
        try {
            localStorage.setItem('journey-notes', JSON.stringify(this.notes));
        } catch (error) {
            console.error('Error saving notes:', error);
            alert('Error saving notes. Your browser may not support local storage or you may have reached the storage limit.');
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new JourneyTracker();
    
    // Add some sample data if no notes exist
    if (localStorage.getItem('journey-notes') === null) {
        const sampleNotes = [
            {
                id: 1,
                skillName: "React",
                category: "framework",
                difficulty: "intermediate",
                status: "practicing",
                notes: "Learning React hooks and state management. Really enjoying the component-based architecture. Still working on understanding useEffect dependencies.",
                resources: "https://react.dev\nhttps://reactjs.org/tutorial/tutorial.html\nReact - The Complete Guide (Udemy)",
                dateAdded: "2024-01-15T10:30:00.000Z",
                lastUpdated: "2024-01-15T10:30:00.000Z"
            },
            {
                id: 2,
                skillName: "CSS Grid",
                category: "frontend",
                difficulty: "intermediate",
                status: "completed",
                notes: "Mastered CSS Grid layout system. Can create complex responsive layouts with ease. Grid areas and template columns/rows are powerful tools.",
                resources: "https://css-tricks.com/snippets/css/complete-guide-grid/\nhttps://gridbyexample.com/\nCSS Grid Garden (game)",
                dateAdded: "2024-01-10T14:20:00.000Z",
                lastUpdated: "2024-01-20T16:45:00.000Z"
            },
            {
                id: 3,
                skillName: "Node.js",
                category: "backend",
                difficulty: "beginner",
                status: "learning",
                notes: "Just started learning Node.js for backend development. Understanding asynchronous programming and the event loop. Built my first Express server!",
                resources: "https://nodejs.org/en/docs/\nhttps://expressjs.com/\nNode.js - The Complete Guide (Udemy)",
                dateAdded: "2024-01-25T09:15:00.000Z",
                lastUpdated: "2024-01-25T09:15:00.000Z"
            }
        ];
        
        localStorage.setItem('journey-notes', JSON.stringify(sampleNotes));
        // Reload the page to show sample data
        window.location.reload();
    }
});