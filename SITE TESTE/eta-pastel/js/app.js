/* Dados de reserva caso o site seja aberto sem servidor local */
const FALLBACK_MENU = [
  { id: 1, categoria: 'salgados', nome: 'Pastel Carne Especial (30cm)', desc: 'Carne moída bovina bem temperada, azeitonas fatiadas e ovos de codorna.', preco: 22.00, badge: 'Mais Pedido', img: 'imagens/pastel-carne.jpg' },
  { id: 2, categoria: 'salgados', nome: 'Pastel Frango com Catupiry (30cm)', desc: 'Peito de frango desfiado suculento com o verdadeiro Catupiry original.', preco: 23.50, badge: 'Tradicional', img: 'imagens/pastel-tamanho.jpg' },
  { id: 3, categoria: 'salgados', nome: 'Pastel Queijo Mussarela Duplo (30cm)', desc: 'Mussarela premium derretida de ponta a ponta com orégano artesanal.', preco: 21.00, badge: 'Sem Carne', img: 'imagens/pastel-tamanho.jpg' },
  { id: 4, categoria: 'salgados', nome: 'Pastel Bauru Supremo (30cm)', desc: 'Presunto magro, queijo mussarela, tomate fresco picadinho e orégano.', preco: 22.50, badge: 'Saboroso', img: 'imagens/pastel-tamanho.jpg' },
  { id: 5, categoria: 'salgados', nome: 'Pastel Palmito com Queijo (30cm)', desc: 'Palmito macio em pedaços selecionados com queijo derretido.', preco: 24.00, badge: 'Vegetariano', img: 'imagens/pastel-tamanho.jpg' },
  { id: 6, categoria: 'doces', nome: 'Pastel Nutella com Morango', desc: 'Creme de avelã Nutella pura com morangos frescos fatiados.', preco: 24.90, badge: 'Sucesso Doce', img: 'imagens/pastel-tamanho.jpg' },
  { id: 7, categoria: 'doces', nome: 'Pastel Romeu e Julieta', desc: 'Goiabada cremosa cascão combinada com queijo minas frescal.', preco: 18.50, badge: 'Clássico', img: 'imagens/pastel-tamanho.jpg' },
  { id: 8, categoria: 'doces', nome: 'Pastel Banana com Canela e Doce de Leite', desc: 'Banana nanica fatiada, doce de leite caseiro e canela polvilhada.', preco: 19.90, badge: 'Delícia', img: 'imagens/pastel-tamanho.jpg' },
  { id: 9, categoria: 'minis', nome: 'Porção 10 Mini Pastéis + Molho Pimenta', desc: 'Sabor sortido (Carne, Queijo e Frango). Acompanha molho artesanal da casa.', preco: 28.00, badge: 'Porção', img: 'imagens/pastel-carne.jpg' },
  { id: 10, categoria: 'minis', nome: 'Porção 20 Mini Pastéis + 2 Molhos', desc: 'Ideal para compartilhar em dupla. Acompanha pimenta e maionese verde.', preco: 52.00, badge: 'Galera', img: 'imagens/pastel-carne.jpg' },
  { id: 11, categoria: 'minis', nome: 'Porção 30 Mini Pastéis (Combo Festa)', desc: 'A porção perfeita para reuniões. Sabores variados com acompanhamento.', preco: 75.00, badge: 'Festa', img: 'imagens/pastel-carne.jpg' },
  { id: 12, categoria: 'bebidas', nome: 'Sucos Naturais (500 ml)', desc: 'Feito na hora, docinho e gostoso. Do jeito que o cliente pedir.', preco: 12.90, badge: 'Fresco na Hora', img: 'imagens/sucos.jpg' },
  { id: 13, categoria: 'bebidas', nome: 'Caldo de Cana Jarra 1 Litro', desc: 'Ideal para a família. Escolha o toque de frutas sem custo extra.', preco: 18.00, badge: 'Especial', img: 'imagens/sucos.jpg' },
  { id: 14, categoria: 'bebidas', nome: 'Refrigerante Lata 350ml', desc: 'Coca-Cola, Guaraná Antarctica ou Fanta Laranja geladíssimos.', preco: 7.00, badge: 'Gelado', img: 'imagens/sucos.jpg' }
];

let menuData = [];
let cart = [];

