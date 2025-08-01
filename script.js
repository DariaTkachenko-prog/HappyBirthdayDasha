document.addEventListener("DOMContentLoaded", () => {
  const cake = document.getElementById("cake");
  const bgMusic = document.getElementById("bg-music");
  const openSound = document.getElementById("open-sound");
  const clickText = document.querySelector(".click-text");
  const congratsWrapper = document.querySelector(".congrats-wrapper");
  const candleLit = document.getElementById("candle-lit");

  const FIRE_DURATION_MS = 3000;
  let alreadyFired = false;

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const lightCandle = () => {
    if (!candleLit) return;
    candleLit.classList.remove("hidden", "fade-out");
    requestAnimationFrame(() => {
      candleLit.classList.add("fade-in", "flicker");
    });

    // Останавливаем мигание торта, когда свеча активирована
    if (cake) {
      cake.classList.add("no-blink");  // Этот класс останавливает мигание торта
    }
  };

  const hideCake = () => {
    return new Promise((resolve) => {
      if (!cake) return resolve();
      cake.classList.add("fade-out-cake");
      setTimeout(() => {
        cake.classList.add("opened");
        cake.style.display = "none";
        resolve();
      }, 400);
    });
  };

  const hideCandle = () => {
    return new Promise((resolve) => {
      if (!candleLit) return resolve();
      candleLit.classList.remove("flicker", "fade-in");
      candleLit.classList.add("fade-out");
      setTimeout(() => {
        candleLit.style.display = "none";
        resolve();
      }, 400);
    });
  };

  const showCongrats = (effect = "dissolve") => {
    if (!congratsWrapper) return;

    // Сброс
    congratsWrapper.classList.remove("hidden", "show-dissolve", "show-flyin", "pre-flyin");

    // Если flyin, подготовка смещения
    if (effect === "flyin") {
      congratsWrapper.classList.add("pre-flyin");
    }

    // Показываем (убираем скрытие)
    requestAnimationFrame(() => {
      if (effect === "flyin") {
        congratsWrapper.classList.add("show-flyin");
      } else {
        congratsWrapper.classList.add("show-dissolve");
      }

      // По-строчное проявление текста
      const lines = congratsWrapper.querySelectorAll(".congrats-text .line");
      lines.forEach((line, idx) => {
        setTimeout(() => {
          line.classList.add("visible");
        }, idx * 180 + 100);
      });

      // Анимация появления подписи
      setTimeout(() => {
        const signature = document.querySelector('.signature');
        if (signature) {
          signature.style.opacity = 1;
          signature.style.transform = 'translateY(0)';
        }
      }, (lines.length * 180) + 100); // Подпись появляется после всех строк

      if (bgMusic) {
        bgMusic.play().catch(() => {});
      }
    });
  };

  const handleClick = async () => {
    if (alreadyFired) return;
    alreadyFired = true;

    if (openSound) {
      openSound.currentTime = 0;
      openSound.play().catch(() => {});
    }

    if (clickText) clickText.remove();

    lightCandle();

    await delay(FIRE_DURATION_MS);
    
    // Обе функции скрытия будут выполняться параллельно
    await Promise.all([hideCake(), hideCandle()]);

    showCongrats("dissolve"); // или "flyin"
  };

  if (cake) {
    cake.addEventListener("click", handleClick);
  }
});







