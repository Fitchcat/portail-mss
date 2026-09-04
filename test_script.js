    
        tailwind.config = {
            safelist: [
                'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 
                'grid-cols-4', 'grid-cols-5', 'grid-cols-6',
                'sm:grid-cols-2', 'md:grid-cols-2', 'md:grid-cols-3', 
                'lg:grid-cols-1', 'lg:grid-cols-2', 'lg:grid-cols-3', 
                'lg:grid-cols-4', 'lg:grid-cols-5', 'lg:grid-cols-6'
            ]
        }
    
    
        const defaultState = {
            settings: {
                categoriesColumns: 1,
                bgType: 'color', // 'color', 'image', 'video'
                bgColor: '#5b7065',
                textColor: '#ffffff',
                buttonBgColor: '#ffffff',
                buttonTextColor: '#5b7065',
                bgImage: '',
                bgVideo: '',
                bgAudioUrl: 'Video/musicFocus.MP3',
                logoUrl: 'https://i.ibb.co/3s7s6qM/logo-mss.png',
                title: 'My Sport Business Tools',
                description: 'Tous les outils développés pour booster l\'acquisition de nos clients. 🚀\nSélectionnez une catégorie ci-dessous.',
            },
            categories: [
                { 
                    id: 1, 
                    title: 'Outils & Simulateurs', 
                    columns: 1,
                    subcategories: [
                        {
                            id: 101,
                            title: 'Marketing & Conversion',
                            columns: 2,
                            cards: [
                                { id: 1001, title: 'Simulateur de Capacité & CA', url: 'simulateur_capacite.html', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80' },
                                { id: 1002, title: 'Landing Page Dynamique', url: 'https://landingcarpathdynamique.netlify.app', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=80' }
                            ]
                        }
                    ]
                }
            ]
        };

        const iconsList = [
            'folder', 'folder-open', 'file-text', 'file-pdf', 'archive', 'clipboard-text',
            'megaphone', 'target', 'trend-up', 'chart-bar', 'chart-line', 'chart-pie-slice', 'envelope-simple', 'share-network', 'lightbulb', 'projector-screen', 'presentation-chart',
            'currency-eur', 'money', 'wallet', 'shopping-cart', 'tag', 'credit-card', 'receipt', 'bank', 'piggy-bank', 'handshake', 'storefront',
            'users', 'user-circle', 'user-focus', 'briefcase', 'calendar', 'calendar-check', 'clock', 'building-office', 'id-badge',
            'headset', 'chat-circle-text', 'wrench', 'gear', 'lifebuoy', 'question', 'info',
            'device-mobile', 'desktop', 'laptop', 'globe', 'map-pin', 'navigation-arrow', 'qr-code', 'link',
            'star', 'heart', 'thumbs-up', 'check-circle', 'sparkle', 'video-camera', 'camera'
        ];

        document.addEventListener('alpine:init', () => {
            Alpine.data('linktreeApp', () => ({
                editMode: false,
                adminView: 'main', // 'main' | 'category' | 'subcategory'
                editingCategoryId: null,
                editingSubcategoryId: null,
                
                currentCategoryId: null,
                currentSubcategoryId: null,

                settings: JSON.parse(JSON.stringify(defaultState.settings)),
                categories: JSON.parse(JSON.stringify(defaultState.categories)),
                nextId: 2000,
                presetIcons: iconsList,
                audioPlaying: false,
                
                searchQuery: '',
                sidebarOpen: window.innerWidth >= 1024,

                presetColors: ['#1e3a8a', '#0f172a', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6', '#14b8a6', '#f43f5e', '#64748b', '#ffffff', '#000000'],
                presetImages: [
                    'https://images.unsplash.com/photo-1506744626753-1fa28f6e3c03?q=80&w=1920',
                    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1920',
                    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1920',
                    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1920',
                    'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1920',
                    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1920'
                ],
                presetVideos: [
                    'https://cdn.pixabay.com/video/2016/08/22/4762-179738669_large.mp4',
                    'https://cdn.pixabay.com/video/2018/06/17/16769-275143362_large.mp4',
                    'https://cdn.pixabay.com/video/2019/11/04/28731-371452934_large.mp4',
                    'https://cdn.pixabay.com/video/2015/09/21/722-139745585_large.mp4'
                ],
                presetAudios: [
                    { name: 'LoFi Chill', url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3' },
                    { name: 'Corporate Tech', url: 'https://cdn.pixabay.com/audio/2022/10/25/audio_27606e10db.mp3' },
                    { name: 'Ambient Piano', url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3' },
                    { name: 'Acoustic Guitar', url: 'https://cdn.pixabay.com/audio/2021/08/25/audio_981a8c983a.mp3' }
                ],
                mediaLibraryOpen: false,
                mediaLibraryTab: 'colors',

                supabase: null,
                session: null,
                portalSlug: '',
                authEmail: '',
                authPassword: '',
                authError: '',
                authLoading: false,
                isLoading: true, // Nouvelle variable pour bloquer l'affichage du defaultState

                async init() {
                    try {
                        this.supabase = supabase.createClient('https://rugwfkovnisyrjtvjzjb.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1Z3dma292bmlzeXJqdHZqempiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NDc0MDMsImV4cCI6MjEwNDAyMzQwM30.AMGbJDy-HERt3lVRsitKVNf--C3Z3acRz_gvYmp7iSk');
                        
                        const params = new URLSearchParams(window.location.search);
                        this.portalSlug = params.get('p') || 'default';

                        const { data, error } = await this.supabase.auth.getSession();
                        if (data) this.session = data.session;

                        this.supabase.auth.onAuthStateChange((_event, currentSession) => {
                            this.session = currentSession;
                        });

                        await this.loadState();
                        if(this.categories.length === 0) this.editMode = true;
                    } catch (e) {
                        console.error("Erreur critique lors de l'initialisation :", e);
                    } finally {
                        this.isLoading = false;
                    }
                },

                async login() {
                    this.authLoading = true;
                    this.authError = '';
                    
                    // Fallback DOM direct au cas où LastPass n'a pas déclenché d'événement Alpine
                    const emailVal = this.authEmail || document.getElementById('authEmail').value;
                    const passVal = this.authPassword || document.getElementById('authPassword').value;

                    const { error } = await this.supabase.auth.signInWithPassword({
                        email: emailVal.trim().toLowerCase(),
                        password: passVal.trim(),
                    });
                    if (error) {
                        console.error("Erreur Auth:", error);
                        // Afficher l'erreur exacte renvoyée par Supabase (traduite si classique)
                        if (error.message.includes('Email not confirmed')) {
                            this.authError = 'Email non confirmé (Désactivez "Confirm Email" dans Supabase).';
                        } else if (error.message.includes('Invalid login credentials')) {
                            this.authError = 'Email ou mot de passe incorrect.';
                        } else {
                            this.authError = error.message;
                        }
                    }
                    this.authLoading = false;
                },

                async logout() {
                    await this.supabase.auth.signOut();
                    this.editMode = false;
                },

                toggleAudio() {
                    const audioEl = this.$refs.bgAudioPlayer;
                    if (!audioEl) return;
                    if (this.audioPlaying) {
                        audioEl.pause();
                        this.audioPlaying = false;
                    } else {
                        audioEl.play().then(() => {
                            this.audioPlaying = true;
                        }).catch(e => {
                            console.error("Lecture audio bloquée", e);
                            this.audioPlaying = false;
                        });
                    }
                },

                // --- Getters Admin ---
                get activeCategory() {
                    return this.categories.find(c => c.id === this.editingCategoryId);
                },
                get activeSubcategory() {
                    return this.activeCategory?.subcategories.find(s => s.id === this.editingSubcategoryId);
                },

                // --- Getters Public ---
                get currentCategory() {
                    return this.categories.find(c => c.id === this.currentCategoryId);
                },
                get currentSubcategory() {
                    return this.currentCategory?.subcategories.find(s => s.id === this.currentSubcategoryId);
                },
                get searchResults() {
                    if (!this.searchQuery) return [];
                    const q = this.searchQuery.toLowerCase().trim();
                    let results = [];
                    for (const cat of this.categories) {
                        for (const sub of cat.subcategories) {
                            for (const card of sub.cards) {
                                if ((card.title && card.title.toLowerCase().includes(q)) || 
                                    (card.url && card.url.toLowerCase().includes(q))) {
                                    results.push(card);
                                }
                            }
                        }
                    }
                    return results;
                },

                bodyStyle() {
                    if(this.settings.bgType === 'color') {
                        return `background-color: ${this.settings.bgColor}; color: ${this.settings.textColor}`;
                    }
                    return `color: ${this.settings.textColor}`;
                },

                formatDescription(text) {
                    if(!text) return '';
                    return text.replace(/\n/g, '<br>');
                },

                getIconClass(id) {
                    const map = {
                        'document': 'file-text',
                        'chart': 'chart-line',
                        'video': 'video-camera',
                        'mail': 'envelope-simple',
                        'shopping-bag': 'shopping-cart'
                    };
                    const safeId = id || 'folder';
                    return `ph ph-${map[safeId] || safeId} text-xl`;
                },

                // --- Navigation Public ---
                openCategory(id) {
                    this.currentCategoryId = id;
                    this.currentSubcategoryId = null;
                },
                closeCategory() {
                    this.currentCategoryId = null;
                    this.currentSubcategoryId = null;
                },
                openSubcategory(id) {
                    this.currentSubcategoryId = id;
                },
                closeSubcategory() {
                    this.currentSubcategoryId = null;
                },

                // --- Navigation Admin ---
                editCategory(id) {
                    this.editingCategoryId = id;
                    this.adminView = 'category';
                },
                editSubcategory(id) {
                    this.editingSubcategoryId = id;
                    this.adminView = 'subcategory';
                },
                backToAdminMain() {
                    this.editingCategoryId = null;
                    this.editingSubcategoryId = null;
                    this.adminView = 'main';
                    this.saveState();
                },
                backToAdminCategory() {
                    this.editingSubcategoryId = null;
                    this.adminView = 'category';
                    this.saveState();
                },

                // --- Uploads ---
                processFileUpload(file, callback) {
                    if (file) {
                        if (file.size > 10 * 1024 * 1024) { 
                            alert("Le fichier est trop lourd (limite ~10Mo). Préférez utiliser une URL (lien) pour les gros fichiers.");
                            return;
                        }
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            callback(e.target.result);
                            this.saveState();
                        };
                        reader.readAsDataURL(file);
                    }
                },
                
                async pasteImageFromClipboard(callback) {
                    try {
                        const clipboardItems = await navigator.clipboard.read();
                        for (const clipboardItem of clipboardItems) {
                            for (const type of clipboardItem.types) {
                                if (type.startsWith('image/')) {
                                    const blob = await clipboardItem.getType(type);
                                    const file = new File([blob], "pasted-image.png", { type: blob.type });
                                    this.processFileUpload(file, callback);
                                    return;
                                }
                            }
                        }
                        alert("Aucune image trouvée dans le presse-papiers.");
                    } catch (err) {
                        console.error(err);
                        alert("Impossible de lire le presse-papiers. Vérifiez les autorisations de votre navigateur.");
                    }
                },

                handleLogoUpload(event) { this.processFileUpload(event.target.files[0], (res) => this.settings.logoUrl = res); },
                handleLogoPaste() { this.pasteImageFromClipboard((res) => this.settings.logoUrl = res); },
                
                handleBgImageUpload(event) { this.processFileUpload(event.target.files[0], (res) => this.settings.bgImage = res); },
                handleBgPaste() { this.pasteImageFromClipboard((res) => this.settings.bgImage = res); },
                
                handleBgVideoUpload(event) { this.processFileUpload(event.target.files[0], (res) => this.settings.bgVideo = res); },
                
                handleCardImageUpload(event, card) { this.processFileUpload(event.target.files[0], (res) => card.image = res); },
                handleCardImagePaste(card) { this.pasteImageFromClipboard((res) => card.image = res); },

                // --- Gestion des Données ---
                addCategory() {
                    this.nextId++;
                    this.categories.push({
                        id: this.nextId,
                        title: 'Nouvelle Catégorie',
                        subcategories: []
                    });
                    this.saveState();
                    setTimeout(() => {
                        const list = this.$refs.categoriesList;
                        if(list) list.parentElement.scrollTop = list.parentElement.scrollHeight;
                    }, 50);
                },
                removeCategory(index) {
                    if(confirm("Supprimer cette catégorie et tout son contenu ?")) {
                        this.categories.splice(index, 1);
                        this.saveState();
                    }
                },
                addSubcategory() {
                    if(!this.activeCategory) return;
                    this.nextId++;
                    this.activeCategory.subcategories.push({
                        id: this.nextId,
                        title: 'Nouvelle Sous-catégorie',
                        columns: 2,
                        cards: []
                    });
                    this.saveState();
                    setTimeout(() => {
                        const list = this.$refs.subcategoriesList;
                        if(list) list.parentElement.scrollTop = list.parentElement.scrollHeight;
                    }, 50);
                },
                removeSubcategory(index) {
                    if(!this.activeCategory) return;
                    if(confirm("Supprimer cette sous-catégorie et toutes ses cartes ?")) {
                        this.activeCategory.subcategories.splice(index, 1);
                        this.saveState();
                    }
                },
                addCard() {
                    if(!this.activeSubcategory) return;
                    this.nextId++;
                    this.activeSubcategory.cards.push({
                        id: this.nextId,
                        title: 'Nouvelle carte',
                        image: '',
                        url: 'https://'
                    });
                    this.saveState();
                },
                removeCard(index) {
                    if(!this.activeSubcategory) return;
                    if(confirm("Supprimer cette carte ?")) {
                        this.activeSubcategory.cards.splice(index, 1);
                        this.saveState();
                    }
                },
                moveCard(card, currentIndex, targetSubId) {
                    if (!targetSubId || targetSubId == this.activeSubcategory.id) return;
                    
                    let targetCat = null;
                    let targetSub = null;
                    
                    for (const c of this.categories) {
                        const s = c.subcategories.find(sub => sub.id == targetSubId);
                        if (s) {
                            targetCat = c;
                            targetSub = s;
                            break;
                        }
                    }
                    
                    if (targetSub) {
                        this.activeSubcategory.cards.splice(currentIndex, 1);
                        targetSub.cards.push(card);
                        this.categories = [...this.categories]; // Force Alpine reactivity
                        this.saveState();
                    }
                },
                reorderItems(type, oldIndex, newIndex) {
                    let list = null;
                    if (type === 'categories') list = this.categories;
                    else if (type === 'subcategories') list = this.activeCategory?.subcategories;
                    else if (type === 'cards') list = this.activeSubcategory?.cards;
                    else if (type === 'cards_preview') list = this.currentSubcategory?.cards;
                    
                    if (list && oldIndex !== newIndex) {
                        const item = list.splice(oldIndex, 1)[0];
                        list.splice(newIndex, 0, item);
                        this.saveState();
                    }
                },

                async saveState() {
                    const state = {
                        settings: this.settings,
                        categories: this.categories
                    };
                    
                    // Sauvegarde dans Supabase si connecté
                    if (this.session) {
                        const { error } = await this.supabase.from('portals').upsert(
                            { slug: this.portalSlug, state: state }, 
                            { onConflict: 'slug' }
                        );
                        if (error) console.error("Erreur de sauvegarde:", error);
                    }
                },

                migrateIcons(categories) {
                    if (!categories) return [];
                    categories.forEach(cat => {
                        if (cat.icon && !cat.iconType) { cat.iconType = 'preset'; cat.iconValue = cat.icon; delete cat.icon; }
                        if (!cat.iconType) cat.iconType = 'preset';
                        if (cat.subcategories) {
                            cat.subcategories.forEach(sub => {
                                if (sub.icon && !sub.iconType) { sub.iconType = 'preset'; sub.iconValue = sub.icon; delete sub.icon; }
                                else if (!sub.iconType) { sub.iconType = 'none'; }
                                
                                if (sub.cards) {
                                    sub.cards.forEach(card => {
                                        if (card.image && !card.iconType) {
                                            card.iconType = 'custom';
                                            card.iconValue = card.image;
                                            delete card.image;
                                        } else if (card.icon && !card.iconType) {
                                            card.iconType = 'preset';
                                            card.iconValue = card.icon;
                                            delete card.icon;
                                        } else if (!card.iconType) {
                                            card.iconType = 'preset';
                                            card.iconValue = 'link';
                                        }
                                    });
                                }
                            });
                        }
                    });
                    return categories;
                },

                async loadState() {
                    // Charger depuis Supabase via le slug
                    const { data, error } = await this.supabase.from('portals').select('state').eq('slug', this.portalSlug).single();
                    if (data && data.state) {
                        try {
                            const parsed = data.state;
                            this.settings = { ...this.settings, ...parsed.settings };
                            this.categories = this.migrateIcons(parsed.categories || []);
                        } catch (e) { console.error('Load error', e); }
                    } else {
                        // TENTATIVE DE RECUPERATION DES DONNEES LOCALES (Migration)
                        const saved = localStorage.getItem('mssLinktreeState');
                        if (saved) {
                            try {
                                const parsed = JSON.parse(saved);
                                if (parsed.settings) this.settings = { ...this.settings, ...parsed.settings };
                                if (parsed.categories) this.categories = this.migrateIcons(parsed.categories);
                                console.log("Données récupérées depuis le cache local !");
                            } catch (e) { console.error('Local Load error', e); }
                        }
                    }
                },

                resetDefaults() {
                    if(confirm("Attention : Cela effacera toutes vos catégories, sous-catégories, cartes et réglages. Continuer ?")) {
                        localStorage.removeItem('mssLinktreeState');
                        this.settings = JSON.parse(JSON.stringify(defaultState.settings));
                        this.categories = JSON.parse(JSON.stringify(defaultState.categories));
                        this.currentCategoryId = null;
                        this.currentSubcategoryId = null;
                        this.adminView = 'main';
                    }
                }
            }));
        });
    
