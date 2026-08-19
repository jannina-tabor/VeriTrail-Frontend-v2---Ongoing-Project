const catalog = [
  {id:1, name:"ThinkPad Lenovo Laptop", cat:"Electronics", stock:"low", qty:5},
  {id:2, name:"MacBook M5", cat:"Electronics", stock:"low", qty:5},
  {id:3, name:"Wireless Mouse", cat:"Electronics", stock:"in", qty:120},
  {id:4, name:"Ergonomic Office Chair", cat:"Home & Living", stock:"in", qty:38},
  {id:5, name:"Corporate Polo Uniform (M)", cat:"Apparel", stock:"in", qty:64},
  {id:6, name:"Safety Field Jacket", cat:"Apparel", stock:"low", qty:8},
  {id:7, name:"Yoga Mat Set", cat:"Sports", stock:"in", qty:22},
  {id:8, name:"A4 Bond Paper (Ream)", cat:"Stationery", stock:"in", qty:210},
  {id:9, name:"Signed NDA Folder", cat:"Documents & Records", stock:"out", qty:0},
  {id:10, name:"Calibration Toolkit", cat:"Tools & Tool Kits", stock:"in", qty:14},
  {id:11, name:"Soldering Station", cat:"Tools & Tool Kits", stock:"low", qty:3},
  {id:12, name:"Studio Desk Lamp", cat:"Home & Living", stock:"in", qty:47},
];

let cart = {};
let nextReqNum = 146; 

function stockLabel(s){ 
  return s === "in" ? "In Stock" : s === "low" ? "Low Stock" : "Out of Stock"; 
}

