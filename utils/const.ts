export const keyToMenuNames = {
  "/home": { path: "/home", name: "首页" },
  // "/learn": { path: "/learn", name: "学习" },
  // "/tasks": { path: "/tasks", name: "任务" },
  "/practice": {
    path: "/practice/list",
    name: "练习",
  },
  "/game": { path: "/game", name: "娱乐" },
  "/shop": { path: "/shop", name: "商店" },
}

export const imgUrls = [
  "https://s11.ax1x.com/2022/12/14/zIZpW9.png",
  "https://s11.ax1x.com/2022/12/14/zIVjdU.png",
  "https://s11.ax1x.com/2022/12/14/zIVXZT.png",
  "https://s11.ax1x.com/2022/12/07/zc0ar9.jpg",
  "https://s11.ax1x.com/2022/12/07/zgDHeJ.png",
  "https://s11.ax1x.com/2022/12/07/zgDoyF.jpg",
  "https://s11.ax1x.com/2022/12/07/zgD4zT.jpg",
  "https://s11.ax1x.com/2022/12/07/zgD2on.jpg",
]

export const indexToOption = ["A", "B", "C", "D"]

export const expArr = [100, 200, 300]

export const quoteTimeFormat = "YYYY.MM.DD"

export const backpackSideNav = ["道具"]

export const gradeOptions = [
  {
    value: 1,
    label: "一年级",
  },
  {
    value: 2,
    label: "二年级",
  },
  {
    value: 3,
    label: "三年级",
  },
  {
    value: 4,
    label: "四年级",
  },
  {
    value: 5,
    label: "五年级",
  },
  {
    value: 6,
    label: "六年级",
  },
  {
    value: 7,
    label: "初一",
  },
  {
    value: 8,
    label: "初二",
  },
  {
    value: 9,
    label: "初三",
  },
  {
    value: 10,
    label: "高一",
  },
  {
    value: 11,
    label: "高二",
  },
  {
    value: 12,
    label: "高三",
  },
]

export const ossBaseURL =
  process.env.NODE_ENV === "production"
    ? "/media-proxy/"
    : "http://120.25.178.64:3150/"
