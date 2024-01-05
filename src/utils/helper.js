import { USER_AVATAR_IMG } from '../constants/constants'

export const getVisiblePage = (totalPages, visiblePages, curPage) => {
  // Limit the visible page
  if (visiblePages > totalPages) {
    visiblePages = totalPages
  }
  const half = Math.floor(visiblePages / 2)
  var start = curPage - half + 1 - (visiblePages % 2)
  var end = curPage + half

  // handle boundary case
  if (start <= 0) {
    start = 1
    end = visiblePages
  }
  if (end > totalPages) {
    start = totalPages - visiblePages + 1
    end = totalPages
  }

  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push({
      value: i,
      isCurrent: i === +curPage,
    })
  }
  return pages
}

export const makeCode = (length) => {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}

export const randomAvatar = () => {
  return USER_AVATAR_IMG[Math.floor(Math.random() * USER_AVATAR_IMG.length)]
}