function renderCatalog(){
  const grid = document.getElementById('catalogGrid');
  const searchEl = document.getElementById('catalogSearch');
  const catEl = document.getElementById('catalogCatFilter');
  const stockEl = document.getElementById('catalogStockFilter');
  
  if (!grid) return;

  const q = ((searchEl && searchEl.value) || '').trim().toLowerCase();
  const catFilter = catEl ? catEl.value : '';
  const stockFilter = stockEl ? stockEl.value : '';

  const filtered = catalog.filter(item => {
    if (q && !item.name.toLowerCase().includes(q)) return false;
    if (catFilter && item.cat !== catFilter) return false;
    if (stockFilter && item.stock !== stockFilter) return false;
    return true;
  });

  if (filtered.length === 0){
    grid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1; text-align:center; padding:30px; color:var(--muted);">No inventory items match your search or filters.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <div class="item-card" style="background:var(--cream); border:1px solid var(--line); border-radius:12px; padding:14px; display:flex; flex-direction:column; gap:8px;">
      <div class="item-thumb" style="width:100%; height:70px; border-radius:9px; background:linear-gradient(135deg,var(--sage),#5F7A49); display:flex; align-items:center; justify-content:center; color:#fff;">
        📦
      </div>
      <div class="item-name" style="font-weight:700; font-size:13px; color:var(--ink);">${item.name}</div>
      <div class="item-meta" style="font-size:11px; color:var(--muted);">${item.cat}</div>
      <span class="stock-tag ${item.stock}" style="font-size:10px; font-weight:800; padding:3px 10px; border-radius:999px; width:fit-content;">${stockLabel(item.stock)}</span>
      <div class="qty-row" style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin-top:4px;">
        ${item.stock === "out"
          ? `<span style="font-size:11px; color:var(--muted);">Unavailable</span>`
          : `<div class="qty-controls" style="display:flex; align-items:center; gap:6px;">
              <button type="button" onclick="changeCartQty(${item.id}, -1)" style="width:24px; height:24px; border-radius:6px; border:1px solid var(--line); background:#fff; cursor:pointer; font-weight:700;">−</button>
              <span id="qty-${item.id}" style="min-width:16px; text-align:center; font-weight:700; font-size:12px;">${cart[item.id] || 0}</span>
              <button type="button" onclick="changeCartQty(${item.id}, 1)" style="width:24px; height:24px; border-radius:6px; border:1px solid var(--line); background:#fff; cursor:pointer; font-weight:700;">+</button>
            </div>`
        }
        <button type="button" class="btn btn-sage btn-sm" ${item.stock === "out" ? "disabled" : ""} onclick="addItemToCart(${item.id})">Add</button>
      </div>
    </div>
  `).join('');
}

function changeCartQty(id, delta){
  const el = document.getElementById('qty-' + id);
  if (!el) return;
  let v = parseInt(el.textContent) || 0;
  v = Math.max(0, v + delta);
  el.textContent = v;
}

function addItemToCart(id){
  const el = document.getElementById('qty-' + id);
  if (!el) return;
  const qty = parseInt(el.textContent) || 0;
  if (qty <= 0){ 
    alert("Select a quantity first using the + control."); 
    return; 
  }
  cart[id] = (cart[id] || 0) + qty;
  el.textContent = 0;
  renderCartSummary();
}

function removeCartItem(id){ 
  delete cart[id]; 
  renderCartSummary(); 
}

function clearCart(){ 
  cart = {}; 
  renderCartSummary(); 
}

function renderCartSummary(){
  const list = document.getElementById('cartList');
  if (!list) return;
  
  const ids = Object.keys(cart);
  if (ids.length === 0){
    list.innerHTML = `<div class="empty-cart" style="color:var(--muted); font-size:13px; text-align:center; padding:20px 0;">Your cart is empty.<br>Add items from the Inventory Browser.</div>`;
  } else {
    list.innerHTML = ids.map(id => {
      const item = catalog.find(c => c.id == id);
      return `<div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--line); font-size:13px;">
        <span style="color:var(--ink);">${item.name} <strong style="color:var(--terracotta);">×${cart[id]}</strong></span>
        <button type="button" class="rm" onclick="removeCartItem(${id})" style="cursor:pointer; color:var(--danger); font-size:11px; font-weight:700; background:none; border:none;">Remove</button>
      </div>`;
    }).join('');
  }
  
  const total = ids.reduce((s, id) => s + cart[id], 0);
  const totalEl = document.getElementById('cartTotal');
  const submitBtn = document.getElementById('submitReqBtn');
  
  if (totalEl) totalEl.textContent = total;
  if (submitBtn) submitBtn.disabled = total === 0;
}

function toggleWaiverSignatureBox() {
  const chk = document.getElementById('attachWaiverChk');
  const box = document.getElementById('waiverSignatureBox');
  const sigInput = document.getElementById('waiverSignatureInput');

  if (chk && box) {
    box.style.display = chk.checked ? 'block' : 'none';
    if (chk.checked && sigInput && !sigInput.value) {
      sigInput.value = "Juan Dela Cruz";
    }
  }
}

function submitRequestInteractive() {
  const ids = Object.keys(cart);
  if (ids.length === 0) return;

  const recipientInput = document.getElementById('requestRecipient');
  const addressInput = document.getElementById('requestAddress');
  const recipientName = recipientInput ? recipientInput.value.trim() : "";
  const deliveryAddress = addressInput ? addressInput.value.trim() : "";

  if (!recipientName) {
    alert("Please enter a recipient name.");
    if (recipientInput) recipientInput.focus();
    return;
  }

  if (!deliveryAddress) {
    alert("Please enter a delivery address.");
    if (addressInput) addressInput.focus();
    return;
  }

  const attachWaiver = document.getElementById('attachWaiverChk')?.checked || false;
  const waiverText = document.getElementById('waiverNoticeText')?.value.trim() || "";
  const waiverSignature = document.getElementById('waiverSignatureInput')?.value.trim() || "";

  if (attachWaiver && !waiverSignature) {
    alert("Please type your signature to sign the sealed package waiver.");
    document.getElementById('waiverSignatureInput').focus();
    return;
  }

  const units = ids.reduce((s, id) => s + cart[id], 0);
  const pref = document.getElementById('packagingPref')?.value || "";
  const newId = "VT-2026-" + String(nextReqNum++).padStart(6, '0');
  
  const cats = [...new Set(ids.map(id => catalog.find(c => c.id == id).cat))];
  const category = cats.length === 1 ? cats[0] : "Mixed";
  const firstItemName = catalog.find(c => c.id == ids[0])?.name || "Company Asset";
  const itemDisplayStr = ids.length > 1 ? `${ids.length} Item Types (${units} total units)` : `1 × ${firstItemName}`;

  const newRequest = {
    id: newId,
    requestType: "Asset Transfer",
    priority: "Normal",
    purpose: "Operational deployment and branch allocation",
    item: itemDisplayStr,
    quantity: units,
    unit: "piece",
    condition: "New",
    itemNotes: attachWaiver ? `Sealed Waiver Signed: ${waiverText}` : "Standard handling requirements.",
    destination: deliveryAddress,
    recipient: recipientName,
    requestedDate: new Date().toISOString().split('T')[0],
    deliveryMethod: "Internal Messenger",
    deliveryNotes: `Packaging Preference: ${pref || "Standard"}`,
    status: "Pending Approval",
    createdAt: new Date().toISOString(),
    createdBy: "Juan Dela Cruz",
    senderLetter: attachWaiver,
    senderLetterText: waiverText,
    senderSignature: waiverSignature
  };

  const STORAGE_KEY = "vt-transfer-requests";
  const existingRequests = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  existingRequests.unshift(newRequest);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existingRequests));

  alert(`Transfer Request ${newId} submitted successfully and routed for Supervisor approval!`);

  cart = {};
  if (recipientInput) recipientInput.value = "";
  if (addressInput) addressInput.value = "";
  if (document.getElementById('packagingPref')) document.getElementById('packagingPref').value = "";
  if (document.getElementById('attachWaiverChk')) document.getElementById('attachWaiverChk').checked = false;
  if (document.getElementById('waiverSignatureInput')) document.getElementById('waiverSignatureInput').value = "";
  toggleWaiverSignatureBox();

  renderCartSummary();
  renderCatalog();

  if (typeof window.showView === "function") {
    const outboundNav = document.querySelector('.nav-item[data-view="req-outbound"]');
    window.showView(outboundNav, "req-outbound");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderCatalog();
  renderCartSummary();
});