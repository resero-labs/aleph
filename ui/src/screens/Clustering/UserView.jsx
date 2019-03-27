import React from 'react';
import { connect } from 'react-redux';

import { selectSession, selectEntity, selectDocumentView } from 'src/selectors';
//import { selectEntity, selectDocumentView } from 'src/selectors';
import Screen from 'src/components/Screen/Screen';
import DocumentViewMode from 'src/components/Document/DocumentViewMode';
import DocumentContextLoader from 'src/components/Document/DocumentContextLoader';

import './UserView.scss';


class PageView extends React.Component {
  constructor(props) {
    super(props);
  }

  renderNotLoggedIn() {
    return (
      <Screen isHomepage={true} title='Testing'>
        <section className='noCredentialsPage'>
          <div className='noLoginMessage'>
            To View this page, you need to first login
            </div>
        </section>
      </Screen>
    );
  }

  renderLoggedIn() {
    return (
      <Screen isHomepage={true} title='Testing'>
        <section className='noCredentialsPage'>
          <h1>Fill in here</h1>
          <a href='/cluster/miwright'>View Clusters</a>
        </section>
      </Screen>
    );
  }

  render() {
    const { session } = this.props;

    if (session.loggedIn) {
      return this.renderLoggedIn();
    } else {
      return this.renderNotLoggedIn()
    }
  }
};

const mapStateToProps = (state) => {
  return {
    session: selectSession(state)
  };
};

let Page = connect(mapStateToProps)(PageView);
export default Page;
