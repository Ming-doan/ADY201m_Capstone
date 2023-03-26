function convertTable(columns, dataSource) {
  // Insert keys
  const data = dataSource.map((item, index) => {
    return { ...item, key: index };
  });
  return data.map((item) => {
    const obj = {};
    columns.forEach((column) => {
      obj[column.dataIndex] = item[column.dataIndex];
    });
    return obj;
  });
}
