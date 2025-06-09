import $ from 'jquery'
import 'jquery.easing'

const pagetop = function () {
  'use strict'
  $(function () {
    const pageTop = $('.footer__pagetop')
    pageTop.hide()

    $(window).scroll(function () {
      if ($(this).scrollTop() > 100) {
        pageTop.fadeIn()
      } else {
        pageTop.fadeOut()
      }
    })

    // フッター手前でストップ
    $('.footer__pagetop').hide()

    $(window).on('scroll', function () {
      const scrollHeight = $(document).height()
      const scrollPosition = $(window).height() + $(window).scrollTop()

      const footHeight = $('.l-footer').innerHeight() // paddingだけを考慮した高さ
      const pageTopHeight = $('.footer__pagetop').outerHeight() // footer__pagetopの高さを取得

      if (scrollHeight - scrollPosition <= footHeight - pageTopHeight / 2) {
        $('.footer__pagetop').css({
          position: 'absolute',
          bottom: footHeight - pageTopHeight / 2, // 高さの半分だけ下げる
        })
      } else {
        $('.footer__pagetop').css({
          position: 'fixed',
          bottom: '20px',
        })
      }
    })
  })
}
export default pagetop
