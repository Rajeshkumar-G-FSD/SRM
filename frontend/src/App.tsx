import { useState, useEffect, useRef, useCallback } from 'react';

const logoUrl = 'https://i.postimg.cc/KcQZk3yC/srmsweets.jpg';
const TOTAL_FRAMES = 240;
const frameSrc = (n: number) => `/images/ezgif-frame-${String(n).padStart(3, '0')}.jpg`;

function clamp(v: number, lo: number, hi: number) { return Math.min(Math.max(v, lo), hi); }

// ─── Types ────────────────────────────────────────────────────────
type Page = 'home' | 'checkout' | 'corporate' | 'contact';

interface Product {
  id: number; name: string; price: number;
  rating: number; reviews: number; badge?: string;
  bg: string; bg2: string;
}

interface CartItem { product: Product; qty: number; }

// ─── Product data ─────────────────────────────────────────────────
const ALL_PRODUCTS: Record<string, Product[]> = {
  Sweets: [
    { id: 1,  name: 'Kaju Katli',      price: 580,  rating: 4.8, reviews: 234, badge: 'Best Seller', bg: '#fde8d0', bg2: '#f5c9a8' },
    { id: 2,  name: 'Gulab Jamun',     price: 180,  rating: 4.7, reviews: 189,                       bg: '#faebd7', bg2: '#f0c896' },
    { id: 3,  name: 'Motichoor Ladoo', price: 240,  rating: 4.9, reviews: 312, badge: 'Best Seller', bg: '#fff2e2', bg2: '#fdd5a8' },
    { id: 4,  name: 'Milk Barfi',      price: 320,  rating: 4.6, reviews: 98,                        bg: '#fde3d2', bg2: '#f5b895' },
    { id: 5,  name: 'Mysore Pak',      price: 280,  rating: 4.8, reviews: 203, badge: 'Best Seller', bg: '#f8f0e3', bg2: '#eedbb8' },
    { id: 6,  name: 'Besan Ladoo',     price: 200,  rating: 4.7, reviews: 176,                       bg: '#fce8cc', bg2: '#f7c88a' },
    { id: 7,  name: 'Rasgulla',        price: 160,  rating: 4.5, reviews: 142,                       bg: '#fdf0e5', bg2: '#f3d5b0' },
    { id: 8,  name: 'Jangiri',         price: 220,  rating: 4.6, reviews: 88,  badge: 'Best Seller', bg: '#fce0c0', bg2: '#f5b070' },
  ],
  Cakes: [
    { id: 9,  name: 'Chocolate Cake',  price: 680,  rating: 4.9, reviews: 456, badge: 'Best Seller', bg: '#e8d5c0', bg2: '#c9a87a' },
    { id: 10, name: 'Black Forest',    price: 750,  rating: 4.8, reviews: 312,                       bg: '#dfe0e2', bg2: '#b0b8c2' },
    { id: 11, name: 'Vanilla Sponge',  price: 520,  rating: 4.6, reviews: 198,                       bg: '#fef6e4', bg2: '#f5dcb0' },
    { id: 12, name: 'Red Velvet',      price: 820,  rating: 4.9, reviews: 278, badge: 'Best Seller', bg: '#f8dde0', bg2: '#e8a0a8' },
    { id: 13, name: 'Pineapple Cake',  price: 580,  rating: 4.7, reviews: 143,                       bg: '#f0f4d8', bg2: '#d4e890' },
    { id: 14, name: 'Butterscotch',    price: 620,  rating: 4.6, reviews: 89,                        bg: '#fde8c0', bg2: '#f5c078' },
    { id: 15, name: 'Fruit Cake',      price: 780,  rating: 4.7, reviews: 67,                        bg: '#f0e8f5', bg2: '#d8b8e8' },
    { id: 16, name: 'Strawberry',      price: 720,  rating: 4.8, reviews: 112, badge: 'Best Seller', bg: '#fde0e8', bg2: '#f5a0b8' },
  ],
  Snacks: [
    { id: 17, name: 'Murukku',         price: 120,  rating: 4.7, reviews: 189, badge: 'Best Seller', bg: '#f5e8c8', bg2: '#e8c878' },
    { id: 18, name: 'Chakli',          price: 100,  rating: 4.6, reviews: 143,                       bg: '#f8f0d8', bg2: '#f0d890' },
    { id: 19, name: 'Mixture',         price: 130,  rating: 4.8, reviews: 234, badge: 'Best Seller', bg: '#f5e0c0', bg2: '#e8b870' },
    { id: 20, name: 'Thattai',         price: 90,   rating: 4.7, reviews: 156,                       bg: '#fde8d0', bg2: '#f5c898' },
    { id: 21, name: 'Ribbon Pakoda',   price: 110,  rating: 4.5, reviews: 98,                        bg: '#f8f0e0', bg2: '#f0d8a8' },
    { id: 22, name: 'Omapodi',         price: 95,   rating: 4.4, reviews: 72,                        bg: '#fce8c8', bg2: '#f5c070' },
    { id: 23, name: 'Kai Murukku',     price: 140,  rating: 4.8, reviews: 201, badge: 'Best Seller', bg: '#f5dcc0', bg2: '#e8b068' },
    { id: 24, name: 'Achu Murukku',    price: 160,  rating: 4.7, reviews: 134,                       bg: '#fde0c0', bg2: '#f5b870' },
  ],
  'Gift Boxes': [
    { id: 25, name: 'Festival Hamper', price: 1800, rating: 4.9, reviews: 87,  badge: 'Best Seller', bg: '#e8d8f0', bg2: '#c8a8e0' },
    { id: 26, name: 'Sweet Mix Box',   price: 950,  rating: 4.8, reviews: 124,                       bg: '#fde8d8', bg2: '#f5c8a8' },
    { id: 27, name: 'Family Pack',     price: 1200, rating: 4.7, reviews: 56,                        bg: '#f8f0e8', bg2: '#f0d8c0' },
    { id: 28, name: 'Mini Gift Box',   price: 450,  rating: 4.6, reviews: 89,                        bg: '#e8f0d8', bg2: '#c8e0a8' },
    { id: 29, name: 'Premium Box',     price: 2200, rating: 4.9, reviews: 43,  badge: 'Best Seller', bg: '#f0e8d8', bg2: '#e0c8a0' },
    { id: 30, name: 'Celebration Pack',price: 1500, rating: 4.8, reviews: 67,                        bg: '#fde0d8', bg2: '#f5b8a8' },
    { id: 31, name: 'Diwali Special',  price: 2800, rating: 5.0, reviews: 34,  badge: 'Best Seller', bg: '#f8e8c0', bg2: '#f0c870' },
    { id: 32, name: 'Wedding Hamper',  price: 3500, rating: 4.9, reviews: 21,                        bg: '#f0dce8', bg2: '#e0b8d0' },
  ],
};

