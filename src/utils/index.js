export const getValueByProp = (propertyName, value) => () => ({
    [propertyName]: value,
})

export const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timezone: 'UTC',
  };

export const randomId = () =>
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

     