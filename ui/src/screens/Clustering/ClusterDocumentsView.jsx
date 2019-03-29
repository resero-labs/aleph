import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { selectSession, selectEntity, selectDocumentView } from 'src/selectors';
//import { selectEntity, selectDocumentView } from 'src/selectors';
import Screen from 'src/components/Screen/Screen';
import DocumentViewMode from 'src/components/Document/DocumentViewMode';
import DocumentContextLoader from 'src/components/Document/DocumentContextLoader';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';


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
      // selectedDocument: 0,
      documentName: null,
      selectedIndex: 0,
      parents: []
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);

    let parentClusters = [];
    if (!(this.props.parentCluster === undefined || this.props.parentCluster === null || isNaN(this.props.parentCluster))) {
      parentClusters.push(this.props.parentCluster);
    }
    console.log('here', parentClusters);

    axios.get('/clusterapi').then(
      res => {
        let clusterDetails = res.data.clusters.local[0];
        console.log('Lets udpate', this.props.clusterLEvel, this.props.cluster);
        this.updateDocumentList(clusterDetails, this.props.cluster, this.props.clusterLevel, parentClusters);
      }
    );
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  findClusterIdsByLevel(clusterDetails, cluster, clusterLevel) {
    if (clusterDetails === undefined) {
      return [];
    }

    clusterLevel = clusterLevel === undefined ? 0 : clusterLevel;
    if (clusterLevel < 0 || clusterLevel > clusterDetails.config.clustering.params.length) {
      console.log(`ClusterLevel ${clusterLevel} is outside the bounds of the data, setting to clusterLevel 0`);
      clusterLevel = 0;
    }

    return clusterDetails.results.map(x => {
      let clusterId = x.clusters[clusterLevel];
      let parentCluster = null;
      if (clusterLevel > 0) {
        parentCluster = x.clusters[clusterLevel-1];
      }

      return {
        parentCluster: parentCluster,
        cluster: clusterId,
        id: x.doc_id,
        key: x.key,
        name: x.key
      };
    }).filter(x => x.cluster === cluster);
  }

  updateDocumentList(clusterDetails, cluster, clusterLevel, parentClusters) {
    let allDocuments = this.findClusterIdsByLevel(clusterDetails, cluster, clusterLevel);
    let documents = allDocuments;

    console.log(documents);
    console.log(parentClusters);
    if (parentClusters !== undefined && parentClusters !== null && parentClusters.length > 0) {
      documents = documents.filter(x => parentClusters.indexOf(x.parentCluster) !== -1);
    }

    documents = documents.sort((l, r) => l.parentCluster - r.parentCluster);

    this.setState((state) => {
      let parentIds = Array.from(new Set(allDocuments.map(x => x.parentCluster)));
      state.parents = parentIds.map(x => {
        return {
          id: x,
          selected: parentClusters.indexOf(x) !== -1
        };
      });
      state.documents = documents;
      if (documents.length <= 0) {
        state.selectedDocument = -1;
        state.documentName = null;
      } else{
        state.selectedDocument = documents[0].id;
        state.documentName = documents[0].name;
      }
      state.clusterDetails = clusterDetails;
      return state;
    });
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
      let { name, id, parentCluster } = doc;

      let lastIdx = name.lastIndexOf('/');
      if (lastIdx != -1) {
        name = name.substring(lastIdx+1);
      }

      return (
        <tr onClick={() => this.selectDocument(id)} className={this.state.selectedDocument === id ? 'selected' : 'nonSelected'}>
          <td className='ClusterParentTD'>{parentCluster}</td><td>{name}</td>
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

  toggleSelectedParent(id) {
    let selectedParents = [];

    for (var c in this.state.parents) {
      let parent = this.state.parents[c];
      if (parent.id === id) {
        let selected = !parent.selected;
        if (selected) {
          selectedParents.push(id);
        }
      } else {
        if (parent.selected) {
          selectedParents.push(parent.id);
        }
      }
    }

    console.log(id, this.state.parents);
    this.updateDocumentList(this.state.clusterDetails, this.props.cluster, this.props.clusterLevel, selectedParents);
  }

  renderAvailableParents() {
    const { classes } = this.props;
    return this.state.parents.map(x => {
      let color = x.selected ? 'primary' : 'secondary';

      return (
        <Button variant="contained" color={color} className={classes.button} onClick={() => this.toggleSelectedParent(x.id)}>{x.id}</Button>
      );
    });
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
              <h1>Cluster {cluster}</h1>
            </div>
            <table>
              <tbody>
                {this.renderDocumentList()}
              </tbody>
            </table>
          </div>

          <div className='DocumentView'>
            <div>
              <div className='DocumentParentButtons'>
                {this.renderAvailableParents()}
              </div>
              <hr />
              {this.state.selectedDocument !== -1 &&
                <div>
                  <div className='DocumentTitle'>
                    {this.state.documentName}
                  </div>
                  <DocumentContextLoader documentId={this.state.selectedDocument}>
                    <DocumentViewMode document={doc} activeMode="view" />
                  </DocumentContextLoader>
                </div>
              }
            </div>
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
  const {user, cluster, level, parent} = ownProps.match.params;

  return {
    state: state,
    user: user,
    cluster: parseInt(cluster),
    clusterLevel: parseInt(level),
    parentCluster: parseInt(parent),
    session: selectSession(state),
    document: selectEntity(state, 17471),
    mode: selectDocumentView(state, 17471, null)
  };
};

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
});

let Page = connect(mapStateToProps)(PageView);
Page = withRouter(Page);
Page = withStyles(styles)(Page);
export default Page;

