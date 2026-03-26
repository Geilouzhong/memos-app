export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    // 如果小于 1 分钟
    if (diff < 60000) {
      return '刚刚';
    }

    // 如果小于 1 小时
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} 分钟前`;
    }

    // 如果小于 24 小时
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} 小时前`;
    }

    // 如果小于 7 天
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days} 天前`;
    }

    // 否则显示完整日期
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch (error) {
    console.error('日期格式化失败:', error);
    return dateString;
  }
};
