export const getValueByProp = (propertyName, value) => () => ({
    [propertyName]: value,
})
