import { getAllFeedback } from "./feedbackStore";

export const buildResourceRatingsMap = async () => {
  const feedbackItems = await getAllFeedback();

  const grouped = feedbackItems.reduce((accumulator, item) => {
    if (!item.resourceId) {
      return accumulator;
    }

    if (!accumulator[item.resourceId]) {
      accumulator[item.resourceId] = {
        count: 0,
        total: 0,
      };
    }

    accumulator[item.resourceId].count += 1;
    accumulator[item.resourceId].total += item.rating;
    return accumulator;
  }, {});

  return Object.entries(grouped).reduce((result, [resourceId, stats]) => {
    result[resourceId] = {
      count: stats.count,
      average: stats.count > 0 ? stats.total / stats.count : 0,
    };
    return result;
  }, {});
};
