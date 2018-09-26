import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { Spinner } from '@blueprintjs/core/lib/esm/components/spinner/spinner';

import { fetchMetadata } from 'src/actions/metaActions';
import { selectSession, selectMetadata } from 'src/selectors';
import NotFoundScreen from 'src/screens/NotFoundScreen';
import OAuthScreen from "src/screens/OAuthScreen";
import LogoutScreen from 'src/screens/LogoutScreen';
import ActivateScreen from 'src/screens/ActivateScreen';
import HomeScreen from 'src/screens/HomeScreen';
import SearchScreen from 'src/screens/SearchScreen';
import NotificationsScreen from 'src/screens/NotificationsScreen';
import SourcesIndexScreen from 'src/screens/SourcesIndexScreen';
import CasesIndexScreen from 'src/screens/CasesIndexScreen';
import CaseScreen from 'src/screens/CaseScreen';
import CollectionDocumentsScreen from 'src/screens/CollectionDocumentsScreen';
import CollectionRedirectScreen from 'src/screens/CollectionRedirectScreen';
import CollectionXrefIndexScreen from 'src/screens/CollectionXrefIndexScreen';
import CollectionXrefMatchesScreen from 'src/screens/CollectionXrefMatchesScreen';
import EntityScreen from 'src/screens/EntityScreen';
import EntityTagsScreen from "src/screens/EntityTagsScreen";
import EntitySimilarScreen from 'src/screens/EntitySimilarScreen';
import DocumentScreen from 'src/screens/DocumentScreen';
import DocumentTagsScreen from 'src/screens/DocumentTagsScreen';
import DocumentSimilarScreen from 'src/screens/DocumentSimilarScreen';
import DocumentRedirectScreen from 'src/screens/DocumentRedirectScreen';

import './Router.css';


class Router extends Component {

  componentWillMount() {
    const { metadata } = this.props;
    if (!metadata.app) {
      this.props.fetchMetadata();
    }
  }

  render() {
    const { metadata, session } = this.props;
    const isLoaded = metadata && metadata.app && session;

    if (!isLoaded) {
      return (
        <div className="RouterLoading">
          <div className="spinner"><Spinner className="pt-large"/></div>
        </div>
      )
    }

    return (
      <Switch>
        <Route path="/oauth" exact component={OAuthScreen}/>
        <Route path="/logout" exact component={LogoutScreen}/>
        <Route path="/activate/:code" exact component={ActivateScreen}/>
        <Route path="/entities/:entityId" exact component={EntityScreen}/>
        <Route path="/entities/:entityId/tags" exact component={EntityTagsScreen}/>
        <Route path="/entities/:entityId/similar" exact component={EntitySimilarScreen}/>
        <Route path="/documents/:documentId" exact component={DocumentScreen}/>
        <Route path="/documents/:documentId/tags" exact component={DocumentTagsScreen}/>
        <Route path="/documents/:documentId/similar" exact component={DocumentSimilarScreen}/>
        <Route path="/text/:documentId" exact component={DocumentRedirectScreen}/>
        <Route path="/tabular/:documentId/:sheet" exact component={DocumentRedirectScreen}/>
        <Route path="/sources" exact component={SourcesIndexScreen}/>
        <Route path="/cases" exact component={CasesIndexScreen}/>
        <Route path="/cases/:collectionId" exact component={CaseScreen}/>
        <Route path="/collections/:collectionId/documents" exact component={CollectionDocumentsScreen}/>
        <Route path="/collections/:collectionId" exact component={CollectionRedirectScreen}/>
        <Route path="/collections/:collectionId/xref" exact component={CollectionXrefIndexScreen}/>
        <Route path="/collections/:collectionId/xref/:otherId" exact component={CollectionXrefMatchesScreen}/>
        <Route path="/search" exact component={SearchScreen}/>
        <Route path="/notifications" exact component={NotificationsScreen}/>
        <Route path="/" exact component={HomeScreen}/>
        <Route component={NotFoundScreen}/>
      </Switch>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    metadata: selectMetadata(state),
    session: selectSession(state)
  };
};

Router = connect(mapStateToProps, { fetchMetadata })(Router);
export default Router;
