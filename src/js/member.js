const member = function () {
  document.addEventListener('DOMContentLoaded', function () {
    const checkboxes = document.querySelectorAll('.p-search-bar-item input')
    const members = document.querySelectorAll('.p-page-members-main__block')

    // チェックボックスの変更イベントを設定
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', updateMemberSelection)
    })

    function updateMemberSelection() {
      // 選択されたjob_categoryとjob_keywordをセットに格納
      const selectedCategories = new Set(
        [...document.querySelectorAll('input[name="job_category"]:checked')].map((el) => el.id)
      )

      const selectedKeywords = new Set(
        [...document.querySelectorAll('input[name="job_keyword"]:checked')].map((el) => el.id)
      )

      // 何もチェックがない場合、全メンバーにjs-selectedを付与して表示
      if (selectedCategories.size === 0 && selectedKeywords.size === 0) {
        members.forEach((member) => {
          member.classList.add('js-selected')
        })
      } else {
        // チェックされたカテゴリ・キーワードに該当するメンバーにjs-selectedを付与
        members.forEach((member) => {
          const categoryElements = member.querySelectorAll('.p-page-members-main__category')
          const keywordElements = member.querySelectorAll('.p-page-members-main__keyword')

          // メンバーのカテゴリとキーワードをクラス名から取得
          const memberCategories = new Set(
            [...categoryElements].map((el) => el.classList[1]) // 2番目のクラス
          )
          const memberKeywords = new Set(
            [...keywordElements].map((el) => el.classList[1]) // 2番目のクラス
          )

          // カテゴリとキーワードのいずれかが一致する場合にjs-selectedを付与
          const matchCategory = [...selectedCategories].some((cat) => memberCategories.has(cat))
          const matchKeyword = [...selectedKeywords].some((key) => memberKeywords.has(key))

          if (matchCategory || matchKeyword) {
            member.classList.add('js-selected')
          } else {
            member.classList.remove('js-selected')
          }
        })
      }
    }

    // 初期状態で全メンバーにjs-selectedを付与
    members.forEach((member) => {
      member.classList.add('js-selected')
    })
  })
}
export default member
