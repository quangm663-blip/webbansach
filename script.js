// KHỞI TẠO BIẾN TOÀN CỤC
let cart = [];
let isLoggedIn = false;
let currentUser = "";
let isVoucherApplied = false; // Trạng thái mã giảm giá

// HÀM HIỂN THỊ TOAST THAY THẾ ALERT
function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  let toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 2900);
}

// 1. MUA SÁCH VÀ HIỆU ỨNG BAY VÀO GIỎ + GỘP SỐ LƯỢNG
function buyBook(bookName, price, imgId, event) {
  // ---- Xử lý Hiệu ứng Bay ----
  let imgElement = document.getElementById(imgId);
  let cartBtn = document.getElementById("cart-btn-nav");

  if (imgElement && cartBtn) {
    let imgRect = imgElement.getBoundingClientRect();
    let cartRect = cartBtn.getBoundingClientRect();

    let clone = imgElement.cloneNode();
    clone.className = "flying-img";
    clone.style.top = imgRect.top + "px";
    clone.style.left = imgRect.left + "px";
    clone.style.width = imgRect.width + "px";
    clone.style.height = imgRect.height + "px";
    document.body.appendChild(clone);

    setTimeout(() => {
      clone.style.top = cartRect.top + 10 + "px";
      clone.style.left = cartRect.left + 10 + "px";
      clone.style.width = "20px";
      clone.style.height = "20px";
      clone.style.opacity = "0.2";
    }, 50);

    setTimeout(() => {
      clone.remove();
    }, 850);
  }

  // ---- Logic Gộp sản phẩm trong Giỏ ----
  let existingItem = cart.find((item) => item.name === bookName);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: bookName, price: price, quantity: 1 });
  }

  updateCartCount();
  showToast(`Đã thêm "${bookName}" vào giỏ hàng!`, "success");
}

// CẬP NHẬT TỔNG SỐ LƯỢNG TRÊN NAVIGATION
function updateCartCount() {
  let totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").innerText = totalQty;
}

// 2. TÌM KIẾM THỜI GIAN THỰC (REAL-TIME SEARCH)
function searchBook() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let books = document.querySelectorAll(".card");

  books.forEach(function (book) {
    let title = book.querySelector(".book-name").innerText.toLowerCase();
    if (title.includes(input)) {
      book.style.display = "block";
    } else {
      book.style.display = "none";
    }
  });
}

// LỌC SÁCH THEO DANH MỤC
function filterBooks(category) {
  let books = document.querySelectorAll(".card");
  books.forEach(function (book) {
    let cat = book.getAttribute("data-category");
    if (cat.includes(category)) {
      book.style.display = "block";
    } else {
      book.style.display = "none";
    }
  });
  showToast(`Đã lọc danh mục sách!`, "success");
}

// 3. AUTO SLIDE BANNER BACKGROUND
let colors = [
  "linear-gradient(135deg,#ffb300,#ff7043)",
  "linear-gradient(135deg,#42a5f5,#7e57c2)",
  "linear-gradient(135deg,#66bb6a,#26c6da)",
];
let current = 0;
setInterval(function () {
  current = (current + 1) % colors.length;
  let banner = document.querySelector(".banner-left");
  if (banner) banner.style.background = colors[current];
}, 3000);

// 4. GIAO DIỆN GIỎ HÀNG VỚI CO CHẾ TĂNG GIẢM SỐ LƯỢNG
function viewCart() {
  renderCart();
  document.getElementById("cart-modal").classList.remove("hidden");
}

function closeCart() {
  document.getElementById("cart-modal").classList.add("hidden");
}

function renderCart() {
  let cartContainer = document.getElementById("cart-items-list");
  let totalContainer = document.getElementById("cart-total");
  let discountRow = document.getElementById("discount-row");
  let discountContainer = document.getElementById("cart-discount");

  let html = "";
  let subtotal = 0;

  if (cart.length === 0) {
    html =
      "<p style='padding: 20px; color: #888; text-align: center;'>Giỏ hàng đang trống</p>";
    isVoucherApplied = false; // Reset voucher nếu giỏ trống
  } else {
    cart.forEach((item, index) => {
      let itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      html += `
                <div class="cart-item">
                  <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price.toLocaleString()}đ x ${item.quantity}</div>
                  </div>
                  <div class="quantity-control">
                    <button class="quantity-btn" onclick="changeQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="changeQuantity(${index}, 1)">+</button>
                  </div>
                  <span class="close-btn" style="position:static; font-size:20px;" onclick="removeFromCart(${index})">&times;</span>
                </div>
            `;
    });
  }

  cartContainer.innerHTML = html;

  // Tính toán giảm giá Voucher
  let discount = isVoucherApplied ? subtotal * 0.5 : 0;
  let finalTotal = subtotal - discount;

  if (isVoucherApplied && cart.length > 0) {
    discountRow.classList.remove("hidden");
    discountContainer.innerText = "-" + discount.toLocaleString() + "đ";
  } else {
    discountRow.classList.add("hidden");
  }

  totalContainer.innerText = finalTotal.toLocaleString() + "đ";
}

function changeQuantity(index, amount) {
  cart[index].quantity += amount;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  updateCartCount();
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartCount();
  renderCart();
  showToast("Đã xóa sản phẩm khỏi giỏ hàng.", "warning");
}

