import React, { ChangeEvent, FocusEvent } from 'react';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
import { WrappedFieldProps } from 'redux-form';


const phoneUtil = PhoneNumberUtil.getInstance();

interface PhoneInputProps extends WrappedFieldProps {
}

interface PhoneInputState {
  value: string;
  formValue: string;
}

export default class PhoneInput extends React.Component<PhoneInputProps, PhoneInputState> {

  constructor(props: PhoneInputProps) {
    super(props);
    this.state = {
      formValue: '',
      value: '',
    };
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  static getDerivedStateFromProps(nextProps: PhoneInputProps, prevState: PhoneInputState): Partial<PhoneInputState> | null {
    if (nextProps.input.value !== prevState.formValue) {
      return {
        value: nextProps.input.value,
        formValue: nextProps.input.value,
      };
    }
    return null;
  }

  onChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState({ value: e.target.value });
  }

  onBlur(e: FocusEvent<HTMLInputElement>) {
    const phone_number = phoneUtil.parse(e.target.value, 'US');
    const formatted_phone_number = phoneUtil.format(phone_number, PhoneNumberFormat.E164);
    this.setState({
      value: formatted_phone_number,
      formValue: formatted_phone_number,
    });
    this.props.input.onBlur(formatted_phone_number);
  }

  render() {
    const { value } = this.state;

    return (
      <input
        value={value}
        type='tel'
        className='form-control'
        onChange={this.onChange}
        onBlur={this.onBlur}
      />
    );
  }
}