const CATEGORIES = Object.keys(ALL_PRODUCTS);
const VISIBLE = 5;

// ─── Stars ────────────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <span className="stars" aria-label={`${rating} out of 5`}>
      {[1,2,3,4,5].map((n) => (
        <span key={n} className={n <= Math.floor(rating) ? 'star full' : n - 0.5 <= rating ? 'star half' : 'star empty'}>★</span>
      ))}
    </span>
  );
}

// ─── Cart FAB ─────────────────────────────────────────────────────
function CartFAB({ count, onClick }: { count: number; onClick: () => void }) {
  if (count === 0) return null;
  return (
    <button className="cart-fab" onClick={onClick} aria-label={`Cart (${count} items)`}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
      <span className="cart-badge">{count}</span>
    </button>
  );
}

// ─── Cart Drawer ──────────────────────────────────────────────────
function CartDrawer({ items, note, onNote, onClose, onQty, onRemove, onCheckout }: {
  items: CartItem[]; note: string; onNote: (v: string) => void;
  onClose: () => void; onQty: (id: number, delta: number) => void;
  onRemove: (id: number) => void; onCheckout: () => void;
}) {
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <aside className="cart-drawer">
        <div className="cart-drawer-header">
          <h2 className="cart-drawer-title">Shopping cart</h2>
          <button className="cart-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="cart-cols">
          <span>Product</span><span>Price</span><span>Quantity</span><span>Total</span>
        </div>
        <hr className="cart-rule" />
        <div className="cart-items">
          {items.length === 0 ? (
            <p className="cart-empty">Your cart is empty.</p>
          ) : items.map((item) => (
            <div key={item.product.id} className="cart-item">
              <div className="cart-thumb" style={{ background: `linear-gradient(140deg,${item.product.bg},${item.product.bg2})` }}>
                <span>{item.product.name}</span>
              </div>
              <p className="cart-item-name">{item.product.name}</p>
              <p className="cart-item-price">Rs. {item.product.price.toLocaleString('en-IN')}.00</p>
              <div className="cart-qty-col">
                <div className="qty-control">
                  <button onClick={() => onQty(item.product.id, -1)}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => onQty(item.product.id, 1)}>+</button>
                </div>
                <button className="cart-remove" onClick={() => onRemove(item.product.id)}>Remove ×</button>
              </div>
              <p className="cart-line-total">Rs. {(item.product.price * item.qty).toLocaleString('en-IN')}.00</p>
            </div>
          ))}
        </div>
        <hr className="cart-rule" />
        <div className="cart-footer">
          <div className="cart-note">
            <label htmlFor="cart-note-input">Add a note to your order</label>
            <textarea id="cart-note-input" value={note} onChange={(e) => onNote(e.target.value)} rows={4} placeholder="Special instructions..." />
          </div>
          <div className="cart-summary">
            <p className="cart-subtotal">Subtotal: Rs. {subtotal.toLocaleString('en-IN')}.00</p>
            <p className="cart-tax-note">Tax included. Shipping calculated at checkout.</p>
            <button className="checkout-btn" disabled={items.length === 0} onClick={onCheckout}>CHECK OUT</button>
            <button className="continue-btn" onClick={onClose}>Continue shopping</button>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Checkout Page ────────────────────────────────────────────────
