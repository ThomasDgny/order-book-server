function calculateRunningTotal(entries) {
    let total = 0;
    return entries.map(entry => {
      total += entry.size;
      return { ...entry, total };
    });
  }
  
  function manageArraySize(existingArray, newArray) {
    return newArray.concat(existingArray).slice(0, 15);
  }
  
  module.exports = {
    calculateRunningTotal,
    manageArraySize,
  };
  