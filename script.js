// ==========================
// CONFIG
// ==========================
const precoUnitario = 69.90;

// ==========================
// ELEMENTOS BASE
// ==========================
const cor = document.getElementById("cor");
const tamanho = document.getElementById("tamanho");

// quantidade base
const qtdBase = document.createElement("input");
qtdBase.type = "number";
qtdBase.min = 1;
qtdBase.value = 1;
qtdBase.id = "quantidadeBase";

tamanho.after(qtdBase);

// ==========================
// CARROSSEL
// ==========================
let index = 0;

const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const carousel = document.getElementById("carousel");

let isSwiping = false;
let startX = 0;

function aplicarFiltroCor() {
  if (!cor.value) {
    slides.forEach(slide => slide.style.display = "block");
    index = 0;
    atualizarCarousel();
    return;
  }

  let corSelecionada = cor.value.includes("Vermelho") ? "vermelho" : "azul";

  slides.forEach(slide => {
    if (slide.dataset.cor === corSelecionada) {
      slide.style.display = "block";
    } else {
      slide.style.display = "none";
      slide.classList.remove("active");
    }
  });

  index = 0;
  atualizarCarousel();
}

function getSlidesVisiveis() {
  return Array.from(slides).filter(s => s.style.display !== "none");
}

function atualizarCarousel() {
  const visiveis = getSlidesVisiveis();

  slides.forEach(s => s.classList.remove("active"));
  dots.forEach(d => d.classList.remove("active"));

  if (visiveis.length === 0) return;

  visiveis[index].classList.add("active");

  const realIndex = Array.from(slides).indexOf(visiveis[index]);
  if (dots[realIndex]) dots[realIndex].classList.add("active");
}

function mudarSlide(dir) {
  const visiveis = getSlidesVisiveis();

  index += dir;

  if (index < 0) index = visiveis.length - 1;
  if (index >= visiveis.length) index = 0;

  atualizarCarousel();
}

// ==========================
// CLIQUE INTELIGENTE
// ==========================
carousel.addEventListener("click", (e) => {
  if (isSwiping) return;

  const rect = carousel.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;

  const zona = width / 3;

  if (clickX < zona) {
    mudarSlide(-1);
  } else if (clickX > width - zona) {
    mudarSlide(1);
  } else {
    abrirImagem();
  }
});

// ==========================
// ABRIR IMAGEM
// ==========================
function abrirImagem() {
  const visiveis = getSlidesVisiveis();
  const slideAtual = visiveis[index];

  if (!slideAtual) return;

  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modalImg");

  modal.style.display = "flex";
  modalImg.src = slideAtual.src;
}

// fechar
document.querySelector(".fechar").onclick = () => {
  document.getElementById("modal").style.display = "none";
};

// fechar clicando fora
document.getElementById("modal").onclick = (e) => {
  if (e.target.id === "modal") {
    e.target.style.display = "none";
  }
};
// ==========================
// SWIPE
// ==========================
carousel.addEventListener("touchstart", (e) => {
  isSwiping = true;
  startX = e.touches[0].clientX;
});

carousel.addEventListener("touchend", (e) => {
  const diff = startX - e.changedTouches[0].clientX;

  if (diff > 50) mudarSlide(1);
  else if (diff < -50) mudarSlide(-1);

  setTimeout(() => isSwiping = false, 100);
});

// ==========================
// NUMERAÇÃO DINÂMICA
// ==========================
function atualizarNumeracao() {
  const itens = document.querySelectorAll(".item");

  itens.forEach((item, index) => {
    const titulo = item.querySelector("strong");
    titulo.textContent = `Peça ${index + 2}`;
  });
}

// ==========================
// CARRINHO
// ==========================
document.getElementById("addItem").onclick = () => {

  const item = document.createElement("div");
  item.classList.add("item");

  item.innerHTML = `
    <div class="item-header">
      <strong>Peça</strong>
      <button type="button" class="remover">remover</button>
    </div>

    <select class="cor">
      <option>Off-White + Vermelho</option>
      <option>Off-White + Azul</option>
    </select>

    <select class="tamanho">
      <option>PP</option><option>P</option><option>M</option><option>G</option><option>GG</option>
    </select>

    <input type="number" class="quantidade" value="1" min="1">
  `;

  document.getElementById("carrinho").appendChild(item);

  item.querySelector(".remover").onclick = () => {
    item.remove();
    atualizarResumo();
    atualizarNumeracao();
  };

  item.querySelectorAll("select, input").forEach(el => {
    el.addEventListener("change", atualizarResumo);
    el.addEventListener("input", atualizarResumo);
  });

  atualizarResumo();
  atualizarNumeracao();
};

// ==========================
// RESUMO (CORRIGIDO)
// ==========================
function atualizarResumo() {
  let total = 0;
  let html = "<h3>Resumo</h3>";

  const corBase = cor.value || "-";
  const tamanhoBase = tamanho.value || "-";
  const qtd = parseInt(qtdBase.value) || 0;

  total += qtd * precoUnitario;

  html += `<p>${corBase} - ${tamanhoBase} (${qtd} un.)</p>`;

  document.querySelectorAll(".item").forEach(item => {
    const c = item.querySelector(".cor")?.value || "-";
    const t = item.querySelector(".tamanho")?.value || "-";
    const q = parseInt(item.querySelector(".quantidade")?.value) || 0;

    total += q * precoUnitario;

    html += `<p>${c} - ${t} (${q} un.)</p>`;
  });

  html += `<strong>Total: R$ ${total.toFixed(2)}</strong>`;

  document.getElementById("resumo").innerHTML = html;
}

// ==========================
// WHATSAPP
// ==========================
function redirecionarWhats() {
  const nome = document.querySelector('input[name="entry.111111111"]').value;

  let mensagem = `*Olá! Acabei de realizar um pedido.*\n\n`;
  mensagem += `Nome: ${nome}\n\n`;
  mensagem += `*Resumo*\n`;

  const corBase = cor.value;
  const tamanhoBase = tamanho.value;
  const qtd = parseInt(qtdBase.value) || 0;

  let total = qtd * precoUnitario;

  mensagem += `${corBase} - ${tamanhoBase} (${qtd} un.)\n`;

  document.querySelectorAll(".item").forEach(item => {
    const c = item.querySelector(".cor").value;
    const t = item.querySelector(".tamanho").value;
    const q = parseInt(item.querySelector(".quantidade").value) || 0;

    total += q * precoUnitario;

    mensagem += `${c} - ${t} (${q} un.)\n`;
  });

  mensagem += `\nTotal no PIX: *R$ ${total.toFixed(2)}*\n\n`;
  mensagem += `Aguardo o link de pagamento 🤪`;

  const numero = "47999942225";

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const url = isMobile
    ? `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`
    : `https://web.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank");
}

// ==========================
// INIT
// ==========================
cor.addEventListener("change", () => {
  aplicarFiltroCor();
  atualizarResumo();
});

tamanho.addEventListener("change", atualizarResumo);
qtdBase.addEventListener("input", atualizarResumo);

aplicarFiltroCor();
atualizarResumo();