function CheckoutPage({ cart, onBack }: { cart: CartItem[]; onBack: () => void }) {
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const tax      = Math.round(subtotal * 0.05);
  const [email, setEmail]         = useState('');
  const [newsletter, setNewsletter] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [address, setAddress]     = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity]           = useState('');
  const [state, setState]         = useState('Tamil Nadu');
  const [pin, setPin]             = useState('');
  const [phone, setPhone]         = useState('');
  const [saveInfo, setSaveInfo]   = useState(false);
  const [billing, setBilling]     = useState<'same' | 'different'>('same');
  const [discount, setDiscount]   = useState('');
  const [paid, setPaid]           = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (paid) return (
    <div className="checkout-success">
      <div className="success-box">
        <div className="success-icon">✓</div>
        <h2>Order Placed!</h2>
        <p>Thank you for ordering from SRM Sweets & Cakes.<br />We'll contact you shortly to confirm your order.</p>
        <button className="checkout-btn" onClick={onBack}>Continue Shopping</button>
      </div>
    </div>
  );

  return (
    <div className="checkout-page">
      <div className="checkout-layout">
        {/* ── Left: form ── */}
        <div className="checkout-form-side">
          {/* breadcrumb */}
          <div className="checkout-breadcrumb">
            <button onClick={onBack} className="co-back">← Cart</button>
            <span>/</span><span className="co-current">Information</span>
            <span>/</span><span>Shipping</span>
            <span>/</span><span>Payment</span>
          </div>

          {/* Contact */}
          <div className="co-section">
            <div className="co-section-head">
              <h3>Contact</h3>
              <a href="#" className="co-link">Sign in</a>
            </div>
            <input className="co-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label className="co-check-label">
              <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} />
              Email me with news and offers
            </label>
          </div>

          {/* Delivery */}
          <div className="co-section">
            <h3>Delivery</h3>
            <div className="co-input-group">
              <label className="co-select-wrap">
                <span className="co-select-label">Country/Region</span>
                <select className="co-select"><option>India</option></select>
              </label>
            </div>
            <div className="co-row">
              <input className="co-input" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <input className="co-input" placeholder="Last name"  value={lastName}  onChange={(e) => setLastName(e.target.value)} />
            </div>
            <input className="co-input" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
            <input className="co-input" placeholder="Apartment, suite, etc. (optional)" value={apartment} onChange={(e) => setApartment(e.target.value)} />
            <div className="co-row co-row-3">
              <input className="co-input" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
              <label className="co-select-wrap">
                <span className="co-select-label">State</span>
                <select className="co-select" value={state} onChange={(e) => setState(e.target.value)}>
                  {['Andhra Pradesh','Bihar','Delhi','Gujarat','Karnataka','Kerala','Maharashtra','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </label>
              <input className="co-input" placeholder="PIN code" value={pin} onChange={(e) => setPin(e.target.value)} />
            </div>
            <input className="co-input" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <label className="co-check-label">
              <input type="checkbox" checked={saveInfo} onChange={(e) => setSaveInfo(e.target.checked)} />
              Save this information for next time
            </label>
          </div>

          {/* Shipping method */}
          <div className="co-section">
            <h3>Shipping method</h3>
            <div className="co-shipping-placeholder">Enter your shipping address to view available shipping methods.</div>
          </div>

          {/* Payment */}
          <div className="co-section">
            <h3>Payment</h3>
            <p className="co-secure-note">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              All transactions are secure and encrypted.
            </p>
            <div className="co-payment-option">
              <div className="co-payment-label">
                <span>Razorpay Secure (UPI, Cards, Int'l Cards, Wallets)</span>
                <div className="co-payment-logos">
                  <span className="pay-logo upi">UPI</span>
                  <span className="pay-logo visa">VISA</span>
                  <span className="pay-logo mc">MC</span>
                  <span className="pay-logo more">+18</span>
                </div>
              </div>
              <p className="co-payment-note">You'll be redirected to Razorpay Secure (UPI, Cards, Int'l Cards, Wallets) to complete your purchase.</p>
            </div>
          </div>

          {/* Billing address */}
          <div className="co-section">
            <h3>Billing address</h3>
            <label className={`co-radio-option${billing === 'same' ? ' selected' : ''}`}>
              <input type="radio" name="billing" value="same" checked={billing === 'same'} onChange={() => setBilling('same')} />
              Same as shipping address
            </label>
            <label className={`co-radio-option${billing === 'different' ? ' selected' : ''}`}>
              <input type="radio" name="billing" value="different" checked={billing === 'different'} onChange={() => setBilling('different')} />
              Use a different billing address
            </label>
          </div>

          {/* Pay now */}
          <button className="pay-now-btn" onClick={() => setPaid(true)}>Pay now</button>

          {/* footer links */}
          <div className="co-footer-links">
            <a href="#">Refund policy</a>
            <a href="#">Shipping</a>
            <a href="#">Privacy policy</a>
            <a href="#">Terms of service</a>
          </div>
        </div>

        {/* ── Right: order summary ── */}
        <div className="checkout-summary-side">
          <div className="co-summary-items">
            {cart.map((item) => (
              <div key={item.product.id} className="co-summary-item">
                <div className="co-summary-thumb" style={{ background: `linear-gradient(140deg,${item.product.bg},${item.product.bg2})` }}>
                  <span className="co-summary-qty">{item.qty}</span>
                  <span>{item.product.name.split(' ')[0]}</span>
                </div>
                <div className="co-summary-info">
                  <p className="co-summary-name">{item.product.name}</p>
                  <p className="co-summary-variant">Handcrafted</p>
                </div>
                <p className="co-summary-price">₹{(item.product.price * item.qty).toLocaleString('en-IN')}.00</p>
              </div>
            ))}
          </div>
          <div className="co-discount-row">
            <input className="co-input co-discount-input" placeholder="Discount code" value={discount} onChange={(e) => setDiscount(e.target.value)} />
            <button className="co-apply-btn">Apply</button>
          </div>
          <hr className="co-divider" />
          <div className="co-totals">
            <div className="co-total-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}.00</span></div>
            <div className="co-total-row"><span>Shipping <span className="co-info">ⓘ</span></span><span className="co-muted">Enter shipping address</span></div>
            <hr className="co-divider" />
            <div className="co-total-row co-total-final">
              <span>Total</span>
              <span><small>INR </small>₹{subtotal.toLocaleString('en-IN')}.00</span>
            </div>
            <p className="co-tax-line">Including ₹{tax.toLocaleString('en-IN')}.00 in taxes</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Corporate Gifting Page ───────────────────────────────────────
function CorporatePage({ onBack }: { onBack: () => void }) {
  const [boxes, setBoxes]       = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm]         = useState({ firstName: '', lastName: '', phone: '', email: '', company: '', address1: '', address2: '', city: '', state: '', zip: '', comments: '' });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const features = [
    { icon: '🎁', iconBg: '#2d5a27', title: 'CUSTOMISABLE',            text: "Choose from our best-selling range of sweets and savories — Gulab Jamuns, crunchy Thattais, and nostalgic Mixture Murukku. Every order is 100% customisable, we cater to your preference from start to finish." },
    { icon: '🍳', iconBg: '#c45e2e', title: 'PERSONALIZATION',          text: "We are all ears to your ideas. Let us personalise your gifting and leave a lasting impression on your customers, employees, and clients. Whether printed logos or handwritten cards, we make sure your associates get an on-brand experience." },
    { icon: '🌸', iconBg: '#6a3d8f', title: 'PREMIUM GIFTING',          text: "We use hand-pounded flour and one-time-use groundnut oil to make our traditional delicacies! Every batch is made with the freshest ingredients, ensuring a tasteful mesmerising experience for you and your clients." },
    { icon: '🏅', iconBg: '#c47830', title: 'STELLAR SERVICE & SHIPPING',text: "We go the extra mile to help you express your brand, making it thoughtful and creative. Your order will be carefully packed and delivered at the earliest possible time slot, regardless of order size." },
    { icon: '💰', iconBg: '#6a3d8f', title: 'CORPORATE DISCOUNTS',      text: "We offer exclusive discounts on all bulk orders. When you order more, you save more!\n\nCALL US TODAY!\n+91 99999 00000" },
  ];

  return (
    <div className="corporate-page">
      {submitted ? (
        <div className="checkout-success">
          <div className="success-box">
            <div className="success-icon">✓</div>
            <h2>Quote Request Sent!</h2>
            <p>We'll reach out within 24 hours with a custom corporate gifting proposal.</p>
            <button className="checkout-btn" onClick={onBack}>Back to Home</button>
          </div>
        </div>
      ) : (
        <>
          {/* Quote form */}
          <section className="corp-form-section">
            <h2 className="corp-form-title">Request a Custom Quote</h2>
            <div className="corp-form-grid">
              <div className="corp-row-2">
                <div className="corp-field"><label>First Name *</label><input value={form.firstName} onChange={set('firstName')} /></div>
                <div className="corp-field"><label>Last Name *</label><input value={form.lastName} onChange={set('lastName')} /></div>
              </div>
              <div className="corp-row-2">
                <div className="corp-field">
                  <label>Phone *</label>
                  <div className="corp-phone-wrap">
                    <span className="corp-phone-prefix">🇮🇳 +91</span>
                    <input placeholder="81234 56789" value={form.phone} onChange={set('phone')} />
                  </div>
                </div>
                <div className="corp-field"><label>Email *</label><input type="email" value={form.email} onChange={set('email')} /></div>
              </div>
              <div className="corp-field"><label>Company Name *</label><input value={form.company} onChange={set('company')} /></div>
              <div className="corp-field"><label>Address 1 *</label><input value={form.address1} onChange={set('address1')} /></div>
              <div className="corp-field"><label>Address 2</label><input value={form.address2} onChange={set('address2')} /></div>
              <div className="corp-row-3">
                <div className="corp-field"><label>City *</label><input value={form.city} onChange={set('city')} /></div>
                <div className="corp-field"><label>State *</label><input value={form.state} onChange={set('state')} /></div>
                <div className="corp-field"><label>Zip *</label><input value={form.zip} onChange={set('zip')} /></div>
              </div>
              <div className="corp-field">
                <label>Number of Boxes Required *</label>
                <div className="corp-boxes">
                  <button type="button" onClick={() => setBoxes((b) => Math.max(1, b - 1))}>−</button>
                  <input readOnly value={boxes} className="corp-boxes-input" />
                  <button type="button" onClick={() => setBoxes((b) => b + 1)}>+</button>
                </div>
              </div>
              <div className="corp-field"><label>Comments</label><textarea rows={4} value={form.comments} onChange={set('comments')} /></div>
              <button className="corp-submit" onClick={() => setSubmitted(true)}>Submit</button>
            </div>
          </section>

          {/* Corporate info */}
          <section className="corp-info-section">
            <h2 className="corp-info-title">Corporate Gifting</h2>
            <p className="corp-info-tagline">Cherish Your Employees, Delight Your Clients!</p>
            <p className="corp-info-text">
              SRM Sweets helps you build valuable business connections and strengthen professional relationships through the authentic flavors of South India. Gift happiness with the finest of sweets and savories for every corporate event and festive season.
            </p>
          </section>

          {/* Feature rows */}
          <section className="corp-features">
            {features.map((f, i) => (
              <div key={f.title} className={`corp-feature-row${i % 2 === 0 ? ' icon-right' : ''}`}>
                {i % 2 !== 0 && (
                  <div className="corp-feature-text">
                    <h3>{f.title}</h3>
                    <p>{f.text}</p>
                  </div>
                )}
                <div className="corp-feature-icon" style={{ background: f.iconBg }}>
                  <span>{f.icon}</span>
                </div>
                {i % 2 === 0 && (
                  <div className="corp-feature-text">
                    <h3>{f.title}</h3>
                    <p>{f.text}</p>
                  </div>
                )}
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  );
}

// ─── Contact Page ─────────────────────────────────────────────────
function ContactPage() {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [phone, setPhone]     = useState('');
  const [sent, setSent]       = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const hours = ['Friday','Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday'];

  return (
    <div className="contact-page">

      {/* ── Hero info card ── */}
      <section className="ctp-hero">
        <div className="ctp-biz-card">
          <div className="ctp-biz-top">
            <img src={logoUrl} className="ctp-biz-logo" alt="SRM" />
            <div>
              <h1 className="ctp-biz-name">SRM Sweets & Cakes</h1>
              <p className="ctp-biz-sub">Palayapalayam, Erode</p>
              <div className="ctp-biz-meta">
                <span className="ctp-rating">★ 3.9</span>
                <span className="ctp-divider">·</span>
                <span>(713 reviews)</span>
                <span className="ctp-divider">·</span>
                <span>₹1–200</span>
                <span className="ctp-divider">·</span>
                <span>Cake shop</span>
              </div>
            </div>
          </div>

          <div className="ctp-info-grid">
            {/* Hours */}
            <div className="ctp-info-block">
              <h3 className="ctp-info-label">
                <span className="ctp-icon">🕐</span> Opening Hours
              </h3>
              <ul className="ctp-hours-list">
                {hours.map((d) => (
                  <li key={d}><span>{d}</span><span>9 am – 10 pm</span></li>
                ))}
              </ul>
            </div>

            {/* Addresses */}
            <div className="ctp-info-block">
              <h3 className="ctp-info-label">
                <span className="ctp-icon">📍</span> Our Locations
              </h3>
              <div className="ctp-address">
                <p className="ctp-addr-tag">Primary Outlet</p>
                <p>146, Perundurai Rd, EB Officer's Colony,<br />Palayapalayam, Erode, Tamil Nadu 638011</p>
              </div>
              <div className="ctp-address ctp-address-2">
                <p className="ctp-addr-tag">Secondary Outlet</p>
                <p>35, Thiru Vi Ka St, Municipal Colony,<br />Edayankattuvalasu, Erode, Tamil Nadu 638004</p>
              </div>
            </div>

            {/* Contact details */}
            <div className="ctp-info-block">
              <h3 className="ctp-info-label">
                <span className="ctp-icon">📞</span> Contact Details
              </h3>
              <p className="ctp-contact-row">
                <strong>Phone:</strong>
                <a href="tel:+919999900000">+91 99999 00000</a>
              </p>
              <p className="ctp-contact-row">
                <strong>Email:</strong>
                <a href="mailto:hello@srmsweets.in">hello@srmsweets.in</a>
              </p>
              <p className="ctp-contact-row">
                <strong>WhatsApp:</strong>
                <a href="https://wa.me/919999900000">+91 99999 00000</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Map ── */}
      <section className="ctp-map-section">
        <iframe
          title="SRM Sweets location"
          src="https://maps.google.com/maps?q=146%2C%20Perundurai%20Rd%2C%20Palayapalayam%2C%20Erode%2C%20Tamil%20Nadu%20638011&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      {/* ── Contact form ── */}
      <section className="ctp-form-section">
        {sent ? (
          <div className="ctp-sent">
            <div className="ctp-sent-icon">✓</div>
            <h2>Message Sent!</h2>
            <p>We'll get back to you within 24 hours.</p>
          </div>
        ) : (
          <>
            <h2 className="ctp-form-title">Contact us</h2>
            <div className="ctp-form">
              <div className="ctp-form-row">
                <div className="ctp-field">
                  <label>Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="ctp-field">
                  <label>Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="ctp-field">
                <label>Message</label>
                <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
              </div>
              <div className="ctp-field">
                <label>Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <button className="ctp-send-btn" onClick={() => setSent(true)}>SEND</button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

// ─── Site Footer (shared) ─────────────────────────────────────────
function SiteFooter({ navigate }: { navigate: (p: Page) => void }) {
  const [nlEmail, setNlEmail] = useState('');
  const [nlSent, setNlSent]   = useState(false);

  return (
    <footer className="site-footer">
      <div className="sf-grid">

        {/* Brand */}
        <div className="sf-col sf-brand-col">
          <button className="sf-brand-btn" onClick={() => navigate('home')}>
            <img src={logoUrl} className="sf-logo" alt="SRM" />
            <div>
              <p className="sf-brand-name">SRM Sweets & Cakes</p>
              <p className="sf-brand-sub">Palayapalayam, Erode</p>
            </div>
          </button>
          <p className="sf-tagline">Bring home a celebration</p>
          <p className="sf-about">
            A trusted destination for premium handcrafted sweets, celebration cakes, and snacks in Erode since 1985.
          </p>
          <div className="sf-social">
            {/* Facebook */}
            <a href="#" className="sf-social-icon" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            {/* Instagram */}
            <a href="#" className="sf-social-icon" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            {/* WhatsApp */}
            <a href="https://wa.me/919999900000" className="sf-social-icon" aria-label="WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.555 4.126 1.527 5.857L0 24l6.335-1.654A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.655-.52-5.17-1.426l-.37-.22-3.76.982.998-3.658-.242-.375A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div className="sf-col">
          <h4 className="sf-heading">Quick Links</h4>
          <ul className="sf-links">
            <li><button onClick={() => navigate('home')}>Home</button></li>
            <li><button onClick={() => { navigate('home'); setTimeout(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>Products</button></li>
            <li><button onClick={() => navigate('corporate')}>Corporate Gifting</button></li>
            <li><button onClick={() => navigate('contact')}>Contact Us</button></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Refund Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>

        {/* Store info */}
        <div className="sf-col">
          <h4 className="sf-heading">Customer Support</h4>
          <div className="sf-contact-list">
            <div className="sf-contact-item">
              <span className="sf-contact-icon">📍</span>
              <div>
                <p className="sf-contact-strong">Primary Outlet</p>
                <p>146, Perundurai Rd, EB Officer's Colony,<br />Palayapalayam, Erode – 638011</p>
              </div>
            </div>
            <div className="sf-contact-item">
              <span className="sf-contact-icon">📍</span>
              <div>
                <p className="sf-contact-strong">Secondary Outlet</p>
                <p>35, Thiru Vi Ka St, Municipal Colony,<br />Edayankattuvalasu, Erode – 638004</p>
              </div>
            </div>
            <div className="sf-contact-item">
              <span className="sf-contact-icon">📞</span>
              <p><a href="tel:+919999900000">+91 99999 00000</a></p>
            </div>
            <div className="sf-contact-item">
              <span className="sf-contact-icon">✉</span>
              <p><a href="mailto:hello@srmsweets.in">hello@srmsweets.in</a></p>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="sf-col">
          <h4 className="sf-heading">Welcome to SRM Sweets!</h4>
          <p className="sf-nl-desc">Sign up and stay updated on our special offers and latest launches</p>
          {nlSent ? (
            <p className="sf-nl-thanks">✓ You're subscribed!</p>
          ) : (
            <div className="sf-nl-form">
              <input
                className="sf-nl-input"
                type="email"
                placeholder="Enter email"
                value={nlEmail}
                onChange={(e) => setNlEmail(e.target.value)}
              />
              <button className="sf-nl-btn" onClick={() => nlEmail && setNlSent(true)}>SIGN UP</button>
            </div>
          )}
          <div className="sf-hours-mini">
            <p className="sf-contact-strong" style={{ marginBottom: '0.5rem' }}>Open 7 days a week</p>
            <p>9:00 am – 10:00 pm</p>
          </div>
        </div>

      </div>

      {/* bottom bar */}
      <div className="sf-bottom">
        <p>© 2026 SRM Sweets & Cakes, Palayapalayam. All rights reserved.</p>
        <div className="sf-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Shipping</a>
          <a href="#">Refund Policy</a>
        </div>
      </div>
    </footer>
  );
}

// ─── Products carousel ────────────────────────────────────────────
function ProductsSection({ onAddToCart }: { onAddToCart: (p: Product) => void }) {
  const [catIdx, setCatIdx] = useState(0);
  const [start, setStart]   = useState(0);
  const [added, setAdded]   = useState<number | null>(null);

  const cat     = CATEGORIES[catIdx];
  const items   = ALL_PRODUCTS[cat];
  const visible = items.slice(start, start + VISIBLE);

  const changeCategory = (i: number) => { setCatIdx(i); setStart(0); };

  const handleAdd = (p: Product) => {
    onAddToCart(p);
    setAdded(p.id);
    setTimeout(() => setAdded(null), 1200);
  };

  return (
    <section className="products-section">
      <div className="cat-tabs">
        {CATEGORIES.map((c, i) => (
          <button key={c} className={`cat-tab${i === catIdx ? ' active' : ''}`} onClick={() => changeCategory(i)}>{c}</button>
        ))}
      </div>
      <div className="products-nav">
        <button className="nav-arrow" onClick={() => setStart((s) => Math.max(0, s - 1))} disabled={start === 0}>‹</button>
        <div className="nav-center">
          <h2 className="products-title">{cat}</h2>
          <a className="view-all" href="#">VIEW ALL</a>
        </div>
        <button className="nav-arrow" onClick={() => setStart((s) => Math.min(items.length - VISIBLE, s + 1))} disabled={start + VISIBLE >= items.length}>›</button>
      </div>
      <div className="products-grid">
        {visible.map((p) => (
          <article key={p.id} className="product-card">
            <div className="product-img-wrap" style={{ background: `linear-gradient(140deg,${p.bg},${p.bg2})` }}>
              {p.badge && (
                <span className="product-badge">
                  <span className="badge-stars">★★★</span>
                  <span className="badge-text">Best<br />Seller</span>
                  <span className="badge-stars">★★★</span>
                </span>
              )}
              <span className="product-img-name">{p.name}</span>
            </div>
            <div className="product-info">
              <p className="product-name">{p.name}</p>
              <div className="product-rating"><Stars rating={p.rating} /><span className="review-count">{p.reviews} reviews</span></div>
              <p className="product-price">Rs. {p.price.toLocaleString('en-IN')}.00</p>
            </div>
            <button className={`add-to-cart${added === p.id ? ' added' : ''}`} onClick={() => handleAdd(p)}>
              {added === p.id ? '✓ ADDED' : 'ADD TO CART'}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

// ─── App ──────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]         = useState<Page>('home');
  const [cart, setCart]         = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [note, setNote]         = useState('');

  const heroScrollRef = useRef<HTMLDivElement>(null);
  const frameRef      = useRef<HTMLImageElement>(null);
  const displayFrame  = useRef(1);
  const targetFrame   = useRef(1);
  const shownFrame    = useRef(1);
  const rafId         = useRef<number | null>(null);

  const totalCount = cart.reduce((s, i) => s + i.qty, 0);

  const navigate = (p: Page) => { setPage(p); setCartOpen(false); window.scrollTo(0, 0); };

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.product.id === product.id);
      if (ex) return prev.map((i) => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
  }, []);

  const updateQty = useCallback((id: number, delta: number) => {
    setCart((prev) => prev.map((i) => i.product.id === id ? { ...i, qty: i.qty + delta } : i).filter((i) => i.qty > 0));
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCart((prev) => prev.filter((i) => i.product.id !== id));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setCartOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = cartOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [cartOpen]);

  // scroll-driven frame animation (only runs on home page)
  useEffect(() => {
    if (page !== 'home') return;
    const frames: HTMLImageElement[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) { const img = new Image(); img.src = frameSrc(i); frames.push(img); }

    const onScroll = () => {
      const s = heroScrollRef.current;
      if (!s) return;
      const progress = clamp((window.scrollY - s.offsetTop) / (s.offsetHeight - window.innerHeight), 0, 1);
      targetFrame.current = Math.round(progress * (TOTAL_FRAMES - 1)) + 1;
    };

    const tick = () => {
      const img = frameRef.current;
      if (img) {
        displayFrame.current += (targetFrame.current - displayFrame.current) * 0.055;
        const rounded = clamp(Math.round(displayFrame.current), 1, TOTAL_FRAMES);
        if (rounded !== shownFrame.current) {
          shownFrame.current = rounded;
          const f = frames[rounded - 1];
          if (f?.complete && f.naturalWidth > 0) img.src = f.src;
        }
      }
      rafId.current = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    rafId.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [page]);

  return (
    <>
      <CartFAB count={totalCount} onClick={() => setCartOpen(true)} />

      {cartOpen && (
        <CartDrawer
          items={cart} note={note} onNote={setNote}
          onClose={() => setCartOpen(false)}
          onQty={updateQty} onRemove={removeFromCart}
          onCheckout={() => navigate('checkout')}
        />
      )}

      {/* ── Header ── */}
      <header className="header">
        <div className="header-brand-row">
          <button className="brand brand-btn" onClick={() => navigate('home')}>
            <img className="brand-logo" src={logoUrl} alt="SRM Sweets & Cakes" />
            <div>
              <span className="brand-title">SRM Sweets & Cakes</span>
              <span className="brand-subtitle">Palayapalayam</span>
            </div>
          </button>
        </div>
        <div className="header-nav-row">
          <nav className="nav">
            <button className={`nav-btn${page === 'home' ? ' nav-active' : ''}`} onClick={() => navigate('home')}>Home</button>
            <a className="nav-btn" href="#products" onClick={() => navigate('home')}>Products</a>
            <a className="nav-btn" href="#location" onClick={() => navigate('home')}>Location</a>
            <a className="nav-btn" href="#hours"    onClick={() => navigate('home')}>Hours</a>
            <button className={`nav-btn${page === 'contact'   ? ' nav-active' : ''}`} onClick={() => navigate('contact')}>Contact</button>
            <button className={`nav-btn${page === 'corporate' ? ' nav-active' : ''}`} onClick={() => navigate('corporate')}>Corporate Gifting</button>
          </nav>
        </div>
      </header>

      {/* ── Page router ── */}
      {page === 'checkout'  && <><CheckoutPage  cart={cart} onBack={() => navigate('home')} /><SiteFooter navigate={navigate} /></>}
      {page === 'corporate' && <><CorporatePage onBack={() => navigate('home')} /><SiteFooter navigate={navigate} /></>}
      {page === 'contact'   && <><ContactPage /><SiteFooter navigate={navigate} /></>}

      {page === 'home' && (
        <main>
          <div ref={heroScrollRef} className="hero-scroll" id="hero">
            <div className="hero-sticky">
              <img ref={frameRef} src={frameSrc(1)} alt="SRM animation" className="hero-frame-img" />
              <div className="hero-scrim" />
              <div className="hero-content">
                <span className="eyebrow">Cake shop · Erode</span>
                <h1>SRM Sweets<br />& Cakes</h1>
                <p>Premium handcrafted treats, celebration cakes, and traditional sweets — crafted with love in Palayapalayam.</p>
                <div className="hero-meta">
                  <div><strong>3.9 ★</strong><span>713 reviews</span></div>
                  <div><strong>₹1 – 200</strong><span>Affordable</span></div>
                </div>
                <div className="hero-actions">
                  <a className="button primary" href="#products">Shop Now</a>
                  <a className="button secondary" href="#location">Find Us</a>
                </div>
              </div>
            </div>
          </div>

          <div id="products"><ProductsSection onAddToCart={addToCart} /></div>

          <section className="section section-overview" id="overview">
            <div className="content-grid">
              <div className="content-card"><h2>Warm Hospitality</h2><p>Every order is made with care, from classic sweets to celebration cakes. A neat, elegant presentation that matches the SRM brand tone.</p></div>
              <div className="content-card"><h2>Made for Sharing</h2><p>Enjoy city favourites like fresh cakes, ladoos, and gift-ready sweets that feel premium yet welcoming.</p></div>
            </div>
          </section>

          <section className="section section-location" id="location">
            <div className="section-left">
              <div className="info-block"><span className="section-label">Address</span><h2>146, Perundurai Rd, EB Officer's Colony</h2><p>Palayapalayam, Erode, Tamil Nadu 638011</p></div>
              <div className="info-block"><span className="section-label">Secondary Outlet</span><h3>35, Thiru Vi Ka St, Municipal Colony</h3><p>Edayankattuvalasu, Erode, Tamil Nadu 638004</p></div>
            </div>
            <div className="map-card">
              <div className="map-header"><h2>Find us on the map</h2></div>
              <iframe title="SRM Sweets location" src="https://maps.google.com/maps?q=146%2C%20Perundurai%20Rd%2C%20Erode%2C%20Tamil%20Nadu%20638011&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </section>

          <section className="section section-hours" id="hours">
            <div className="hours-card">
              <span className="section-label">Opening hours</span>
              <ul>{['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map((d) => <li key={d}>{d}: 9 am – 10 pm</li>)}</ul>
            </div>
          </section>

          <SiteFooter navigate={navigate} />
        </main>
      )}
    </>
  );
}