/* Carregar Cardápio do JSON */
async function loadMenu() {
  try {
    const response = await fetch('data/cardapio.json');
    if (!response.ok) throw new Error('Falha ao carregar cardapio.json');
    menuData = await response.json();
  } catch (err) {
    menuData = FALLBACK_MENU;
  }
  renderMenu(menuData);
}

/* Renderizar Cards do Cardápio usando <article> semântico */
function renderMenu(items) {
  const menuGrid = document.getElementById('menuGrid');
  menuGrid.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'menu-card';
    card.innerHTML = `
      <div class="menu-card-img-wrapper">
        <img src="${item.img}" alt="${item.nome}" onerror="this.src='https://placehold.co/500x300/D32F2F/FFFFFF?text=${encodeURIComponent(item.nome)}'">
        <span class="menu-card-badge">${item.badge}</span>
      </div>
      <div class="menu-card-body">
        <h3 class="menu-card-title">${item.nome}</h3>
        <p class="menu-card-desc">${item.desc}</p>
        <div class="menu-card-footer">
          <span class="menu-card-price">R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
          <button class="add-to-cart-btn" data-id="${item.id}">
            <i class="fa-solid fa-plus"></i> Adicionar
          </button>
        </div>
      </div>
    `;
    menuGrid.appendChild(card);
  });
}

function filtrarCategoria(cat) {
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.categoria === cat);
  });
  renderMenu(cat === 'todos' ? menuData : menuData.filter(item => item.categoria === cat));
}

/* Carrinho */
function addToCart(productId) {
  const product = menuData.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  showToast(`"${product.nome}" adicionado!`);
}

function changeQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== productId);
    }
  }
  updateCartUI();
  renderCartModalList();
}

function updateCartUI() {
  const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.preco * item.qty), 0);

  const floatBar = document.getElementById('cartFloatBar');
  const badgeCount = document.getElementById('cartBadgeCount');
  const floatTotal = document.getElementById('cartFloatTotal');

  if (totalCount > 0) {
    floatBar.style.display = 'flex';
    badgeCount.textContent = totalCount;
    floatTotal.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
  } else {
    floatBar.style.display = 'none';
  }
}

function openCartModal() {
  renderCartModalList();
  document.getElementById('cartModal').classList.add('active');
}

function closeCartModal() {
  document.getElementById('cartModal').classList.remove('active');
}

