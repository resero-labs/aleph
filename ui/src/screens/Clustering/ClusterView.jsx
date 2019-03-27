import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { selectSession } from 'src/selectors';
import Screen from 'src/components/Screen/Screen';
// import { Histogram, DensitySeries, BarSeries, withParentSize, XAxis, YAxis } from '@data-ui/histogram';

// import { LineChart, Line } from 'recharts';
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

import './ClusterStyle.scss';



class ClusterView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: props.user,
      clusterData: [
        {id: 0, name: 'Cluster 1', total: 45, selected: true, color: '#'+(Math.random()*0xFFFFFF<<0).toString(16), keywords: ['Java', 'Programming']},
        {id: 1, name: 'Cluster 2', total: 66, selected: true, color: '#'+(Math.random()*0xFFFFFF<<0).toString(16), keywords: ['Others', 'Style']},
        {id: 2, name: 'Cluster 3', total: 15, selected: true, color: '#'+(Math.random()*0xFFFFFF<<0).toString(16), keywords: ['Finance', 'Paystub']},
        {id: 3, name: 'Cluster 4', total: 1123, selected: false, color: '#'+(Math.random()*0xFFFFFF<<0).toString(16), keywords: ['Digest', 'Invite']},
        {id: 4, name: 'Cluster 5', total: 102, selected: false, color: '#'+(Math.random()*0xFFFFFF<<0).toString(16), keywords: ['HR', 'Hiring']},
        {id: 5, name: 'Cluster 6', total: 34, selected: false, color: '#'+(Math.random()*0xFFFFFF<<0).toString(16), keywords: ['Desk', 'Laptop']},
        {id: 6, name: 'Cluster 7', total: 6, selected: false, color: '#'+(Math.random()*0xFFFFFF<<0).toString(16), keywords: ['Not', 'Real']},
      ],
    };

    let globalTotal = this.state.clusterData.reduce((t, d) => t + d.total, 0);
    console.log(`The total: ${globalTotal}`);

    this.state.clusterData = this.state.clusterData.sort((l, r) => r.total - l.total);
    this.state.clusterData.forEach(d => d.selected = (d.total / globalTotal) < .8);
    this.state.renderData = this.state.clusterData.filter((d) =>  d.selected);

    this.clusterClicked = this.clusterClicked.bind(this);
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

  getVisualizationData() {
    if (this.state.clusterData === undefined) {
      console.log(`The cluster data was not found`);
      return [];
    }

    //const uniqueCategories = [...new Set(buttons)];

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
    const {user} = this.props;

    return this.state.clusterData.map(d => (
      <div className="ClusterItem">
        <input type="checkbox" checked={d.selected} onChange={() => this.checkboxChanged(d)} />
        <div className="ClusterDetails">
          <p><b>{d.name}</b> (<i>{d.total}</i> )</p>
          <a href={`/cluster/${user}/documents/${d.id}`}>View documents</a>
        </div>
        <svg height="50" width="50">
          <circle cx="25" cy="25" r="20" stroke="black" stroke-width="3" fill={d.color} />
        </svg>
      </div>
    ));
  }

  clusterClicked(d) {
    const {user} = this.props;

    this.props.history.push(`/cluster/${user}/documents/${d.id}`);
  }

  renderLoggedIn() {
    const { user } = this.props;
    const rawData = Array(100).fill().map(Math.random);

    const CustomTooltip = ({ active, payload, label }) => {
      if (active) {
        return (
          <div className="custom-tooltip">
            {/* <p className="label">{`${label} : ${payload[0].value}`}</p> */}
            <p className="keywords">Keywords: {this.state.clusterData.find((x) => x.name === label).keywords.map(v => (<li>{v}</li>))}</p>
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
            <BarChart width={1024} height={640} data={this.state.renderData}>
              <YAxis  />
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
  const { user } = ownProps.match.params;
  return {
    session: selectSession(state),
    user: user,
  };
};

let Page = connect(mapStateToProps)(ClusterView);
Page = withRouter(Page);
export default Page;