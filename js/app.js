import { ProductModule } from './product.js';
import { OrderModule } from './order.js';
import { MCPServer } from './mcp-server.js';
import { CATEGORIES, STYLE_TAGS, INFO_PAGES, MEMBERSHIP_TIERS } from './data.js';

const App = {
    state: {
        currentPage: 'home',
        cat: 'all',
        user: null,
        cart: [],
        wishlist: [],
        orders: [],
        activeDiscount: null,
        searchQuery: '',
        currentP: null,
        selectedSize: null
    },

    async init() {
        ProductModule.init();
        OrderModule.init();
        this.load();
        this.state.cart = OrderModule.cart;
        this.state.orders = OrderModule.orders;

        this.updateUI();
        this.render();

        // Hashchange no longer used for cart toggle to prevent lockups. Left as hook.
        window.addEventListener('hashchange', () => { });

        // Setup Search
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('keypress', e => {
                if (e.key === 'Enter') {
                    this.state.searchQuery = e.target.value;
                    this.state.currentPage = 'shop';
                    this.render();
                    document.getElementById('search-bar').classList.add('hidden');
                }
            });
        }

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') this.closeAllModals();
        });
    },

    save() {
        OrderModule.cart = this.state.cart;
        OrderModule.orders = this.state.orders;
        OrderModule.save();
        localStorage.setItem('trendy_v3_state', JSON.stringify({
            user: this.state.user,
            cart: this.state.cart,
            wishlist: this.state.wishlist,
            orders: this.state.orders
        }));
    },

    load() {
        const s = localStorage.getItem('trendy_v3_state');
        if (s) {
            const d = JSON.parse(s);
            this.state.user = d.user;
            this.state.cart = d.cart || [];
            this.state.wishlist = d.wishlist || [];
            this.state.orders = d.orders || [];
        }
    },

    loadUsers() {
        const s = localStorage.getItem('trendy_v3_users');
        return s ? JSON.parse(s) : {
            'guest@trendy.com': { name: 'Demo', email: 'guest@trendy.com', pass: '123456', spending: 0 }
        };
    },

    saveUsers(users) {
        localStorage.setItem('trendy_v3_users', JSON.stringify(users));
    },

    render() {
        const el = document.getElementById('app-content');
        if (!el) return;
        window.scrollTo(0, 0);
        let html = '';
        switch (this.state.currentPage) {
            case 'home': html = this.renderHome(); break;
            case 'shop': html = this.renderShop(); break;
            case 'preorder': html = this.renderPreorder(); break;
            case 'checkout': html = this.renderCheckout(); break;
            case 'account': html = this.renderAccount(); break;
            case 'order-confirmed': html = this.renderConfirmed(); break;
            default: html = this.renderHome();
        }
        el.innerHTML = html;
        if (window.lucide) lucide.createIcons();
    },

    renderHome() {
        const hot = ProductModule.products.slice(0, 4);
        return `
        <section class="relative h-[90vh] overflow-hidden flex items-center justify-center grain text-center px-4">
            <div class="absolute inset-0 z-0"><img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1800&q=80" class="w-full h-full object-cover opacity-10"></div>
            <div class="relative z-10 space-y-8 fade-up">

                <h1 class="font-display text-7xl md:text-9xl tracking-[-0.05em] uppercase italic">TRENDY<br>潮流系列</h1>
                <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed italic">定義您的街頭語彙。結合極簡美學與 MCP 智慧技術，為您量身打造專屬風格。</p>
                <div class="flex flex-col sm:flex-row justify-center gap-4 pt-10">
                    <button onclick="window.app.navigate('shop')" class="bg-black text-white px-16 py-6 font-display text-xl uppercase tracking-widest hover:bg-gray-800 transition shadow-2xl italic">探索全部系列</button>
                    <button onclick="window.app.openRecommendation()" class="border-2 border-black px-16 py-6 font-display text-xl uppercase tracking-widest hover:bg-black hover:text-white transition italic">智慧服飾推薦</button>
                </div>
            </div>
            <div class="absolute bottom-10 left-1/2 -translate-x-1/2 bounce"><i data-lucide="chevron-down" class="w-8 h-8 opacity-20"></i></div>
        </section>
        <section class="py-32 max-w-[1600px] mx-auto px-4">
            <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                <div><h2 class="font-display text-5xl uppercase mb-2 italic">本季熱選分析</h2><p class="font-mono text-xs text-gray-400 uppercase tracking-widest font-bold italic">熱門趨勢：根據模擬銷售數據排列</p></div>
                <button onclick="window.app.navigate('shop')" class="group flex items-center gap-2 font-mono text-xs uppercase tracking-widest hover:opacity-60 transition">查看全部商品系列 <i data-lucide="arrow-right" class="w-4 h-4 group-hover:translate-x-2 transition-transform"></i></button>
            </div>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-12">${hot.map(p => this.renderCard(p)).join('')}</div>
        </section>
        <section id="marquee" class="bg-black text-white py-40 overflow-hidden relative">
            <div class="marquee-track whitespace-nowrap"><div class="inline-block text-[15vw] font-display uppercase tracking-tighter opacity-10 px-4 italic">極簡 街頭 潮流 Minimal Street Techwear</div><div class="inline-block text-[15vw] font-display uppercase tracking-tighter opacity-10 px-4 italic">極簡 街頭 潮流 Minimal Street Techwear</div></div>
            <div class="absolute inset-0 flex items-center justify-center text-center px-4">
                <div class="max-w-3xl space-y-6">
                    <h3 class="font-display text-4xl md:text-6xl uppercase italic">預購專區現已開啟</h3>
                    <p class="font-mono text-sm tracking-widest text-gray-400 font-bold uppercase italic">獨家優先預購計畫．掌握潮流脈動</p>
                    <button onclick="window.app.navigate('preorder')" class="bg-white text-black px-12 py-4 font-display uppercase tracking-widest hover:opacity-80 transition italic">立即進入預購</button>
                </div>
            </div>
        </section>`;
    },

    renderShop() {
        const list = ProductModule.filter(this.state.cat, this.state.searchQuery);
        return `
        <section class="py-24 max-w-[1600px] mx-auto px-4 text-black">
            <div class="mb-20 space-y-4">
                <h1 class="font-display text-6xl uppercase tracking-tighter italic">${this.state.searchQuery ? `搜尋結果: ${this.state.searchQuery}` : CATEGORIES[this.state.cat].zh}</h1>
                <p class="font-mono text-xs text-gray-400 uppercase tracking-widest font-bold">${list.length} 件精選潮流單品</p>
            </div>
            <div class="flex flex-wrap gap-4 mb-20 border-b border-black/5 pb-10">
                ${Object.entries(CATEGORIES).map(([k, v]) => `<button onclick="window.app.filterCat('${k}')" class="px-8 py-3 font-mono text-xs uppercase tracking-widest transition-all italic font-bold ${this.state.cat === k ? 'bg-black text-white shadow-xl' : 'border border-black/10 hover:border-black'}">${v.zh}</button>`).join('')}
            </div>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-12 gap-y-20">${list.length ? list.map(p => this.renderCard(p)).join('') : '<div class="col-span-full py-40 text-center font-mono opacity-20 text-3xl italic">無相符搜尋商品</div>'}</div>
        </section>`;
    },

    renderPreorder() {
        const list = ProductModule.products.filter(p => p.is_preorder);
        return `<section class="py-24 max-w-[1600px] mx-auto px-4 text-black"><div class="mb-20"><h1 class="font-display text-6xl uppercase tracking-tighter text-amber-600 italic">預購專區</h1><p class="font-mono text-xs text-gray-500 mt-4 uppercase tracking-widest font-bold">獨家優先獲取計畫 Exclusive Early Access</p></div><div class="grid grid-cols-2 lg:grid-cols-4 gap-12">${list.map(p => this.renderCard(p)).join('')}</div></section>`;
    },

    renderCheckout() {
        const u = this.state.user || { spending: 0 };
        const tiers = [...MEMBERSHIP_TIERS].reverse();
        const tier = tiers.find(t => u.spending >= t.min) || MEMBERSHIP_TIERS[0];

        const sub = this.state.cart.reduce((a, b) => {
            const p = ProductModule.getById(b.id);
            return a + (p ? p.price * b.qty : 0);
        }, 0);

        // 1. 會員等級折扣 (MD 中寫到的 95折/90折/85折)
        const tierDiscountRate = (tier.discount || 0) / 100;
        const tierDiscountVal = Math.floor(sub * tierDiscountRate);

        // 2. 優惠碼折扣
        const promoDisc = this.state.activeDiscount ? this.state.activeDiscount.val : 0;

        // 3. 運費 (MD 規則：滿2000免運，金星以上免運)
        const shipping = OrderModule.calculateShipping(sub, tier.id);

        const total = Math.max(0, sub - tierDiscountVal - promoDisc + shipping);

        return `
        <section class="py-24 max-w-4xl mx-auto px-4 text-black">
            <h1 class="font-display text-5xl uppercase mb-12 italic tracking-tighter">結帳程序系統</h1>
            <div class="grid lg:grid-cols-2 gap-16">
                <div class="space-y-8">
                    <div class="p-6 bg-gray-50 rounded-2xl border border-black/5">
                        <p class="font-mono text-[10px] uppercase font-bold text-gray-400 mb-2">當前身分優惠 Current Status</p>
                        <p class="font-display text-lg italic font-bold text-amber-600">${tier.name}：享全站 ${100 - tier.discount}% 折扣 + ${shipping === 0 ? '免運特權' : '運費優惠'}</p>
                    </div>
                    <div class="space-y-4">
                        <label class="font-mono text-[10px] uppercase font-bold text-gray-400">收件人姓名 NAME</label>
                        <input id="chk-name" type="text" value="${this.state.user ? this.state.user.name : ''}" class="w-full border-b-2 border-black/10 focus:border-black outline-none pb-2 text-xl font-bold">
                    </div>
                    <div class="space-y-4">
                        <label class="font-mono text-[10px] uppercase font-bold text-gray-400">電子郵件 EMAIL</label>
                        <input id="chk-email" type="email" value="${this.state.user ? this.state.user.email : ''}" placeholder="example@gmail.com" class="w-full border-b-2 border-black/10 focus:border-black outline-none pb-2 text-xl font-bold">
                    </div>
                    <div class="space-y-4">
                        <label class="font-mono text-[10px] uppercase font-bold text-gray-400">連絡電話 PHONE</label>
                        <input id="chk-phone" type="text" placeholder="09xxxxxxxx" class="w-full border-b-2 border-black/10 focus:border-black outline-none pb-2 text-xl font-bold">
                    </div>
                    <div class="space-y-4">
                        <label class="font-mono text-[10px] uppercase font-bold text-gray-400">配送地址 ADDRESS</label>
                        <textarea id="chk-addr" class="w-full border-b-2 border-black/10 focus:border-black outline-none pb-2 text-lg font-bold" rows="2"></textarea>
                    </div>
                    <div class="space-y-4 pt-4">
                        <label class="font-mono text-[10px] uppercase font-bold text-gray-400">優惠碼 DISCOUNT CODE</label>
                        <div class="flex gap-2">
                            <input id="chk-disc" type="text" placeholder="輸入代碼" class="bg-gray-100 px-4 py-2 outline-none flex-1 font-mono uppercase">
                            <button onclick="window.app.applyDisc()" class="bg-black text-white px-6 py-2 font-mono text-xs uppercase font-bold">套用</button>
                        </div>
                        ${this.state.activeDiscount ? `<p class="text-xs text-green-600 font-bold italic">已套用優惠券: -NT$ ${promoDisc} (${this.state.activeDiscount.code})</p>` : ''}
                    </div>
                    <button onclick="window.app.placeOrder()" class="w-full bg-black text-white py-6 font-display text-2xl uppercase italic tracking-widest hover:bg-gray-800 transition shadow-2xl">確認下單訂購</button>
                </div>
                <div class="bg-gray-50 p-10 rounded-3xl space-y-8 h-fit border border-black/5">
                    <h3 class="font-display text-xl uppercase italic pb-4 border-b">訂單摘要 Summary</h3>
                    <div class="max-h-60 overflow-y-auto space-y-4">${this.state.cart.map(i => {
            const p = ProductModule.getById(i.id);
            return `<div class="flex justify-between text-sm"><span>${p.name_zh} (${i.size}) x ${i.qty}</span><span class="font-bold">NT$ ${(p.price * i.qty).toLocaleString()}</span></div>`;
        }).join('')}</div>
                    <div class="pt-6 border-t border-black/10 space-y-3">
                        <div class="flex justify-between text-xs text-gray-400 font-bold uppercase"><span>小計</span><span>NT$ ${sub.toLocaleString()}</span></div>
                        ${tierDiscountVal > 0 ? `<div class="flex justify-between text-xs text-amber-600 font-bold uppercase"><span>會員等級折抵 (${tier.name})</span><span>-NT$ ${tierDiscountVal.toLocaleString()}</span></div>` : ''}
                        <div class="flex justify-between text-xs text-red-500 font-bold uppercase"><span>優惠券折抵</span><span>-NT$ ${promoDisc.toLocaleString()}</span></div>
                        <div class="flex justify-between text-xs text-blue-500 font-bold uppercase"><span>運費</span><span>${shipping === 0 ? 'FREE 免運' : `NT$ ${shipping.toLocaleString()}`}</span></div>
                        <div class="flex justify-between items-baseline pt-6 border-t border-dotted border-black/20">
                            <span class="font-mono text-xs uppercase font-bold">應付總額 TOTAL</span>
                            <span class="font-display text-4xl italic tracking-tighter">NT$ ${total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>`;
    },

    renderAccount() {
        const u = this.state.user || { name: '訪客', email: 'Guest', spending: 0 };
        const tiers = [...MEMBERSHIP_TIERS].reverse();
        const tier = tiers.find(t => u.spending >= t.min) || MEMBERSHIP_TIERS[0];
        return `
        <section class="py-24 max-w-7xl mx-auto px-4 text-black">
            <div class="grid lg:grid-cols-3 gap-12">
                <div class="lg:col-span-1 space-y-8">
                    <div class="glass-card p-10 rounded-3xl space-y-6">
                        <div class="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white text-3xl font-display">T</div>
                        <div>
                            <h2 class="font-display text-3xl italic">${u.name}</h2>
                            <p class="text-gray-400 font-mono text-xs uppercase tracking-widest font-bold">${u.email}</p>
                            <div class="flex gap-4 mt-4">
                                <button onclick="window.app.editProfile()" class="font-mono text-[10px] uppercase font-bold text-gray-400 underline hover:text-black">Edit Profile</button>
                                <button onclick="window.app.exportOrdersToCSV()" class="font-mono text-[10px] uppercase font-bold text-amber-600 underline hover:text-amber-700">匯出 CSV 報表</button>
                            </div>
                        </div>
                        <div class="pt-6 border-t border-black/5 space-y-4">
                            <div>
                                <p class="font-mono text-[10px] uppercase text-gray-400 font-bold">目前等級 Tier</p>
                                <p class="font-display text-2xl ${tier.color} italic font-bold">${tier.name}</p>
                            </div>
                            <div class="bg-gray-100 p-4 rounded-xl">
                                <p class="font-mono text-[10px] uppercase text-gray-400 font-bold mb-2">專屬權益 Benefits</p>
                                <ul class="text-[11px] space-y-1 font-bold">
                                    ${tier.benefits.map(b => `<li class="flex items-center gap-2">✅ ${b}</li>`).join('')}
                                </ul>
                            </div>
                            ${(() => {
                const nextIdx = MEMBERSHIP_TIERS.findIndex(t => t.id === tier.id) + 1;
                const next = MEMBERSHIP_TIERS[nextIdx];
                if (next) {
                    const diff = next.min - u.spending;
                    const perc = Math.min(100, (u.spending / next.min) * 100);
                    return `
                                    <div class="p-4 bg-gray-50 rounded-2xl border border-black/5 relative overflow-hidden">
                                        <div class="flex justify-between text-[10px] font-mono font-bold mb-3 relative z-10">
                                            <span class="uppercase tracking-widest">🚀 距離下級還差</span>
                                            <span class="text-amber-600">NT$ ${diff.toLocaleString()}</span>
                                        </div>
                                        <div class="h-2 bg-gray-200 rounded-full overflow-hidden relative z-10">
                                            <div class="h-full bg-black transition-all duration-1000" style="width: ${perc}%"></div>
                                        </div>
                                    </div>`;
                }
                return '<p class="text-xs font-mono text-green-600 font-bold uppercase tracking-widest text-center py-2">💎 您已晉升最高鑽石會員</p>';
            })()}
                        </div>
                        <div class="pt-6 border-t border-black/5">
                            <p class="font-mono text-[10px] uppercase text-gray-400 font-bold mb-4">我的優惠券 VOUCHERS</p>
                            <div class="space-y-2">
                                <div class="bg-amber-50 border border-amber-200 p-3 rounded-lg flex justify-between items-center">
                                    <div><p class="text-[10px] font-bold">WELCOME10</p><p class="text-[8px] text-gray-400">新會員 9 折</p></div>
                                    <span class="bg-amber-500 text-white text-[9px] px-2 py-0.5 rounded-full">可使用</span>
                                </div>
                                <div class="bg-gray-50 border border-gray-200 p-3 rounded-lg flex justify-between items-center opacity-50">
                                    <div><p class="text-[10px] font-bold">BDAY500</p><p class="text-[8px] text-gray-400">生日專屬抵用代金券</p></div>
                                    <span class="bg-gray-400 text-white text-[9px] px-2 py-0.5 rounded-full">未到期</span>
                                </div>
                            </div>
                        </div>
                        <button onclick="window.app.logout()" class="w-full border border-red-200 text-red-500 py-3 rounded-xl font-mono text-xs uppercase font-bold hover:bg-red-50 transition">登出帳戶 LOGOUT</button>
                    </div>
                </div>
                <div class="lg:col-span-2 space-y-12">
                    <h2 class="font-display text-4xl uppercase italic">歷史訂單紀錄 ORDER HISTORY</h2>
                    ${this.state.orders.length ? [...this.state.orders].reverse().map(o => {
                const totalCount = (o.in_stock ? o.in_stock.length : 0) + (o.preorders ? o.preorders.length : 0);
                const status = o.preorders && o.preorders.length > 0 ? '預購排程中' : '包裹配送中';
                return `
                        <div class="glass-card p-8 rounded-2xl space-y-6 relative border border-black/5">
                            <div class="flex justify-between items-center font-mono text-xs uppercase font-bold border-b border-black/5 pb-4">
                                <span><i data-lucide="receipt" class="w-4 h-4 inline mr-1 opacity-50"></i> ${o.id}</span>
                                <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[9px] tracking-widest">${status}</span>
                            </div>
                            <div class="grid md:grid-cols-2 gap-8">
                                <div class="space-y-4">
                                    <p class="font-bold text-lg">${totalCount} 件潮流單品</p>
                                    <div class="space-y-2">
                                        <div class="flex items-center gap-3 text-xs text-gray-500">
                                            <i data-lucide="truck" class="w-4 h-4"></i>
                                            <span>物流單號：TRENDY-${o.id.split('-')[1]}</span>
                                        </div>
                                        <div class="flex items-center gap-3 text-xs text-gray-500">
                                            <i data-lucide="map-pin" class="w-4 h-4"></i>
                                            <span class="truncate">${o.address}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="text-right space-y-1">
                                    <p class="text-gray-400 font-mono text-[10px] uppercase font-bold">應付總額 TOTAL</p>
                                    <p class="font-display text-4xl italic font-bold tracking-tighter">NT$ ${o.total.toLocaleString()}</p>
                                    <p class="text-[10px] text-gray-400 uppercase font-bold">${o.date} 完成訂購</p>
                                </div>
                            </div>
                        </div>`;
            }).join('') : '<div class="py-40 text-center glass-card rounded-3xl opacity-30 italic font-display text-2xl uppercase tracking-widest">尚無訂單紀錄</div>'}
                </div>
            </div>
        </section>`;
    },

    renderConfirmed() {
        return `<section class="py-40 text-center space-y-8 fade-up text-black"><div class="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white mb-6"><i data-lucide="check" class="w-12 h-12"></i></div><h1 class="font-display text-6xl uppercase italic">訂單已完成！</h1><p class="text-gray-500 font-mono text-sm tracking-widest font-bold">感謝您的訂購。訂單正全速處理中。</p><button onclick="window.app.navigate('home')" class="bg-black text-white px-12 py-4 font-display uppercase italic tracking-widest hover:bg-gray-800 transition">回到首頁</button></section>`;
    },

    renderCard(p) {
        const isW = this.state.wishlist.includes(p.id);
        return `
        <div class="group relative" onclick="window.app.openModal('${p.id}')">
            <div class="aspect-[3/4] overflow-hidden bg-gray-50 mb-6 relative">
                <img src="${p.images.main}" class="w-full h-full object-cover img-zoom">
                <div class="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform bg-gradient-to-t from-black/60 to-transparent">
                    <button class="w-full bg-white text-black py-4 font-display text-xs uppercase tracking-widest hover:bg-black hover:text-white transition italic font-bold">快速商品查看</button>
                </div>
                <button onclick="event.stopPropagation();window.app.toggleWish('${p.id}')" title="加入願望清單" class="absolute top-4 right-4 p-3 glass rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-90 shadow-md">
                    <i data-lucide="heart" class="w-5 h-5 ${isW ? 'fill-red-500 stroke-red-500' : 'text-black'}"></i>
                </button>
                ${p.is_preorder ? '<span class="absolute top-4 left-4 preorder-badge shadow-lg font-bold">預購中 PREORDER</span>' : ''}
                ${p.compare_price ? '<span class="absolute top-4 left-4 bg-red-600 text-white font-mono text-[10px] px-2 py-1 uppercase tracking-tighter shadow-lg font-bold' + (p.is_preorder ? ' mt-10' : '') + '">限時特價 SALE</span>' : ''}
            </div>
            <div class="space-y-1">
                <div class="flex justify-between items-start"><h3 class="font-bold text-lg leading-tight uppercase">${p.name_zh}</h3></div>
                <p class="text-xs text-gray-400 font-mono tracking-wide uppercase">${p.name_en}</p>
                <div class="flex items-baseline gap-3 pt-2">
                    <p class="font-display text-2xl tracking-tighter">NT$ ${p.price.toLocaleString()}</p>
                    ${p.compare_price ? `<p class="text-sm text-gray-300 line-through font-mono italic">NT$ ${p.compare_price.toLocaleString()}</p>` : ''}
                </div>
            </div>
        </div>`;
    },

    navigate(p) {
        if (p === 'account' && !this.state.user) {
            document.getElementById('auth-modal').classList.remove('hidden');
            this.toggleAuthMode('login');
            return;
        }
        this.state.currentPage = p;
        this.render();
    },

    toggleAuthMode(mode) {
        document.getElementById('auth-login').classList.toggle('hidden', mode !== 'login');
        document.getElementById('auth-reg').classList.toggle('hidden', mode !== 'reg');
    },

    login() {
        const email = document.getElementById('login-email').value.trim();
        const pass = document.getElementById('login-pass').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !pass) return alert('請完整輸入帳號與密碼');
        if (!emailRegex.test(email)) return alert('請輸入有效的電子郵件格式');

        const users = this.loadUsers();
        const user = users[email];

        if (!user) return alert('找不到該帳號，請先註冊會員');
        if (user.pass !== pass) return alert('密碼錯誤，請重新輸入');

        this.state.user = { name: user.name, email: user.email, spending: user.spending || 0 };
        this.save();
        document.getElementById('auth-modal').classList.add('hidden');
        this.navigate('account');
    },

    register() {
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const pass = document.getElementById('reg-pass').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name || !email || !pass) return alert('請完整填寫註冊資料');
        if (name.length < 2) return alert('姓名長度不足');
        if (!emailRegex.test(email)) return alert('請輸入有效的電子郵件格式');
        if (pass.length < 6) return alert('密碼長度至少需要 6 位數(包含英文數字)');

        const users = this.loadUsers();
        if (users[email]) return alert('此電子郵件已經註冊過，如果您是此電子郵件的擁有者，請直接登入。');

        const newUser = { name, email, pass, spending: 0 };
        users[email] = newUser;
        this.saveUsers(users);

        this.state.user = { name: newUser.name, email: newUser.email, spending: 0 };
        this.save();
        document.getElementById('auth-modal').classList.add('hidden');
        this.navigate('account');
        alert('註冊成功！歡迎來到 TRENDY MALL，享受您的專屬會員福利。');
    },

    logout() { this.state.user = null; this.save(); this.navigate('home'); },

    editProfile() {
        const newName = prompt('請輸入新的姓名：', this.state.user.name);
        if (newName === null) return;
        if (newName.trim().length < 2) return alert('姓名長度不足，修改失敗');

        const newPass = prompt('請輸入新密碼\n(長度需大於等於 6 個字元，若不修改請直接留空按下確認)：');
        const users = this.loadUsers();
        const storedUser = users[this.state.user.email];

        if (storedUser) {
            storedUser.name = newName.trim();
            if (newPass !== null && newPass.trim().length > 0) {
                if (newPass.trim().length < 6) return alert('密碼長度不足 6 位數，修改失敗');
                storedUser.pass = newPass.trim();
            }
            this.saveUsers(users);
        }

        this.state.user.name = newName.trim();
        this.save();
        this.render();
        alert('個人資料修改成功！');
    },

    filterCat(c) { this.state.cat = c; this.state.searchQuery = ''; this.render(); },

    updateUI() {
        const c = this.state.cart.reduce((a, b) => a + b.qty, 0);
        const b = document.getElementById('cart-count');
        if (b) {
            if (c > 0) { b.textContent = c; b.classList.remove('hidden'); }
            else b.classList.add('hidden');
        }
    },

    openModal(id) {
        const p = ProductModule.getById(id);
        if (!p) return;
        this.state.currentP = p;
        this.state.selectedSize = null;
        const modal = document.getElementById('product-modal');
        const content = document.getElementById('product-modal-content');
        content.innerHTML = `
        <div class="p-8 lg:p-16"><div class="grid lg:grid-cols-2 gap-16">
            <div class="space-y-6">
                <div class="aspect-[3/4] overflow-hidden bg-gray-50 rounded-2xl shadow-xl relative"><img id="modal-img" src="${p.images.main}" class="w-full h-full object-cover"></div>
                <div class="grid grid-cols-5 gap-3">${Object.values(p.images).map(u => `<img src="${u}" onclick="document.getElementById('modal-img').src='${u}'" class="aspect-square object-cover cursor-pointer rounded-lg hover:opacity-70 transition border border-black/5">`).join('')}</div>
            </div>
            <div class="space-y-12">
                <div class="space-y-6">
                    <div class="flex justify-between items-start"><div class="space-y-2"><h2 class="font-display text-5xl uppercase tracking-tight leading-[0.9] italic">${p.name_zh}</h2><p class="text-gray-400 font-mono text-sm tracking-widest capitalize font-bold">${p.name_en}</p></div><button onclick="window.app.closeModal()"><i data-lucide="x" class="w-10 h-10"></i></button></div>
                    <div class="flex items-baseline gap-6"><p class="text-6xl font-display tracking-tighter italic">NT$ ${p.price.toLocaleString()}</p></div>
                </div>
                <div class="space-y-6 text-black">
                    <h3 class="font-display text-sm uppercase tracking-widest font-bold">請選擇尺寸 Select Size</h3>
                    <div class="flex flex-wrap gap-3">${p.sizes.map(s => `<button onclick="window.app.selSize('${s}', this)" class="size-opt border-2 border-black/10 px-6 py-2 rounded-xl font-display text-lg hover:border-black transition-all shadow-tiny">${s}</button>`).join('')}</div>
                </div>
                <button onclick="window.app.addCart()" class="w-full bg-black text-white py-6 font-display text-2xl uppercase tracking-widest hover:bg-gray-800 transition shadow-2xl flex items-center justify-center gap-4 italic tracking-tighter"><i data-lucide="shopping-bag" class="w-6 h-6"></i> 放入購物車系統</button>
            </div>
        </div></div>`;
        modal.classList.remove('hidden');
        if (window.lucide) lucide.createIcons();
    },

    closeModal() { document.getElementById('product-modal').classList.add('hidden'); },
    selSize(s, btn) {
        this.state.selectedSize = s;
        document.querySelectorAll('.size-opt').forEach(b => b.classList.remove('active', 'bg-black', 'text-white'));
        btn.classList.add('active', 'bg-black', 'text-white');
    },

    toggleCart() {
        const d = document.getElementById('cart-drawer');
        if (d.classList.contains('hidden')) { this.renderCart(); d.classList.remove('hidden'); }
        else d.classList.add('hidden');
    },

    renderCart() {
        const itemsEl = document.getElementById('cart-items');
        const footerEl = document.getElementById('cart-footer');
        if (!this.state.cart.length) {
            itemsEl.innerHTML = '<p class="text-center py-20 font-mono opacity-30 italic">目前購物車是空的</p>';
            footerEl.innerHTML = `<button onclick="window.app.toggleCart()" class="w-full border-2 border-black py-4 font-display uppercase italic">繼續逛逛</button>`;
            return;
        }
        itemsEl.innerHTML = this.state.cart.map(i => {
            const p = ProductModule.getById(i.id);
            return `<div class="flex gap-4 border-b border-black/5 pb-4 text-black"><img src="${p.images.main}" class="w-20 h-24 object-cover rounded-lg"><div class="flex-1 space-y-1"><h4 class="font-bold uppercase text-sm">${p.name_zh}</h4><p class="text-xs text-gray-400">SIZE: ${i.size}</p><div class="flex justify-between items-center pt-2"><div class="flex items-center border border-black/10 rounded-lg overflow-hidden"><button onclick="window.app.updateQty('${i.id}', '${i.size}', -1)" class="px-3 py-1 hover:bg-black/5">-</button><span class="px-4 font-mono text-sm">${i.qty}</span><button onclick="window.app.updateQty('${i.id}', '${i.size}', 1)" class="px-3 py-1 hover:bg-black/5">+</button></div><p class="font-display">NT$ ${(p.price * i.qty).toLocaleString()}</p></div></div></div>`;
        }).join('');
        const sub = this.state.cart.reduce((a, b) => { const p = ProductModule.getById(b.id); return a + (p ? p.price * b.qty : 0); }, 0);
        footerEl.innerHTML = `<div class="flex justify-between items-baseline mb-6 text-black"><span class="font-mono text-xs uppercase font-bold text-gray-400">小計 Subtotal</span><span class="font-display text-3xl italic tracking-tighter">NT$ ${sub.toLocaleString()}</span></div><button onclick="window.app.toggleCart(); if(!window.app.state.user){ alert('為了給您完整的會員累計消費福利，請先登入或註冊後再進行結帳！'); window.app.navigate('account'); } else { window.app.navigate('checkout'); }" class="w-full bg-black text-white py-6 font-display text-xl uppercase italic tracking-widest hover:bg-gray-800 transition shadow-2xl">前往結帳系統</button>`;
    },

    updateQty(id, size, delta) {
        const i = this.state.cart.find(x => x.id === id && x.size === size);
        if (i) {
            i.qty += delta;
            if (i.qty <= 0) this.state.cart = this.state.cart.filter(x => x !== i);
            this.save(); this.updateUI(); this.renderCart();
        }
    },

    addCart() {
        if (!this.state.selectedSize) return alert('請務必先選擇一個尺寸');
        const p = this.state.currentP;
        try {
            OrderModule.addToCart(p, this.state.selectedSize, 1);
            this.state.cart = OrderModule.cart;
            this.save(); this.updateUI(); this.closeModal();
            alert(`已將 ${p.name_zh} 放入購物車`);
        } catch (e) { alert(e.message); }
    },

    applyDisc() {
        const code = document.getElementById('chk-disc').value.trim().toUpperCase();
        const d = OrderModule.discountCodes[code];
        if (!d) return alert('無效的優惠碼');
        const sub = this.state.cart.reduce((a, b) => { const p = ProductModule.getById(b.id); return a + (p ? p.price * b.qty : 0); }, 0);
        if (d.min && sub < d.min) return alert(`需滿 NT$ ${d.min.toLocaleString()} 使用`);
        let val = d.value;
        if (d.type === 'percent') val = Math.floor(sub * (d.value / 100));
        if (d.max && val > d.max) val = d.max;
        this.state.activeDiscount = { code, val };
        this.render();
    },

    async placeOrder() {
        const u = this.state.user || { spending: 0 };
        const tiers = [...MEMBERSHIP_TIERS].reverse();
        const tier = tiers.find(t => u.spending >= t.min) || MEMBERSHIP_TIERS[0];

        const form = {
            name: document.getElementById('chk-name').value,
            email: document.getElementById('chk-email').value,
            phone: document.getElementById('chk-phone').value,
            address: document.getElementById('chk-addr').value
        };
        const err = OrderModule.validateOrder(form); if (err) return alert(err);

        const sub = this.state.cart.reduce((a, b) => { const p = ProductModule.getById(b.id); return a + (p ? p.price * b.qty : 0); }, 0);
        const tierDiscountVal = Math.floor(sub * ((tier.discount || 0) / 100));
        const promoDisc = this.state.activeDiscount ? this.state.activeDiscount.val : 0;
        const shipping = OrderModule.calculateShipping(sub, tier.id);

        const total = Math.max(0, sub - tierDiscountVal - promoDisc + shipping);

        if (this.state.user) {
            this.state.user.spending += total;
            const users = this.loadUsers();
            if (users[this.state.user.email]) {
                users[this.state.user.email].spending = this.state.user.spending;
                this.saveUsers(users);
            }
        }
        const preorders = [];
        const in_stock = [];
        this.state.cart.forEach(item => {
            const p = ProductModule.getById(item.id);
            if (p && p.is_preorder) preorders.push(item);
            else in_stock.push(item);
        });

        const o = { id: 'ORD-' + Date.now(), date: new Date().toLocaleDateString(), in_stock, preorders, items: [...this.state.cart], subtotal: sub, shipping: shipping, discount: (tierDiscountVal + promoDisc), total: total, ...form };
        this.state.orders.push(o); this.state.cart = []; this.state.activeDiscount = null;
        this.save(); this.updateUI(); this.state.currentPage = 'order-confirmed'; this.render();
    },

    toggleWish(id) {
        const i = this.state.wishlist.indexOf(id);
        if (i === -1) this.state.wishlist.push(id); else this.state.wishlist.splice(i, 1);
        this.save(); this.render();
    },

    openRecommendation() { document.getElementById('recommend-modal').classList.remove('hidden'); document.getElementById('recommend-form').classList.remove('hidden'); document.getElementById('recommend-results').classList.add('hidden'); },

    async processRecommendation() {
        const h = parseFloat(document.getElementById('rec-height').value);
        const w = parseFloat(document.getElementById('rec-weight').value);

        if (!h || !w) return alert('請填寫身高與體重資料');
        if (h < 50 || h > 250) return alert('請輸入正常的身高範圍 (50-250cm)');
        if (w < 10 || w > 300) return alert('請輸入正常的體重範圍 (10-300kg)');

        const weather = await MCPServer.fetchWeather();
        const bmi = w / ((h / 100) * (h / 100));
        const res = await MCPServer.getRecommendation(bmi, weather, ProductModule.products, { height: h, weight: w });
        const el = document.getElementById('recommend-results');
        document.getElementById('recommend-form').classList.add('hidden');
        el.classList.remove('hidden');
        el.innerHTML = `<div class="space-y-8 text-black"><div class="bg-black text-white p-10 rounded-3xl"><h3 class="font-display text-2xl mb-4 italic">MCP 核心分析脈絡</h3><p class="text-lg leading-relaxed">${res.reasoning}</p></div><div class="grid grid-cols-2 gap-4">${res.items.map(p => `<div onclick="window.app.openModal('${p.id}')" class="cursor-pointer"><img src="${p.images.main}" class="rounded-2xl aspect-[3/4] object-cover mb-2"><p class="font-bold text-xs uppercase truncate">${p.name_zh}</p></div>`).join('')}</div><button onclick="document.getElementById('recommend-modal').classList.add('hidden')" class="w-full border-2 border-black py-4 font-display uppercase italic">關閉</button></div>`;
    },

    openInfo(id) {
        const page = INFO_PAGES[id];
        if (!page) return;
        const modal = document.getElementById('product-modal'); // Reusing product modal for info
        const content = document.getElementById('product-modal-content');
        content.innerHTML = `
        <div class="p-10 lg:p-20 space-y-12 text-black max-w-3xl mx-auto">
            <div class="flex justify-between items-start border-b border-black/10 pb-8">
                <div class="space-y-2">
                    <h2 class="font-display text-4xl uppercase italic">${page.t}</h2>
                    <p class="font-mono text-xs text-gray-400 uppercase tracking-widest font-bold">${page.e}</p>
                </div>
                <button onclick="window.app.closeModal()"><i data-lucide="x" class="w-8 h-8"></i></button>
            </div>
            <div class="prose prose-sm font-sans leading-relaxed text-gray-700">
                ${page.b}
            </div>
            <button onclick="window.app.closeModal()" class="w-full bg-black text-white py-4 font-display uppercase italic tracking-widest hover:opacity-80 transition shadow-xl mt-10">已了解</button>
        </div>`;
        modal.classList.remove('hidden');
        if (window.lucide) lucide.createIcons();
    },

    closeAllModals() { this.closeModal(); document.getElementById('recommend-modal').classList.add('hidden'); document.getElementById('search-bar').classList.add('hidden'); document.getElementById('auth-modal').classList.add('hidden'); }
};

window.app = App;
document.addEventListener('DOMContentLoaded', () => App.init());
