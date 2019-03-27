import React from 'react';
import axios from 'axios';
import Screen from 'src/components/Screen/Screen';

import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { selectSession } from 'src/selectors';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import './TopicStyle.scss';



class TopicViewPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      emailCount: null,
      attachmentCount: null,
      topicCount: null,
      topics: null
    };
  }

  componentDidMount() {
    const { collectionId } = this.props;
    console.log(`Attempting to get topic details for collection ${collectionId}`);

    // Load all the topic details
    axios.get(`/topic/user/${collectionId}`).then(
      res => {
        console.log(`Received response for topic details for collection ${collectionId}`);
        let details = res.data.details;

        this.setState({
          loaded: true,
          emailCount: details['email_count'],
          attachmentCount: details['attachment_count'],
          topicCount: details['topic_count'],
          topics: details['topics']
        });
      }
    );
  }

  generateWordClouds() {
    const { collectionId } = this.props;

    let topicElements = Object.entries(this.state.topics).map(([topicNum, topic]) => {
      let query = 'finance|hr';
      return (
        // <a className='topicItem' href={`/search?collection_id=${collectionId}&facet=collection_id&filter%3Acollection_id=${collectionId}&q=${query}`}>
        <a className='topicItem' href={`/view/topic/${collectionId}/${topicNum}`}>
          <img src={`/topic/user/${collectionId}/topic/${topicNum}/img`} alt={query} />
          <div className='topicPredominance'>Predominance: {topic.predominance}</div>
        </a>
      );
    });

    return (
      <div>
        {topicElements}
      </div>
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
      <Screen isHomepage={false} title='Testing'>
        <section className='topicViewPage'>
          <section className='userSummary'>
            <div className='emailCount'>Email Count: {this.state.emailCount}</div>
            <div className='attachmentCount'>Attachment Count: {this.state.attachmentCount}</div>
            <div className='topicCount'>Topic Count: {this.state.topicCount}</div>
          </section>
          <section className='wordClouds'>
            {this.generateWordClouds()}
          </section>
        </section>
      </Screen>
    );
  }

  renderLoggedInLoading() {
    const { classes } = this.props;

    return (
      <Screen isHomepage={false} title='Topics Loading'>
        <section className='loadingSection'>
          <div className='loadingHeader'>Loading...</div>
          <div className='loadingDetails'>This can take upwards of 3 minutes</div>
          <div className='loadingProgress'>
            <CircularProgress className={classes.progress} />
          </div>
        </section>
      </Screen>
    );
  }

  render() {
    const { session } = this.props;

    if (session.loggedIn) {
      if (this.state.loaded) {
        return this.renderLoggedIn();
      } else {
        return this.renderLoggedInLoading();
      }
    } else {
      return this.renderNotLoggedIn()
    }
  }
};


TopicViewPage.propTypes = {
  classes: PropTypes.object.isRequired,
};
const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
});



const mapStateToProps = (state, ownProps) => {
  const {collectionId} = ownProps.match.params;
  return {
    collectionId: collectionId,
    session: selectSession(state)
  };
};

let Page = connect(mapStateToProps)(TopicViewPage);
Page = withStyles(styles)(Page);
export default withRouter(Page);
