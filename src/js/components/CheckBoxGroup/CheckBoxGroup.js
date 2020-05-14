import React, { forwardRef, useContext, useMemo } from 'react';

import { Box } from '../Box';
import { CheckBox } from '../CheckBox';
import { FormContext } from '../Form/FormContext';

export const CheckBoxGroup = forwardRef(
  (
    {
      value: valueProp,
      disabled: disabledProp,
      gap = 'small', // consistent with RadioButtonGroup default
      labelKey,
      valueKey,
      onChange,
      options: optionsProp,
      name,
      ...rest
    },
    ref,
  ) => {
    const formContext = useContext(FormContext);

    // In case option is a string, normalize it to be an object
    const options = useMemo(
      () =>
        optionsProp.map(option => {
          return typeof option === 'string'
            ? {
                disabled: disabledProp,
                id: option,
                label: option,
              }
            : option;
        }),
      [optionsProp, disabledProp],
    );

    // 'value' is an array of checked valueKeys
    const [value, setValue] = formContext.useFormContext(name, valueProp, []);

    // Logic is necessary to maintain a proper data structure for Form logic
    const onCheckBoxChange = (event, optionValue, option) => {
      // deep copy of value
      const nextValue = JSON.parse(JSON.stringify(value)) || [];
      const optionIndex = nextValue.indexOf(optionValue);
      // If the index of the value option isn't in the array add the option.
      // Otherwise, remove the option from the array to simulate a toggle action
      if (optionIndex < 0) nextValue.push(optionValue);
      else nextValue.splice(optionIndex, 1);
      setValue(nextValue);
      // Same functionalities as Select onChange()
      if (onChange) {
        event.persist(); // extract from React synthetic event pool
        const adjustedEvent = event;
        adjustedEvent.value = nextValue;
        adjustedEvent.option = option;
        onChange(adjustedEvent);
      }
    };

    return (
      <Box ref={ref} gap={gap} {...rest}>
        {options.map(
          ({
            checked: checkedOption,
            disabled: disabledOption,
            label: labelOption,
            ...optionRest
          }) => {
            const label = labelKey
              ? optionRest[labelKey] || labelOption
              : labelOption;
            const disabled = disabledProp || disabledOption;
            const valueOption = valueKey ? optionRest[valueKey] : optionRest.id;
            const checked =
              checkedOption ||
              (valueProp && valueProp.indexOf(valueOption) >= 0);
            const option = { label, checked, disabled, ...optionRest };
            return (
              <CheckBox
                key={label}
                disabled={disabled}
                checked={checked}
                label={label}
                onChange={event => onCheckBoxChange(event, valueOption, option)}
                {...optionRest}
              />
            );
          },
        )}
      </Box>
    );
  },
);

CheckBoxGroup.displayName = 'CheckBoxGroup';

let CheckBoxGroupDoc;
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  CheckBoxGroupDoc = require('./doc').doc(CheckBoxGroup);
}
const RadioButtonGroupWrapper = CheckBoxGroupDoc || CheckBoxGroup;

export { RadioButtonGroupWrapper as RadioButtonGroup };