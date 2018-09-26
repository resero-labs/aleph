import { suggestRoles, fetchRole, updateRole } from './roleActions';
import { fetchAlerts, addAlert, deleteAlert } from './alertActions';
import { queryNotifications, deleteNotifications } from './notificationActions';
import {
  fetchDocument,
  queryDocumentRecords,
  fetchDocumentPage,
  ingestDocument,
  deleteDocument
} from './documentActions';
import {
  queryCollections,
  fetchCollection,
  updateCollection,
  fetchCollectionPermissions,
  updateCollectionPermissions,
  fetchCollectionXrefIndex,
  queryXrefMatches,
  createCollection,
  deleteCollection
} from './collectionActions';
import {
  queryEntities,
  fetchEntity,
  fetchEntityReferences,
  fetchEntityTags
} from './entityActions';

import { fetchMetadata,
  fetchStatistics,
  setLocale
} from './metaActions'

export {
  suggestRoles,
  fetchRole,
  updateRole,
  fetchAlerts,
  addAlert,
  deleteAlert,
  queryEntities,
  fetchEntity,
  fetchEntityReferences,
  fetchEntityTags,
  fetchDocument,
  queryDocumentRecords,
  fetchDocumentPage,
  queryCollections,
  fetchCollection,
  updateCollection,
  fetchCollectionPermissions,
  updateCollectionPermissions,
  fetchCollectionXrefIndex,
  queryXrefMatches,
  queryNotifications,
  createCollection,
  deleteCollection,
  deleteNotifications,
  ingestDocument,
  deleteDocument,
  fetchMetadata,
  fetchStatistics,
  setLocale
};