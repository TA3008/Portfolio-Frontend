const fetchSections = [
  fetch('components/SidebarMenu.html')
    .then(res => res.text())
    .then(html => {
      // Gắn HTML vào DOM
      const container = document.getElementById('sidebar-menu');
      container.innerHTML = html;

      // Gắn sự kiện sau khi DOM đã render
      initSidebarMenu();
    })
    .catch(err => console.error('Lỗi tải SidebarMenu.html:', err)),

  fetch('sections/AboutMe.html').then(res => res.text()).then(data => {
    document.getElementById('about').innerHTML = data;
  }),

  fetch('sections/MyService.html').then(res => res.text()).then(data => {
    document.getElementById('services').innerHTML = data;
  }),

  fetch('sections/MyWork.html').then(res => res.text()).then(data => {
    document.getElementById('work').innerHTML = data;

    // CHỜ DOM được render xong rồi mới khởi tạo Isotope
    setTimeout(() => {
      const elem = document.querySelector('.isotope-box');
      if (elem) {
        new Isotope(elem, {
          itemSelector: '.isotope-item',
          layoutMode: 'fitRows',
          percentPosition: true
        });
      }
    }, 100);
  }),

  fetch('sections/ContactMe.html').then(res => res.text()).then(data => {
    document.getElementById('contact').innerHTML = data;

    // Gắn submit handler sau khi DOM đã render
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); // Ngăn reload trang

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      const formData = { name, email, subject, message };

      try {
        // Gọi API gửi thông tin liên hệ
        const response = await fetch(`${CONFIG.API_BASE_URL}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          alert('✅ Gửi thành công! Cảm ơn bạn đã liên hệ.');
          form.reset();
        }
      } catch (error) {
        console.error('❌ Lỗi kết nối:', error);
        alert('❌ Đã xảy ra lỗi khi gửi biểu mẫu.');
      }
    });
  })
];

Promise.all(fetchSections).then(() => {
  setTimeout(() => {
    $(".main-menu li:first").addClass("active");

    const showSection = function (section, isAnimate) {
      const direction = section.replace(/#/, "");
      const reqSection = $(".section").filter(`[data-section="${direction}"]`);
      const reqSectionPos = reqSection.offset().top;

      if (isAnimate) {
        $("html, body").animate({ scrollTop: reqSectionPos }, 800);
      } else {
        $("html, body").scrollTop(reqSectionPos);
      }
    };

    const checkSection = function () {
      $(".section").each(function () {
        const $this = $(this);
        const topEdge = $this.offset().top - 80;
        const bottomEdge = topEdge + $this.height();
        const wScroll = $(window).scrollTop();

        if (topEdge < wScroll && bottomEdge > wScroll) {
          const currentId = $this.data("section");
          const reqLink = $("a").filter(`[href*="#${currentId}"]`);
          reqLink.closest("li").addClass("active").siblings().removeClass("active");
        }
      });
    };

    $(".main-menu").on("click", "a", function (e) {
      e.preventDefault();
      showSection($(this).attr("href"), true);
    });

    $(window).on("scroll", checkSection);
    $(window).trigger("scroll");
  }, 200);
});

// Hàm gắn toggle menu sau khi SidebarMenu đã render
function initSidebarMenu() {
  const toggleBtn = document.querySelector('#menu-toggle');
  const closeBtn = document.querySelector('#menu-close');
  const menu = document.querySelector('#menu');

  if (!toggleBtn || !closeBtn || !menu) {
    console.error('❌ Không tìm thấy toggle, close hoặc menu');
    return;
  }

  toggleBtn.addEventListener('click', () => {
    console.log('✅ Mở menu');
    menu.classList.add('open');
  });

  closeBtn.addEventListener('click', () => {
    console.log('✅ Đóng menu');
    menu.classList.remove('open');
  });
}
