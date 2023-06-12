const catchRequires = (data) => {
  let errors = [];
  for (const [key, value] of Object.entries(data)) {
    console.log(value.trim());
    if (value.trim() === "") errors.push(`${key} is required`);
  }
  return errors;
};

export default catchRequires;
