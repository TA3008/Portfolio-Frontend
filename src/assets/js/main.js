const fetchSections = [
  fetch('components/SidebarMenu.html').then(res => res.text()).then(data => {
    document.getElementById('sidebar-menu').innerHTML = data;
  }),
  fetch('sections/AboutMe.html').then(res => res.text()).then(data => {
    document.getElementById('about').innerHTML = data;
  }),
  fetch('sections/MyService.html').then(res => res.text()).then(data => {
    document.getElementById('services').innerHTML = data;
  }),
  fetch('sections/MyWork.html').then(res => res.text()).then(data => {
    document.getElementById('work').innerHTML = data;
  }),
  fetch('sections/ContactMe.html').then(res => res.text()).then(data => {
    document.getElementById('contact').innerHTML = data;
  })
];

Promise.all(fetchSections).then(() => {
  // Đợi layout vẽ xong, sau đó gắn scroll logic
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

    // Toggle mobile menu
    $("#menu-toggle").on("click", function () {
      $("#menu").addClass("active");
    });
    $("#menu-close").on("click", function () {
      $("#menu").removeClass("active");
    });

    // Reset scroll nếu lệch
    $(window).trigger("scroll");

  }, 200); // Delay nhỏ để layout kịp render xong
});
