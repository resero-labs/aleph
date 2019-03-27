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



class TopicDocumentPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      topicDocuments: null,
    };
  }

  componentDidMount() {
    const { collectionId, topicId } = this.props;
    console.log(`Attempting to get topic details for collection ${collectionId} - ${topicId}`);

    // Load all the topic details
    axios.get(`/topic/user/${collectionId}/topic/${topicId}`).then(
      res => {
        console.log(`Received response for topic details for collection ${collectionId} - ${topicId}`);
        let docs = res.data.topic_docs;

        this.setState({
          loaded: true,
          topicDocuments: docs,
        });
      }
    );
  }

  generateDocuments() {
    //const { collectionId, topicId } = this.props;
    let topicDocs = Object.entries(this.state.topicDocuments).map(([num, document]) => {
      return (
        <tr>
          <td>{document.title}</td>
          <td>{document.doc_key}</td>
          <td>{document.doc_type}</td>
          <td>{document.num_words}</td>
        </tr>
      );
    });

    return (
      <div>
        {topicDocs}
      </div>
    );
  }

  renderNotLoggedIn() {
    return (
      <Screen isHomepage={false} title='Testing'>
        <section className='noCredentialsPage'>
            <div className='noLoginMessage'>
              To View this page, you need to first login
            </div>
        </section>
      </Screen>
    );
  }

  renderLoggedIn() {
    const { collectionId } = this.props;

    return (
      <Screen isHomepage={false} title='Topic Documents'>
        <section className='topicDocumentsPage'>
          <div className='advancedSearch'>
            <a href={`/search?collection_id=${collectionId}&facet=collection_id&filter%3Acollection_id=${collectionId}`}>
              Start advanced search of all user documents
            </a>
          </div>
          <section className='topicDocuments'>
            {this.generateDocuments()}
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


TopicDocumentPage.propTypes = {
  classes: PropTypes.object.isRequired,
};
const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
});



const mapStateToProps = (state, ownProps) => {
  const {collectionId, topicId} = ownProps.match.params;
  return {
    collectionId: collectionId,
    topicId: topicId,
    session: selectSession(state)
  };
};

let Page = connect(mapStateToProps)(TopicDocumentPage);
Page = withStyles(styles)(Page);
export default withRouter(Page);
