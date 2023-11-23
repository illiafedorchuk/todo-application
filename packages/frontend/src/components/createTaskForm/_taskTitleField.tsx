import React, {
  FC,
  ReactElement,
  ChangeEvent,
} from 'react';
import PropTypes from 'prop-types';

import { TextField } from '@mui/material';
import { ITextField } from './interfaces/ITextField';

export const TaskTitleField: FC<ITextField> = (
  props,
): ReactElement => {
  // Destructure props
  const {
    onChange = (e: ChangeEvent<HTMLInputElement>) =>
      console.log(e),
    disabled = false,
  } = props;

  return (
    <TextField
      id="title"
      label="Task Title"
      placeholder="Task Title"
      variant="outlined"
      size="small"
      name="title"
      fullWidth
      disabled={disabled}
      onChange={onChange}
    />
  );
};

TaskTitleField.propTypes = {
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};
