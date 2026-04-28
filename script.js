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

function atualizarCarousel() {
  slides.forEach(s => s.classList.remove("active"));
  dots.forEach(d => d.classList.remove("active"));

  slides[index].classList.add("active");
  if (dots[index]) dots[index].classList.add("active");
}

function mudarSlide(dir) {
  index += dir;

  if (index < 0) index = slides.length - 1;
  if (index >= slides.length) index = 0;

  atualizarCarousel();
}

// clique lateral
carousel.addEventListener("click", (e) => {
  if (isSwiping) return;

  const rect = carousel.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;

  if (clickX < width / 2) mudarSlide(-1);
  else mudarSlide(1);
});

// swipe mobile
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
// NUMERAÇÃO
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
// RESUMO
// ==========================
function atualizarResumo() {
  let total = 0;
  let resumoTexto = "";

  total += qtdBase.value * precoUnitario;
  resumoTexto += `${cor.value} - ${tamanho.value} (${qtdBase.value} un.)\n`;

  document.querySelectorAll(".item").forEach(item => {
    const c = item.querySelector(".cor").value;
    const t = item.querySelector(".tamanho").value;
    const q = item.querySelector(".quantidade").value;

    total += q * precoUnitario;
    resumoTexto += `${c} - ${t} (${q} un.)\n`;
  });

  document.getElementById("resumo").innerHTML =
    `<h3>Resumo</h3><pre>${resumoTexto}</pre><strong>Total: R$ ${total.toFixed(2)}</strong>`;

  document.getElementById("resumoInput").value = resumoTexto;
  document.getElementById("totalInput").value = total.toFixed(2);
}

// ==========================
// SUBMIT (WHATS + FORMS)
// ==========================
document.getElementById("pedidoForm").addEventListener("submit", function(e) {
  e.preventDefault();

  atualizarResumo();

  // ==========================
  // WHATSAPP PRIMEIRO (CRÍTICO)
  // ==========================
  const nome = document.querySelector('[name="entry.382958934"]').value;

  let mensagem = `*Olá! Acabei de realizar um pedido.*\n\n`;
  mensagem += `Nome: ${nome}\n\n`;
  mensagem += `*Resumo*\n`;
  mensagem += document.getElementById("resumoInput").value;
  mensagem += `\nTotal no PIX: *R$ ${document.getElementById("totalInput").value}*\n\n`;
  mensagem += `Aguardo o link de pagamento 🤪`;

  const numero = "47999942225";

  const link = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

  // abre imediatamente (evita bloqueio)
  window.open(link, "_blank");

  // ==========================
  // ENVIA PRO FORMS (depois)
  // ==========================
  const url = "https://docs.google.com/forms/d/e/1FAIpQLSfKg0pFvwNUL3E4FSgQYMy6xlZKTk6tWZAD0yCrDi8l0wpmiQ/formResponse";

  const data = new FormData();

  data.append("entry.382958934", nome);
  data.append("entry.264914806", document.querySelector('[name="entry.264914806"]').value);
  data.append("entry.706782334", document.querySelector('[name="entry.706782334"]').value);
  data.append("entry.236354104", document.getElementById("resumoInput").value);
  data.append("entry.1970057357", document.getElementById("totalInput").value);

  fetch(url, {
    method: "POST",
    mode: "no-cors",
    body: data
  });
});

// ==========================
// INIT
// ==========================
cor.addEventListener("change", atualizarResumo);
tamanho.addEventListener("change", atualizarResumo);
qtdBase.addEventListener("input", atualizarResumo);

atualizarCarousel();
atualizarResumo();