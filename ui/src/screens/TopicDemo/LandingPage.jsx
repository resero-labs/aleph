import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import { selectSession } from 'src/selectors';
import Screen from 'src/components/Screen/Screen';

import './TopicStyle.scss';


class LandingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = { users: {} };
  }

  componentDidMount() {
    axios.get('/topic/user').then(
      res => {
        console.log(res);
        this.setState({ users: res.data });
      }
    );
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
        <section className='LandingPage'>
            <div className='accountSelection'>
              <ul>
                {
                  Object.entries(this.state.users).map(([user_name, user_id]) =>
                    <li><a href={`/view/topic/${user_id}`} x-collection-id={user_id}>{user_name}</a></li>)
                }
              </ul>
            </div>
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

LandingPage = connect(mapStateToProps)(LandingPage);
export default LandingPage;