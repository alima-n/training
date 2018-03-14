export const getValueByProp = (propertyName, value) => () => ({
    [propertyName]: value,
})

export const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timezone: 'UTC',
  };
  