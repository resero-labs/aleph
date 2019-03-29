import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { selectSession } from 'src/selectors';
import Screen from 'src/components/Screen/Screen';
// import { Histogram, DensitySeries, BarSeries, withParentSize, XAxis, YAxis } from '@data-ui/histogram';

// import { LineChart, Line } from 'recharts';
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
//import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import './ClusterStyle.scss';



class ClusterView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: props.user,
      clusterDetails: {},
      clusterLevel: this.props.clusterLevel,
      parentCluster: this.props.parentCluster,
      clusterData: [],
      breadCrumbs: [],
      config: {
        minClusterSize: null,
        clusterType: null,
        vectorization: {}
      }
    };

    let globalTotal = this.state.clusterData.reduce((t, d) => t + d.total, 0);
    console.log(`The total: ${globalTotal}`);

    this.state.clusterData = this.state.clusterData.sort((l, r) => r.total - l.total);
    this.state.clusterData.forEach(d => d.selected = (d.total / globalTotal) < .8);
    this.state.renderData = this.state.clusterData.filter((d) => d.selected);

    this.clusterClicked = this.clusterClicked.bind(this);
  }

  /*
   * findClusterIdsByLevelAndParent
   *
   * This method will iterate through the results of the clusterDetails and return the list of documents
   *   that are part of the specific clusterLevel and parentCluster.
   *
   * NOTE: If the clusterLevel is not provided or is 0 the parentCluster is ignored.  If the parentCluster
   *   is null/undefined then all documents and their clusterId will be returned.
   */
  findClusterIdsByLevel(clusterDetails, clusterLevel) {
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
      let parentClusterId = -1;
      if (clusterLevel > 0) {
        parentClusterId = x.clusters[clusterLevel - 1];
      }

      return {
        'cluster': clusterId,
        'parentCluster': parentClusterId,
        'doc_id': x.doc_id,
        'key': x.key
      };
    });
  }

  createClusters(clusterDetails, clusterLevel, parentCluster) {
    clusterLevel = clusterLevel === undefined ? 0 : clusterLevel;
    parentCluster = parentCluster === undefined ? null : parentCluster;

    if (clusterDetails === undefined) {
      this.setState((state) => {
        state.clusterDetails = null;
        state.clusterData = [];
        state.clusterLevel = clusterLevel;
      });
      return;
    }

    let maxDepth = clusterDetails.config.clustering.params.length;
    if (clusterLevel < 0 || clusterLevel >= maxDepth) {
      console.log(`ClusterLevel ${clusterLevel} is outside the bounds of the data, setting to clusterLevel 0`);
      clusterLevel = 0;
      parentCluster = null;
    }

    let clusterDocuments = this.findClusterIdsByLevel(clusterDetails, clusterLevel);
    let documents = clusterDocuments;
    if (parentCluster !== null) {
      documents = clusterDocuments.filter(x => x.parentCluster === parentCluster);
    }

    //let documents = this.findClusterIdsByLevelAndParent(clusterDetails, 2, 5);
    //console.log(documents);

    // For the first setup we need to loop through all the clusters to get the unique ids
    let clusterIds = documents.map(x => x.cluster);
    let uniqueClusters = Array.from(new Set(clusterIds));

    this.setState((state) => {
      state.clusterDetails = clusterDetails;
      state.clusterLevel = clusterLevel;
      state.parentCluster = parentCluster;
      state.maxDepth = maxDepth;

      console.log('Parsing all data');
      state.clusterData = uniqueClusters.map((clusterId) => {
        let cdocs = clusterDocuments.filter(x => x.cluster === clusterId);
        let cpdocs = documents.filter(x => x.cluster === clusterId);

        let details = [];
        if (clusterLevel > 0) {
          details.push(`Cluster ${clusterId} Totals at Depth (${clusterLevel}): ${cdocs.length}`);
          details.push(`Other Parent Clusters at Depth (${clusterLevel}): ${Array.from(new Set(cdocs.filter(x => x.parentCluster != parentCluster).map(x => x.parentCluster)))}`);
        }

        return {
          id: clusterId,
          name: `Cluster ${clusterId}`,
          total: cpdocs.length,
          selected: clusterId != -1,
          color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16),
          details: details
        };
      });

      state.clusterData = state.clusterData.sort((l, r) => r.total - l.total);
      state.renderData = state.clusterData.filter((d) => d.selected);

      state.config = {
        minClusterSize: clusterDetails.config.clustering.params[clusterLevel].min_cluster_size,
        clusterType: clusterDetails.config.clustering.type,
        vectorization: clusterDetails.config.vectorization
      };

      console.log('All done with update');
      return state;
    });
  }

  componentDidMount() {
    axios.get('/clusterapi').then(
      res => {
        let clusterDetails = res.data.clusters.local[0];
        this.createClusters(clusterDetails, this.props.clusterLevel, this.props.parentCluster);
      }
    )
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

  checkboxChanged(dataPoint) {
    console.log(`Checked ${dataPoint.id}`);
    this.setState((state) => {
      console.log(state);
      state.clusterData.forEach((d) => {
        if (d.id === dataPoint.id) {
          d.selected = !d.selected;
        }
      });

      state.renderData = state.clusterData.filter((d) => d.selected);
      return state;
    });
  }


  renderClusterList() {
    const { user } = this.props;

    return this.state.clusterData.map(d => (
      <div className="ClusterItem">
        <input type="checkbox" checked={d.selected} onChange={() => this.checkboxChanged(d)} />
        <div className="ClusterDetails">
          <p><b>{d.name}</b> (<i>{d.total}</i> )</p>
          <a href={`/cluster/${user}/documents/${this.state.clusterLevel}/${this.state.parentCluster}/${d.id}`}>View documents</a>
        </div>
        <svg height="50" width="50">
          <circle cx="25" cy="25" r="20" stroke="black" stroke-width="3" fill={d.color} />
        </svg>
      </div>
    ));
  }

  componentDidUpdate() {
    let clusterDetails = this.state.clusterDetails;
    let clusterLevel = this.props.clusterLevel;
    let parentCluster = this.props.parentCluster;

    // Since this is called anytime an update takes place, we only want it to run the first time (when the level/parent changes)
    if ((this.state.clusterLevel != clusterLevel || this.state.parentCluster != parentCluster) && (clusterLevel < this.state.maxDepth)) {
      this.createClusters(clusterDetails, clusterLevel, parentCluster);
    }
  }

  clusterClicked(d) {
    const { user } = this.props;

    let clusterLevel = this.state.clusterLevel;
    let parentCluster = d.id;

    if (clusterLevel + 1 < this.state.maxDepth) {
      // Add to the history so that the back button works
      this.props.history.push(`/cluster/${user}/clusters/${clusterLevel + 1}/${parentCluster}`);
    }
  }

  renderBreadcrumbs() {
    return (<li>Breadcrumbs</li>);
  }

  renderLoggedIn() {
    const { user, classes } = this.props;
    //const rawData = Array(100).fill().map(Math.random);

    const CustomTooltip = ({ active, payload, label }) => {
      if (active) {
        return (
          <div className="custom-tooltip">
            {/* <p className="label">{`${label} : ${payload[0].value}`}</p> */}
            <p className="keywords">
              {this.state.clusterData.find(x => x.name === label).details.map(v => <li>{v}</li>)}
              {/* Details: {this.state.clusterData.find((x) => x.name === label).keywords.map(v => (<li>{v}</li>))}</p> */}
            </p>
          </div>
        );
      }

      return null;
    };

    return (
      <Screen isHomepage={true} title='Testing'>
        <section className='ClusterPage'>
          <div className='ClusterList'>
            <h1>Selected User: {user}</h1>
            {this.renderClusterList()}
          </div>

          <div className='ClusterVisualization'>
            <div className='ClusterBreadcrumbs'>
              <h1>Cluster Type: {this.state.config.clusterType} ({this.state.config.minClusterSize}) &nbsp; &nbsp; Cluster Depth: {this.state.clusterLevel} &nbsp; &nbsp; Parent Cluster Id: {this.state.parentCluster}</h1>
            </div>
            <div className='ClusterBar'>
              <BarChart width={1024} height={640} data={this.state.renderData}>
                <YAxis />
                <XAxis dataKey="name" stroke="#8884d8" />
                <Tooltip content={<CustomTooltip />} />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <Bar type="monotone" dataKey="total" fill="#8884d8" barSize={30} onClick={this.clusterClicked}>
                  {
                    this.state.renderData.map((entry, index) => (
                      <Cell cursor="pointer" fill={entry.color} key={`cell-${index}`} />
                    ))
                  }
                </Bar>
              </BarChart>
              <div className='ClusterDetails'>
                <ExpansionPanel>
                  <ExpansionPanelSummary>
                    <Typography className={classes.heading}><b>Vectorization Details</b></Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <pre>
                      <Typography>
                        {JSON.stringify(this.state.config.vectorization, null, 2)}
                      </Typography>
                    </pre>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </div>
            </div>
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
  const { user, level, parent } = ownProps.match.params;
  return {
    session: selectSession(state),
    user: user,
    clusterLevel: level === undefined ? 0 : parseInt(level),
    parentCluster: parent === undefined ? null : parseInt(parent)
  };
};

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

let Page = connect(mapStateToProps)(ClusterView);
Page = withRouter(Page);
Page = withStyles(styles)(Page);
export default Page;