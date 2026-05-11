// MUA SÁCH

function buyBook(bookName) {
  alert("Bạn đã thêm '" + bookName + "' vào giỏ hàng!");
}

// TÌM KIẾM

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

// AUTO SLIDE BANNER

let colors = [
  "linear-gradient(135deg,#ffb300,#ff7043)",
  "linear-gradient(135deg,#42a5f5,#7e57c2)",
  "linear-gradient(135deg,#66bb6a,#26c6da)",
];

let current = 0;

setInterval(function () {
  current++;

  if (current >= colors.length) {
    current = 0;
  }

  document.querySelector(".banner-left").style.background = colors[current];
}, 3000);

// --- 1. LOGIC GIỎ HÀNG ---
let cartCount = 0;

// Sửa lại hàm buyBook hiện tại của bạn
function buyBook(bookName) {
  cartCount++;
  document.getElementById("cart-count").innerText = cartCount;
  alert("Bạn đã thêm '" + bookName + "' vào giỏ hàng thành công!");
}

function viewCart() {
  if (cartCount === 0) {
    alert("Giỏ hàng của bạn đang trống!");
  } else {
    alert("Bạn đang có " + cartCount + " sản phẩm trong giỏ hàng.");
  }
}

// --- 2. LOGIC THÔNG BÁO ---
function toggleNoti() {
  let notiBox = document.getElementById("noti-box");
  notiBox.classList.toggle("hidden");
}

// --- 3. LOGIC ĐĂNG NHẬP ---
function openLogin() {
  document.getElementById("login-modal").classList.remove("hidden");
}

function closeLogin() {
  document.getElementById("login-modal").classList.add("hidden");
}

// Đóng modal nếu người dùng click ra ngoài hộp đăng nhập
window.onclick = function (event) {
  let modal = document.getElementById("login-modal");
  if (event.target == modal) {
    closeLogin();
  }
};
// LỌC SÁCH THEO DANH MỤC
function filterBooks(category) {
  let books = document.querySelectorAll(".card");

  books.forEach(function (book) {
    // Lấy chuỗi danh mục (ví dụ: "cntt flash-sale")
    let bookCategories = book.getAttribute("data-category");

    if (category === "all" || bookCategories.includes(category)) {
      book.style.display = "block";
    } else {
      book.style.display = "none";
    }
  });
}
