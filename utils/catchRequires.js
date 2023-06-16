const catchRequires = (data) => {
  let errors = [];
  for (const [key, value] of Object.entries(data)) {
    if (value.trim() === "") errors.push(`${key} is required`);
  }
  return errors;
};

export default catchRequires;