// ÁP DỤNG MÃ GIẢM GIÁ
function applyVoucher() {
  let code = document
    .getElementById("voucher-input")
    .value.trim()
    .toUpperCase();
  if (cart.length === 0) {
    showToast("Vui lòng thêm sản phẩm trước khi nhập mã!", "warning");
    return;
  }
  if (code === "MINHQUANG") {
    isVoucherApplied = true;
    showToast("🎫 Áp dụng mã MINHQUANG thành công! Đã giảm 50%", "success");
    renderCart();
  } else {
    showToast("Mã giảm giá không hợp lệ!", "error");
  }
}

// 5. TÍNH NĂNG THANH TOÁN
function checkout() {
  if (cart.length === 0) {
    showToast("Giỏ hàng của bạn đang trống!", "warning");
    return;
  }
  if (!isLoggedIn) {
    showToast("Vui lòng đăng nhập tài khoản trước khi thanh toán!", "error");
    closeCart();
    openLogin();
    return;
  }

  let subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  let finalTotal = isVoucherApplied ? subtotal * 0.5 : subtotal;

  showToast(
    `🎉 Thanh toán thành công! Đơn hàng trị giá ${finalTotal.toLocaleString()}đ của ${currentUser} đã được ghi nhận!`,
    "success",
  );

  // Reset toàn bộ trạng thái giỏ hàng
  cart = [];
  isVoucherApplied = false;
  document.getElementById("voucher-input").value = "";
  updateCartCount();
  closeCart();
}

// 6. THÔNG BÁO DROPDOWN
function toggleNoti() {
  document.getElementById("noti-box").classList.toggle("hidden");
}

// 7. ĐĂNG NHẬP
function openLogin() {
  document.getElementById("login-modal").classList.remove("hidden");
}
function closeLogin() {
  document.getElementById("login-modal").classList.add("hidden");
}

function handleLogin() {
  let userInp = document.getElementById("login-username").value.trim();
  let passInp = document.getElementById("login-password").value.trim();

  if (userInp === "" || passInp === "") {
    showToast("Vui lòng điền đầy đủ thông tin!", "warning");
    return;
  }

  isLoggedIn = true;
  currentUser = userInp;
  document.getElementById("login-status").innerText = "👤 " + currentUser;

  showToast(`Chào mừng ${currentUser} đã đến với wuangStore!`, "success");
  closeLogin();
}

// 8. TÍNH NĂNG DARK MODE
function toggleDarkMode() {
  let body = document.body;
  body.classList.toggle("dark-mode");

  let toggleBtn = document.getElementById("darkmode-toggle");
  if (body.classList.contains("dark-mode")) {
    toggleBtn.innerText = "☀️";
    showToast("Đã bật chế độ Nền tối!", "success");
  } else {
    toggleBtn.innerText = "🌙";
    showToast("Đã tắt chế độ Nền tối!", "success");
  }
}

// CLICK RA NGOÀI ĐỂ ĐÓNG MODAL
window.onclick = function (event) {
  let loginModal = document.getElementById("login-modal");
  let cartModal = document.getElementById("cart-modal");
  if (event.target == loginModal) closeLogin();
  if (event.target == cartModal) closeCart();
};
// --- LOGIC XỬ LÝ CHATBOT ---
function toggleChatbot() {
  document.getElementById("chatbot-box").classList.toggle("hidden");
}

function handleChatPress(event) {
  if (event.key === "Enter") {
    sendChatMessage();
  }
}

function sendChatMessage() {
  let inputElement = document.getElementById("chatbot-input");
  let messageText = inputElement.value.trim();

  if (messageText === "") return;

  let msgContainer = document.getElementById("chatbot-messages");

  // 1. Hiển thị tin nhắn của Người dùng
  let userMsg = document.createElement("div");
  userMsg.className = "chat-msg user";
  userMsg.innerText = messageText;
  msgContainer.appendChild(userMsg);

  // Xóa nội dung ô input và tự cuộn xuống đáy
  inputElement.value = "";
  msgContainer.scrollTop = msgContainer.scrollHeight;

  // 2. Bot tự động phản hồi lại sau 0.6 giây
  setTimeout(() => {
    let botMsg = document.createElement("div");
    botMsg.className = "chat-msg bot";
    botMsg.innerText =
      "Cảm ơn anh/chị đã ghé qua shop chúng em, shop em sẽ phản hồi sớm nhất có thể.";
    msgContainer.appendChild(botMsg);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }, 600);
}
// HÀM LỌC DÙNG CHUNG THUỘC TÍNH DATA-CATEGORY CỦA CARD
function filterBooksByTag(category) {
  let books = document.querySelectorAll(".card");

  books.forEach(function (book) {
    if (category === "all") {
      book.style.display = "block";
    } else {
      // Lấy chuỗi chữ trong data-category của card (ví dụ: "flash-sale kynang")
      let bookCategories = book.getAttribute("data-category");

      // Nếu chuỗi đó có chứa từ khóa được chọn từ menu
      if (bookCategories && bookCategories.includes(category)) {
        book.style.display = "block";
      } else {
        book.style.display = "none";
      }
    }
  });
  showToast(`Đã lọc sản phẩm theo danh mục lựa chọn!`, "success");
}
