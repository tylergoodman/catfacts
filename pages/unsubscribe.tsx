import '../styles.scss';
import 'isomorphic-fetch';
import React, { ChangeEvent } from 'react';
import { compose } from 'redux';
import { reduxForm, SubmissionError, InjectedFormProps } from 'redux-form';
import withRedux from 'next-redux-wrapper';
import Router from 'next/router';
import Error from 'next/error';

import makeStore from '../store';
import Nav from '../components/Nav';
import AutoDismissingAlert from '../components/AutoDismissingAlert';


interface UnsubscribeProps extends InjectedFormProps {
  code: string;
}
interface UnsubscribeState {
  confirmOne: boolean;
  confirmTwo: boolean;
  confirmThree: string;
}

export default compose(
  withRedux(makeStore),
  reduxForm({
    form: 'unsubscribe',
  }),
)(class Unsubscribe extends React.Component<UnsubscribeProps, UnsubscribeState> {

  constructor(props: UnsubscribeProps) {
    super(props);
    this.state = {
      confirmOne: false,
      confirmTwo: false,
      confirmThree: '',
    };

    this.confirmOne = this.confirmOne.bind(this);
    this.confirmTwo = this.confirmTwo.bind(this);
    this.confirmThree = this.confirmThree.bind(this);
    this.submit = this.submit.bind(this);
  }

  static getInitialProps({ query }: { query: { code: string } }) {
    return {
      code: query.code,
    };
  }

  confirmOne() {
    this.setState({
      confirmOne: window.confirm('Are you sure?'),
    });
  }

  confirmTwo(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
      confirmTwo: e.target.checked,
    });
  }

  confirmThree(e: ChangeEvent<HTMLSelectElement>) {
    this.setState({
      confirmThree: e.target.value,
    });
  }

  submit() {
    console.log(this);
    const { code } = this.props;
    if (this.state.confirmThree !== 'Yes') {
      Router.replace('/');
    }

    this.props.handleSubmit(async () => {
      try {
        const res = await fetch('/api/unsubscribe', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });
        if (res.status !== 200) {
          throw res;
        }
      }
      catch (err) {
        console.warn(err);
        throw new SubmissionError({ _error: 'Failed to unsubscribe your number. Please try again later.' });
      }
    })();
  }

  render() {
    const { code, error, submitSucceeded } = this.props;

    if (!code) {
      return (
        <Error statusCode={400} />
      );
    }

    return (
      <div className='main'>
        <Nav />
        <div className='container vertical-center'>
          <div>
            <p>Are you sure you want to unsubscribe?</p>
            <div>
              <button className='btn btn-danger' type='button' onClick={() => Router.replace('/')}>Cancel</button>
              <button className='btn btn-light ml-1' type='button' onClick={() => this.setState({ confirmOne: true })}>Yes</button>
            </div>
            {
              this.state.confirmOne ?
              <div className='form-check form-check-inline'>
                <label className='form-check-label mr-1'>Are you sure sure?</label>
                <input className='form-check-input' type='checkbox' value='' onChange={this.confirmTwo} />
              </div>
              : null
            }
            {
              this.state.confirmTwo ?
              <div className='form-group'>
                <label className='form-check-label'>Are you sure sure sure?</label>
                <select className='form-control mb-1' onChange={this.confirmThree}>
                  <option>Cancel</option>
                  <option>No</option>
                  <option>Yes</option>
                </select>
                <div className='text-right'>
                  <button className='btn btn-success' onClick={this.submit}>Finish</button>
                </div>
              </div>
              : null
            }
            {
              error ?
              <div className='alert alert-danger' role='alert'>{error}</div>
              : null
            }
            {
              submitSucceeded ?
              <div className='alert alert-success' role='alert'>Unsubscibed successfully! Your request will be processed in 4-6 weeks.</div>
              : null
            }
          </div>
        </div>
      </div>
    );
  }
});
