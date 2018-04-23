import React from 'react';
import cs from 'classnames';


interface AutoDismissingAlertProps extends React.HTMLAttributes<{}> {
  timeout?: number;
}

interface AutoDismissingAlertState {
  visible: boolean;
}

export default class AutoDismissingAlert extends React.Component<AutoDismissingAlertProps, AutoDismissingAlertState> {

  timeout: number | undefined;

  constructor(props: {}) {
    super(props);

    this.state = {
      visible: true,
    };
  }

  static defaultProps: Partial<AutoDismissingAlertProps> = {
    timeout: 1000 * 5,
  };

  componentDidMount() {
    this.timeout = setTimeout(() => this.setState({ visible: false }), this.props.timeout);
  }

  componentWillMount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  render() {
    return (
      <div
        {...this.props}
        className={cs(this.props.className, {
          'd-none': !this.state.visible,
        })}
        >
        {this.props.children}
      </div>
    );
  }
}
