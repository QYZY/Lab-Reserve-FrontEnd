export const WEEKS = [1, 2, 3, 4, 5, 6, 7, 8];
export const DAYS = [
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
  "星期日",
]; // 星期映射为1到7
export const TIME_SLOTS = [
  { id: 1, label: "一二节" },
  { id: 2, label: "三四节" },
  { id: 3, label: "五六节" },
  { id: 4, label: "七八节" },
];

export const STATUS = [
  { status: "PENDING", value: "待办" },
  { status: "APPROVED", value: "已通过" },
  { status: "REJECTED", value: "已拒绝" },
];
// 映射方法
export const getDayLabel = (dayNumber) => {
  return days[dayNumber - 1] || "未知"; // dayNumber 从 1 开始
};

export const getTimeslotLabel = (slotId) => {
  const slot = timeslots.find((slot) => slot.id === slotId);
  return slot ? slot.label : "未知时段"; // 返回对应的label或默认值
};

// 从值获取 ID 的方法
export const getDayId = (dayName) => {
  const index = days.indexOf(dayName);
  return index !== -1 ? index + 1 : null; // 返回 ID（从 1 开始），如果未找到则返回 null
};

export const getTimeslotId = (label) => {
  const slot = timeslots.find((slot) => slot.label === label);
  return slot ? slot.id : null; // 返回 ID，如果未找到则返回 null
};
