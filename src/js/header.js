import $ from 'jquery'
import 'jquery.easing'

import Swiper from 'swiper/bundle'
import 'swiper/css/bundle'

const header = function () {
  'use strict'
  $(function () {
    $('#hamburger').on('click', function () {
      $('.hamburger__menu').toggleClass('close')
      $('.nav__menu').slideToggle()

      // スクロール禁止のクラスを切り替え
      $('body').toggleClass('no-scroll')
    })
  })

  $(function () {
    //クリックで動く
    $('.nav__item').click(function () {
      $(this).toggleClass('open')
      $(this).children('.nav__sublist').slideToggle()
    })
  })

  $(function () {
    const $header = $('.header')
    const fvHeight = $('.p-top-fv').outerHeight() // FVの高さを取得
    const pvHeight = $('.p-page-fv').outerHeight() // FVの高さを取得
    console.log(`fvHeight: ${fvHeight}, pvHeight: ${pvHeight}`)

    $(window).on('scroll', function () {
      if ($(this).scrollTop() > fvHeight || $(this).scrollTop() > pvHeight) {
        $header.addClass('scrolled')
      } else {
        $header.removeClass('scrolled')
      }
    })
  })

  $(function () {
    const DURATION = 3000 // スライド1枚の表示時間（ミリ秒）

    const swiper = new Swiper('#mainSlider', {
      loop: true,
      effect: 'fade',
      autoplay: {
        delay: DURATION,
        disableOnInteraction: false,
      },
      speed: 1000,
      on: {
        slideChangeTransitionStart: function () {
          updateSlideCounter()
          startProgressBar(DURATION)
        },
      },
    })

    const totalSlides = $('#mainSlider .swiper-slide:not(.swiper-slide-duplicate)').length
    $('.total-slides').text(String(totalSlides).padStart(2, '0'))

    let isPlaying = true
    let startTime = null
    let elapsed = 0
    let timer = null

    function updateSlideCounter() {
      const current = swiper.realIndex + 1
      $('.current-slide').text(String(current).padStart(2, '0'))
    }

    function startProgressBar(duration) {
      clearTimeout(timer)
      const $bar = $('.fv__progress-bar')
      $bar.css({ width: '0%', transition: 'none' })

      setTimeout(() => {
        $bar.css({
          width: '100%',
          transition: `width ${duration}ms linear`,
        })
      }, 50)

      startTime = Date.now()
      elapsed = 0

      timer = setTimeout(() => {
        startTime = null
      }, duration)
    }

    function pauseProgressBar() {
      if (!startTime) return

      const $bar = $('.fv__progress-bar')
      elapsed = Date.now() - startTime
      const percent = Math.min((elapsed / DURATION) * 100, 100)

      $bar.css({
        width: percent + '%',
        transition: 'none',
      })

      clearTimeout(timer)
      startTime = null
    }

    function resumeProgressBar() {
      const remaining = DURATION - elapsed
      if (remaining <= 0) return

      const $bar = $('.fv__progress-bar')

      // 現在の幅を即反映（正確な位置まで伸ばす）
      const percent = Math.min((elapsed / DURATION) * 100, 100)
      $bar.css({
        width: percent + '%',
        transition: 'none',
      })

      // ★ 1フレーム後に「続きから」100%まで伸ばす
      requestAnimationFrame(() => {
        $bar.css({
          transition: `width ${remaining}ms linear`,
          width: '100%',
        })
      })

      // ★ new startTimeは「今時点 - 前の経過分」で補正する
      startTime = Date.now() - elapsed

      // ★ new タイマーは「残り時間」で再スタート
      clearTimeout(timer)
      timer = setTimeout(() => {
        startTime = null
        elapsed = 0
      }, remaining)
    }

    // 初回
    updateSlideCounter()
    startProgressBar(DURATION)

    // 再生/停止トグル
    $('#sliderToggle').on('click', function () {
      const $btn = $(this)

      if (isPlaying) {
        swiper.autoplay.stop()
        $btn.removeClass('playing').text('▶︎')
        pauseProgressBar()
        isPlaying = false
      } else {
        swiper.autoplay.start()
        $btn.addClass('playing').text('⏸︎')
        resumeProgressBar()
        isPlaying = true
      }
    })
  })
}
export default header
