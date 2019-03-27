import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { selectSession, selectEntity, selectDocumentView } from 'src/selectors';
//import { selectEntity, selectDocumentView } from 'src/selectors';
import Screen from 'src/components/Screen/Screen';
import DocumentViewMode from 'src/components/Document/DocumentViewMode';
import DocumentContextLoader from 'src/components/Document/DocumentContextLoader';


import './ClusterDocumentsStyle.scss';


class PageView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      documents: [
        { name: 'DanielRich_resume[1].pdf', id: 17471 },
        { name: 'Lakhani_resume.pdf', id: 5978 },
        { name: 'Cantera_resume.pdf', id: 15823 },
        { name: 'Rowe_resume.pdf', id: 35471 },
      ],
      selectedDocument: 17471,
      selectedIndex: 0
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  selectDocument(docId) {
    if (this.state.selectedDocument === docId) {
      console.log(`Already selected doc ${docId} skipping event`);
      return;
    }

    console.log(`Selecting document ${docId}`);
    this.setState((state) => {
      state.selectedDocument = docId
      return state;
    });
  }

  renderDocumentList() {
    return this.state.documents.map(doc => {
      const { name, id } = doc;
      return (
        <tr onClick={() => this.selectDocument(id)} className={this.state.selectedDocument === id ? 'selected' : 'nonSelected'}>
          <td>{name}</td>
          {/* <td>{id}</td> */}
        </tr>
      );
    });
  }

  handleKeyPress(e) {
    if (this.state.documents === undefined ||
      this.state.documents.length <= 0) {
      console.log('No documents found, skipping event');
      return;
    }

    // 38: up, 40: down, 37: left, 39: right
    if (e.keyCode === 37) {      // This is the up-arrow
      console.log('Handling left or up');
      e.stopPropagation();

      this.setState((state) => {
        let newIndex = state.selectedIndex - 1;
        if (newIndex < 0) {
          newIndex = 0;
        }

        state.selectedIndex = newIndex;
        state.selectedDocument = state.documents[newIndex].id;

        return state;
      });
    } else if (e.keyCode === 39) {  // This is the down-arrow
      console.log('Handling right or down');
      e.stopPropagation();

      this.setState((state) => {
        let newIndex = state.selectedIndex + 1;
        if (newIndex >= state.documents.length) {
          newIndex = state.documents.length - 1;
        }

        state.selectedIndex = newIndex;
        state.selectedDocument = state.documents[newIndex].id;

        return state;
      });
    }
  }

  renderLoggedIn() {
    const { user, cluster } = this.props;

    let doc = null;
    if (this.state.selectedDocument !== -1) {
      doc = selectEntity(this.props.state, this.state.selectedDocument);
    }

    return (
      <Screen isHomepage={true} title='Testing'>
        <section className='LandingPage'>
          <div className='DocumentList'>
            <div>
              <h1>Cluster {cluster+1}</h1>
            </div>
            <table>
              <tbody>
                {this.renderDocumentList()}
              </tbody>
            </table>
          </div>

          <div className='DocumentView'>
            {this.state.selectedDocument !== -1 &&
              <DocumentContextLoader documentId={this.state.selectedDocument}>
                <DocumentViewMode document={doc} activeMode="view" />
              </DocumentContextLoader>
            }
          </div>

        </section>
      </Screen>
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

  render() {
    const { session } = this.props;

    if (session.loggedIn) {
      return this.renderLoggedIn();
    } else {
      return this.renderNotLoggedIn()
    }
  }
};

const mapStateToProps = (state, ownProps) => {
  const {user, number} = ownProps.match.params;

  return {
    state: state,
    user: user,
    cluster: parseInt(number),
    session: selectSession(state),
    document: selectEntity(state, 17471),
    mode: selectDocumentView(state, 17471, null)
  };
};

let Page = connect(mapStateToProps)(PageView);
Page = withRouter(Page);
export default Page;