function renderCartModalList() {
  const list = document.getElementById('cartItemsList');
  const modalTotal = document.getElementById('cartModalTotal');
  list.innerHTML = '';

  let totalPrice = 0;

  if (cart.length === 0) {
    list.innerHTML = '<li style="text-align: center; color: var(--text-muted); padding: 20px;">Seu carrinho está vazio.</li>';
    modalTotal.textContent = 'R$ 0,00';
    return;
  }

  cart.forEach(item => {
    const subtotal = item.preco * item.qty;
    totalPrice += subtotal;

    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <div>
        <div class="cart-item-title">${item.nome}</div>
        <div class="cart-item-price">R$ ${item.preco.toFixed(2).replace('.', ',')}</div>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" data-id="${item.id}" data-delta="-1">-</button>
        <span><strong>${item.qty}</strong></span>
        <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
      </div>
    `;
    list.appendChild(li);
  });

  modalTotal.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
}

function finalizarPedidoWhatsApp() {
  if (cart.length === 0) {
    alert('Adicione itens ao carrinho antes de enviar!');
    return;
  }

  const nome = document.getElementById('clienteNome').value.trim() || 'Cliente';
  const entrega = document.getElementById('tipoEntrega').value;
  const obs = document.getElementById('obsPedido').value.trim();

  let msg = `*--- NOVO PEDIDO: ÊTA PASTEL ---*\n`;
  msg += `*Cliente:* ${nome}\n`;
  msg += `*Opção:* ${entrega}\n\n`;
  msg += `*ITENS DO PEDIDO:*\n`;

  let total = 0;
  cart.forEach(item => {
    const sub = item.preco * item.qty;
    total += sub;
    msg += `- ${item.qty}x ${item.nome} (R$ ${sub.toFixed(2).replace('.', ',')})\n`;
  });

  msg += `\n*TOTAL ESTIMADO:* R$ ${total.toFixed(2).replace('.', ',')}\n`;
  if (obs) msg += `*Observações:* ${obs}\n`;
  msg += `\n_Vim pelo site e aguardo confirmação do pedido!_`;

  const phone = "5519999092169";
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  closeCartModal();
}

/* Calculadora B2B */
function calcularEvento() {
  const numInput = document.getElementById('numPessoas');
  let pessoas = parseInt(numInput.value, 10) || 1;
  if (pessoas < 1) pessoas = 1;

  document.getElementById('resPasteis').textContent = pessoas * 6;
  document.getElementById('resCaldo').textContent = (pessoas * 0.3).toFixed(1);
}

function enviarB2B(e) {
  e.preventDefault();
  const nome = document.getElementById('b2bNome').value.trim();
  const telefone = document.getElementById('b2bTelefone').value.trim();
  const email = document.getElementById('b2bEmail').value.trim();
  const tipoEvento = document.getElementById('b2bTipoEvento').value;
  const data = document.getElementById('b2bData').value;
  const modalidadeEl = document.querySelector('input[name="b2bModalidade"]:checked');
  const modalidade = modalidadeEl ? modalidadeEl.value : 'Não informada';
  const prefs = Array.from(document.querySelectorAll('input[name="b2bPreferencias"]:checked')).map(cb => cb.value);
  const desc = document.getElementById('b2bDesc').value.trim();

  let msg = `*--- SOLICITAÇÃO DE ENCOMENDA B2B / EVENTO ---*\n`;
  msg += `*Responsável:* ${nome}\n`;
  msg += `*WhatsApp:* ${telefone}\n`;
  msg += `*E-mail:* ${email}\n`;
  msg += `*Tipo de Evento:* ${tipoEvento}\n`;
  msg += `*Data Pretendida:* ${data}\n`;
  msg += `*Modalidade:* ${modalidade}\n`;
  if (prefs.length > 0) msg += `*Itens de Interesse:* ${prefs.join(', ')}\n`;
  if (desc) msg += `*Detalhes do Evento:* ${desc}\n`;

  const phone = "5519999092169";
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
}

function showToast(message) {
  const toast = document.getElementById('toastMsg');
  document.getElementById('toastText').textContent = message;
  toast.classList.add('active');
  setTimeout(() => toast.classList.remove('active'), 2500);
}

/* Inicialização de Eventos */
document.addEventListener('DOMContentLoaded', () => {
  loadMenu();
  calcularEvento();

  // Data mínima no formulário B2B
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('b2bData');
  if (dateInput) dateInput.min = today;

  // Cookies
  const bannerCookies = document.getElementById('banner-cookies');
  const btnAceitar = document.getElementById('btn-aceitar-cookies');
  if (localStorage.getItem('cookiesAceitos') === 'sim') {
    bannerCookies.classList.add('oculto');
  }
  btnAceitar.addEventListener('click', () => {
    localStorage.setItem('cookiesAceitos', 'sim');
    bannerCookies.classList.add('oculto');
  });

  // Filtros do cardápio (abas e submenu)
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => filtrarCategoria(btn.dataset.categoria));
  });

  document.querySelectorAll('[data-filter-link]').forEach(link => {
    link.addEventListener('click', () => filtrarCategoria(link.dataset.filterLink));
  });

  // Delegação de clique para adicionar ao carrinho
  document.getElementById('menuGrid').addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart-btn');
    if (btn) addToCart(Number(btn.dataset.id));
  });

  // Delegação de clique para alterar quantidade no modal
  document.getElementById('cartItemsList').addEventListener('click', (e) => {
    const btn = e.target.closest('.qty-btn');
    if (btn) changeQty(Number(btn.dataset.id), Number(btn.dataset.delta));
  });

  // Abrir e fechar modal do carrinho
  document.getElementById('cartFloatBar').addEventListener('click', openCartModal);
  document.getElementById('closeCartModalBtn').addEventListener('click', closeCartModal);
  document.getElementById('finalizarWhatsAppBtn').addEventListener('click', finalizarPedidoWhatsApp);

  // Calculadora e formulário B2B
  document.getElementById('numPessoas').addEventListener('input', calcularEvento);
  document.getElementById('b2bForm').addEventListener('submit', enviarB2B);

  // Menu mobile
  const mobileDrawer = document.getElementById('mobileDrawer');
  document.getElementById('mobileMenuToggle').addEventListener('click', () => mobileDrawer.classList.add('active'));
  document.getElementById('drawerClose').addEventListener('click', () => mobileDrawer.classList.remove('active'));
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => mobileDrawer.classList.remove('active'));
  });
});
