import 'jquery.easing'

const animation = function () {
  'use strict'
  document.addEventListener('DOMContentLoaded', function () {
    // #introductionがページに存在するかを確認
    const mainIntroduction = document.querySelector('#introduction')

    if (!mainIntroduction) return // クラスがなければ処理を終了

    const leads = document.querySelectorAll('.p-introduction-section-lead')
    const sections = document.querySelectorAll('.p-introduction-section')
    const targetSection = document.querySelector('.p-introduction-section.bg07')
    let redirectTimeout = null // 転送のためのタイマー

    // 文字を1つずつ <span> で囲む処理
    leads.forEach((lead) => {
      const text = lead.getAttribute('data-text')
      lead.innerHTML = '' // 一旦クリア
      text.split('').forEach((char, index) => {
        const span = document.createElement('span')
        span.textContent = char
        span.style.transitionDelay = `${index * 0.1}s` // 1文字ごとに0.1秒遅延
        lead.appendChild(span)
      })
    })

    // IntersectionObserverのコールバック関数（1回だけ実行）
    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
          observer.unobserve(entry.target) // 監視を解除（アニメーションを繰り返さない）
        }
      })
    }

    // IntersectionObserverの設定
    const observerOptions = {
      root: null, // ビューポート基準
      rootMargin: '-30% 0px -30% 0px', // 画面中央付近でトリガー
      threshold: 0.1,
    }

    // IntersectionObserverを作成
    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // 文字と背景のアニメーションを監視
    leads.forEach((lead) => observer.observe(lead))
    sections.forEach((section) => observer.observe(section))

    // .p-introduction-section.bg07 がビューポートに入ったらリダイレクト
    if (targetSection) {
      const redirectObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (!redirectTimeout) {
                redirectTimeout = setTimeout(() => {
                  window.location.href = '/' // 3秒後にリダイレクト
                }, 3000) // 3秒（3000ミリ秒）後に転送
              }
            } else {
              // ユーザーがスクロールアップした場合、転送をキャンセル
              if (redirectTimeout) {
                clearTimeout(redirectTimeout)
                redirectTimeout = null
              }
            }
          })
        },
        { threshold: 0.5 }
      ) // 50%以上表示されたら発火

      redirectObserver.observe(targetSection)
    }
  })
}

export default animation
