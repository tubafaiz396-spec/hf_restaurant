"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, ChevronDown, Clock3, Heart, MapPin, Minus, Plus, Search, ShoppingBag, Star, X } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { createOrder } from "@/app/actions/orders"

const products = [
  { id: 1, name: "Smoky HF Burger", category: "Burgers", price: 12.5, description: "Charred beef, smoked cheddar, crisp lettuce and our house sauce.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85", tag: "Bestseller" },
  { id: 2, name: "Tandoori Chicken Wrap", category: "Wraps", price: 10.5, description: "Spiced chicken, fresh herbs, pickled onions and cooling yogurt.", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=85", tag: "Chef's pick" },
  { id: 3, name: "Golden Crunch Wings", category: "Chicken", price: 11, description: "Crispy wings tossed in your choice of hot honey or garlic pepper.", image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=900&q=85", tag: "Popular" },
  { id: 4, name: "Loaded HF Fries", category: "Sides", price: 7.5, description: "Skin-on fries, cheese sauce, chives and a bright house relish.", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85", tag: "New" },
  { id: 5, name: "Mango Cream Lassi", category: "Drinks", price: 5.5, description: "Silky yogurt, ripe mango and a touch of cardamom.", image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=900&q=85", tag: "Refreshing" },
  { id: 6, name: "Chocolate Lava Cake", category: "Desserts", price: 8, description: "Warm dark chocolate cake with a molten center and vanilla cream.", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=85", tag: "Sweet finish" },
]
const categories = ["All", "Burgers", "Wraps", "Chicken", "Sides", "Drinks", "Desserts"]

type CartItem = (typeof products)[number] & { quantity: number }

export default function Home() {
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const [activeCategory, setActiveCategory] = useState("All")
  const [search, setSearch] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const [welcomeOpen, setWelcomeOpen] = useState(true)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [checkoutError, setCheckoutError] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")

  const filtered = useMemo(() => products.filter((item) => (activeCategory === "All" || item.category === activeCategory) && `${item.name} ${item.description}`.toLowerCase().includes(search.toLowerCase())), [activeCategory, search])
  const count = cart.reduce((sum, item) => sum + item.quantity, 0)
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  function addToCart(product: (typeof products)[number]) {
    setCart((current) => current.some((item) => item.id === product.id) ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { ...product, quantity: 1 }])
    setToast(`${product.name} added to your bag`)
    setCartOpen(true)
    window.setTimeout(() => setToast(""), 2200)
  }
  function updateQuantity(id: number, delta: number) { setCart((current) => current.map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0)) }
  function beginCheckout() {
    if (!cart.length) return
    setCartOpen(false)
    setCheckoutOpen(true)
  }
  async function placeOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) return
    setCheckoutError("")
    try {
      const order = await createOrder({
        customerName,
        customerPhone,
        deliveryAddress: customerAddress,
        items: cart.map(({ id, name, price, quantity }) => ({ id, name, price, quantity })),
      })
      setOrderId(order.id)
      setCheckoutOpen(false)
      setOrderPlaced(true)
    } catch {
      setCheckoutError("We couldn't save your order. Please check your details and try again.")
    }
  }

  return (
    <main className="site-shell">
      <header className="nav-wrap">
        <nav className="nav container" aria-label="Main navigation">
          <a className="brand" href="#top"><span className="brand-mark">HF</span><span><strong>HF</strong> Restaurant</span></a>
          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            <a href="#menu" onClick={() => setMenuOpen(false)}>Menu</a><a href="#story" onClick={() => setMenuOpen(false)}>Our story</a><a href="#offers" onClick={() => setMenuOpen(false)}>Offers</a><a href="#visit" onClick={() => setMenuOpen(false)}>Visit us</a>
          </div>
          <div className="nav-actions"><button className="icon-button search-button" aria-label="Search menu" onClick={() => document.getElementById("menu-search")?.focus()}><Search size={18} /></button><button className="bag-button" onClick={() => setCartOpen(true)}><ShoppingBag size={17} /> Bag <span>{count}</span></button><button className="menu-toggle" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <ChevronDown size={20} />}</button></div>
        </nav>
      </header>

      <section className="hero" id="top"><div className="hero-image" /><div className="hero-overlay" /><div className="container hero-content"><p className="eyebrow light">Good food, good mood</p><h1>Made with feeling.<br /><em>Served with soul.</em></h1><p className="hero-copy">Big flavours, familiar comforts, and a little something unexpected. Welcome to your new favourite table.</p><div className="hero-actions"><a href="#menu" className="button button-light">Explore the menu <ArrowRight size={16} /></a><a href="#story" className="text-link light">Our story <ArrowRight size={15} /></a></div></div><div className="hero-note"><span>Open today</span><strong>11:00 — 23:00</strong></div></section>

      <section className="intro section" id="story"><div className="container intro-grid"><div><p className="eyebrow">The HF way</p><h2>Comfort food with a <em>point of view.</em></h2></div><div className="intro-copy"><p>HF Restaurant is a neighbourhood kitchen built around generous portions, bold seasoning, and the simple joy of sharing a good meal.</p><p>From our signature burgers to our family-inspired desi favourites, every dish is made to feel both familiar and new.</p><a className="text-link" href="#menu">Discover our menu <ArrowRight size={15} /></a></div></div></section>

      <section className="feature-band"><div className="feature-image" /><div className="feature-copy"><p className="eyebrow light">The house favourite</p><h2>Meet the<br /><em>Smoky HF.</em></h2><p>Our best-selling burger: flame-grilled, loaded with smoked cheddar, and finished with a swipe of our secret sauce.</p><button className="button button-outline" onClick={() => addToCart(products[0])}>Add to bag <Plus size={16} /></button></div></section>

      <section className="menu-section section" id="menu"><div className="container"><div className="section-heading"><div><p className="eyebrow">Take your pick</p><h2>Something for <em>everyone.</em></h2></div><div className="search-field"><Search size={17} /><input id="menu-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search the menu" aria-label="Search the menu" /></div></div><div className="category-row" role="tablist">{categories.map((category) => <button key={category} className={activeCategory === category ? "category active" : "category"} onClick={() => setActiveCategory(category)}>{category}</button>)}</div><div className="product-grid">{filtered.map((product) => <article className="product-card" key={product.id}><div className="product-image"><img src={product.image} alt={product.name} /><span>{product.tag}</span><button className="heart" aria-label={`Save ${product.name}`}><Heart size={17} /></button></div><div className="product-info"><div><h3>{product.name}</h3><p>{product.description}</p></div><div className="product-bottom"><strong>${product.price.toFixed(2)}</strong><button className="add-button" onClick={() => addToCart(product)} aria-label={`Add ${product.name} to bag`}><Plus size={18} /></button></div></div></article>)}</div>{filtered.length === 0 && <p className="empty-state">No dishes found. Try another search.</p>}</div></section>

      <section className="offer section" id="offers"><div className="container offer-card"><div><p className="eyebrow">For the table</p><h2>Feed the whole<br /><em>crew.</em></h2><p>Two mains, a side to share, and something cold to drink. Our easy-going dinner deal is made for good company.</p><button className="button button-dark" onClick={() => { setActiveCategory("Burgers"); document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" }) }}>See the menu <ArrowRight size={16} /></button></div><div className="offer-image"><img src="https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=1100&q=85" alt="Friends sharing a meal" /></div></div></section>

      <section className="visit section" id="visit"><div className="container visit-grid"><div><p className="eyebrow">Come say hello</p><h2>Your table is<br /><em>waiting.</em></h2><div className="details"><p><MapPin size={18} /> 14 Garden Street, Lahore</p><p><Clock3 size={18} /> Mon — Sun · 11:00 — 23:00</p></div></div><div className="quote"><Star size={18} fill="currentColor" /><p>“The kind of place you find yourself thinking about the next day.”</p><span>— A very happy regular</span></div></div></section>

      <footer className="footer"><div className="container footer-grid"><div><a className="brand footer-brand" href="#top"><span className="brand-mark">HF</span><span><strong>HF</strong> Restaurant</span></a><p>Good food, good mood.<br />Developed by Tuba Hassan.</p></div><div><p className="footer-label">Explore</p><a href="#menu">Menu</a><a href="#story">Our story</a><a href="#offers">Offers</a></div><div><p className="footer-label">Say hello</p><a href="mailto:hello@hfrestaurant.com">hello@hfrestaurant.com</a><a href="#visit">Find us · Lahore</a></div><div className="social"><Star size={19} /><span>Follow along<br /><strong>@hf.restaurant</strong></span></div></div><div className="container footer-bottom"><span>© 2026 HF Restaurant. Sample menu content.</span><span>Made for sharing.</span></div></footer>

      {toast && <div className="toast" role="status">{toast}</div>}
      {cartOpen && <div className="drawer-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(e) => e.stopPropagation()}><div className="drawer-head"><div><p className="eyebrow">Your order</p><h2>Your bag</h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close bag"><X size={20} /></button></div>{cart.length === 0 ? <div className="empty-cart"><ShoppingBag size={32} /><p>Your bag is waiting for something delicious.</p><button className="button button-dark" onClick={() => setCartOpen(false)}>Keep browsing</button></div> : <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><img src={item.image} alt="" /><div><h3>{item.name}</h3><strong>${(item.price * item.quantity).toFixed(2)}</strong><div className="quantity"><button onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease quantity"><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)} aria-label="Increase quantity"><Plus size={13} /></button></div></div></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><strong>${total.toFixed(2)}</strong></div><p>Delivery and taxes calculated at checkout.</p><button className="button button-dark full" onClick={beginCheckout}>Continue to checkout <ArrowRight size={16} /></button></div></>}</aside></div>}
      {welcomeOpen && <div className="welcome-backdrop"><section className="welcome-card" role="dialog" aria-modal="true" aria-labelledby="welcome-title"><div className="welcome-mark">HF</div><p className="eyebrow">Welcome to HF Restaurant</p><h2 id="welcome-title">Good food,<br /><em>good mood.</em></h2><p>Explore bold flavours, comforting favourites, and a table made for sharing.</p><button className="button button-dark full" onClick={() => setWelcomeOpen(false)}>Explore the menu <ArrowRight size={16} /></button><small>Developed by Tuba Hassan</small></section></div>}
      {checkoutOpen && <div className="drawer-backdrop"><section className="checkout-card" role="dialog" aria-modal="true" aria-labelledby="checkout-title"><div className="drawer-head"><div><p className="eyebrow">Secure checkout</p><h2 id="checkout-title">Almost there.</h2></div><button className="icon-button" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout"><X size={20} /></button></div>{sessionPending ? <p className="auth-loading">Checking your account…</p> : !session ? <div className="checkout-auth"><p>Sign in to save your details and complete your order securely.</p><Link className="button button-dark full" href="/sign-in">Sign in to continue <ArrowRight size={16} /></Link><p className="auth-switch">New to HF? <Link href="/sign-up">Create an account</Link></p></div> : <form onSubmit={placeOrder} className="checkout-form"><p className="signed-in-as">Ordering as <strong>{session.user.name || session.user.email}</strong></p><label>Name<input required value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Your name" /></label><label>Phone<input required value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="03XX XXXXXXX" inputMode="tel" /></label><label>Delivery address<textarea required value={customerAddress} onChange={(event) => setCustomerAddress(event.target.value)} placeholder="Where should we bring your order?" rows={3} /></label><div className="checkout-total"><span>Total · Cash on delivery</span><strong>${total.toFixed(2)}</strong></div>{checkoutError && <p className="auth-error" role="alert">{checkoutError}</p>}<button className="button button-dark full" type="submit">Place order <ArrowRight size={16} /></button></form>}</section></div>}
      {orderPlaced && <div className="welcome-backdrop"><section className="welcome-card confirmation-card" role="dialog" aria-modal="true" aria-labelledby="confirmation-title"><div className="success-mark">✓</div><p className="eyebrow">Order received</p><h2 id="confirmation-title">Your order has<br /><em>been placed.</em></h2><p>Thanks, {customerName}. We&apos;ll deliver your order to {customerAddress} and call {customerPhone} if we need anything.</p><div className="confirmation-total"><span>Order total</span><strong>${total.toFixed(2)}</strong></div><small className="order-reference">Order reference: {orderId}</small><button className="button button-dark full" onClick={() => { setOrderPlaced(false); setCart([]) }}>Continue browsing <ArrowRight size={16} /></button></section></div>}
    </main>
  )
}
