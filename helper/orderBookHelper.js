function calculateRunningTotal(entries) {
  let total = 0;
  return entries.map((entry) => {
    total += entry.size;
    return { ...entry, total };
  });
}

function manageArraySize(existingArray, newArray) {
  return newArray.concat(existingArray).slice(0, 15);
}

function handleOrderBookResponse(data) {
  const updatedBids = data.b.map(([price, size]) => ({
    price: parseFloat(price),
    size: parseFloat(size),
    total: 0,
  }));

  const updatedAsks = data.a.map(([price, size]) => ({
    price: parseFloat(price),
    size: parseFloat(size),
    total: 0,
  }));

  const processedData = {
    bids: manageArraySize([], calculateRunningTotal(updatedBids)),
    asks: manageArraySize([], calculateRunningTotal(updatedAsks)),
  };
  return processedData;
}

module.exports = {
  handleOrderBookResponse,
};
