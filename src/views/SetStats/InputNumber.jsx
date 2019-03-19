// @flow
/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
} from '@material-ui/core';
import { translate } from "actions";



const propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

class InputNumber extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  render() {
    const {
      label,
      lang,
      value,
      onChange,
    } = this.props;
    return (
      <TextField
        className="item-field"
        label={translate(label, lang)}
        value={value}
        onChange={onChange}
        type="number"
        inputProps={{
          name: label,
          onKeyPress: this.handleKeyPress
        }}
        variant="filled"
      />
    );
  }

  handleKeyPress = (e) => {
    //prevent user enter + - e in number input field.
    if (["+", "-", "e", "."].includes(e.key)) {
      e.preventDefault();
    }
  }
}

InputNumber.propTypes = propTypes;

export default InputNumber;