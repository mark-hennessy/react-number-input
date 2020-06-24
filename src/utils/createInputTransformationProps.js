const createInputTransformationProps = ({
  value,
  allCaps,
  onChange,
  onValueChange,
}) => {
  const transformValue = rawValue => {
    // convert undefined and null to ''
    // convert 5 to '5'
    let newValue =
      rawValue !== undefined && rawValue !== null ? `${rawValue}` : '';

    if (allCaps) {
      newValue = rawValue.toUpperCase();
    }

    return newValue;
  };

  const onChangeWrapper = e => {
    const { name, value } = e.target;
    const newValue = transformValue(value);
    e.target.value = newValue;

    if (onChange) {
      onChange(e);
    }

    if (onValueChange) {
      onValueChange(newValue, name);
    }
  };

  const transformedValue = transformValue(value);

  return {
    transformedValue,
    onChangeWrapper,
  };
};

export default createInputTransformationProps;
